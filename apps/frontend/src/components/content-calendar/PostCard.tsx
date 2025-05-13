import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Schedule } from "@/types/schedule";
interface PostCardProps {
  schedule: Schedule;
  onClick: () => void;
  compact?: boolean;
}

export default function PostCard({
  schedule,
  onClick,
  compact = false,
}: PostCardProps) {
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

  const platformColor = getPlatformColor(schedule.platform);

  if (compact) {
    return (
      <div
        className={cn(
          "p-2 mb-1 rounded cursor-pointer border-l-4 text-xs",
          platformColor
        )}
        onClick={onClick}
      >
        <div className="font-medium truncate">{schedule.post.title}</div>
        <div className="flex items-center text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
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
      <div className="font-medium">{schedule.post.title}</div>
      <div className="flex items-center text-gray-500 text-sm mt-1">
        <Clock className="h-3 w-3 mr-1" />
      </div>
    </div>
  );
}
