import { Plus } from "lucide-react"

interface Props{
    onClick: () => void
    text: string
}

const AddButton = ({onClick, text}: Props) => {
  return <button 
    onClick={onClick} 
    className="flex items-center justify-center gap-1 bg-gradient-to-b from-[#b3dcc7] to-[#a0d2ba] text-white font-medium py-3 px-6 rounded-2xl hover:opacity-90 transition-all"
  >
    <Plus className="w-4 h-4 text-white" />
    <span>{text}</span>
  </button>
}

export default AddButton