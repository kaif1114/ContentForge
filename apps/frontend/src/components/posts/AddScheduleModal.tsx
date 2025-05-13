import { useState } from "react";
import { Calendar as CalendarIcon, Clock, ChevronLeft, X } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useAddSchedule } from "@/hooks/useAddSchedule";
import { Post } from "@/types/content";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

const AddScheduleModal = ({ isOpen, onClose, post }: AddScheduleModalProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    "linkedin" | "x" | "both"
  >(post.platform || "both");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("12:00");

  const { mutateAsync, isPending } = useAddSchedule();

  if (!isOpen) return null;

  const handleScheduleSubmit = () => {
    // Combine date and time
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduleDate = new Date(selectedDate);
    scheduleDate.setHours(hours, minutes, 0, 0);

    const schedulePromise = mutateAsync({
      postId: post._id,
      platform: selectedPlatform,
      scheduleDate: scheduleDate,
    });

    toast
      .promise(schedulePromise, {
        loading: "Scheduling post...",
        success: "Post scheduled successfully!",
        error: "Failed to schedule post",
      })
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error("Scheduling error:", error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-51">
      <div className="absolute inset-0 backdrop-blur-xs" onClick={onClose} />
      <div className="w-full max-w-md md:max-w-lg rounded-lg shadow-xl overflow-hidden relative modal-bg">
        <div className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onClose}
            >
              <ChevronLeft className="h-5 w-5 text-mint-700" />
            </Button>
            <h2 className="text-xl font-bold">Schedule Post</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Platform</Label>
            <RadioGroup
              value={selectedPlatform}
              onValueChange={(value) =>
                setSelectedPlatform(value as "linkedin" | "x" | "both")
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="linkedin" id="linkedin" />
                <Label
                  htmlFor="linkedin"
                  className="flex items-center space-x-2"
                >
                  <img
                    src="/linkedin.png"
                    width={24}
                    height={24}
                    alt="LinkedIn"
                  />
                  <span>LinkedIn</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="x" id="x" />
                <Label htmlFor="x" className="flex items-center space-x-2">
                  <img src="/x.png" width={20} height={20} alt="X" />
                  <span>X</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="flex items-center space-x-2">
                  <img
                    src="/linkedin_and_x.png"
                    width={48}
                    height={24}
                    alt="Both"
                  />
                  <span>Both</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between items-center"
                  >
                    <span>{format(selectedDate, "PPP")}</span>
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Time</Label>
              <div className="flex items-center">
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full border border-input rounded-md px-3 py-2"
                />
                <Clock className="ml-2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-3 border rounded-lg p-4">
            <h3 className="font-medium">Post Preview</h3>
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">{post.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {post.description}
              </p>
              <div className="flex space-x-2 flex-wrap">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Source: {post.sourceTitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleScheduleSubmit} disabled={isPending}>
            {isPending ? "Scheduling..." : "Schedule Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddScheduleModal;
