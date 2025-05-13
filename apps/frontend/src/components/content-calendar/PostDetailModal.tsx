import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { parseISO, format } from "date-fns";
import { Calendar, Clock, X } from "lucide-react";

interface PostDetailModalProps {
  post: any;
  onClose: () => void;
}

export default function PostDetailModal({
  post,
  onClose,
}: PostDetailModalProps) {
  const postDate = parseISO(post.scheduleDate);
  const formattedDate = format(postDate, "MMMM d, yyyy");
  const formattedTime = format(postDate, "h:mm a");

  const getPlatformDetails = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "x":
        return { name: "Twitter/X", color: "bg-red-100 text-red-800" };
      case "linkedin":
        return { name: "LinkedIn", color: "bg-blue-100 text-blue-800" };
      case "both":
        return { name: "Facebook", color: "bg-indigo-100 text-indigo-800" };
      default:
        return { name: platform, color: "bg-gray-100 text-gray-800" };
    }
  };

  const platformDetails = getPlatformDetails(post.platform);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{post.post.title}</DialogTitle>
            <X className="h-4 w-4 cursor-pointer" onClick={onClose} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={platformDetails.color}>
              {platformDetails.name}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formattedTime}
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-1">Description</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {post.post.description}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-1">Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Status:</span>
              <Badge variant="outline" className="ml-2 capitalize">
                {post.post.status}
              </Badge>
            </div>
            <div>
              <span className="text-gray-500">Length:</span>
              <Badge variant="outline" className="ml-2 capitalize">
                {post.post.length}
              </Badge>
            </div>
            <div>
              <span className="text-gray-500">Tone:</span>
              <Badge variant="outline" className="ml-2 capitalize">
                {post.post.tone}
              </Badge>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2">
                {format(parseISO(post.post.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
