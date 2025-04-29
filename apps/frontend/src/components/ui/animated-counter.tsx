import { useEffect, useRef } from "react"

interface AnimatedCounterProps {
  value: number
}

export default function AnimatedCounter({ value }: AnimatedCounterProps) {
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.classList.add("pulse")

      const timer = setTimeout(() => {
        if (counterRef.current) {
          counterRef.current.classList.remove("pulse")
        }
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [value])

  return (
    <div
      ref={counterRef}
      className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-[#DEF0EA] transition-all duration-300"
    >
      <span className="text-xl font-bold text-[#45c19a]">{value}</span>
      <style>{`
        .pulse {
          transform: scale(1.1);
          border-color: #45c19a;
          box-shadow: 0 0 0 4px rgba(69, 193, 154, 0.2);
        }
      `}</style>
    </div>
  )
}
