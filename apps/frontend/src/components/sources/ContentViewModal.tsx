import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"
import type { ContentSource, ScrapedContent } from "@/types/content-sources"


interface ContentViewModalProps {
  source: ContentSource
  content: ScrapedContent | null
  isLoading: boolean
  onClose: () => void
}

export function ContentViewModal({ source, content, isLoading, onClose }: ContentViewModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{source.label}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-4">
            Source:{" "}
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-wayflyer-green hover:underline"
            >
              {source.url}
            </a>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-wayflyer-green mb-4" />
              <p className="text-muted-foreground">Fetching content...</p>
            </div>
          ) : content ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">{content.title}</h2>

              <div className="space-y-4">
                {content.content.map((item, index) => (
                  <div key={index}>
                    {item.type === "text" ? (
                      <p className="text-sm leading-relaxed">{item.content}</p>
                    ) : item.type === "video" ? (
                      <div className="aspect-video relative rounded-md overflow-hidden">
                        <div className="bg-black/5 flex items-center justify-center">
                          <img
                            src={item.thumbnail || "/placeholder.svg?height=180&width=320"}
                            alt="Video thumbnail"
                            width={640}
                            height={360}
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button className="bg-wayflyer-green hover:bg-wayflyer-green/90">Play Video</Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="text-xs text-muted-foreground pt-4 border-t">
                Last updated: {new Date(content.lastUpdated).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No content available for this source.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

