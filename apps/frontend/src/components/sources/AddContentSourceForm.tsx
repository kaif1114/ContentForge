import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import type { ContentSource } from "@/types/content-sources"

interface AddContentSourceFormProps {
  onSubmit: (source: Omit<ContentSource, "id" | "createdAt">) => Promise<void>
  onCancel: () => void
}

export function AddContentSourceForm({ onSubmit, onCancel }: AddContentSourceFormProps) {
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
    } else if (!formData.url.startsWith("http")) {
      newErrors.url = "URL must start with http:// or https://"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await onSubmit({
        label: formData.label,
        url: formData.url,
        type: formData.type as "url" | "youtube",
      })
    } catch (error) {
      console.error("Error adding content source:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Add New Content Source</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder={formData.type === "youtube" ? "https://youtube.com/channel/..." : "https://example.com/blog"}
              className={errors.url ? "border-red-500" : ""}
            />
            {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
          </div>

          <CardFooter className="px-0 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-wayflyer-green hover:bg-wayflyer-green/90">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Source...
                </>
              ) : (
                "Add Source"
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

