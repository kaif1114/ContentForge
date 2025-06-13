import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Underline,
  Link2,
  ImageIcon,
  ChevronLeft,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  AlertCircle,
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
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="absolute inset-0 backdrop-blur-xs" onClick={onClose} />
      <div className="w-full max-w-5xl overflow-hidden modal-bg">
        <div className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onClose}
            >
              <ChevronLeft className="h-5 w-5 text-mint-700" />
            </Button>
            <div className="text-lg font-medium">Edit Post</div>
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

        <form onSubmit={onSubmit} className="p-6">
          {isSubmitted && Object.keys(errors).length > 0 && (
            <Alert className="mb-6 border-red-500/50 bg-red-500/10 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-5 text-sm">
                  {renderErrorMessages()}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 text-sm font-medium text-mint-800">
              <span className="text-mint-500">{initialData.sourceTitle}</span>
            </div>
            <div className="ml-2 px-2 py-0.5 text-xs font-medium rounded">
              Draft
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 postFormSchema">
            {/* Left Column - Post Content */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-4 mb-4">
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
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded border border-white/20">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded"
                >
                  <Bold className="h-4 w-4 text-mint-700" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded"
                >
                  <Italic className="h-4 w-4 text-mint-700" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded"
                >
                  <Underline className="h-4 w-4 text-mint-700" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded"
                >
                  <Link2 className="h-4 w-4 text-mint-700" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded"
                >
                  <ImageIcon className="h-4 w-4 text-mint-700" />
                </Button>
              </div>

              <div className="flex flex-col">
                <Textarea
                  {...register("description")}
                  className="min-h-[300px] focus-visible:ring-0 focus-visible:ring-offset-0 p-4 bg-white/5 rounded"
                  placeholder="Write your post description here..."
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Tags</Label>
                <div className="flex flex-wrap gap-2 p-2 bg-white/5 rounded">
                  {["modify", "the", "modal", "component"].map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6 bg-white/5 p-4 rounded-lg">
              <div>
                <Label className="text-sm block mb-2">Platform</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-10 gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={getPlatformIcon(watch("platform") || "x")}
                          alt={watch("platform")}
                          width={18}
                          height={18}
                        />
                        <span>
                          {watch("platform") === "x"
                            ? "X"
                            : watch("platform") === "linkedin"
                              ? "LinkedIn"
                              : "X & LinkedIn"}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem
                      onClick={() =>
                        setValue("platform", "x", { shouldValidate: true })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <img src="/x.png" alt="X" width={16} height={16} />
                        <span>X</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setValue("platform", "linkedin", {
                          shouldValidate: true,
                        })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="/linkedin.png"
                          alt="LinkedIn"
                          width={16}
                          height={16}
                        />
                        <span>LinkedIn</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setValue("platform", "both", { shouldValidate: true })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="/linkedin_and_x.png"
                          alt="Both"
                          width={16}
                          height={16}
                        />
                        <span>X & LinkedIn</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tone Selection */}
              <EnhanceSection
                initialData={initialData}
                toneWatch={watchTone}
                lengthWatch={watchLength}
                customLengthWatch={watchCustomLength}
                onSetLength={(length) => setValue("length", length)}
                onSetCustomLength={(customLength) =>
                  setValue("customLength", customLength)
                }
                onSetTone={(tone) => setValue("tone", tone)}
              />
            </div>
          </div>

          <div className="flex justify-between border-t border-white/30 mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/40 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-mint-600 hover:bg-mint-700 text-white border-none"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
