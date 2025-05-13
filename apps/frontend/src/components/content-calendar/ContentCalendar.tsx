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
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";

// dummy data for UI preview
export const dummyPosts = [
  {
    _id: "6820ac8d00fc0c8e70278459",
    scheduleDate: "2025-07-15T15:30:00.000Z",
    platform: "x",
    post: {
      title: "Bootstrapping Success! 🚀",
      description:
        '"We bootstrapped from day one, and I\'m so happy we did!" - Sandra Lewis of Worldwide 101, now earning $275K/mo! Curious about their journey? 🤔 Read on to discover their secrets! #Entrepreneurship #SuccessStory',
      tags: [],
      platform: "x",
      length: "short",
      tone: "informative",
      status: "scheduled",
      createdAt: "2025-05-11T13:54:43.186Z",
      _id: "6820ac2300fc0c8e70278438",
    },
  },
  {
    _id: "6820cb5cafa48d4e94e0a892",
    scheduleDate: "2025-07-15T15:30:00.000Z",
    platform: "linkedin",
    post: {
      title: "Bootstrapping Success! 🚀",
      description:
        '"We bootstrapped from day one, and I\'m so happy we did!" - Sandra Lewis of Worldwide 101, now earning $275K/mo! Curious about their journey? 🤔 Read on to discover their secrets! #Entrepreneurship #SuccessStory',
      tags: [],
      platform: "x",
      length: "short",
      tone: "informative",
      status: "scheduled",
      createdAt: "2025-05-11T13:54:43.186Z",
      _id: "6820ac2300fc0c8e70278438",
    },
  },
  // Additional dummy data to populate the calendar
  {
    _id: "6820cb5cafa48d4e94e0a893",
    scheduleDate: "2025-07-15T09:30:00.000Z",
    platform: "facebook",
    post: {
      title: "Morning Marketing Tips",
      description:
        "Start your day with these 5 essential marketing tips that will boost your engagement and drive more traffic to your website. #MarketingTips #MorningRoutine",
      tags: ["marketing", "tips"],
      platform: "facebook",
      length: "medium",
      tone: "educational",
      status: "scheduled",
      createdAt: "2025-05-10T10:24:43.186Z",
      _id: "6820ac2300fc0c8e70278439",
    },
  },
  {
    _id: "6820cb5cafa48d4e94e0a894",
    scheduleDate: "2025-07-16T11:00:00.000Z",
    platform: "instagram",
    post: {
      title: "Product Launch Announcement",
      description:
        "Exciting news! We're launching our new product line next week. Stay tuned for exclusive early access and special discounts for our loyal followers. #ProductLaunch #ComingSoon",
      tags: ["product", "launch"],
      platform: "instagram",
      length: "short",
      tone: "exciting",
      status: "scheduled",
      createdAt: "2025-05-12T09:15:43.186Z",
      _id: "6820ac2300fc0c8e70278440",
    },
  },
  {
    _id: "6820cb5cafa48d4e94e0a895",
    scheduleDate: "2025-07-16T14:00:00.000Z",
    platform: "linkedin",
    post: {
      title: "Industry Insights Report",
      description:
        "Our latest industry report reveals surprising trends that will shape the market in the coming year. Download the full report to stay ahead of the competition. #IndustryInsights #MarketTrends",
      tags: ["report", "insights"],
      platform: "linkedin",
      length: "long",
      tone: "professional",
      status: "scheduled",
      createdAt: "2025-05-09T16:30:43.186Z",
      _id: "6820ac2300fc0c8e70278441",
    },
  },
  {
    _id: "6820cb5cafa48d4e94e0a896",
    scheduleDate: "2025-07-17T10:00:00.000Z",
    platform: "x",
    post: {
      title: "Quick Poll",
      description:
        "What feature would you like to see in our next update? Vote now and help shape our product roadmap! #CustomerFeedback #ProductDevelopment",
      tags: ["poll", "feedback"],
      platform: "x",
      length: "short",
      tone: "conversational",
      status: "scheduled",
      createdAt: "2025-05-13T11:20:43.186Z",
      _id: "6820ac2300fc0c8e70278442",
    },
  },
  {
    _id: "6820cb5cafa48d4e94e0a897",
    scheduleDate: "2025-07-17T13:30:00.000Z",
    platform: "facebook",
    post: {
      title: "Customer Success Story",
      description:
        "Meet John, who increased his business revenue by 200% using our platform. Read his inspiring journey and learn how you can achieve similar results. #SuccessStory #CustomerSpotlight",
      tags: ["success", "customer"],
      platform: "facebook",
      length: "medium",
      tone: "inspirational",
      status: "scheduled",
      createdAt: "2025-05-08T14:45:43.186Z",
      _id: "6820ac2300fc0c8e70278443",
    },
  },
  {
    _id: "6820cb5cafa48d4e94e0a898",
    scheduleDate: "2025-07-18T09:00:00.000Z",
    platform: "instagram",
    post: {
      title: "Friday Motivation",
      description:
        "It's Friday! Here's your dose of motivation to finish the week strong. Remember, persistence is key to success. #FridayMotivation #WeekendVibes",
      tags: ["motivation", "friday"],
      platform: "instagram",
      length: "short",
      tone: "motivational",
      status: "scheduled",
      createdAt: "2025-05-14T08:10:43.186Z",
      _id: "6820ac2300fc0c8e70278444",
    },
  },
  {
    _id: "6820cb5cafa48d4e94e0a899",
    scheduleDate: "2025-07-18T16:00:00.000Z",
    platform: "linkedin",
    post: {
      title: "Weekend Reading List",
      description:
        "Looking for some insightful weekend reading? Check out our curated list of the best articles and resources in the industry this week. #WeekendReading #ProfessionalDevelopment",
      tags: ["reading", "resources"],
      platform: "linkedin",
      length: "medium",
      tone: "helpful",
      status: "scheduled",
      createdAt: "2025-05-15T15:30:43.186Z",
      _id: "6820ac2300fc0c8e70278445",
    },
  },
];

type ViewType = "day" | "week" | "month";

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("week");
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

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
    return dummyPosts.filter((post) => {
      const postDate = parseISO(post.scheduleDate);
      return isSameDay(postDate, day);
    });
  };

  // Hours for the day view
  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Calendar</h1>
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
          <span>{dummyPosts.length} event's</span>
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
                      .filter((post) => {
                        const postDate = parseISO(post.scheduleDate);
                        return postDate.getHours() === hour;
                      })
                      .map((post) => (
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
                        .filter((post) => {
                          const postDate = parseISO(post.scheduleDate);
                          return postDate.getHours() === hour;
                        })
                        .map((post) => (
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
                {getPostsForDay(day).map((post) => (
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
