import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bold, Italic, Underline, Link2, ImageIcon, ChevronLeft, Bookmark, MoreHorizontal } from "lucide-react"
import { Post } from "@/types/content"

interface EditPostModalProps {
  onClose: () => void
  initialData: Post | null
  onSave: (data: Post) => void
}

export default function EditPostModal({  onClose, initialData, onSave }: EditPostModalProps) {
  if (initialData === null) return null

  const [postData, setPostData] = useState(initialData)
  const handlePlatformChange = (platform: "x" | "linkedin" | "both") => {
    setPostData({ ...postData, platform })
  }

  const handleSave = () => {
    onSave(postData)
    onClose()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "x":
        return "/x.png"
      case "linkedin":
        return "/linkedin.png"
      case "both":
        return "/linkedin_and_x.png"
      default:
        return "/x.png"
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 " >
      <div className="absolute inset-0 backdrop-blur-xs"
        onClick={onClose}
      />
      {/* <div className="absolute inset-0"
        onClick={onClose}
      /> */}
      <div className=" w-full max-w-2xl  shadow-xl rounded-xl overflow-hidden bg-white/0 backdrop-blur-2xl border border-gray-100">
        <div className="flex flex-row items-center justify-between p-4 border-b ">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
              <ChevronLeft className="h-5 w-5 text-mint-700" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Link2 className="h-5 w-5 text-mint-700" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bookmark className="h-5 w-5 text-mint-700" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="h-5 w-5 text-mint-700" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6 ">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-mint-800">
              <span className="text-mint-500">{postData.sourceTitle}</span>
            </div>
            <div className="ml-2 px-2 py-0.5 bg-mint-100/70 backdrop-blur-sm text-mint-700 text-xs font-medium rounded">
              Draft
            </div>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={getPlatformIcon(postData.platform) || "/placeholder.svg"}
              alt={postData.platform}
              width={24}
              height={24}
              className="object-contain"
            />
            <Input
              value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              className="text-xl font-semibold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-mint-900"
              placeholder="Post Title"
            />
          </div>

          <div className="space-y-2 relative">
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm text-mint-700">Platform</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2  border-mint-200 text-mint-800">
                    <img
                      src={getPlatformIcon(postData.platform) || "/placeholder.svg"}
                      alt={postData.platform}
                      width={16}
                      height={16}
                    />
                    {postData.platform === "x" ? "X" : postData.platform === "linkedin" ? "LinkedIn" : "X & LinkedIn"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handlePlatformChange("x")}>
                    <div className="flex items-center gap-2">
                      <img src="/x.png" alt="X" width={16} height={16} />
                      <span>X</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePlatformChange("linkedin")}>
                    <div className="flex items-center gap-2">
                      <img src="/linkedin.png" alt="LinkedIn" width={16} height={16} />
                      <span>LinkedIn</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePlatformChange("both")}>
                    <div className="flex items-center gap-2">
                      <img src="/linkedin_and_x.png" alt="Both" width={16} height={16} />
                      <span>X & LinkedIn</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 p-2  rounded border border-white/50">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                <Bold className="h-4 w-4 text-mint-700" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                <Italic className="h-4 w-4 text-mint-700" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                <Underline className="h-4 w-4 text-mint-700" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                <Link2 className="h-4 w-4 text-mint-700" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                <ImageIcon className="h-4 w-4 text-mint-700" />
              </Button>
            </div>

            <Textarea
              value={postData.description}
              onChange={(e) => setPostData({ ...postData, description: e.target.value })}
              className="min-h-[230px] focus-visible:ring-0 focus-visible:ring-offset-0 p-4 text-mint-800 "
              placeholder="Write your post description here..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-mint-700">Tags</Label>
            <div className="flex flex-wrap gap-2 p-2 ">
              {["modify", "the", "modal", "component"].map((tag, index) => (
                <div key={index} className="px-3 py-1  text-sm">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between p-4 border-t border-white/30 ">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/40  text-mint-700 hover:bg-white/50"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-mint-500/90 backdrop-blur-sm hover:bg-mint-600 text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
