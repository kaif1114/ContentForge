import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Calendar, Share2, Clock, Tag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_sidebarLayout/posts/$postId")({
  component: PostDetailComponent,
});

// API function to fetch a single post
const fetchPost = async (postId: string) => {
  const response = await fetch(`http://localhost:3001/posts/${postId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch post: ${response.status}`);
  }
  const data = await response.json();
  return data.post;
};

function PostDetailComponent() {
  const { postId } = useParams({ from: "/_sidebarLayout/posts/$postId" });

  const {
    data: post,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-lg bg-white shadow-md text-center"
        >
          <div className="w-16 h-16 border-4 border-gray-200 border-t-cf-primary-green rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Loading post...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch the post details
          </p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-lg bg-white shadow-md text-center max-w-lg"
        >
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700">
            Post not found
          </h2>
          <p className="text-gray-500 mt-2">
            {error?.message || "The post you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/posts">
            <Button className="mt-4 bg-cf-primary-green hover:bg-cf-secondary-green">
              Back to Posts
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "x":
        return "/x.png";
      case "linkedin":
        return "/linkedin.png";
      case "both":
        return "/linkedin_and_x.png";
      default:
        return "/x.png";
    }
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "x":
        return { label: "X (Twitter)", color: "bg-gray-800 text-white" };
      case "linkedin":
        return { label: "LinkedIn", color: "bg-blue-600 text-white" };
      case "both":
        return { label: "Both Platforms", color: "bg-purple-600 text-white" };
      default:
        return { label: platform, color: "bg-gray-500 text-white" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <Link to="/posts">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Post
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Post Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-6"
      >
        {/* Post Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Created {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              {post.sourceTitle && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>From: {post.sourceTitle}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platform and Status Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <img
              src={getPlatformIcon(post.platform)}
              alt={post.platform}
              width={20}
              height={20}
              className="object-contain"
            />
            <Badge className={getPlatformBadge(post.platform).color}>
              {getPlatformBadge(post.platform).label}
            </Badge>
          </div>
          
          <Badge variant="outline" className="text-green-700 border-green-300">
            {post.status || "Draft"}
          </Badge>
          
          <Badge variant="secondary" className="capitalize">
            {post.tone}
          </Badge>
          
          <Badge variant="secondary">
            {post.length || "Medium"} Length
          </Badge>
        </div>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.description}
          </div>
        </div>

        {/* Post Stats */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-cf-primary-green">
                {post.description?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Characters</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-cf-primary-green">
                {post.description?.split(' ').length || 0}
              </div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-cf-primary-green">
                {post.platform === 'both' ? '2' : '1'}
              </div>
              <div className="text-sm text-gray-600">Platform{post.platform === 'both' ? 's' : ''}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-cf-primary-green hover:bg-cf-secondary-green flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Post
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Content
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Duplicate Post
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 