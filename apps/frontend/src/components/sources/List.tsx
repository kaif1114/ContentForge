import type { ContentSource } from "@/types/content-sources"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Youtube, Globe, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
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
    <div className="space-y-4 ">
      {sources.map((source) => (
        <div key={source.id} className="bg-gray-50 border-0 rounded-lg shadow-sm flex items-center py-5 blue">
          <div className="flex flex-col justify-center items-center  px-8">
            <p className="font-semibold">Type</p>
            {source.type === "youtube" ? <Youtube width={40} height={40}/> : <Globe width={40} height={40}/>}
          </div>
          <div className="h-18 w-px bg-gray-300 mx-2"></div>
          <div className="flex flex-col gap-2 px-8 min-w-xs">
            <p className="w-max font-semibold">{source.label}</p>
            <p title={source.url}>{truncateUrl(source.url)}</p>
          </div>
          <div className="flex flex-col gap-2 px-8">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, numquam?</p>
            <p>October 31st</p>
          </div>
          <div className="flex-col"></div>
        </div>
      ))}
    </div>
  )
}

