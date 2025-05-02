
import { Pencil, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Post } from "@/types/content"
import { useRef, useState } from "react"
import { EnhancePopup } from "./enhance-popup"

interface PostCardProps {
    post: Post,
    time: string,
    onEdit: () => void
  }
  
  export default function PostCard({
    post,
    time,
    onEdit,
  }: PostCardProps) {
    
  const [showPopup, setShowPopup] = useState(false)
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
    

  const handleEnhanceClick = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setPopupPosition({
        top: rect.top + window.scrollY - 20, // Position slightly above the card
        left: rect.left + rect.width / 2 + window.scrollX,
      })
    }
    setShowPopup(true)
  }

    return (
        <div className="p-[4px] border rounded-[28px] w-full cf-card-gradient">
          <div className="bg-white rounded-3xl p-4 md:p-6 md:pt-3 shadow-md border w-full border-cf-beige-light">
            <div className="mb-2 flex justify-between items-center">
              <div className="flex items-center">
                {
                  post.platform === "linkedin" ? <img src={"/linkedin.png"} width={70} height={70} alt={post.title} /> : post.platform === "x" ? <img src={"/x.png"} width={30} height={30} alt={post.title} /> : <img src={"/linkedin_and_x.png"} width={90} height={90} alt={post.title} />  
                }
              </div>
              <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8" 
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4 text-cf-purple" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8" 
                onClick={handleEnhanceClick}
              >
                
                <Sparkle className="h-4 w-4 text-cf-purple" />
              </Button>
              </div>
              
            </div>
            <h2 className="text-base md:text-lg font-bold text-cf-dark mb-1 leading-tight line-clamp-2">{post.title}</h2>
            <p className="text-sm md:text-md text-gray-500 mb-2 md:mb-3">{post.sourceTitle}</p>
            
            {["modify", "the", "card", "component"].length > 0 && <div className="flex flex-wrap py-1 sm:py-2 gap-1 sm:gap-1.5 md:gap-2 max-w-full overflow-hidden">
              {["modify", "the", "card", "component"].map((tag, index) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 sm:px-2 md:px-3 md:py-1 bg-white text-cf-purple border border-cf-purple-light rounded-md text-[10px] sm:text-xs font-semibold truncate max-w-[90px] sm:max-w-[120px] md:max-w-[150px] hover:bg-cf-mint-light hover:border-cf-primary-green"
                >
                  {tag}
                </span>
              ))}
            </div>}
          </div>
          <p className="text-center text-sm md:text-base font-bold py-2 md:py-3">{time}</p>
          <EnhancePopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onEnhance={()=>{}}
        position={popupPosition || undefined}
      />
          
        </div>
    )
  }
  
  