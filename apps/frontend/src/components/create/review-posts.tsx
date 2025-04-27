"use client"

import type React from "react"

import { useState } from "react"
import {
  Edit,
  Sparkles,
  Check,
  X,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Linkedin,
  Twitter,
  Tag,
  PenSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { GeneratedPost, PostData } from "@/routes/create"
import TagInput from "../ui/tag-input"
import { Post } from "@/types/content"
// No replacement needed - removing unused import

interface ReviewPostsProps {
  posts: Post[]
  // onUpdatePost: (postId: string, updatedContent: string) => void
  // onUpdatePostTitle: (postId: string, updatedTitle: string) => void
  // onUpdatePostDescription: (postId: string, updatedDescription: string) => void
  // onUpdatePostTags: (postId: string, updatedTags: string[]) => void
  // onTogglePlatform: (postId: string) => void
  // onDiscardPost: (postId: string) => void
  // onEnhancePost: (postId: string, enhancementPrompt: string) => void
}

export default function ReviewPosts({
  posts,
  
  // onUpdatePost,
  // onUpdatePostTitle,
  // onUpdatePostDescription,
  // onUpdatePostTags,
  // onTogglePlatform,
  // onDiscardPost,
  // onEnhancePost,
}: ReviewPostsProps) {
  const [editingPost, setEditingPost] = useState<GeneratedPost | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  const [editedTags, setEditedTags] = useState<string[]>([])
  const [enhancingPost, setEnhancingPost] = useState<GeneratedPost | null>(null)
  const [enhancementPrompt, setEnhancementPrompt] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [activePlatformFilter, setActivePlatformFilter] = useState("all")

  const handleStartEditing = (post: GeneratedPost) => {
    setEditingPost(post)
    setEditedContent(post.content)
    setEditedTitle(post.title)
    setEditedDescription(post.description)
    setEditedTags([...post.tags])
  }

  // const handleSaveEdit = () => {
  //   if (editingPost) {
  //     onUpdatePost(editingPost.id, editedContent)
  //     onUpdatePostTitle(editingPost.id, editedTitle)
  //     onUpdatePostDescription(editingPost.id, editedDescription)
  //     onUpdatePostTags(editingPost.id, editedTags)
  //     setEditingPost(null)
  //   }
  // }

  // const handleStartEnhancing = (post: GeneratedPost) => {
  //   setEnhancingPost(post)
  //   setEnhancementPrompt("")
  // }

  // const handleApplyEnhancement = () => {
  //   if (enhancingPost && enhancementPrompt.trim()) {
  //     onEnhancePost(enhancingPost.id, enhancementPrompt)
  //     setEnhancingPost(null)
  //     setEnhancementPrompt("")
  //   }
  // }

  // const filters = [
  //   { id: "all", label: `All Posts (${posts.length})` },
  //   { id: "modified", label: `Modified (${posts.filter((p) => p.status === "modified").length})` },
  //   { id: "draft", label: `Drafts (${posts.filter((p) => p.status === "draft").length})` },
  // ]

  const platformFilters = [
    { id: "all", label: "All Platforms" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "x", label: "X (Twitter)" },
  ]

  // const filteredPosts = posts
  //   .filter((post) => {
  //     if (activeFilter === "all") return true
  //     return post.status === activeFilter
  //   })
  //   .filter((post) => {
  //     if (activePlatformFilter === "all") return true
  //     return post.platform === activePlatformFilter
  //   })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">Review and Modify Posts</h2>
      <p className="text-gray-600 mb-8">
        Review your generated posts, make edits, or enhance them with additional instructions
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-r from-[#EEF8F5] to-white rounded-xl">
          <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-4">
            <MessageSquare className="h-10 w-10 text-[#45c19a]" />
          </div>
          <p className="text-[#1a1a2e] text-lg">No posts have been generated yet.</p>
          <p className="text-gray-500 mt-2">Go back to the previous step to generate posts.</p>
        </div>
      ) : (
        <>
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
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="h-2 bg-gradient-to-r from-[#45c19a] to-[#6DC7A9]"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#1a1a2e]">{post.title}</h3>
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

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">{post.description}</p>
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
                        // onClick={() => handleStartEditing(post)}
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
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-green-600 border-green-100 hover:bg-green-50">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => onDiscardPost(post.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Discard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={editingPost !== null} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-2">Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingPost && (
              <>
                <div className="bg-[#EEF8F5] p-3 rounded-lg text-sm flex justify-between items-center">
                  <p className="text-[#1a1a2e] font-medium">
                    Editing Post for {editingPost.platform === "linkedin" ? "LinkedIn" : "X (Twitter)"}
                  </p>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      editingPost.platform === "linkedin" ? "bg-[#0077B5] text-white" : "bg-black text-white"
                    }`}
                  >
                    {editingPost.platform === "linkedin" ? (
                      <Linkedin className="h-4 w-4" />
                    ) : (
                      <Twitter className="h-4 w-4" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#1a1a2e] font-medium flex items-center">
                    <PenSquare className="h-4 w-4 mr-2" />
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="border-2 border-[#DEF0EA] focus:border-[#45c19a] focus:ring-[#45c19a]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#1a1a2e] font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="min-h-[80px] border-2 border-[#DEF0EA] focus:border-[#45c19a] focus:ring-[#45c19a]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-[#1a1a2e] font-medium flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </Label>
                  <TagInput tags={editedTags} setTags={setEditedTags} placeholder="Add tags..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-[#1a1a2e] font-medium flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[200px] border-2 border-[#DEF0EA] focus:border-[#45c19a] focus:ring-[#45c19a]"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setEditingPost(null)}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#45c19a] to-[#6DC7A9] hover:from-[#3bb389] hover:to-[#5DB999] text-white shadow-md hover:shadow-lg transition-all duration-300"
                    // onClick={handleSaveEdit}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={enhancingPost !== null} onOpenChange={(open) => !open && setEnhancingPost(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-2">Enhance Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {enhancingPost && (
              <>
                <div className="bg-[#EEF8F5] p-3 rounded-lg text-sm flex justify-between items-center">
                  <p className="text-[#1a1a2e] font-medium">Enhancing: {enhancingPost.title}</p>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      enhancingPost.platform === "linkedin" ? "bg-[#0077B5] text-white" : "bg-black text-white"
                    }`}
                  >
                    {enhancingPost.platform === "linkedin" ? (
                      <Linkedin className="h-4 w-4" />
                    ) : (
                      <Twitter className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">Provide additional instructions to enhance this post</p>
                <Textarea
                  placeholder="Make it more persuasive, add statistics, etc."
                  value={enhancementPrompt}
                  onChange={(e) => setEnhancementPrompt(e.target.value)}
                  className="min-h-[120px] border-2 border-[#DEF0EA] focus:border-[#45c19a] focus:ring-[#45c19a]"
                />
                <Button
                  className="w-full bg-gradient-to-r from-[#45c19a] to-[#6DC7A9] hover:from-[#3bb389] hover:to-[#5DB999] text-white shadow-md hover:shadow-lg transition-all duration-300"
                  // onClick={handleApplyEnhancement}
                  disabled={!enhancementPrompt.trim()}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Apply Enhancement
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface LabelProps {
  htmlFor?: string
  className?: string
  children: React.ReactNode
}

function Label({ htmlFor, className, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium ${className || ""}`}>
      {children}
    </label>
  )
}
