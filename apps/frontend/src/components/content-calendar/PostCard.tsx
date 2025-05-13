import { parseISO, format } from "date-fns";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCardProps {
  post: any;
  onClick: () => void;
  compact?: boolean;
}

export default function PostCard({
  post,
  onClick,
  compact = false,
}: PostCardProps) {
  const postDate = parseISO(post.scheduleDate);
  const startTime = format(postDate, "hh:mm a");
  const endTime = format(
    new Date(postDate.getTime() + 60 * 60 * 1000),
    "hh:mm a"
  );

  // Determine color based on platform
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "x":
        return "border-red-500 bg-red-50";
      case "linkedin":
        return "border-blue-500 bg-blue-50";
      case "facebook":
        return "border-indigo-500 bg-indigo-50";
      case "instagram":
        return "border-pink-500 bg-pink-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const platformColor = getPlatformColor(post.platform);

  if (compact) {
    return (
      <div
        className={cn(
          "p-2 mb-1 rounded cursor-pointer border-l-4 text-xs",
          platformColor
        )}
        onClick={onClick}
      >
        <div className="font-medium truncate">{post.post.title}</div>
        <div className="flex items-center text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {startTime}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-3 mb-2 rounded cursor-pointer border-l-4",
        platformColor
      )}
      onClick={onClick}
    >
      <div className="font-medium">{post.post.title}</div>
      <div className="flex items-center text-gray-500 text-sm mt-1">
        <Clock className="h-3 w-3 mr-1" />
        {startTime} - {endTime}
      </div>

      <div className="flex items-center mt-2">
        <div className="flex -space-x-2">
          <Avatar className="h-6 w-6 border-2 border-white">
            <AvatarImage src="/placeholder.svg?height=24&width=24" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar className="h-6 w-6 border-2 border-white">
            <AvatarImage src="/placeholder.svg?height=24&width=24" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <Avatar className="h-6 w-6 border-2 border-white">
            <AvatarImage src="/placeholder.svg?height=24&width=24" />
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
        </div>
        <span className="text-xs text-gray-500 ml-2">+2 Other</span>
      </div>
    </div>
  );
}
