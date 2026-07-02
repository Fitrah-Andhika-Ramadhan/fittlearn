export default function PortfolioLoading() {
  return (
    <div className="w-full min-h-screen text-white pt-32 pb-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto text-center mb-16 flex flex-col items-center">
        <div className="w-48 h-8 rounded-full bg-white/5 animate-pulse mb-6"></div>
        <div className="w-3/4 h-16 rounded-2xl bg-white/5 animate-pulse mb-6"></div>
        <div className="w-1/2 h-6 rounded-lg bg-white/5 animate-pulse"></div>
      </div>

      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col gap-4 p-4 md:p-6 bg-[#13141f]/80 rounded-[2rem] border border-white/5">
            <div className="w-full aspect-[4/3] rounded-2xl bg-white/5 animate-pulse"></div>
            <div className="w-3/4 h-8 rounded-lg bg-white/5 animate-pulse"></div>
            <div className="w-full h-4 rounded-md bg-white/5 animate-pulse"></div>
            <div className="w-full h-4 rounded-md bg-white/5 animate-pulse"></div>
            <div className="w-2/3 h-4 rounded-md bg-white/5 animate-pulse"></div>
            <div className="w-32 h-10 rounded-full bg-white/5 animate-pulse mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
