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

  setMonth,
  setYear,
} from "date-fns";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Schedule } from "@/types/schedule";

interface DatePickerCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  events?: Schedule[];
}

export default function DatePickerCalendar({
  selectedDate,
  onDateSelect,
  onClose,
  events = [],
}: DatePickerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(
      direction === "prev"
        ? subMonths(currentMonth, 1)
        : addMonths(currentMonth, 1)
    );
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const hasEvents = (date: Date) => {
    return events.some((event) => {
      const eventDate = new Date(event.scheduleDate);
      return isSameDay(eventDate, date);
    });
  };

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate a list of years (current year ± 10 years)
  //   const currentYear = getYear(new Date());
  //   const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  const years = [2025];

  const handleSelectDate = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(currentMonth, monthIndex);
    setCurrentMonth(newDate);
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year: number) => {
    const newDate = setYear(currentMonth, year);
    setCurrentMonth(newDate);
    setShowYearPicker(false);
  };

  const closeDropdowns = () => {
    setShowMonthPicker(false);
    setShowYearPicker(false);
  };

  return (
    <div className="modal-bg p-4 rounded-lg shadow w-72">
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex gap-1">
          <button
            className="text-gray-600 hover:text-gray-900 font-medium text-lg flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
          >
            {format(currentMonth, "MMMM")}
            <ChevronDown className="h-4 w-4" />
          </button>

          <button
            className="text-gray-600 hover:text-gray-900 font-medium text-lg flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => {
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
          >
            {format(currentMonth, "yyyy")}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              navigateMonth("prev");
              closeDropdowns();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              navigateMonth("next");
              closeDropdowns();
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showMonthPicker && (
        <div className="absolute left-4 top-16 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-[calc(100%-2rem)]">
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <button
                key={month}
                className={cn(
                  "px-2 py-1.5 text-sm rounded-md transition-colors",
                  currentMonth.getMonth() === index
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100"
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}

      {showYearPicker && (
        <div className="absolute right-4 top-16 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-h-48 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {years.map((year) => (
              <button
                key={year}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors text-center",
                  currentMonth.getFullYear() === year
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100"
                )}
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 h-8 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({
          length: new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
          ).getDay(),
        }).map((_, index) => (
          <div key={`empty-start-${index}`} className="h-10"></div>
        ))}

        {daysInMonth.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const hasEventOnDay = hasEvents(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div key={day.toString()} className="relative">
              <button
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm",
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 hover:bg-gray-100",
                  !isCurrentMonth && "text-gray-300"
                )}
                onClick={() => handleSelectDate(day)}
              >
                {format(day, "d")}
              </button>
              {hasEventOnDay && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={onClose}
        >
          Jump
        </Button>
      </div>
    </div>
  );
}
