import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Post } from "@/types/content";
import { useState } from "react";
import { tones } from "@/types/post-attributes";
interface EnhanceSectionProps {
  initialData: Post;
  lengthWatch: "short" | "medium" | "long" | undefined;
  toneWatch: tones;
  customLengthWatch: number | undefined;
  onSetLength: (length: "short" | "medium" | "long" | undefined) => void;
  onSetCustomLength: (customLength: number | undefined) => void;
  onSetTone: (tone: tones) => void;
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

const EnhanceSection = ({
  initialData,
  lengthWatch,
  customLengthWatch,
  onSetLength,
  onSetCustomLength,
  toneWatch,
  onSetTone,
}: EnhanceSectionProps) => {
  const [customLength] = useState(initialData?.customLength || 150);

  const isUsingCustomLength =
    lengthWatch === undefined && customLengthWatch !== undefined;

  const handleLengthChange = (value: string) => {
    if (value === "custom") {
      onSetLength(undefined);
      onSetCustomLength(customLength);
    } else {
      onSetLength(value as "short" | "medium" | "long");
      onSetCustomLength(undefined);
    }
  };

  const handleCustomLengthChange = (value: number[]) => {
    onSetCustomLength(value[0]);
  };

  return (
    <>
      <div>
        <Label className="text-sm block mb-2">Tone</Label>
        <div className="grid grid-cols-2 gap-2">
          {toneOptions.map((tone) => (
            <div
              key={tone.id}
              className={`p-2 rounded border text-center cursor-pointer transition-all ${
                toneWatch === tone.id
                  ? "border-mint-500 bg-mint-50"
                  : "border-white/30 hover:border-mint-200"
              }`}
              onClick={() => onSetTone(tone.id as tones)}
            >
              <div className="text-sm font-medium">{tone.label}</div>
              <div className="text-xs text-gray-500 mt-1">
                {tone.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Length Selection */}
      <div>
        <Label className="text-sm block mb-2">Length</Label>
        <RadioGroup
          value={isUsingCustomLength ? "custom" : lengthWatch || "medium"}
          onValueChange={handleLengthChange}
          className="grid grid-cols-2 gap-2"
        >
          {lengthOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.id}
                id={`length-${option.id}`}
                className="sr-only"
              />
              <Label
                htmlFor={`length-${option.id}`}
                className={`flex flex-col items-center justify-center p-2 rounded border w-full h-full cursor-pointer transition-all ${
                  !isUsingCustomLength && lengthWatch === option.id
                    ? "border-mint-500 bg-mint-50"
                    : "border-white/30 hover:border-mint-200"
                }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
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
              <span className="text-xs text-gray-500 mt-1">Specify length</span>
            </Label>
          </div>
        </RadioGroup>

        {isUsingCustomLength && (
          <div className="p-3 border rounded mt-2">
            <div className="flex justify-between mb-2">
              <Label className="text-sm">Custom Word Count</Label>
              <span className="text-sm font-medium">
                {customLengthWatch} words
              </span>
            </div>
            <Slider
              value={[customLengthWatch || 150]}
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
      </div>
    </>
  );
};

export default EnhanceSection;
