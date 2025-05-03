import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { CustomDropdown } from "../ui/custom-dropdown"
import { createPortal } from "react-dom"

interface EnhancePopupProps {
  isOpen: boolean
  onClose: () => void
  onEnhance: (options: {
    instructions: string
    tone: string
    length: string
    advanced?: any
  }) => void
  buttonRef?: React.RefObject<HTMLButtonElement | null>
}

export function EnhancePopup({ isOpen, onClose, onEnhance, buttonRef }: EnhancePopupProps) {
  const [instructions, setInstructions] = useState("")
  const [tone, setTone] = useState<string>("professional")
  const [length, setLength] = useState<string>("medium")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const popupRef = useRef<HTMLDivElement>(null)

  const toneOptions = [
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "professional", label: "Professional" },
  ]

  const lengthOptions = [
    { value: "short", label: "Short" },
    { value: "medium", label: "Medium" },
    { value: "long", label: "Long" },
  ]

  // Calculate position based on button location
  useEffect(() => {
    if (isOpen && buttonRef?.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popupWidth = 400; // Approximate width of popup
      
      // Check if popup would go off the right edge of the screen
      let left = buttonRect.left - popupWidth / 2 + buttonRect.width / 2;
      if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 20;
      }
      if (left < 20) {
        left = 20;
      }
      
      // Position slightly below the button
      const top = buttonRect.bottom + 10;
      
      setPosition({ top, left });
    }
  }, [isOpen, buttonRef]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = () => {
    onEnhance({
      instructions,
      tone,
      length,
      advanced: showAdvanced ? { custom: true } : undefined,
    })
    onClose();
  }

  const content = (
    <div 
      className="fixed z-50"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <div
        ref={popupRef}
        className="w-full max-w-md bg-gradient-to-b from-white/90 to-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200"
      >
        <div className="p-4 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#EEF8F5] flex items-center justify-center hover:bg-[#DEF0EA] transition-colors"
          >
            <X className="w-5 h-5 text-[#1a1a2e]" />
          </button>

          {/* Title */}
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Enhance Post</h2>

          {/* Subtitle */}
          <p className="text-[#1a1a2e]/70 text-sm mb-3">How would you like to enhance the content?</p>

          {/* Text input */}
          <div className="mb-5">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Add your enhancement instructions..."
              className="w-full h-20 p-3 rounded-xl bg-white border border-[#DEF0EA] focus:outline-none focus:ring-2 focus:ring-[#45c19a] resize-none text-[#1a1a2e] text-sm"
            />
          </div>

          {/* Options in a row */}
          <div className="flex gap-4 mb-6">
            <CustomDropdown label="Tone" options={toneOptions} value={tone} onChange={setTone} className="flex-1" />

            <CustomDropdown
              label="Length"
              options={lengthOptions}
              value={length}
              onChange={setLength}
              className="flex-1"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[#45c19a] hover:text-[#3bb389] font-medium"
            >
              Advanced options
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/50 text-[#1a1a2e] hover:bg-white/80 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl bg-[#45c19a] text-white hover:bg-[#3bb389] transition-colors text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
