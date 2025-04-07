interface PostCardProps {
    logo: string
    title: string
    description: string
    tags: string[]
    time: string
  }
  
  export default function PostCard({
    logo,
    title,
    description,
    tags ,
    time,
  }: PostCardProps) {
    return (
      
   
        <div className="p-[4px] border rounded-[28px] max-w-fit" style={{ background: 'linear-gradient(180deg, rgba(69,193,154,1) 0%, rgba(161,208,193,1) 100%)' }}>
          {/* Main card with white background and rounded corners */}
          <div className="bg-white rounded-3xl p-6 shadow-md border w-[22rem] border-[#f0e9e0]">
            {/* Company logo */}
            <div className="mb-4">
              <div className="flex items-center">
                <img src={logo || "/placeholder.svg"} width={60} height={60}  alt={title}  />
              </div>
            </div>
  

            <h2 className="text-xl font-bold text-[#1a1a2e] mb-1 leading-tight">{title}</h2>
  

            <p className="text-md text-gray-500 mb-3">{description}</p>
  
            {tags.length > 0 && <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-[#6c5ce7] border border-[#e2e0f5] rounded-md text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>}
          </div>
          <p className="text-center font-bold py-3">{time}</p>
          {/* Posted time at the bottom */}
          
        </div>
     
    )
  }
  
  