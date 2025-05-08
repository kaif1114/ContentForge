import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Idea } from "../../types/idea";
import { Check, FileText, Video, Clock } from "lucide-react";

interface ContentIdeaCardProps {
  idea: Idea;
  isSelected: boolean;
  onSelect: () => void;
}

export function ContentIdeaCard({
  idea,
  isSelected,
  onSelect,
}: ContentIdeaCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative rounded-xl bg-[#DEF0EA]/80 backdrop-blur-sm border border-white/20
                 p-5 shadow-sm hover:shadow-md transition
                 ${isSelected ? "ring-2 ring-[var(--cf-primary-green)]" : ""}
                 hover:translate-y-[-2px]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect();
          e.preventDefault();
        }
      }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 bg-[var(--cf-primary-green)] rounded-full p-1">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Card content */}
      <div className="mb-12">
        <h3 className="text-lg leading-6 font-semibold text-[var(--cf-text-dark)] line-clamp-2">
          {idea.title}
        </h3>

        <p className="mt-2 text-sm leading-5 text-muted-foreground line-clamp-3">
          {idea.description}
        </p>
      </div>

      {/* Action buttons */}
      <div
        className={`absolute right-4 bottom-4 transition-all duration-150 md:opacity-0 md:translate-y-2 
                      ${isHovered ? "md:opacity-100 md:translate-y-0" : ""}`}
      >
        <Button
          variant="ghost"
          className="text-[var(--cf-primary-green)] hover:bg-white/50 hover:backdrop-blur-md rounded-xl"
          onClick={(e) => {
            e.stopPropagation();
            // In a real app, this would open a modal to generate posts
            console.log("Generate posts from idea:", idea._id);
          }}
        >
          Generate Posts
        </Button>
      </div>

      {/* Card overlay for selection */}
      <div
        className="absolute inset-0 cursor-pointer rounded-xl"
        onClick={onSelect}
        aria-label={`Select idea: ${idea.title}`}
      />
    </div>
  );
}
