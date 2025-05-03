import { Pencil, Sparkle, ThumbsDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { Post } from "@/types/content"
import { useState, useRef } from "react"
import { EnhancePopup } from "./enhance-popup"

interface PostCardProps {
    post: Post,
    time: string,
    onEdit: () => void,
    onDiscard?: (postId: string) => void
  }
  
  export default function PostCard({
    post,
    onEdit,
    onDiscard
  }: PostCardProps) {
    
  const [showPopup, setShowPopup] = useState(false)
  const enhanceButtonRef = useRef<HTMLButtonElement>(null)
  
  const handleEnhanceClick = () => {
    setShowPopup(true)
  }

  const handleEnhanceComplete = (options: any) => {
    console.log("Enhance with options:", options);
    setShowPopup(false);
    // Add your enhance logic here
  }

    return (
        <div className="p-[4px] border flex flex-col items-center rounded-[28px] w-full cf-card-gradient relative z-0">
          <div className="bg-white rounded-3xl p-4 md:p-6 md:pt-3 shadow-md border w-full border-cf-beige-light">
            <div className="mb-2 flex justify-between items-center">
              <div className="flex items-center">
                {
                  post.platform === "linkedin" ? <img src={"/linkedin.png"} width={70} height={70} alt={post.title} /> : post.platform === "x" ? <img src={"/x.png"} width={30} height={30} alt={post.title} /> : <img src={"/linkedin_and_x.png"} width={90} height={90} alt={post.title} />  
                }
              </div>
              <div className="flex items-center">
                <Badge 
                  className="bg-cf-mint-light text-cf-primary-green border-cf-primary-green"
                >
                  Draft
                </Badge>
              </div>
            </div>
            <h2 className="text-base md:text-lg font-bold text-cf-dark mb-1 leading-tight line-clamp-2">{post.title}</h2>
            <p className="text-sm md:text-md text-gray-500 mb-2 md:mb-3">{post.sourceTitle}</p>
            
             <div className="flex flex-wrap py-1 sm:py-2 gap-1 sm:gap-1.5 md:gap-2 max-w-full overflow-hidden">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 justify-center px-1.5 py-0.5 sm:px-2 md:px-3 md:py-1 border border-cf-primary-green bg-white text-cf-primary-green rounded-md text-[10px] sm:text-xs font-semibold truncate max-w-[90px] sm:max-w-[120px] md:max-w-[150px] hover:bg-cf-mint-light hover:border-cf-primary-green"
                >
                  <Pencil className="w-4 h-4" />  Edit
                </button>
                <button
                  ref={enhanceButtonRef}
                  onClick={handleEnhanceClick}
                  className="flex items-center gap-2 justify-center px-1.5 py-0.5 sm:px-2 md:px-3 md:py-1 border border-cf-primary-green bg-white text-cf-primary-green rounded-md text-[10px] sm:text-xs font-semibold truncate max-w-[90px] sm:max-w-[120px] md:max-w-[150px] hover:bg-cf-mint-light hover:border-cf-primary-green"
                >
                  <Sparkle className="w-4 h-4" />  Enhance with AI
                </button>
                {onDiscard && (
                  <button
                    onClick={() => onDiscard(post._id)}
                    className="flex items-center gap-2 justify-center px-1.5 py-0.5 sm:px-2 md:px-3 md:py-1 border border-red-500 bg-white text-red-500 rounded-md text-[10px] sm:text-xs font-semibold truncate max-w-[90px] sm:max-w-[120px] md:max-w-[150px] hover:bg-red-50 hover:border-red-600"
                  >
                    <ThumbsDown className="w-4 h-4" />  Discard
                  </button>
                )}
            </div>
          </div>
          <button className=" text-sm text-white hover:text-[#cfe2dc] md:text-base font-bold py-2 md:py-3">Schedule</button>
          
          {showPopup && (
            <EnhancePopup
              isOpen={showPopup}
              onClose={() => setShowPopup(false)}
              onEnhance={handleEnhanceComplete}
              buttonRef={enhanceButtonRef}
            />
          )}
        </div>
    )
  }
  
  