import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink, X, Youtube } from "lucide-react"
import type { ContentSource } from "@/types/content-sources"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface ContentViewModalProps {
  source: ContentSource
  onClose: () => void
  open: boolean
}

export function ContentViewModal({
  source,
  onClose,
  open,
}: ContentViewModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 shrink-0">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold pr-8">
              {source.label}
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={source.type === "youtube" ? "destructive" : "secondary"} className="flex items-center gap-1">
              {source.type === "youtube" ? (
                <>
                  <Youtube className="h-3 w-3" />
                  YouTube
                </>
              ) : (
                <>
                  <ExternalLink className="h-3 w-3" />
                  URL
                </>
              )}
            </Badge>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Added on {formatDate(source.createdAt)}
            </div>
          </div>
          
          <a 
            href={source.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-2 max-w-full"
          >
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{source.url}</span>
          </a>
        </DialogHeader>
        
        <Separator className="shrink-0" />
        
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: source.content }} 
                  className="break-words [&_img]:max-w-full [&_pre]:overflow-x-auto [&_table]:w-full [&_table]:table-fixed"
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
