function SkeletonBlock({ className }) {
  return <div className={`bg-white/5 rounded-xl animate-pulse ${className}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5 border border-white/5 space-y-3">
            <div className="flex justify-between">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-8 w-8 rounded-xl" />
            </div>
            <SkeletonBlock className="h-7 w-28" />
            <SkeletonBlock className="h-2.5 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5 border border-white/5">
          <SkeletonBlock className="h-3 w-32 mb-5" />
          <SkeletonBlock className="h-56 w-full rounded-xl" />
        </div>
        <div className="glass rounded-2xl p-5 border border-white/5">
          <SkeletonBlock className="h-3 w-24 mb-5" />
          <SkeletonBlock className="h-40 w-40 rounded-full mx-auto" />
        </div>
      </div>
      <div className="glass rounded-2xl p-5 border border-white/5">
        <SkeletonBlock className="h-3 w-40 mb-5" />
        <RowSkeleton count={5} />
      </div>
    </div>
  )
}

export function RowSkeleton({ count = 4 }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <SkeletonBlock className="h-4 w-full max-w-[200px]" />
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="h-4 w-16" />
          <SkeletonBlock className="ml-auto h-4 w-20" />
        </div>
      ))}
    </div>
  )
}
