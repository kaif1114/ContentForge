import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import type { ContentSource } from "@/types/content"
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

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
      <DialogContent className="font-inter sm:max-w-[90vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white rounded-2xl border">
        <DialogHeader className="p-6 pb-3 shrink-0">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold">
              {source.label}
            </DialogTitle>
            
          </div>
          
          <div className="flex flex-col gap-3 py-4">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Badge variant="outline" className="flex items-center gap-1 font-normal">
                <ExternalLink className="h-3 w-3" />
                URL
              </Badge>
              <span className="ml-2">Added on {formatDate(source.createdAt)}</span>
            </div>
            
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline flex items-center gap-1 mt-1"
            >
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
              <span className="break-all">{source.url}</span>
            </a>
          </div>
        </DialogHeader>
        
        <Separator className="shrink-0" />
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-xl font-bold">
              How to Create an AI Agent for Customer Support
            </h2>
            <div className="flex flex-col">
              <span className="text-base font-medium">Maxwell Timothy</span>
              <span className="text-sm text-muted-foreground">Dec 28, 2024</span>
              <span className="text-sm text-muted-foreground">13 minute read</span>
            </div>
          </div> */}
          
          <div className="prose prose-p:my-3 prose-headings:font-bold prose-headings:my-4 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-a:text-green-600 hover:prose-a:underline max-w-none">
            <ReactMarkdown 
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
            >
              {source.content}
            </ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
