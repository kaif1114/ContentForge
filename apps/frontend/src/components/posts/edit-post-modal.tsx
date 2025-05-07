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
  Check,
  ChevronDown,
} from "lucide-react";
import { Post } from "@/types/content";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface EditPostModalProps {
  onClose: () => void;
  initialData: Post | null;
  onSave: (data: Partial<Post>) => Promise<void>;
}

const toneOptions = [
  {
    id: "professional",
    label: "Professional",
    description: "Formal and business-like tone",
  },
  {
    id: "narrative",
    label: "Narrative",
    description: "Storytelling approach",
  },
  {
    id: "informative",
    label: "Informative",
    description: "Educational and detailed",
  },
  {
    id: "persuasive",
    label: "Persuasive",
    description: "Convincing and influential",
  },
  {
    id: "casual",
    label: "Casual",
    description: "Relaxed and conversational",
  },
  {
    id: "formal",
    label: "Formal",
    description: "Structured and traditional",
  },
  {
    id: "enthusiastic",
    label: "Enthusiastic",
    description: "Excited and energetic",
  },
  { id: "neutral", label: "Neutral", description: "Balanced and impartial" },
];

const lengthOptions = [
  { id: "short", label: "Short", description: "50-100 words" },
  { id: "medium", label: "Medium", description: "100-200 words" },
  { id: "long", label: "Long", description: "200-300 words" },
];

const postFormSchema = z
  .object({
    title: z.string().min(3, "Title Must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description Must be at least 10 characters"),
    platform: z.enum(["x", "linkedin", "both"], {
      required_error: "Please select a platform",
    }),
    tone: z.enum(
      [
        "professional",
        "narrative",
        "informative",
        "persuasive",
        "casual",
        "formal",
        "enthusiastic",
        "neutral",
      ],
      {
        required_error: "Please select a tone",
      }
    ),
  })
  .and(
    z.union([
      z.object({
        length: z.enum(["short", "medium", "long"]),
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
  const [customLength] = useState(initialData?.customLength || 150);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
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
  const isUsingCustomLength =
    watchLength === undefined && watchCustomLength !== undefined;

  const handleLengthChange = (value: string) => {
    if (value === "custom") {
      setValue("length", undefined);
      setValue("customLength", customLength);
    } else {
      setValue("length", value as "short" | "medium" | "long", {
        shouldValidate: true,
      });
      setValue("customLength", undefined);
    }
  };

  const handleCustomLengthChange = (value: number[]) => {
    setValue("customLength", value[0]);
  };

  const handleSave = (data: PostFormValues) => {
    const { length, customLength, ...baseData } = data;

    const postData: Partial<Post> = {
      _id: initialData._id,
      ...baseData,
    };

    if (customLength !== undefined) {
      (postData as any).customLength = customLength;
    } else if (length !== undefined) {
      (postData as any).length = length;
    }

    onSave(postData);
    onClose();
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
      <div className="w-full max-w-5xl overflow-hidden modal-bg rounded-xl">
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

        <form onSubmit={handleSubmit(handleSave)} className="p-6">
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
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
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
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
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
                {errors.platform && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.platform.message}
                  </p>
                )}
              </div>

              {/* Tone Selection */}
              <div>
                <Label className="text-sm block mb-2">Tone</Label>
                <div className="grid grid-cols-2 gap-2">
                  {toneOptions.map((tone) => (
                    <div
                      key={tone.id}
                      className={`p-2 rounded border text-center cursor-pointer transition-all ${
                        watch("tone") === tone.id
                          ? "border-mint-500 bg-mint-50"
                          : "border-white/30 hover:border-mint-200"
                      }`}
                      onClick={() =>
                        setValue("tone", tone.id as any, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <div className="text-sm font-medium">{tone.label}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {tone.description}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.tone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tone?.message}
                  </p>
                )}
              </div>

              {/* Length Selection */}
              <div>
                <Label className="text-sm block mb-2">Length</Label>
                <RadioGroup
                  value={
                    isUsingCustomLength ? "custom" : watchLength || "medium"
                  }
                  onValueChange={handleLengthChange}
                  className="grid grid-cols-2 gap-2"
                >
                  {lengthOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={`length-${option.id}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`length-${option.id}`}
                        className={`flex flex-col items-center justify-center p-2 rounded border w-full h-full cursor-pointer transition-all ${
                          !isUsingCustomLength && watchLength === option.id
                            ? "border-mint-500 bg-mint-50"
                            : "border-white/30 hover:border-mint-200"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {option.description}
                        </span>
                      </Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="custom"
                      id="length-custom"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="length-custom"
                      className={`flex flex-col items-center justify-center p-2 rounded border w-full h-full cursor-pointer transition-all ${
                        isUsingCustomLength
                          ? "border-mint-500 bg-mint-50"
                          : "border-white/30 hover:border-mint-200"
                      }`}
                    >
                      <span className="text-sm font-medium">Custom</span>
                      <span className="text-xs text-gray-500 mt-1">
                        Specify length
                      </span>
                    </Label>
                  </div>
                </RadioGroup>

                {isUsingCustomLength && (
                  <div className="p-3 border rounded mt-2">
                    <div className="flex justify-between mb-2">
                      <Label className="text-sm">Custom Word Count</Label>
                      <span className="text-sm font-medium">
                        {watchCustomLength} words
                      </span>
                    </div>
                    <Slider
                      value={[watchCustomLength || 150]}
                      min={50}
                      max={500}
                      step={10}
                      onValueChange={handleCustomLengthChange}
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>50</span>
                      <span>250</span>
                      <span>500</span>
                    </div>
                  </div>
                )}
                {errors.length && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.length.message}
                  </p>
                )}
                {errors.customLength && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.customLength.message}
                  </p>
                )}
              </div>
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
