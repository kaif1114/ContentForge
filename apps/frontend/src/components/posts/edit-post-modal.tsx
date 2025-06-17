import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Bold,
  Italic,
  Underline,
  Link2,
  AlertCircle,
  X,
} from "lucide-react";
import { Post } from "@/types/content";
import EnhanceSection from "./EnhanceSection";
import { tonesArray, lengthArray } from "@/types/post-attributes";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditPostModalProps {
  onClose: () => void;
  initialData: Post | null;
  onSave: (data: Partial<Post>) => Promise<any>;
}

const postFormSchema = z
  .object({
    title: z.string().min(3, "Title Must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description Must be at least 10 characters"),
    platform: z.enum(["x", "linkedin", "both"], {
      required_error: "Please select a platform",
    }),
    tone: z.enum(tonesArray, {
      required_error: "Please select a tone",
    }),
  })
  .and(
    z.union([
      z.object({
        length: z.enum(lengthArray),
        customLength: z.undefined(),
      }),
      z.object({
        length: z.undefined(),
        customLength: z.number().min(100).max(1000),
      }),
    ])
  );

type PostFormValues = z.infer<typeof postFormSchema>;

export default function EditPostModal({
  onClose,
  initialData,
  onSave,
}: EditPostModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: initialData?.title,
      description: initialData?.description,
      platform: initialData?.platform as "x" | "linkedin" | "both",
      tone: initialData?.tone,
      ...(initialData?.customLength !== undefined
        ? { customLength: initialData.customLength }
        : {
            length:
              (initialData?.length as "short" | "medium" | "long") || "medium",
          }),
    },
  });

  if (initialData === null) return null;

  const watchLength = watch("length");
  const watchCustomLength = watch("customLength");
  const watchTone = watch("tone");

  const onSubmit = handleSubmit((data) => {
    const { length, customLength, ...baseData } = data;

    const postData: Partial<Post> = {
      _id: initialData._id,
      ...baseData,
    };

    if (customLength !== undefined) {
      postData.customLength = customLength;
    } else if (length !== undefined) {
      postData.length = length;
    }

    onSave(postData);
    onClose();
  });

  const renderErrorMessages = () => {
    return Object.entries(errors).map(([key, error]) => (
      <li key={key}>
        {key.charAt(0).toUpperCase() + key.slice(1)}: {error.message}
      </li>
    ));
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "x":
        return "/x.png";
      case "linkedin":
        return "/linkedin.png";
      case "both":
        return "/linkedin_and_x.png";
      default:
        return "/x.png";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Simplified Header */}
        <div className="relative bg-gradient-to-r from-cf-primary-green to-cf-secondary-green p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <img
                  src={getPlatformIcon(watch("platform") || "x")}
                  alt={watch("platform")}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Edit Post</h2>
                <p className="text-white/80 text-sm">{initialData?.sourceTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col h-[calc(95vh-120px)]">
          {/* Error Alert */}
          {isSubmitted && Object.keys(errors).length > 0 && (
            <div className="p-6 pb-0">
              <Alert className="border-red-500/50 bg-red-500/10 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc pl-5 text-sm">
                    {renderErrorMessages()}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Post Content Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cf-primary-green/10 rounded-lg flex items-center justify-center">
                    <span className="text-cf-primary-green font-bold text-sm">✏️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Content</h3>
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Post Title</Label>
                  <Input
                    {...register("title")}
                    className="text-lg font-medium border-2 focus:border-cf-primary-green"
                    placeholder="Enter your post title..."
                  />
                </div>

                {/* Rich Text Toolbar */}
                <div className="flex items-center gap-1 p-2 bg-gray-50 rounded-xl border">
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bold className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Italic className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Underline className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Link2 className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>

                {/* Description Textarea */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Post Content</Label>
                  <Textarea
                    {...register("description")}
                    className="min-h-[200px] border-2 focus:border-cf-primary-green resize-none"
                    placeholder="Write your post content here..."
                  />
                </div>
              </div>

              {/* Settings Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Platform Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cf-primary-green/10 rounded-lg flex items-center justify-center">
                      <span className="text-cf-primary-green font-bold text-sm">🚀</span>
                    </div>
                    <Label className="text-lg font-semibold text-gray-800">Platform</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "x", label: "X", icon: "/x.png" },
                      { value: "linkedin", label: "LinkedIn", icon: "/linkedin.png" },
                      { value: "both", label: "Both", icon: "/linkedin_and_x.png" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setValue("platform", option.value as any, { shouldValidate: true })}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                          watch("platform") === option.value
                            ? "border-cf-primary-green bg-cf-mint-light"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <img src={option.icon} alt={option.label} width={20} height={20} />
                        <span className="text-xs font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Settings */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cf-primary-green/10 rounded-lg flex items-center justify-center">
                      <span className="text-cf-primary-green font-bold text-sm">⚙️</span>
                    </div>
                    <Label className="text-lg font-semibold text-gray-800">Settings</Label>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <EnhanceSection
                      initialData={initialData}
                      toneWatch={watchTone}
                      lengthWatch={watchLength}
                      customLengthWatch={watchCustomLength}
                      onSetLength={(length) => setValue("length", length)}
                      onSetCustomLength={(customLength) => setValue("customLength", customLength)}
                      onSetTone={(tone) => setValue("tone", tone)}
                    />
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cf-primary-green/10 rounded-lg flex items-center justify-center">
                    <span className="text-cf-primary-green font-bold text-sm">#</span>
                  </div>
                  <Label className="text-lg font-semibold text-gray-800">Tags</Label>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  {["AI", "Content", "Social Media", "Marketing"].map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-cf-primary-green/10 text-cf-primary-green rounded-full text-sm font-medium"
                    >
                      {tag}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="px-3 py-1 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-cf-primary-green hover:text-cf-primary-green transition-colors"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 text-base font-medium border-2 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-cf-primary-green to-cf-secondary-green hover:from-cf-secondary-green hover:to-cf-primary-green text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
