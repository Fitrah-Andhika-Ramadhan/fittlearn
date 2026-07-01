export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a061e]/80 backdrop-blur-md">
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing rings */}
        <div className="absolute w-24 h-24 rounded-full border border-purple-500/30 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute w-16 h-16 rounded-full border border-indigo-400/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
        
        {/* Glowing core */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
        </div>
        
        <p className="mt-8 text-sm font-semibold tracking-widest text-purple-200/80 uppercase animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  )
}
