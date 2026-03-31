const sk = "rounded-sm bg-surface animate-[skeleton-pulse_2s_ease-in-out_infinite]";

export default function AboutLoading() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        {/* Eyebrow */}
        <div className="mb-10 flex items-center gap-4">
          <div className={`h-px w-12 ${sk}`} />
          <div className={`h-3 w-20 ${sk}`} />
          <div className={`h-px w-12 ${sk}`} />
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-3">
          <div className={`h-12 w-72 md:h-24 md:w-[500px] ${sk}`} />
          <div className={`h-12 w-48 md:h-24 md:w-[300px] ${sk}`} />
        </div>

        {/* Subtitle */}
        <div className={`mt-10 h-5 w-96 max-w-full ${sk}`} />
      </section>

      {/* Team section */}
      <section className="bg-surface px-6 py-16 md:px-12 md:py-24 lg:px-24">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-center gap-3">
          <div className={`h-3 w-16 ${sk}`} />
          <div className={`h-8 w-64 ${sk}`} />
          <div className={`h-4 w-80 max-w-full ${sk}`} />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          {/* Portrait */}
          <div className="hidden lg:block">
            <div className={`aspect-[3/4] w-full max-w-md ${sk}`} />
          </div>

          {/* Team list */}
          <div className="flex flex-col">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border/20 py-6 md:py-8"
              >
                <div className="flex flex-col gap-2">
                  <div className={`h-8 w-48 md:h-12 md:w-64 ${sk}`} />
                  <div className={`h-3 w-24 ${sk}`} />
                </div>
                <div className={`h-10 w-10 rounded-full ${sk}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
