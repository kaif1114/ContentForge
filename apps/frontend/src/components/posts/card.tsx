import { useState } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditPostModal from "@/components/create/edit-post-modal"
import { Post } from "@/types/content"

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
    
    return (
        <div className="p-[4px] border rounded-[28px] w-full cf-card-gradient">
          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-md border w-full border-cf-beige-light">
            <div className="mb-3 md:mb-4 flex justify-between items-center">
              <div className="flex items-center">
                {
                  post.platform === "linkedin" ? <img src={"/linkedin.png"} width={60} height={60} alt={post.title} /> : post.platform === "x" ? <img src={"/x.png"} width={30} height={30} alt={post.title} /> : <img src={"/linkedin_and_x.png"} width={90} height={90} alt={post.title} />  
                }
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8" 
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4 text-cf-purple" />
              </Button>
            </div>
            <h2 className="text-base md:text-lg font-bold text-cf-dark mb-1 leading-tight line-clamp-2">{post.title}</h2>
            <p className="text-sm md:text-md text-gray-500 mb-2 md:mb-3">{post.sourceTitle}</p>
            
            {post.tags.length > 0 && <div className="flex flex-wrap py-1 sm:py-2 gap-1 sm:gap-1.5 md:gap-2 max-w-full overflow-hidden">
              {post.tags.map((tag, index) => (
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

          
        </div>
    )
  }
  
  