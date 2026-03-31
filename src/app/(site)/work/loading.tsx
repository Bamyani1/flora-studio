const sk = "rounded-sm bg-surface animate-[skeleton-pulse_2s_ease-in-out_infinite]";

export default function WorkLoading() {
  return (
    <main>
      {/* Hero section */}
      <section className="relative h-dvh w-full overflow-hidden bg-surface-lowest">
        <div className={`absolute inset-0 ${sk}`} />

        {/* Bottom-right text overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-end p-[var(--container-padding-x)] pb-12 md:p-24">
          <div className={`mb-4 h-3 w-20 bg-surface-elevated ${sk}`} />
          <div className={`mb-4 h-12 w-64 md:h-16 bg-surface-elevated ${sk}`} />
          <div className={`mb-12 h-3 w-40 bg-surface-elevated ${sk}`} />
          <div className="flex items-center gap-4">
            <div className="h-12 w-px bg-primary/30" />
            <div className={`h-2 w-16 bg-surface-elevated ${sk}`} />
          </div>
        </div>
      </section>

      {/* Grid section */}
      <section className="bg-surface">
        <div className="grid grid-cols-1 gap-px md:grid-cols-3">
          {/* Large card */}
          <div className="md:col-span-2 md:row-span-2">
            <div className={`aspect-[3/4] w-full ${sk}`} />
          </div>
          {/* Smaller cards */}
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className={`w-full ${i % 2 === 0 ? "aspect-video" : "aspect-[3/4]"} ${sk}`} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
