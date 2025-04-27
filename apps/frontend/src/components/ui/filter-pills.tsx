"use client"

interface FilterPillsProps {
  filters: { id: string; label: string }[]
  activeFilter: string
  onChange: (filterId: string) => void
}

export default function FilterPills({ filters, activeFilter, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-1 bg-[#EEF8F5] rounded-full">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeFilter === filter.id ? "bg-white text-[#45c19a] shadow-sm" : "text-gray-600 hover:text-[#45c19a]"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
