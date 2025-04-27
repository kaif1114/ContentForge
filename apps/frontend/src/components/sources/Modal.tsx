import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Globe, Link2, ArrowRight, AlertCircle, Check, X } from "lucide-react"
import useAddSource from "@/hooks/useAddSource"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"


interface AddSourceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => void
}

const formSchema = z.object({
  label: z.string().min(1, { message: "Source label is required" }).max(255, {message: "Source label must be under 255 characters"}),
  url: z.string().min(1, { message: "URL is required" }).max(1024, {message: "Url too long"})
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://") || url.includes("youtube.com"),
      { message: "Must be a valid URL starting with http:// or https://" }
    ),
  type: z.enum(["url", "youtube"])
})

type FormValues = z.infer<typeof formSchema>

export function AddSourceModal({ open, onOpenChange, onAdd }: AddSourceModalProps) {
  const { mutateAsync: addSource, isError, isPending, isSuccess, error } = useAddSource()

  
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      url: "",
      type: "url"
    }
  })

  const formType = watch("type")

  // Close modal after successful submission with delay for animation
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset();
        onOpenChange(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onOpenChange, reset]);

  const submit = async (data: FormValues) => {
  
      await addSource({
        label: data.label,
        url: data.url,
        type: data.type,
      });
      onAdd();
    
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        reset();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="font-inter sm:max-w-[672px] p-0 gap-0 overflow-hidden bg-white rounded-2xl">
        <form onSubmit={handleSubmit(submit)} className="flex flex-col h-full">
          <div className="p-8 text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 bg-[#5EAFC6] rounded-xl flex items-center justify-center"
              >
                <Link2 className="h-8 w-8 text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </motion.div>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="w-16 h-16 bg-black rounded-xl flex items-center justify-center"
              >
                <Globe className="h-8 w-8 text-white" />
              </motion.div>
            </div>

            <DialogHeader className="mb-10">
              <DialogTitle className="text-2xl font-bold text-center">Add a Content Source</DialogTitle>
              <p className="text-gray-600 text-center mt-3">
                Add a content source to fetch long-form content<br />
                from websites or YouTube channel
              </p>
            </DialogHeader>

            {/* Error state notification */}
            <AnimatePresence>
              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"
                >
                  <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium">Failed to add content source</p>
                    <p className="text-sm">{error?.message || "Please check your input and try again."}</p>
                  </div>
                  <button 
                    type="button"
                    className="ml-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <X className="h-5 w-5 text-red-500" />
                  </button>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 15
                    }}
                    className="bg-green-100 rounded-full p-1 mr-3"
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                  <p>Content source added successfully!</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6 text-left">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <RadioGroup 
                    value={field.value} 
                    onValueChange={field.onChange}
                    className="flex space-x-8"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="url" 
                        id="url" 
                        className="w-5 h-5 border-2 text-green-500 bg-white" 
                        checked={field.value === "url"} 
                        disabled={isPending}
                      />
                      <Label htmlFor="url" className="text-base cursor-pointer font-medium">
                        Website URL
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="youtube" 
                        id="youtube" 
                        className="w-5 h-5 border-2 text-green-500 bg-white"
                        disabled={isPending}
                      />
                      <Label htmlFor="youtube" className="text-base cursor-pointer font-medium">
                        YouTube
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="label" className="text-base font-medium">Source Label</Label>
                <input
                  {...register('label')}
                  placeholder="e.g., Company Blog"
                  className={`w-full h-12 px-4 rounded-xl border ${errors.label ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"}`}
                  disabled={isPending}
                />
                {errors.label && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{errors.label.message}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-base font-medium">Source URL</Label>
                <input
                  {...register('url')}
                  placeholder={formType === "youtube" ? "https://youtube.com/channel/..." : "https://example.com/blog"}
                  className={`w-full h-12 px-4 rounded-xl border ${errors.url ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"}`}
                  disabled={isPending}
                />
                {errors.url && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{errors.url.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex px-8 pb-8 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isPending}
              className="h-12 flex-1 rounded-xl border-gray-200 text-gray-700 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isSuccess}
              className={`h-12 flex-1 rounded-xl font-medium relative ${isPending || isSuccess ? "bg-[#6DC7A9] text-white" : "bg-[#6DC7A9] hover:bg-[#5DB999] text-white"}`}
            >
              <AnimatePresence mode="wait">
                {isPending && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1, 
                          ease: "linear" 
                        }}
                      >
                        <Loader2 className="h-4 w-4 mr-2" />
                      </motion.div>
                      Processing...
                    </div>
                  </motion.div>
                )}
                
                {isSuccess && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      Added!
                    </div>
                  </motion.div>
                )}
                
                {!isPending && !isSuccess && (
                  <motion.span
                    key="normal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Next
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>

          <div className="px-8 py-6 bg-gray-50 text-sm border-t border-gray-100 rounded-b-2xl">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center mr-3">
                <Globe className="h-5 w-5 text-black" />
              </div>
              <div>
                <p className="font-medium text-base">Public Data</p>
                <p className="text-gray-600">The data used in this connection is <span className="font-medium">public</span> data only</p>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

