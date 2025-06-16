import { useState } from "react";
import { X, Sparkles, Linkedin, Twitter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Idea } from "@/types/idea";
import { useGenerateFromIdea } from "@/hooks/useGenerateFromIdea";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

interface GeneratePostsModalProps {
  idea: Idea;
  onClose: () => void;
}

export function GeneratePostsModal({ idea, onClose }: GeneratePostsModalProps) {
  const [count, setCount] = useState(3);
  const [platform, setPlatform] = useState<"linkedin" | "x" | "both">("both");
  const [tone, setTone] = useState<"professional" | "narrative" | "informative" | "persuasive" | "casual" | "formal" | "neutral">("professional");
  const [length, setLength] = useState<"short" | "medium" | "long" | "custom">("medium");
  const [customLength, setCustomLength] = useState(200);

  const { mutateAsync: generatePosts, isPending } = useGenerateFromIdea();
  const navigate = useNavigate();

  const platforms = [
    {
      id: "linkedin" as const,
      label: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      color: "bg-[#0077B5]",
      description: "Professional network for B2B content",
    },
    {
      id: "x" as const,
      label: "X (Twitter)",
      icon: <Twitter className="h-5 w-5" />,
      color: "bg-black",
      description: "Fast-paced platform for concise updates",
    },
    {
      id: "both" as const,
      label: "Both Platforms",
      icon: (
        <div className="relative">
          <Linkedin className="h-4 w-4 text-[#0077B5] absolute -top-1 -left-1" />
          <Twitter className="h-4 w-4 text-black absolute -bottom-1 -right-1" />
          <div className="w-5 h-5"></div>
        </div>
      ),
      color: "bg-gradient-to-br from-[#0077B5] to-black",
      description: "Optimized for both platforms",
    },
  ];

  const tones = [
    { id: "professional" as const, name: "Professional", description: "Formal and business-like" },
    { id: "narrative" as const, name: "Narrative", description: "Storytelling approach" },
    { id: "informative" as const, name: "Informative", description: "Educational and detailed" },
    { id: "persuasive" as const, name: "Persuasive", description: "Convincing and influential" },
    { id: "casual" as const, name: "Casual", description: "Relaxed and conversational" },
    { id: "formal" as const, name: "Formal", description: "Structured and traditional" },
    { id: "neutral" as const, name: "Neutral", description: "Balanced and impartial" },
  ];

  const lengthOptions = [
    { id: "short" as const, label: "Short", description: "50-100 words" },
    { id: "medium" as const, label: "Medium", description: "100-200 words" },
    { id: "long" as const, label: "Long", description: "200-300 words" },
    { id: "custom" as const, label: "Custom", description: "Specify word count" },
  ];

  const handleGenerate = async () => {
    try {
      const requestData = {
        ideaId: idea._id,
        count,
        platform,
        tone,
        ...(length === "custom" ? { customLength } : { length }),
      };

      await generatePosts(requestData);
      
      toast.success(`Successfully generated ${count} post${count > 1 ? 's' : ''} from "${idea.title}"!`);
      onClose();
      
      // Navigate to posts page to see the generated posts
      navigate({ to: "/posts" });
    } catch (error) {
      toast.error("Failed to generate posts. Please try again.");
      console.error("Generate posts error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generate Posts</h2>
            <p className="text-sm text-gray-600 mt-1">From: {idea.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Post Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Number of Posts: {count}
            </label>
            <Slider
              value={[count]}
              onValueChange={(value) => setCount(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Platform
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    platform === p.id
                      ? "border-[#45c19a] bg-[#45c19a]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className={`p-2 rounded-full ${p.color} text-white`}>
                      {p.icon}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{p.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tone
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    tone === t.id
                      ? "border-[#45c19a] bg-[#45c19a]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Length Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Post Length
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {lengthOptions.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLength(l.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    length === l.id
                      ? "border-[#45c19a] bg-[#45c19a]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-medium">{l.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{l.description}</div>
                </button>
              ))}
            </div>
            
            {length === "custom" && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Length: {customLength} words
                </label>
                <Slider
                  value={[customLength]}
                  onValueChange={(value) => setCustomLength(value[0])}
                  max={1000}
                  min={100}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100</span>
                  <span>1000</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isPending}
            className="bg-[#45c19a] hover:bg-[#3bb389] text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate {count} Post{count > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 