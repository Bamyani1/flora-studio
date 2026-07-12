const sk = "rounded-sm bg-surface animate-[skeleton-pulse_2s_ease-in-out_infinite]";

export default function WorkLoading() {
  return (
    <main>
      <div className="flex flex-col gap-2 bg-background">
        {[...Array(3)].map((_, i) => (
          <section
            key={i}
            className={`relative w-full overflow-hidden bg-surface-lowest ${
              i === 0 ? "h-svh" : "h-[78svh] md:h-[92vh]"
            }`}
          >
            <div className={`absolute inset-0 ${sk}`} />
            <div
              className={`absolute inset-x-0 bottom-0 flex flex-col p-6 pb-10 md:p-16 ${
                i % 2 === 1 ? "items-end" : "items-start"
              }`}
            >
              <div className={`h-2 w-14 bg-surface-elevated ${sk}`} />
              <div className={`mt-3 h-8 w-56 bg-surface-elevated md:h-12 md:w-80 ${sk}`} />
              <div className={`mt-4 h-2 w-40 bg-surface-elevated ${sk}`} />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
