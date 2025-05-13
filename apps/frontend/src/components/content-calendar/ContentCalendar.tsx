import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  addDays,
  parse,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";
import { useSchedule } from "@/hooks/useSchedule";
import { Schedule } from "@/types/schedule";
import DatePickerCalendar from "./DatePickerCalendar";
type ViewType = "day" | "week" | "month";

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("week");
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const {
    data: schedule,
    isError,
    error,
    isLoading,
  } = useSchedule(currentDate.getMonth() + 1, currentDate.getFullYear());

  const navigateDate = (direction: "prev" | "next") => {
    if (view === "day") {
      setCurrentDate(
        direction === "prev"
          ? addDays(currentDate, -1)
          : addDays(currentDate, 1)
      );
    } else if (view === "week") {
      setCurrentDate(
        direction === "prev"
          ? addDays(currentDate, -7)
          : addDays(currentDate, 7)
      );
    } else {
      setCurrentDate(
        direction === "prev"
          ? subMonths(currentDate, 1)
          : addMonths(currentDate, 1)
      );
    }
  };

  // Get the appropriate date format based on the current view
  const getDateRangeDisplay = () => {
    if (view === "day") {
      return format(currentDate, "MMMM d, yyyy");
    } else if (view === "week") {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = addDays(weekStart, 6);
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    } else {
      return format(currentDate, "MMMM yyyy");
    }
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    setIsDatePickerOpen(false);
  };

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Calendar</h1>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Jump to date
                </Button>
                {isDatePickerOpen && (
                  <div className="absolute top-full left-0 mt-1 z-20">
                    <DatePickerCalendar
                      selectedDate={currentDate}
                      onDateSelect={handleDateChange}
                      onClose={() => setIsDatePickerOpen(false)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {getDateRangeDisplay()}
                </h2>
                <ChevronRight
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => navigateDate("next")}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4 text-xl">
            Error Loading Calendar
          </div>
          <p className="text-gray-600">
            {error?.message ||
              "Failed to load schedule data. Please try again later."}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Calendar</h1>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Jump to date
                </Button>
                {isDatePickerOpen && (
                  <div className="absolute top-full left-0 mt-1 z-20">
                    <DatePickerCalendar
                      selectedDate={currentDate}
                      onDateSelect={handleDateChange}
                      onClose={() => setIsDatePickerOpen(false)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {getDateRangeDisplay()}
                </h2>
                <ChevronRight
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => navigateDate("next")}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span className="h-4 w-16 bg-gray-200 animate-pulse rounded"></span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-end mb-4 space-x-2">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <Button
                variant={view === "day" ? "default" : "ghost"}
                className={cn(
                  "rounded-full",
                  view === "day" ? "" : "text-gray-500"
                )}
                onClick={() => setView("day")}
              >
                Day
              </Button>
              <Button
                variant={view === "week" ? "default" : "ghost"}
                className={cn(
                  "rounded-full",
                  view === "week" ? "" : "text-gray-500"
                )}
                onClick={() => setView("week")}
              >
                Week
              </Button>
              <Button
                variant={view === "month" ? "default" : "ghost"}
                className={cn(
                  "rounded-full",
                  view === "month" ? "" : "text-gray-500"
                )}
                onClick={() => setView("month")}
              >
                Month
              </Button>
            </div>
          </div>
          {view === "day" && (
            <div className="border rounded-lg">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[100px_1fr] border-b">
                  <div className="p-4 h-24 bg-gray-100"></div>
                  <div className="p-4 h-24 bg-gray-50"></div>
                </div>
              ))}
            </div>
          )}
          {view === "week" && (
            <div className="border rounded-lg">
              <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="p-4 h-10 bg-gray-100"></div>
                ))}
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b"
                >
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div key={j} className="p-4 h-24 bg-gray-50"></div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {view === "month" && (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100"></div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-50 rounded-lg"></div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!schedule?.data || schedule?.data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Calendar</h1>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Jump to date
                </Button>
                {isDatePickerOpen && (
                  <div className="absolute top-full left-0 mt-1 z-20">
                    <DatePickerCalendar
                      selectedDate={currentDate}
                      onDateSelect={handleDateChange}
                      onClose={() => setIsDatePickerOpen(false)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {getDateRangeDisplay()}
                </h2>
                <ChevronRight
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => navigateDate("next")}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <CalendarIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-xl font-medium mb-2">No scheduled content</h3>
          <p className="text-gray-500 mb-4">There are no posts scheduled.</p>
        </div>
      </div>
    );
  }

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  // Generate days for the current month view
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Generate days for the current week view
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const daysInWeek = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek, i)
  );

  // Filter posts for the current view
  const getPostsForDay = (day: Date) => {
    return (
      schedule?.data?.filter((post: Schedule) => {
        const postDate = parseISO(post.scheduleDate);
        return isSameDay(postDate, day);
      }) || []
    );
  };

  // Hours for the day view
  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM

  return (
    <div className="modal-bg rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Calendar</h1>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Jump to date
              </Button>
              {isDatePickerOpen && (
                <div className="absolute top-full left-0 mt-1 z-20">
                  <DatePickerCalendar
                    selectedDate={currentDate}
                    onDateSelect={handleDateChange}
                    onClose={() => setIsDatePickerOpen(false)}
                    events={schedule?.data}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{getDateRangeDisplay()}</h2>
              <ChevronRight
                className="h-4 w-4 cursor-pointer"
                onClick={() => navigateDate("next")}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4" />
          <span>{schedule?.data.length} event's</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-end mb-4 space-x-2">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <Button
              variant={view === "day" ? "default" : "ghost"}
              className={cn(
                "rounded-full",
                view === "day" ? "" : "text-gray-500"
              )}
              onClick={() => setView("day")}
            >
              Day
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              className={cn(
                "rounded-full",
                view === "week" ? "" : "text-gray-500"
              )}
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              variant={view === "month" ? "default" : "ghost"}
              className={cn(
                "rounded-full",
                view === "month" ? "" : "text-gray-500"
              )}
              onClick={() => setView("month")}
            >
              Month
            </Button>
          </div>
        </div>

        {view === "day" && (
          <div className="border rounded-lg">
            <div className="grid grid-cols-[100px_1fr] border-b">
              <div className="p-4 font-medium border-r">UTC +1</div>
              <div className="p-4 font-medium">
                {format(currentDate, "d")}
                <div className="text-gray-500">
                  {format(currentDate, "EEEE")}
                </div>
              </div>
            </div>
            <div>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[100px_1fr] border-b last:border-b-0"
                >
                  <div className="p-4 border-r">
                    {hour % 12 || 12} {hour < 12 ? "AM" : "PM"}
                  </div>
                  <div className="p-2 min-h-[100px]">
                    {getPostsForDay(currentDate)
                      .filter((post: Schedule) => {
                        const postDate = parseISO(post.scheduleDate);
                        return postDate.getHours() === hour;
                      })
                      .map((post: Schedule) => (
                        <PostCard
                          key={post._id}
                          post={post}
                          onClick={() => handlePostClick(post)}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="border rounded-lg">
            <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
              <div className="p-4 font-medium border-r">UTC +1</div>
              {daysInWeek.map((day, index) => (
                <div key={index} className="p-4 font-medium text-center">
                  {format(day, "d")}
                  <div className="text-gray-500">{format(day, "EEEE")}</div>
                </div>
              ))}
            </div>
            <div>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b last:border-b-0"
                >
                  <div className="p-4 border-r">
                    {hour % 12 || 12} {hour < 12 ? "AM" : "PM"}
                  </div>
                  {daysInWeek.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="p-2 min-h-[100px] border-r last:border-r-0"
                    >
                      {getPostsForDay(day)
                        .filter((post: Schedule) => {
                          const postDate = parseISO(post.scheduleDate);
                          return postDate.getHours() === hour;
                        })
                        .map((post: Schedule) => (
                          <PostCard
                            key={post._id}
                            post={post}
                            onClick={() => handlePostClick(post)}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "month" && (
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium p-2">
                {day}
              </div>
            ))}
            {Array.from(
              { length: startOfMonth(currentDate).getDay() },
              (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="h-32 p-2 bg-gray-50 rounded-lg"
                ></div>
              )
            )}
            {daysInMonth.map((day) => (
              <div
                key={day.toString()}
                className={cn(
                  "h-32 p-2 rounded-lg overflow-y-auto",
                  isSameMonth(day, currentDate)
                    ? "bg-white border"
                    : "bg-gray-50"
                )}
              >
                <div className="font-medium mb-1">{format(day, "d")}</div>
                {getPostsForDay(day).map((post: Schedule) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onClick={() => handlePostClick(post)}
                    compact
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={closeModal} />
      )}
    </div>
  );
}
