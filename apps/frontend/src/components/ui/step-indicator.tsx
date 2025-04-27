interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: "Select Content Source" },
    { number: 2, title: "Generate Posts" },
    { number: 3, title: "Review and Modify Posts" },
  ]

  return (
    <div className="flex justify-between items-center max-w-3xl mx-auto relative">
      {/* Connecting line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#DEF0EA] -z-10"></div>

      {steps.map((step) => (
        <div key={step.number} className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 shadow-md transition-all duration-300 ${
              currentStep >= step.number
                ? "bg-gradient-to-br from-[#45c19a] to-[#6DC7A9] text-white scale-110"
                : "bg-[#DEF0EA] text-[#1a1a2e]"
            }`}
          >
            {step.number}
          </div>
          <div className="text-center">
            <p
              className={`text-sm font-medium transition-all duration-300 ${
                currentStep >= step.number ? "text-[#1a1a2e]" : "text-gray-400"
              }`}
            >
              {step.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
