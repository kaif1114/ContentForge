"use client"

import type React from "react"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TagInputProps {
  tags: string[]
  setTags: (tags: string[]) => void
  placeholder?: string
}

export default function TagInput({ tags, setTags, placeholder = "Add tag..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()])
      }
      setInputValue("")
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-2 border-[#DEF0EA] rounded-md focus-within:border-[#45c19a] focus-within:ring-1 focus-within:ring-[#45c19a] bg-white">
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center gap-1 px-2 py-1 text-sm bg-[#EEF8F5] text-[#45c19a] rounded-full">
          <span>#{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#45c19a] hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] border-none shadow-none focus-visible:ring-0 p-0 text-sm"
      />
    </div>
  )
}
