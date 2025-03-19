import type { ContentSource } from "@/types/content-sources"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Youtube, Globe, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
// import { formatDistanceToNow } from "date-fns"

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
          <Card key={i} className="overflow-hidden bg-gray-50 border-0 rounded-lg shadow-sm">
            <CardContent className="p-0">
              <div className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-60" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (sources.length === 0) {
    return (
      <Card className="bg-gray-50 border-0 rounded-lg shadow-sm">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No content sources found. Add your first source to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <div key={source.id} className="overflow-hidden bg-[#ECEEF2] border-none rounded-lg ">
          <div className="p-0">
            <div className="relative px-3 py-2">
              <div className="absolute top-2 right-3 text-xs font-medium bg-gray-700 text-white px-2 py-0.5 rounded">
                {source.type.toUpperCase()}
              </div>
            </div>
            <div className="p-5 grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold">{source.label}</p>
                <p className="text-xs text-muted-foreground mt-1">Source Name</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold truncate max-w-[150px] mx-auto">{source.url.split('/').pop() || source.url}</p>
                <p className="text-xs text-muted-foreground mt-1">Content ID</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {source.type === "youtube" ? "YouTube" : "Website"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Source Type</p>
              </div>
              <div className="text-center flex items-center justify-center">
                <Button variant="outline" onClick={() => onViewContent(source)} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Content
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

