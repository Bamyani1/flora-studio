const sk = "rounded-sm bg-surface animate-[skeleton-pulse_2s_ease-in-out_infinite]";

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative grid min-h-screen grid-cols-1 md:grid-cols-[44%_56%]">
        {/* Left — image skeleton */}
        <div className="min-h-[60vh] md:min-h-0">
          <div className={`h-full w-full ${sk}`} />
        </div>

        {/* Right — content skeleton */}
        <div className="flex flex-col items-center justify-center px-6 py-12 md:items-start md:border-l md:border-white/5 md:px-12 md:py-0">
          {/* Eyebrow */}
          <div className={`mb-5 h-3 w-24 ${sk}`} />

          {/* Title lines */}
          <div className="mb-12 flex w-full flex-col items-center gap-3 md:items-start">
            <div className={`h-16 w-3/4 max-w-[480px] md:h-24 ${sk}`} />
            <div className={`h-16 w-1/2 max-w-[320px] md:h-24 ${sk}`} />
          </div>

          {/* Description */}
          <div className="flex w-full max-w-[340px] flex-col gap-2">
            <div className={`h-4 w-full ${sk}`} />
            <div className={`h-4 w-4/5 ${sk}`} />
          </div>
        </div>
      </div>
    </main>
  );
}
