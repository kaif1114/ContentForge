import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import StepIndicator from "@/components/ui/step-indicator";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import ReviewPosts from "@/components/create/review-posts";
import GeneratePosts from "@/components/create/generate-posts";
import SelectContentSource from "@/components/create/select-content-source";
import { checkAuth } from "@/utils/auth";
import useGeneratePosts from "@/hooks/useGeneratePosts";
import { PostData } from "@/types/content";

export const Route = createFileRoute("/create")({
  component: Create,
  beforeLoad: async ({ location }) => {
    await checkAuth(location.href);
  },
});

export default function Create() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<PostData>({
    contentId: "",
    templateId: "",
    tone: "",
    postCount: 3,
    customPrompt: "",
    platform: "both",
    length: "short",
    customLength: undefined,
  });

  const updateData = (updatedFields: Partial<PostData>) => {
    setData((prevData) => {
      const newData = { ...prevData };

      if ("length" in updatedFields && updatedFields.length) {
        newData.length = updatedFields.length;
        newData.customLength = undefined;
      } else if (
        "customLength" in updatedFields &&
        updatedFields.customLength !== undefined
      ) {
        newData.customLength = updatedFields.customLength;
        newData.length = undefined as any;
      }

      // Apply all other updates
      Object.entries(updatedFields).forEach(([key, value]) => {
        if (key !== "length" && key !== "customLength") {
          (newData as any)[key] = value;
        }
      });

      return newData as PostData;
    });
  };

  const {
    mutateAsync: generatePosts,
    isPending,
    isSuccess,
    isError,
    error,
  } = useGeneratePosts();

  const handleNext = async () => {
    if (currentStep === 2) {
      console.log(data);
      await generatePosts(data);
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#45c19a10] to-[#6dc7a910] pb-8 ">
      <div className="container mx-auto px-4 md:px-6  ">
        {/* Background elements */}
        <div className="flex justify-between items-center py-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center text-[#1a1a2e] hover:text-[#3bb389] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
          <Button
            onClick={handleNext}
            disabled={
              currentStep === 3 ||
              (currentStep === 1 && !data.contentId) ||
              isPending
            }
            className="bg-gradient-to-r from-[#45c19a] to-[#6DC7A9] hover:from-[#3bb389] hover:to-[#5DB999] text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            {currentStep === 3 ? "Finish" : "Next Step"}
          </Button>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#1a1a2e] mb-6 relative inline-block">
            Create Posts
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#45c19a] to-transparent"></div>
          </h1>
          <StepIndicator currentStep={currentStep} />
        </div>

        <div className="p-8">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#45c19a]/20 to-transparent"></div>
          </div>

          <>
            {currentStep === 1 && (
              <SelectContentSource data={data} onUpdateData={updateData} />
            )}

            {currentStep === 2 && (
              <GeneratePosts
                data={data}
                onUpdateData={updateData}
                onGenerate={handleNext}
              />
            )}

            {currentStep === 3 && isSuccess && <ReviewPosts />}
          </>
        </div>
      </div>
    </div>
  );
}
