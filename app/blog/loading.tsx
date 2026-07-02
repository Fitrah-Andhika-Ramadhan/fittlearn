export default function BlogLoading() {
  return (
    <div className="w-full min-h-screen text-white pt-32 pb-16 px-4">
      <div className="w-full max-w-4xl mx-auto text-center mb-16 flex flex-col items-center">
        <div className="w-40 h-8 rounded-full bg-white/5 animate-pulse mb-6"></div>
        <div className="w-3/4 h-16 rounded-2xl bg-white/5 animate-pulse mb-6"></div>
        <div className="w-1/2 h-6 rounded-lg bg-white/5 animate-pulse"></div>
      </div>

      <div className="container mx-auto max-w-4xl flex flex-col gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6 bg-[#13141f]/80 rounded-[2rem] border border-white/5">
            <div className="w-full md:w-5/12 aspect-[4/3] rounded-2xl bg-white/5 animate-pulse shrink-0"></div>
            <div className="flex flex-col justify-center py-2 flex-1 w-full space-y-4">
              <div className="flex gap-3 mb-2">
                <div className="w-16 h-6 rounded-full bg-white/5 animate-pulse"></div>
                <div className="w-24 h-6 rounded-full bg-white/5 animate-pulse"></div>
              </div>
              <div className="w-full h-8 rounded-lg bg-white/5 animate-pulse"></div>
              <div className="w-3/4 h-8 rounded-lg bg-white/5 animate-pulse mb-4"></div>
              <div className="w-full h-4 rounded-md bg-white/5 animate-pulse"></div>
              <div className="w-full h-4 rounded-md bg-white/5 animate-pulse"></div>
              <div className="w-2/3 h-4 rounded-md bg-white/5 animate-pulse"></div>
              <div className="w-32 h-5 rounded-md bg-white/5 animate-pulse mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
