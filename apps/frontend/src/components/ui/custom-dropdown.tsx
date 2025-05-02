"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"

interface DropdownOption {
  value: string
  label: string
}

interface CustomDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  className?: string
}

export function CustomDropdown({ options, value, onChange, label, className = "" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      {label && <p className="text-[#1a1a2e] mb-1 text-xs font-medium">{label}</p>}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#1a1a2e] bg-white border border-[#DEF0EA] rounded-xl hover:border-[#45c19a] focus:outline-none focus:ring-2 focus:ring-[#45c19a] transition-colors"
        >
          <span>{selectedOption?.label || "Select option"}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div
            className="absolute z-50 w-full mt-1 bg-white border border-[#DEF0EA] rounded-xl shadow-lg overflow-hidden"
            style={{ maxHeight: "150px", overflowY: "auto" }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-[#EEF8F5] transition-colors ${
                  option.value === value ? "bg-[#EEF8F5] text-[#45c19a]" : "text-[#1a1a2e]"
                }`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                <span>{option.label}</span>
                {option.value === value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
