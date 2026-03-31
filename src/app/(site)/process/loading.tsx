const sk = "rounded-sm bg-surface animate-[skeleton-pulse_2s_ease-in-out_infinite]";

export default function ProcessLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background">
        <div className={`absolute inset-0 ${sk}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className={`h-12 w-64 md:h-20 md:w-80 bg-surface-elevated ${sk}`} />
          <div className={`h-12 w-48 md:h-20 md:w-64 bg-surface-elevated ${sk}`} />
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-background px-[var(--container-padding-x)] py-32">
        {/* Section header */}
        <div className="mx-auto mb-24 flex max-w-2xl flex-col items-center gap-4">
          <div className={`h-8 w-48 ${sk}`} />
          <div className={`h-4 w-80 max-w-full ${sk}`} />
        </div>

        {/* Steps */}
        <div className="mx-auto flex max-w-5xl flex-col gap-24">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`flex flex-col gap-8 md:flex-row md:gap-16 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Text */}
              <div className="flex flex-1 flex-col gap-3">
                <div className={`h-8 w-8 rounded-full ${sk}`} />
                <div className={`h-6 w-40 ${sk}`} />
                <div className={`h-4 w-full ${sk}`} />
                <div className={`h-4 w-3/4 ${sk}`} />
              </div>

              {/* Image */}
              <div className="flex-1">
                <div className={`aspect-[4/3] w-full ${sk}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
