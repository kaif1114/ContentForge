import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Sparkles } from "lucide-react";
import { useGenerateFromSource } from "@/hooks/useGenerateFromSource";
import { ContentSource } from "@/types/content";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

interface GeneratePostsModalProps {
  source: ContentSource;
  onClose: () => void;
}

export function GeneratePostsModal({ source, onClose }: GeneratePostsModalProps) {
  const [postCount, setPostCount] = useState([3]);
  const [platform, setPlatform] = useState<"linkedin" | "x" | "both">("both");
  const [tone, setTone] = useState<"professional" | "narrative" | "informative" | "persuasive" | "casual" | "formal" | "neutral">("professional");
  const [length, setLength] = useState<"short" | "medium" | "long" | "custom">("medium");
  const [customLength, setCustomLength] = useState([300]);
  
  const { mutate: generatePosts, isPending } = useGenerateFromSource();
  const navigate = useNavigate();

  const handleGenerate = () => {
    const request = {
      contentId: source._id,
      postCount: postCount[0],
      platform,
      tone,
      ...(length === "custom" ? { customLength: customLength[0] } : { length }),
    };

    generatePosts(request, {
      onSuccess: () => {
        toast.success(`Successfully generated ${postCount[0]} posts from "${source.label}"!`);
        onClose();
        // Navigate to posts page to see the generated posts
        navigate({ to: "/posts" });
      },
      onError: () => {
        toast.error("Failed to generate posts. Please try again.");
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cf-primary-green to-cf-secondary-green p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Generate Posts</h2>
                <p className="text-white/80 text-sm mt-1">Transform your content into engaging social posts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
            <p className="text-white/90 text-sm font-medium">Source: {source.label}</p>
          </div>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Post Count */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cf-primary-green/10 rounded-lg flex items-center justify-center">
                <span className="text-cf-primary-green font-bold text-sm">1</span>
              </div>
              <label className="text-lg font-semibold text-gray-800">
                Number of Posts
              </label>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-cf-primary-green">{postCount[0]}</span>
                <span className="text-sm text-gray-500">posts to generate</span>
              </div>
              <Slider
                value={postCount}
                onValueChange={setPostCount}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1 post</span>
                <span>10 posts</span>
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cf-primary-green/10 rounded-lg flex items-center justify-center">
                <span className="text-cf-primary-green font-bold text-sm">2</span>
              </div>
              <label className="text-lg font-semibold text-gray-800">Choose Platform</label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "linkedin", label: "LinkedIn", emoji: "💼", color: "from-blue-500 to-blue-600" },
                { value: "x", label: "X (Twitter)", emoji: "🐦", color: "from-gray-800 to-black" },
                { value: "both", label: "Both Platforms", emoji: "🚀", color: "from-purple-500 to-pink-500" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPlatform(option.value as any)}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    platform === option.value
                      ? "border-cf-primary-green bg-gradient-to-br from-cf-mint-light to-white shadow-lg"
                      : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
                  }`}
                >
                  <div className="text-2xl mb-3">{option.emoji}</div>
                  <div className="font-semibold text-sm text-gray-800">{option.label}</div>
                  {platform === option.value && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-cf-primary-green rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cf-primary-green/10 rounded-lg flex items-center justify-center">
                <span className="text-cf-primary-green font-bold text-sm">3</span>
              </div>
              <label className="text-lg font-semibold text-gray-800">Select Tone</label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "professional", emoji: "👔" },
                { value: "narrative", emoji: "📖" }, 
                { value: "informative", emoji: "📊" },
                { value: "persuasive", emoji: "🎯" },
                { value: "casual", emoji: "😊" },
                { value: "formal", emoji: "🎩" },
                { value: "neutral", emoji: "⚖️" },
              ].map((toneOption) => (
                <button
                  key={toneOption.value}
                  onClick={() => setTone(toneOption.value as any)}
                  className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 ${
                    tone === toneOption.value
                      ? "bg-gradient-to-br from-cf-primary-green to-cf-secondary-green text-white shadow-lg transform scale-105"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md"
                  }`}
                >
                  <span className="text-lg">{toneOption.emoji}</span>
                  <span className="capitalize">{toneOption.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Length Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cf-primary-green/10 rounded-lg flex items-center justify-center">
                <span className="text-cf-primary-green font-bold text-sm">4</span>
              </div>
              <label className="text-lg font-semibold text-gray-800">Post Length</label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: "short", label: "Short", desc: "~100 words", icon: "⚡" },
                { value: "medium", label: "Medium", desc: "~200 words", icon: "📝" },
                { value: "long", label: "Long", desc: "~400 words", icon: "📄" },
                { value: "custom", label: "Custom", desc: "Set your own", icon: "🎛️" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLength(option.value as any)}
                  className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-md ${
                    length === option.value
                      ? "border-cf-primary-green bg-gradient-to-br from-cf-mint-light to-white shadow-lg"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="text-xl mb-2">{option.icon}</div>
                  <div className="font-semibold text-sm text-gray-800">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Length Slider */}
          {length === "custom" && (
            <div className="space-y-4 bg-gradient-to-r from-cf-mint-light/30 to-transparent p-6 rounded-2xl border border-cf-primary-green/20">
              <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🎛️</span>
                Custom Length: <span className="text-cf-primary-green">{customLength[0]} words</span>
              </label>
              <Slider
                value={customLength}
                onValueChange={setCustomLength}
                max={1000}
                min={100}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>100 words</span>
                <span>1000 words</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50">
          <div className="flex gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 text-base font-medium border-2 hover:bg-gray-50"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-cf-primary-green to-cf-secondary-green hover:from-cf-secondary-green hover:to-cf-primary-green text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate {postCount[0]} Posts
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 