interface GradientBadgeProps {
  number: number
}

export default function GradientBadge({ number }: GradientBadgeProps) {
  return (
    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#45c19a] to-[#6DC7A9] text-white flex items-center justify-center mr-3 shadow-sm">
      <span className="text-sm font-bold">{number}</span>
    </span>
  )
}
