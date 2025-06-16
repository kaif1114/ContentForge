import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { createPortal } from "react-dom";

import { Post } from "@/types/content";
import { useState, useRef } from "react";

interface PostCardProps {
  post: Post;
  onEdit: () => void;
  onDiscard?: (postId: string) => void;
  onSchedule: () => void;
}

export default function PostCard({
  post,
  onEdit,
  onDiscard,
  onSchedule,
}: PostCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const cardRef = useRef<HTMLDivElement>(null);
  // const [showPopup, setShowPopup] = useState(false)

  // const enhanceButtonRef = useRef<HTMLButtonElement>(null)

  // const handleEnhanceClick = () => {
  //   setShowPopup(true)
  // }

  // const handleEnhanceComplete = (options: any) => {
  //   console.log("Enhance with options:", options);
  //   setShowPopup(false);
  //   // Add your enhance logic here
  // }

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handleScheduleClick = () => {
    onSchedule();
    setShowTooltip(false);
  };

  // Check if any modal is open to determine if tooltip should be enabled /* || showPopup */ // Add other modals here if needed

  return (
    <>
      <div
        ref={cardRef}
        className="p-[4px] border flex flex-col items-center rounded-[28px] w-full cf-card-gradient relative z-0"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="bg-white rounded-3xl p-4 md:p-6 md:pt-3 shadow-md border w-full border-cf-beige-light">
          <div className="mb-5 flex justify-between items-center">
            <div className="flex items-center">
              {post.platform === "linkedin" ? (
                <img
                  src={"/linkedin.png"}
                  width={70}
                  height={70}
                  alt={post.title}
                />
              ) : post.platform === "x" ? (
                <img src={"/x.png"} width={30} height={30} alt={post.title} />
              ) : (
                <img
                  src={"/linkedin_and_x.png"}
                  width={90}
                  height={90}
                  alt={post.title}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-cf-mint-light text-cf-primary-green border-cf-primary-green">
                Draft
              </Badge>
              {post.sourceType && (
                <Badge 
                  className={`text-xs font-medium ${
                    post.sourceType === "content" 
                      ? "bg-gradient-to-r from-cf-primary-green to-cf-secondary-green text-white border-0" 
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                  }`}
                >
                  {post.sourceType === "content" ? "From Sources" : "From Ideas"}
                </Badge>
              )}
              {onDiscard && (
                <button
                  onClick={() => onDiscard(post._id)}
                  className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <h2 className="text-base md:text-lg font-bold text-cf-dark mb-2 leading-tight line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm md:text-md text-gray-500 mb-2 md:mb-3">
            {post.sourceTitle}
          </p>

          <div className="flex flex-wrap justify-between py-1 sm:py-2 gap-1 sm:gap-1.5 md:gap-2 max-w-full overflow-hidden">
            <div className="flex gap-1 sm:gap-1.5 md:gap-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 justify-center px-1.5 py-0.5 sm:px-2 md:px-3 md:py-1 border border-cf-primary-green bg-white text-cf-primary-green rounded-md text-[10px] sm:text-xs font-semibold truncate max-w-[90px] sm:max-w-[120px] md:max-w-[150px] hover:bg-cf-mint-light hover:border-cf-primary-green"
              >
                <Pencil className="w-4 h-4" /> Edit & Enhance
              </button>
              {/* <button
              ref={enhanceButtonRef}
              onClick={handleEnhanceClick}
              className="flex items-center gap-2 justify-center px-1.5 py-0.5 sm:px-2 md:px-3 md:py-1 border border-cf-primary-green bg-white text-cf-primary-green rounded-md text-[10px] sm:text-xs font-semibold truncate max-w-[90px] sm:max-w-[120px] md:max-w-[150px] hover:bg-cf-mint-light hover:border-cf-primary-green"
            >
              <Sparkle className="w-4 h-4" /> Enhance with AI
            </button> */}
            </div>
          </div>
        </div>
        <button
          className="text-sm text-white hover:text-[#cfe2dc] md:text-base font-bold py-2 md:py-3"
          onClick={handleScheduleClick}
        >
          Schedule
        </button>

        {/* Markdown Tooltip using Portal - only show if no modals are open */}
        {showTooltip &&
          post.description &&
          typeof document !== "undefined" &&
          createPortal(
            <TooltipContent
              cursorPosition={cursorPosition}
              content={post.description}
            />,
            document.body
          )}

        {/* Schedule Modal */}

        {/* {showPopup && (
            <EnhancePopup
              isOpen={showPopup}
              onClose={() => setShowPopup(false)}
              onEnhance={handleEnhanceComplete}
              buttonRef={enhanceButtonRef}
            />
          )} */}
      </div>
    </>
  );
}

// Tooltip component that positions itself at the cursor
function TooltipContent({
  cursorPosition,
  content,
}: {
  cursorPosition: { x: number; y: number };
  content: string;
}) {
  // Add a small offset to avoid the tooltip appearing directly under the cursor
  const offsetX = 15;
  const offsetY = 10;

  // Calculate position to keep tooltip within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tooltipWidth = 280; // Reduced from 320px
  const tooltipMaxHeight = 300; // Reduced from 400px
  
  let left = cursorPosition.x + offsetX;
  let top = cursorPosition.y + offsetY;
  
  // Adjust if tooltip would go off-screen horizontally
  if (left + tooltipWidth > viewportWidth - 20) {
    left = cursorPosition.x - tooltipWidth - offsetX;
  }
  
  // Adjust if tooltip would go off-screen vertically
  if (top + tooltipMaxHeight > viewportHeight - 20) {
    top = cursorPosition.y - tooltipMaxHeight - offsetY;
  }

  return (
    <div
      className="fixed shadow-2xl border border-gray-200/80 bg-white/95 backdrop-blur-sm rounded-2xl p-5 w-70 max-h-[300px] overflow-y-auto z-[9999] transition-all duration-200"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        pointerEvents: "none",
        width: "280px",
      }}
    >
      {/* Header with subtle styling */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
        <div className="w-2 h-2 bg-cf-primary-green rounded-full"></div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Post Content</span>
      </div>
      
      {/* Content with improved typography */}
      <div className="prose prose-sm max-w-none prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-2 prose-headings:text-gray-800 prose-headings:font-semibold prose-headings:my-2 prose-a:text-cf-primary-green hover:prose-a:text-cf-secondary-green prose-strong:text-gray-800 prose-em:text-gray-600">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      
      {/* Subtle arrow indicator */}
      <div 
        className="absolute w-3 h-3 bg-white/95 border-l border-t border-gray-200/80 transform rotate-45"
        style={{
          left: left > cursorPosition.x ? 'calc(100% - 6px)' : '-6px',
          top: '20px',
        }}
      />
    </div>
  );
}
