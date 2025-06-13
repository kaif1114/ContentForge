import { useState } from "react"
import {
  Edit,
  Sparkles,
  X,
  MessageSquare,
  ThumbsDown,
  Linkedin,
  Twitter,
  Trash2,
  CheckSquare,
  Square
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Post } from "@/types/content"
import useDeletePost from "@/hooks/useDeletePost"
import { useQueryClient } from "@tanstack/react-query"
import EditPostModal from "../posts/edit-post-modal"

interface ReviewPostsProps {
}

export default function ReviewPosts({
}: ReviewPostsProps) {
 

  const [activeFilter, setActiveFilter] = useState("all")
  const [activePlatformFilter, setActivePlatformFilter] = useState("all")
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [postToEdit, setPostToEdit] = useState<Post | null>(null)
  const queryClient = useQueryClient()

  const { mutateAsync: deletePost, isPending: isDeletingPost  } = useDeletePost()
  const posts = queryClient.getQueryData<{data: Post[]}>(['generatedPosts'])



  const platformFilters = [
    { id: "all", label: "All Platforms" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "x", label: "X (Twitter)" },
  ]



  const handleDiscardPost = async (postId: string) => {

    setSelectionMode(true)

    setSelectedPostIds(prev => [...prev, postId])
  }
  
  const togglePostSelection = (postId: string) => {
    setSelectedPostIds(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }
  
  const cancelSelection = () => {
    setSelectionMode(false)
    setSelectedPostIds([])
  }
  
  const discardSelectedPosts = async () => {
    try {
      // Create a promise array for all deletion operations
      const deletePromises = selectedPostIds.map(postId => 
        deletePost(postId, {
          onSuccess: () => {
            const remainingPosts = posts?.data.filter(post => !selectedPostIds.includes(post._id))
      
            // Update the main mutation data in the cache
            queryClient.setQueriesData({ queryKey: ['generatedPosts'] }, (oldData: any) => {
              if (!oldData) return oldData
              
              return {
                ...oldData,
                data: remainingPosts
              }
            })
          }
        })
      )
      await Promise.all(deletePromises)
      
    } catch (error) {
      console.error("Failed to delete posts:", error)
    } finally {
      setSelectedPostIds([])
      setSelectionMode(false)
    }
  }

  // Filter posts based on selected filters 
  const filteredPosts = posts?.data.filter(post => {
    if (activePlatformFilter === "all") return true
    return post.platform === activePlatformFilter
  }) || []

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">Review and Modify Posts</h2>
      <p className="text-gray-600 mb-8">
        Review your generated posts, make edits, or enhance them with additional instructions
      </p>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-r from-[#EEF8F5] to-white rounded-xl">
          <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-4">
            <MessageSquare className="h-10 w-10 text-[#45c19a]" />
          </div>
          <p className="text-[#1a1a2e] text-lg">No posts have been generated yet.</p>
          <p className="text-gray-500 mt-2">Go back to the previous step to generate posts.</p>
        </div>
      ) : (
        <>
          {/* Selection Mode Controls */}
          {selectionMode && (
            <div className="bg-[#EEF8F5] p-4 rounded-xl mb-6 sticky top-0 z-10 shadow-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 text-[#45c19a] mr-2" />
                  <span className="font-medium text-[#1a1a2e]">
                    {selectedPostIds.length} {selectedPostIds.length === 1 ? 'post' : 'posts'} selected
                  </span>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelSelection}
                    className="border-[#DEF0EA] hover:bg-white"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={discardSelectedPosts}
                    disabled={selectedPostIds.length === 0 || isDeletingPost}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Discard Selected
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Filter Dropdowns */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Filter by Status</h4>
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="w-full p-2 rounded-md border border-[#DEF0EA] focus:border-[#45c19a] focus:ring-[#45c19a] bg-[#EEF8F5] text-[#1a1a2e]"
                  >
                      {/* {filters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.label}
                        </option>
                      ))} */}
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Filter by Platform</h4>
                  <select
                    value={activePlatformFilter}
                    onChange={(e) => setActivePlatformFilter(e.target.value)}
                    className="w-full p-2 rounded-md border border-[#DEF0EA] focus:border-[#45c19a] focus:ring-[#45c19a] bg-[#EEF8F5] text-[#1a1a2e]"
                  >
                    {platformFilters.map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border ${
                  selectedPostIds.includes(post._id) ? 'border-[#45c19a] ring-2 ring-[#45c19a]/20' : 'border-gray-100'
                }`}
              >
                {isDeletingPost && selectedPostIds.includes(post._id) ? (
                  <div className="p-10 flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#45c19a] mb-4"></div>
                    <p className="text-gray-600">Deleting post...</p>
                  </div>
                ) : (
                  <>
                    <div className="h-2 bg-gradient-to-r from-[#45c19a] to-[#6DC7A9]"></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-2">
                          {selectionMode && (
                            <button 
                              onClick={() => togglePostSelection(post._id)}
                              className="mt-1 focus:outline-none"
                            >
                              {selectedPostIds.includes(post._id) ? (
                                <CheckSquare className="h-5 w-5 text-[#45c19a]" />
                              ) : (
                                <Square className="h-5 w-5 text-gray-300" />
                              )}
                            </button>
                          )}
                          <h3 className="text-xl font-bold text-[#1a1a2e]">{post.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* {post.status === "modified" && (
                            <div className="px-3 py-1 bg-[#EEF8F5] text-[#45c19a] text-xs font-medium rounded-full border border-[#DEF0EA]">
                              Modified
                            </div>
                          )} */}
                          <button
                            // onClick={() => onTogglePlatform(post.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              post.platform === "linkedin" ? "bg-[#0077B5] text-white" : "bg-black text-white"
                            }`}
                            title={`Switch to ${post.platform === "linkedin" ? "X" : "LinkedIn"}`}
                          >
                            {post.platform === "linkedin" ? (
                              <Linkedin className="h-4 w-4" />
                            ) : (
                              <Twitter className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF8F5] text-[#45c19a] border border-[#DEF0EA]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="bg-[#EEF8F5] p-4 rounded-lg border border-[#DEF0EA] mb-4 max-h-32 overflow-y-auto">
                        <p className="text-gray-700 whitespace-pre-line text-sm">{post.description}</p>
                      </div>

                      <div className="flex flex-wrap justify-between gap-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPostToEdit(post)}
                            className="text-gray-600 border-[#DEF0EA] hover:bg-[#EEF8F5] hover:text-[#45c19a] transition-all"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 border-[#DEF0EA] hover:bg-[#EEF8F5] hover:text-[#45c19a] transition-all"
                                // onClick={() => handleStartEnhancing(post)}
                              >
                                <Sparkles className="h-4 w-4 mr-1" />
                                Enhance
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDiscardPost(post._id)}
                            disabled={ selectedPostIds.includes(post._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Discard
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <EditPostModal  onClose={() => setPostToEdit(null)} initialData={postToEdit} onSave={function (_data: Partial<Post>): Promise<void> {
        throw new Error("Function not implemented.")
      } } />
    </div>
  )
}

// interface LabelProps {
//   htmlFor?: string
//   className?: string
//   children: React.ReactNode
// }

// function Label({ htmlFor, className, children }: LabelProps) {
//   return (
//     <label htmlFor={htmlFor} className={`text-sm font-medium ${className || ""}`}>
//       {children}
//     </label>
//   )
// }
