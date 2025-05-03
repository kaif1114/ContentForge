import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bold, Italic, Underline, Link2, ImageIcon, ChevronLeft, Bookmark, MoreHorizontal } from "lucide-react"
import { Post } from "@/types/content"

interface EditPostModalProps {
  onClose: () => void
  initialData: Post | null
  onSave: (data: Partial<Post>) => Promise<void>
}

const postFormSchema = z.object({
  title: z.string().min(3, "Title Must be at least 3 characters"),
  description: z.string().min(10, "Description Must be at least 10 characters"),
  platform: z.enum(["x", "linkedin", "both"], {
    required_error: "Please select a platform",
  }),
})

type PostFormValues = z.infer<typeof postFormSchema>

export default function EditPostModal({  onClose, initialData, onSave }: EditPostModalProps) {
  if (initialData === null) return null

  

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      platform: initialData.platform as "x" | "linkedin" | "both",
    },
  })

  const handleSave = (data: PostFormValues) => {
    
    console.log({_id: initialData._id, ...data})
    onSave({_id: initialData._id, ...data})
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
      <div className=" w-full max-w-2xl overflow-hidden modal-bg">
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

        <form onSubmit={handleSubmit(handleSave)} className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-mint-800">
              <span className="text-mint-500">{initialData.sourceTitle}</span>
            </div>
            <div className="ml-2 px-2 py-0.5 text-xs font-medium rounded">
              Draft
            </div>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={getPlatformIcon(watch("platform") || "x")}
              alt={watch("platform")}
              width={24}
              height={24}
              className="object-contain"
            />
            <div className="flex-1 flex flex-col">
              <Input
                {...register("title")}
                className="text-xl font-semibold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                placeholder="Post Title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 relative">
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm ">Platform</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2">
                    <img
                      src={getPlatformIcon(watch("platform") || "x")}
                      alt={watch("platform")}
                      width={16}
                      height={16}
                    />
                    {watch("platform") === "x" ? "X" : watch("platform") === "linkedin" ? "LinkedIn" : "X & LinkedIn"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setValue("platform", "x", { shouldValidate: true })}>
                    <div className="flex items-center gap-2">
                      <img src="/x.png" alt="X" width={16} height={16} />
                      <span>X</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setValue("platform", "linkedin", { shouldValidate: true })}>
                    <div className="flex items-center gap-2">
                      <img src="/linkedin.png" alt="LinkedIn" width={16} height={16} />
                      <span>LinkedIn</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setValue("platform", "both", { shouldValidate: true })}>
                    <div className="flex items-center gap-2">
                      <img src="/linkedin_and_x.png" alt="Both" width={16} height={16} />
                      <span>X & LinkedIn</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {errors.platform && (
              <p className="text-red-500 text-xs">{errors.platform.message}</p>
            )}

            <div className="flex items-center gap-2 p-2 rounded border border-white/50">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded">
                <Bold className="h-4 w-4 text-mint-700" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded">
                <Italic className="h-4 w-4 text-mint-700" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded">
                <Underline className="h-4 w-4 text-mint-700" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded">
                <Link2 className="h-4 w-4 text-mint-700" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded">
                <ImageIcon className="h-4 w-4 text-mint-700" />
              </Button>
            </div>

            <div className="flex flex-col">
              <Textarea
                {...register("description")}
                className="min-h-[230px] focus-visible:ring-0 focus-visible:ring-offset-0 p-4 "
                placeholder="Write your post description here..."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm ">Tags</Label>
            <div className="flex flex-wrap gap-2 p-2 ">
              {["modify", "the", "modal", "component"].map((tag, index) => (
                <div key={index} className="px-3 py-1  text-sm">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        

        <div className="flex justify-between pt-4 border-t border-white/30 ">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-white/40  hover:bg-white/50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="border-white/40 hover:bg-white/50"
          >
            Save Changes
          </Button>
        </div>
        </form>
      </div>
    </div>
  )
}
