import PostCard from '@/components/posts/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { usePosts } from '@/hooks/usePosts'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import AddButton from '@/components/ui/add-button'
import EditPostModal from '@/components/posts/edit-post-modal'
import { Post } from '@/types/content'
import { useUpdatePost } from '@/hooks/useUpdatePost'
import toast, { Toaster } from 'react-hot-toast'
import { CheckSquare, Square, X, Trash2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import useDeletePost from '@/hooks/useDeletePost'

export const Route = createFileRoute('/_sidebarLayout/posts')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [postsPerPage] = useState(8);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null)
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  const { mutateAsync: updatePost } = useUpdatePost()
  const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  async function handleEditPost(post: Partial<Post>) {
    toast.promise(
      updatePost(post),
      {
        loading: 'Updating post...',
        success: 'Post updated successfully!',
        error: (err) => `Update failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      }
    );
  }
  
  const { data: response, isLoading, error, isError } = usePosts({
    page: currentPage,
    limit: postsPerPage
  });

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
            // Update the query cache after successful deletion
            queryClient.invalidateQueries({ queryKey: ['posts'] })
          }
        })
      )
      await Promise.all(deletePromises)
      
      toast.success(`${selectedPostIds.length} post${selectedPostIds.length > 1 ? 's' : ''} discarded successfully`)
    } catch (error) {
      console.error("Failed to delete posts:", error)
      toast.error("Failed to discard posts")
    } finally {
      setSelectedPostIds([])
      setSelectionMode(false)
    }
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-8 rounded-lg bg-white shadow-md text-center"
      >
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading your posts...</h2>
        <p className="text-gray-500 mt-2">Please wait while we fetch your content</p>
      </motion.div>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-8 rounded-lg bg-white shadow-md text-center max-w-lg"
      >
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-700">Something went wrong</h2>
        <p className="text-gray-500 mt-2">{error.message || "We couldn't load your posts. Please try again later."}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
  
  const posts = response?.data?.data || [];
  const pagination = response?.data?.pagination || { total: 0, page: 1, limit: postsPerPage, totalPages: 0 };
  
  if(posts.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-8 rounded-lg bg-white shadow-md text-center max-w-lg"
      >
        <div className="text-gray-400 text-5xl mb-4">📝</div>
        <h2 className="text-xl font-semibold text-gray-700">No posts found</h2>
        <p className="text-gray-500 mt-2">Start creating posts by adding a new content source or generating posts from your saved content sources.</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
          <Link 
            to="/sources"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Add Content Source
          </Link>
          <Link 
            to="/sources"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Generate From Existing Sources
          </Link>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] px-4">
      <Toaster position="top-center" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-bold">Posts</h2>
        <AddButton onClick={() => navigate({to: "/create"})} text="Create Post" />
      </div>

      {/* Selection Mode Controls */}
      {selectionMode && (
        <div className="bg-cf-mint-light p-4 rounded-xl mb-6 sticky top-0 z-10 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CheckSquare className="h-5 w-5 text-cf-primary-green mr-2" />
              <span className="font-medium text-[#1a1a2e]">
                {selectedPostIds.length} {selectedPostIds.length === 1 ? 'post' : 'posts'} selected
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={cancelSelection}
                className="px-3 py-1.5 border border-cf-beige-light rounded-md hover:bg-white text-sm font-medium flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={discardSelectedPosts}
                disabled={selectedPostIds.length === 0 || isDeletingPost}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Discard Selected
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="w-full md:w-auto mb-3 md:mb-0">
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cf-primary-green text-sm md:text-base bg-cf-mint-light"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap justify-between gap-3 sm:gap-4 w-full md:w-auto">
          <select 
            className="flex-1 sm:flex-none w-[calc(50%-6px)] sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cf-primary-green text-sm md:text-base bg-cf-mint-light"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="linkedin">LinkedIn</option>
            <option value="x">X (FormerlyTwitter)</option>
          </select>
          
          <select 
            className="flex-1 sm:flex-none w-[calc(50%-6px)] sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cf-primary-green text-sm md:text-base bg-cf-mint-light"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col">
        <div className="grid grid-cols-1 min-[450px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              className={`w-full flex justify-center ${
                isDeletingPost && selectedPostIds.includes(post._id) ? 'opacity-50' : ''
              }`}
            >
              {isDeletingPost && selectedPostIds.includes(post._id) ? (
                <div className="w-full h-full flex items-center justify-center p-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cf-primary-green"></div>
                </div>
              ) : (
                <div className="w-full relative">
                  {selectionMode && (
                    <button 
                      onClick={() => togglePostSelection(post._id)}
                      className="absolute top-2 left-2 z-10 focus:outline-none bg-white rounded-full p-1 shadow-md"
                    >
                      {selectedPostIds.includes(post._id) ? (
                        <CheckSquare className="h-5 w-5 text-cf-primary-green" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-300" />
                      )}
                    </button>
                  )}
                  <PostCard
                    post={post}
                    onEdit={() => setPostToEdit(post)}
                    onDiscard={handleDiscardPost}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="mt-auto">
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 py-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cf-mint-light"
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === page
                        ? 'bg-cf-secondary-green text-white'
                        : 'border hover:bg-cf-mint-light'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cf-mint-light"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
        {
              <EditPostModal
              onClose={() => setPostToEdit(null)}
              initialData={postToEdit}
              onSave={handleEditPost}
            />
          }
    </div>
  );
}
