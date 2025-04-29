import { useState } from "react"
import {
  Minus,
  Plus,
  Sparkles,
  Zap,
  FileText,
  MessageSquare,
  BookOpen,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Linkedin,
  Twitter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { PostData } from "@/routes/create"
import GradientBadge from "../ui/gradient-badge"
import AnimatedCounter from "../ui/animated-counter"

interface GeneratePostsProps {
  data: PostData
  onUpdateData: (data: Partial<PostData>) => void
  onGenerate: () => void
}



export default function GeneratePosts({
  data,
  onUpdateData,
  onGenerate,
}: GeneratePostsProps) {
  const [promptFocus, setPromptFocus] = useState(false)
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)

  // Sample tones
  const tones = [
    {
      id: "1",
      name: "Professional",
      description:
        "Formal and business-like tone suitable for corporate communications and industry thought leadership.",
      icon: "briefcase",
    },
    {
      id: "2",
      name: "Casual",
      description: "Relaxed and conversational tone that builds rapport and feels more personal and approachable.",
      icon: "message-square",
    },
    {
      id: "3",
      name: "Enthusiastic",
      description: "Excited and energetic tone that conveys passion and creates engagement through dynamic language.",
      icon: "zap",
    },
    {
      id: "4",
      name: "Informative",
      description:
        "Educational and detailed tone that focuses on delivering valuable insights and data-driven content.",
      icon: "book-open",
    },
  ]

  // Sample templates with example posts
  const templates = [
    {
      id: "1",
      name: "Blog Post Promotion",
      description: "Share your latest blog post with a compelling hook and call-to-action",
      icon: "file-text",
      example:
        '📝 Just published: "10 Ways to Improve Your Marketing Strategy in 2023"\n\nIn this comprehensive guide, I break down the latest trends and actionable tactics that are driving results for top brands.\n\nKey highlights:\n• The shift from traditional to digital-first approaches\n• How AI is transforming customer engagement\n• Budget-friendly strategies for startups\n\nRead the full article at the link below! 👇\n#MarketingStrategy #DigitalMarketing',
    },
    {
      id: "2",
      name: "Product Update",
      description: "Announce new features or updates to your product with excitement and clear benefits",
      icon: "zap",
      example:
        "🚀 Exciting news! We've just launched our newest feature: Advanced Analytics Dashboard\n\nNow you can:\n✅ Track performance in real-time\n✅ Customize reports with drag-and-drop\n✅ Share insights with your team instantly\n\nUpgrade today and transform how you make data-driven decisions!\n#ProductUpdate #Analytics",
    },
    {
      id: "3",
      name: "How-to Guide",
      description: "Step-by-step instructions for completing a task, positioned as valuable expertise",
      icon: "book-open",
      example:
        "How to Create Engaging Social Media Content in 5 Steps:\n\n1️⃣ Know your audience - research demographics and interests\n2️⃣ Choose the right format - video, images, or text based on platform\n3️⃣ Create a content calendar - consistency is key\n4️⃣ Use storytelling techniques - connect emotionally\n5️⃣ Analyze performance - adjust based on engagement metrics\n\nWhat content strategy works best for you? Share below!\n#ContentStrategy #SocialMediaTips",
    },
    {
      id: "4",
      name: "Case Study",
      description: "Detailed analysis of a specific example or scenario that showcases results",
      icon: "lightbulb",
      example:
        "📊 Case Study: How we helped @TechStartup increase conversion rates by 137% in just 60 days\n\nThe Challenge:\n• Low website conversion (1.2%)\n• High bounce rate on landing pages\n• Unclear value proposition\n\nOur Solution:\n• Redesigned customer journey\n• Implemented A/B testing\n• Refined messaging based on user feedback\n\nResults speak for themselves! Full case study in comments.\n#ConversionOptimization #GrowthStrategy",
    },
  ]

  // Platform options
  const platforms: { id: "linkedin" | "x" | "both"; label: string; icon: React.ReactNode; color: string; description: string }[] = [
    {
     id: "linkedin",
      label: "LinkedIn",
      icon: <Linkedin className="h-6 w-6" />,
      color: "bg-[#0077B5]",
      description: "Professional network ideal for B2B content, industry insights, and career-related posts.",
    },
    {
      id: "x",
      label: "X (Twitter)",
      icon: <Twitter className="h-6 w-6" />,
      color: "bg-black",
      description: "Fast-paced platform for concise updates, trending topics, and real-time engagement.",
    },
    {
      id: "both",
      label: "Both Platforms",
      icon: (
        <div className="relative">
          <div className="absolute -left-1 -top-1">
            <Linkedin className="h-5 w-5 text-[#0077B5]" />
          </div>
          <div className="absolute -right-1 -bottom-1">
            <Twitter className="h-5 w-5 text-black" />
          </div>
          <div className="w-6 h-6"></div>
        </div>
      ),
      color: "bg-gradient-to-br from-[#0077B5] to-black",
      description: "Generate content optimized for both LinkedIn and X, with platform-specific formatting.",
    },
  ]

  const decrementCount = () => {
    if (data.postCount > 1) {
      onUpdateData({ postCount: data.postCount - 1 })
    }
  }

  const incrementCount = () => {
    if (data.postCount < 10) {
      onUpdateData({ postCount: data.postCount + 1 })
    }
  }

  const toggleTemplateExpansion = (templateId: string) => {
    if (expandedTemplate === templateId) {
      setExpandedTemplate(null)
    } else {
      setExpandedTemplate(templateId)
    }
  }

  const handlePlatformSelect = (platform: "linkedin" | "x" | "both") => {
    onUpdateData({ platform })
  }

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case "file-text":
        return <FileText className="h-6 w-6" />
      case "zap":
        return <Zap className="h-6 w-6" />
      case "message-square":
        return <MessageSquare className="h-6 w-6" />
      case "book-open":
        return <BookOpen className="h-6 w-6" />
      case "lightbulb":
        return <Lightbulb className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">Generate Posts</h2>
      <p className="text-gray-600 mb-8">Configure your post generation settings</p>

      <div className="space-y-10">
        {/* Platform Selection */}
        <div className="bg-gradient-to-r from-[#EEF8F5] to-white p-6 rounded-xl max-w-4xl mx-auto">
          <h3 className="text-lg font-medium text-[#1a1a2e] mb-5 flex items-center">
            <GradientBadge number={1} />
            Select Platform
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                  data.platform === platform.id
                    ? "bg-white border-l-4 border-[#45c19a] shadow-md"
                    : "bg-white border border-gray-100 hover:border-[#DEF0EA]"
                }`}
                onClick={() => handlePlatformSelect(platform.id)}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white ${platform.color}`}
                  >
                    {platform.icon}
                  </div>
                  <h4 className="font-medium text-[#1a1a2e] text-lg">{platform.label}</h4>
                </div>
                <p className="text-sm text-gray-500 ml-13">{platform.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Post Count Selector */}
        <div className="bg-gradient-to-r from-[#EEF8F5] to-white p-6 rounded-xl max-w-3xl mx-auto">
          <h3 className="text-lg font-medium text-[#1a1a2e] mb-5 flex items-center">
            <GradientBadge number={2} />
            Number of Posts
          </h3>
          <div className="flex items-center space-x-6 px-4">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementCount}
              disabled={data.postCount <= 1}
              className="h-10 w-10 rounded-full border-2 border-[#DEF0EA] hover:border-[#45c19a] hover:bg-[#EEF8F5]"
            >
              <Minus className="h-5 w-5 text-[#1a1a2e]" />
            </Button>
            <div className="w-full max-w-md">
              <Slider
                value={[data.postCount]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => onUpdateData({ postCount: value[0] })}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementCount}
              disabled={data.postCount >= 10}
              className="h-10 w-10 rounded-full border-2 border-[#DEF0EA] hover:border-[#45c19a] hover:bg-[#EEF8F5]"
            >
              <Plus className="h-5 w-5 text-[#1a1a2e]" />
            </Button>
            <AnimatedCounter value={data.postCount} />
          </div>
        </div>

        {/* Tone Selection */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-medium text-[#1a1a2e] mb-5 flex items-center">
            <GradientBadge number={3} />
            Select Tone
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tones.map((tone) => (
              <div
                key={tone.id}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                  data.toneId === tone.id
                    ? "bg-gradient-to-r from-[#EEF8F5] to-white border-l-4 border-[#45c19a] shadow-md"
                    : "bg-white border border-gray-100 hover:border-[#DEF0EA]"
                }`}
                onClick={() => onUpdateData({ toneId: tone.id })}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      data.toneId === tone.id
                        ? "bg-gradient-to-r from-[#45c19a] to-[#6DC7A9] text-white"
                        : "bg-[#EEF8F5] text-[#45c19a]"
                    }`}
                  >
                    {getTemplateIcon(tone.icon)}
                  </div>
                  <h4 className="font-medium text-[#1a1a2e] text-lg">{tone.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{tone.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Template Selection */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-medium text-[#1a1a2e] mb-5 flex items-center">
            <GradientBadge number={4} />
            Select Template
          </h3>
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`rounded-lg transition-all duration-300 hover:shadow-md overflow-hidden ${
                  data.templateId === template.id
                    ? "bg-gradient-to-r from-[#EEF8F5] to-white border-l-4 border-[#45c19a] shadow-md"
                    : "bg-white border border-gray-100 hover:border-[#DEF0EA]"
                }`}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => {
                    onUpdateData({ templateId: template.id })
                    toggleTemplateExpansion(template.id)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          data.templateId === template.id
                            ? "bg-gradient-to-r from-[#45c19a] to-[#6DC7A9] text-white"
                            : "bg-[#EEF8F5] text-[#45c19a]"
                        }`}
                      >
                        {getTemplateIcon(template.icon)}
                      </div>
                      <h4 className="font-medium text-[#1a1a2e] text-lg">{template.name}</h4>
                    </div>
                    <button
                      className="text-gray-400 hover:text-[#45c19a] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTemplateExpansion(template.id)
                      }}
                    >
                      {expandedTemplate === template.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{template.description}</p>
                </div>

                {/* Expanded template example */}
                {expandedTemplate === template.id && template.example && (
                  <div className="px-4 pb-4">
                    <div className="mt-2 p-4 bg-[#f8f9fa] rounded-lg border border-[#DEF0EA]">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#EEF8F5] flex items-center justify-center mr-2">
                          <FileText className="h-4 w-4 text-[#45c19a]" />
                        </div>
                        <div className="text-sm font-medium text-[#1a1a2e]">Example Post</div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{template.example}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Prompt */}
        <div
          className={`bg-gradient-to-r from-[#EEF8F5] to-white p-6 rounded-xl transition-all duration-300 max-w-4xl mx-auto mt-10 ${
            promptFocus ? "shadow-md" : ""
          }`}
        >
          <h3 className="text-lg font-medium text-[#1a1a2e] mb-4 flex items-center">
            <GradientBadge number={5} />
            Custom Prompt (Optional)
          </h3>
          <div className="relative">
            <Textarea
              placeholder="Add specific instructions for your posts..."
              value={data.customPrompt}
              onChange={(e) => onUpdateData({ customPrompt: e.target.value })}
              onFocus={() => setPromptFocus(true)}
              onBlur={() => setPromptFocus(false)}
              className={`min-h-[120px] border-2 transition-all duration-300 ${
                promptFocus
                  ? "border-[#45c19a] shadow-sm"
                  : "border-[#DEF0EA] focus:border-[#45c19a] focus:ring-[#45c19a]"
              } bg-white`}
            />
            {promptFocus && (
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">{data.customPrompt.length} characters</div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="relative max-w-2xl mx-auto mt-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#45c19a] to-[#6DC7A9] blur-lg opacity-30 rounded-xl"></div>
          <Button
            onClick={onGenerate}
            disabled={!data.templateId || !data.toneId || data.platform.length === 0}
            className="w-full bg-gradient-to-r from-[#45c19a] to-[#6DC7A9] hover:from-[#3bb389] hover:to-[#5DB999] text-white py-8 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <Sparkles className="mr-3 h-6 w-6" />
            Generate {data.postCount} Posts
          </Button>
        </div>
      </div>
    </div>
  )
}
