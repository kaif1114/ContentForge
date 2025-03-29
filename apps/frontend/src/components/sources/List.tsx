import type { ContentSource } from "@/types/content-sources"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Youtube, Globe } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
// import { formatDistanceToNow } from "date-fns"

// Function to truncate URL to 30 characters
const truncateUrl = (url: string, maxLength: number = 30) => {
  return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
}

interface ContentSourcesListProps {
  sources: ContentSource[]
  isLoading: boolean
  onViewContent: (source: ContentSource) => void
}

export function ContentSourcesList({ sources, isLoading, onViewContent }: ContentSourcesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (sources.length === 0) {
    return (
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm">
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
          key={source.id}
          initial={{ scale: 1 }}
          whileHover={{ 
            scale: 1.01,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            transition: { duration: 0.2 }
          }}
          className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
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
              className="text-blue-600 hover:underline text-sm mb-4 block"
            >
              {truncateUrl(source.url)}
            </a>

            <p className="text-gray-600 text-sm mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, numquam?
            </p>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Added October 31st</span>
              <Button
                onClick={() => onViewContent(source)}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Content
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

