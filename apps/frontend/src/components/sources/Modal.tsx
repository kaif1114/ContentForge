import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Globe, Youtube, Link2 } from "lucide-react"
import type { ContentSource } from "@/types/content-sources"

interface AddSourceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (source: Omit<ContentSource, "id" | "createdAt">) => Promise<void>
}

export function AddSourceModal({ open, onOpenChange, onSubmit }: AddSourceModalProps) {
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    type: "url",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.label.trim()) {
      newErrors.label = "Source label is required"
    }

    if (!formData.url.trim()) {
      newErrors.url = "URL is required"
    } else if (formData.type === "youtube" && !formData.url.includes("youtube.com")) {
      newErrors.url = "Must be a valid YouTube URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await onSubmit({
        label: formData.label,
        url: formData.url.startsWith("http") ? formData.url : `https://${formData.url}`,
        type: formData.type as "url" | "youtube",
      })

      // Reset form after successful submission
      setFormData({
        label: "",
        url: "",
        type: "url",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error adding content source:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <div className="p-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-[#5EAFC6] rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="w-4 h-4 flex items-center justify-center">
              <Link2 className="h-4 w-4 text-gray-400" />
            </div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              {formData.type === "youtube" ? (
                <Youtube className="h-6 w-6 text-white" />
              ) : (
                <Globe className="h-6 w-6 text-white" />
              )}
            </div>
          </div>

          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold text-center">Connect to Content Source</DialogTitle>
            <p className="text-gray-500 text-center mt-2">
              Add a content source to fetch and display information from websites or YouTube channels
            </p>
          </DialogHeader>

          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="type">Source Type</Label>
              <RadioGroup value={formData.type} onValueChange={handleTypeChange} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="url" />
                  <Label htmlFor="url" className="cursor-pointer">
                    Website URL
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="youtube" id="youtube" />
                  <Label htmlFor="youtube" className="cursor-pointer">
                    YouTube
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Source Label</Label>
              <Input
                id="label"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="e.g., Company Blog"
                className={errors.label ? "border-red-500" : ""}
              />
              {errors.label && <p className="text-sm text-red-500">{errors.label}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Source URL</Label>
              <div className="flex">
                <div className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 rounded-l-md">https://</div>
                <Input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder={formData.type === "youtube" ? "youtube.com/channel/..." : "example.com/blog"}
                  className={`rounded-l-none ${errors.url ? "border-red-500" : ""}`}
                />
              </div>
              {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-center p-6 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="mr-2 flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>

        <div className="p-4 bg-gray-50 text-sm text-gray-500 border-t border-gray-100">
          <p className="mb-2">
            By clicking "Next," you confirm your intention to connect this content source. This action signifies you
            accept of the{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Terms and conditions
            </a>{" "}
            outlined.
          </p>

          <div className="flex items-center mt-4">
            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-3">
              <Globe className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium">Public Data</p>
              <p className="text-xs">The data used in this connection is public data only</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

