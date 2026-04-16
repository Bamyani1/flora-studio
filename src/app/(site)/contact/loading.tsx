const sk = "rounded-sm bg-surface animate-[skeleton-pulse_2s_ease-in-out_infinite]";

export default function ContactLoading() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background px-4 pt-24 pb-10 sm:px-[5%] md:h-screen md:min-h-0 md:px-[10%] md:pt-[140px] md:pb-20">
      {/* Grain overlay */}
      <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />

      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Left Panel */}
        <div className="flex w-full flex-col gap-8 bg-surface-deep px-8 py-10 md:w-[39.5%] md:justify-between md:gap-0 md:px-14 md:py-14">
          {/* Top */}
          <div>
            <div className={`mb-8 h-3 w-24 ${sk}`} />
            <div className="mb-6 flex flex-col gap-2">
              <div className={`h-10 w-48 ${sk}`} />
              <div className={`h-10 w-36 ${sk}`} />
            </div>
            <div className="flex flex-col gap-2">
              <div className={`h-4 w-full max-w-[340px] ${sk}`} />
              <div className={`h-4 w-4/5 max-w-[280px] ${sk}`} />
            </div>
          </div>

          {/* Bottom */}
          <div>
            <div className={`mb-4 h-3 w-24 ${sk}`} />
            <div className={`mb-1 h-4 w-40 ${sk}`} />
            <div className={`mt-3 h-3 w-32 ${sk}`} />
            <div className={`mt-1 h-3 w-28 ${sk}`} />
            <div className="mt-8 flex gap-6">
              <div className={`h-5 w-5 rounded-full ${sk}`} />
              <div className={`h-5 w-5 rounded-full ${sk}`} />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col border-l border-border/10 bg-surface-lowest px-8 pt-10 pb-6 md:w-[60.5%] md:px-14 md:pt-14 md:pb-8">
          <div className={`mb-4 h-3 w-28 ${sk}`} />
          <div className={`mb-10 h-8 w-64 ${sk}`} />

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className={`h-11 w-full ${sk}`} />
              <div className={`h-11 w-full ${sk}`} />
            </div>
            <div className={`h-11 w-full ${sk}`} />
            <div className={`h-11 w-full ${sk}`} />
            <div className={`h-11 w-full ${sk}`} />
            <div className={`h-24 w-full ${sk}`} />
            <div className={`h-14 w-full ${sk}`} />
          </div>
        </div>
      </div>
    </main>
  );
}
