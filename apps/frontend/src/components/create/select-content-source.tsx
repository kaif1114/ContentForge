"use client"

import { useState } from "react"
import {  Calendar, FileText, ExternalLink, Zap, Bookmark, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useContentSources } from "@/hooks/useContentSources"
import AddButton from "../ui/add-button"
import { AddSourceModal } from "../sources/Modal"
import { PostData } from "@/routes/create"


interface SelectContentSourceProps {
  data: PostData
  onUpdateData: (data: Partial<PostData>) => void
}

export default function SelectContentSource({ data, onUpdateData }: SelectContentSourceProps) {

  const [searchTerm, setSearchTerm] = useState("")
  const { data: contentSources, isLoading, isError, error, refetch } = useContentSources()
  const [showAddModal, setShowAddModal] = useState(false)

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText className="h-6 w-6 text-white" />
      case "product":
        return <ExternalLink className="h-6 w-6 text-white" />
      case "marketing":
        return <Calendar className="h-6 w-6 text-white" />
      case "social":
        return <Zap className="h-6 w-6 text-white" />
      default:
        return <FileText className="h-6 w-6 text-white" />
    }
  }

  const getSourceColor = (type: string) => {
    switch (type) {
      case "blog":
        return "from-[#45c19a] to-[#6DC7A9]"
      case "product":
        return "from-[#45c19a] to-[#3bb389]"
      case "marketing":
        return "from-[#6DC7A9] to-[#5DB999]"
      case "social":
        return "from-[#3bb389] to-[#45c19a]"
      default:
        return "from-[#45c19a] to-[#6DC7A9]"
    }
  }

  return (
    <>
    
    <div className="max-w-5xl mx-auto">
    <AddSourceModal open={showAddModal} onOpenChange={setShowAddModal} onAdd={async ()=> await refetch()} />
      <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-4">Select a Content Source</h2>
      <p className="text-gray-600 mb-6">Choose a content source from your saved sources or add a new one</p>

      {/* Search and Add Source Bar */}
      <div className="flex items-center gap-4 mb-8 bg-[#EEF8F5] p-3 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sources..."
            className="pl-10 border-none h-11 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AddButton onClick={() => setShowAddModal(true)} text="Add Source" />
      </div>

      {/* Selected Source Section - Always reserves space */}
      <div className="mb-8">
        {data.contentId ? (
          <div className="bg-gradient-to-r from-[#EEF8F5] to-white p-6 rounded-xl border-l-4 border-[#45c19a] shadow-inner">
            <h3 className="font-medium text-[#1a1a2e] mb-3 flex items-center">
              <Bookmark className="h-5 w-5 mr-2 text-[#45c19a]" />
              Selected Source
            </h3>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${getSourceColor(
                  contentSources?.data.find((source) => source._id === data.contentId)?.type || "",
                )} mr-3`}
              >
                {getSourceIcon(contentSources?.data.find((source) => source._id === data.contentId)?.type || "")}
              </div>
              <div>
                <span className="font-medium text-[#1a1a2e]">{contentSources?.data.find((source) => source._id === data.contentId)?.label}</span>
                <div className="text-xs text-gray-500 mt-0.5">Ready to generate content</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center text-gray-400">
            <p>Select a content source to continue</p>
          </div>
        )}
      </div>

      {/* Content Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {contentSources?.data.map((source) => (
          <div
            key={source._id}
            className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
              data.contentId === source._id
                ? "bg-gradient-to-r from-[#EEF8F5] to-white border-l-4 border-[#45c19a] shadow-md"
                : "bg-white border border-gray-100 hover:border-[#DEF0EA]"
            }`}
            onClick={() => onUpdateData({ contentId: source._id })}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${getSourceColor(
                source.type,
              )} mr-4 shadow-sm`}
            >
              {getSourceIcon(source.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[#1a1a2e] text-lg">{source.label}</h3>
              
            </div>
            {data.contentId === source._id && (
              <div className="w-6 h-6 rounded-full bg-[#45c19a] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  )
}
