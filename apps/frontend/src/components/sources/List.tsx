import type { ContentSource } from "@/types/content"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Youtube, Globe, AlertCircle, RefreshCw, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { format } from "date-fns"
// import { formatDistanceToNow } from "date-fns"

// Function to truncate URL to 30 characters
const truncateUrl = (url: string, maxLength: number = 30) => {
  return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
}

interface ContentSourcesListProps {
  sources: ContentSource[]
  onViewContent: (source: ContentSource) => void
  onGeneratePosts?: (source: ContentSource) => void
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
}

export function ContentSourcesListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div 
          key={index}
          className="bg-[#DEF0EA] border border-gray-100 rounded-2xl overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-6 w-40" />
            </div>
            
            <Skeleton className="h-4 w-60 mb-4" />

            <Skeleton className="h-16 w-full mb-4" />

            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ContentSourcesErrorState({ errorMessage, onRetry }: { errorMessage?: string, onRetry?: () => void }) {
  return (
    <Card className="bg-[#DEF0EA] border border-gray-100 rounded-2xl shadow-sm">
      <div className="p-6 text-center flex flex-col items-center">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-red-600 font-medium mb-2">Failed to load content sources</p>
        <p className="text-muted-foreground mb-4">{errorMessage || "An error occurred while fetching content sources."}</p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        )}
      </div>
    </Card>
  )
}

export function ContentSourcesList({ 
  sources, 
  onViewContent,
  onGeneratePosts,
  isLoading = false, 
  isError = false,
  errorMessage,
  onRetry 
}: ContentSourcesListProps) {
  if (isLoading) {
    return <ContentSourcesListSkeleton />
  }
  
  if (isError) {
    return <ContentSourcesErrorState errorMessage={errorMessage} onRetry={onRetry} />
  }
  
  if (sources.length === 0) {
    return (
      <Card className="bg-[#DEF0EA] border border-gray-100 rounded-2xl shadow-sm">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">No content sources found. Add your first source to get started.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <motion.div
          key={source._id}
          initial={{ scale: 1 }}
          whileHover={{ 
            scale: 1.01,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            transition: { duration: 0.2 }
          }}
          className="bg-[#DEF0EA] border border-gray-100 rounded-2xl overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {source.type === "youtube" ? (
                <Youtube className="w-6 h-6 text-gray-600" />
              ) : (
                <Globe className="w-6 h-6 text-gray-600" />
              )}
              <h3 className="font-semibold text-lg">{source.label}</h3>
            </div>
            
            <a 
              href={source.url}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-green-600 hover:underline text-sm mb-4 block"
            >
              {truncateUrl(source.url)}
            </a>

            <p className="text-gray-600 text-sm mb-4">
              {source.content ? truncateUrl(source.content, 100) : "No content available."}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">
                Added {source.createdAt ? format(new Date(source.createdAt), "MMMM do, yyyy") : "recently"}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => onViewContent(source)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Content
                </Button>
                {onGeneratePosts && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGeneratePosts(source);
                    }}
                    size="sm"
                    className="bg-gradient-to-r from-cf-primary-green to-cf-secondary-green hover:from-cf-secondary-green hover:to-cf-primary-green text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Posts
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

