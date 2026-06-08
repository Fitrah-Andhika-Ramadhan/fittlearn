export default function DashboardLoading() {
  return (
    <div className="w-full py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="h-9 bg-white/10 rounded-xl w-48" />
          <div className="h-4 bg-white/[0.06] rounded w-64" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/[0.06] border border-white/[0.10] rounded-2xl p-5 flex items-center gap-4">
              <div className="h-11 w-11 bg-white/10 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-7 bg-white/10 rounded w-12" />
                <div className="h-3 bg-white/[0.06] rounded w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Search skeleton */}
        <div className="bg-white/[0.06] border border-white/[0.10] rounded-2xl p-5 animate-pulse">
          <div className="h-5 bg-white/10 rounded w-32 mb-4" />
          <div className="h-10 bg-white/[0.06] border border-white/[0.08] rounded-xl" />
        </div>

        {/* Card skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/[0.06] border border-white/[0.10] rounded-2xl p-5 animate-pulse">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-white/10 rounded-lg w-3/4" />
                <div className="flex gap-2">
                  <div className="h-5 bg-white/10 rounded-full w-16" />
                  <div className="h-5 bg-white/[0.06] rounded-full w-28" />
                </div>
                <div className="h-4 bg-white/[0.06] rounded w-full" />
                <div className="h-4 bg-white/[0.06] rounded w-4/5" />
              </div>
              <div className="flex flex-col gap-1.5">
                {[1, 2, 3, 4].map((j) => <div key={j} className="h-8 w-8 bg-white/[0.06] rounded-lg" />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
