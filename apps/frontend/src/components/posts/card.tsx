interface PostCardProps {
    logo: string
    title: string
    source: string
    tags: string[]
    time: string
  }
  
  export default function PostCard({
    logo,
    title,
    source,
    tags ,
    time,
  }: PostCardProps) {
    return (
        <div className="p-[4px] border rounded-[28px] w-full cf-card-gradient">
          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-md border w-full border-cf-beige-light">
            <div className="mb-3 md:mb-4">
              <div className="flex items-center">
                <img src={logo || "/placeholder.svg"} width={60} height={60} alt={title} />
              </div>
            </div>
            <h2 className="text-base md:text-lg font-bold text-cf-dark mb-1 leading-tight line-clamp-2">{title}</h2>
            <p className="text-sm md:text-md text-gray-500 mb-2 md:mb-3">{source}</p>
            
            {tags.length > 0 && <div className="flex flex-wrap py-1 sm:py-2 gap-1 sm:gap-1.5 md:gap-2 max-w-full overflow-hidden">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 sm:px-2 md:px-3 md:py-1 bg-white text-cf-purple border border-cf-purple-light rounded-md text-[10px] sm:text-xs font-semibold truncate max-w-[90px] sm:max-w-[120px] md:max-w-[150px] hover:bg-cf-mint-light hover:border-cf-primary-green"
                >
                  {tag}
                </span>
              ))}
            </div>}
          </div>
          <p className="text-center text-sm md:text-base font-bold py-2 md:py-3">{time}</p>
        </div>
    )
  }
  
  