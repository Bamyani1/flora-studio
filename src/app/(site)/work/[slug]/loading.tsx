const sk = "rounded-sm bg-surface animate-[skeleton-pulse_2s_ease-in-out_infinite]";

export default function AlbumLoading() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-dvh overflow-hidden bg-surface-lowest">
        <div className={`absolute inset-0 ${sk}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-[var(--container-padding-x)] pb-[var(--space-16)]">
          <div className={`mb-[var(--space-4)] h-8 w-48 md:h-12 bg-surface-elevated ${sk}`} />
          <div className={`h-3 w-32 bg-surface-elevated ${sk}`} />
        </div>
      </section>

      {/* Narrative */}
      <section className="px-[var(--container-padding-x)] py-[var(--section-padding-y)]">
        <div className="mx-auto flex max-w-[var(--max-width-narrow)] flex-col gap-3">
          <div className={`h-5 w-full ${sk}`} />
          <div className={`h-5 w-full ${sk}`} />
          <div className={`h-5 w-full ${sk}`} />
          <div className={`h-5 w-3/4 ${sk}`} />
        </div>
      </section>

      {/* Gallery placeholder */}
      <section className="flex flex-col gap-px">
        <div className={`min-h-[60vh] w-full ${sk}`} />
        <div className={`min-h-[60vh] w-full ${sk}`} />
      </section>

      {/* Nav */}
      <section className="grid grid-cols-2 gap-[var(--grid-gap)] px-[var(--container-padding-x)] py-[var(--section-padding-y)]">
        <div className="flex flex-col gap-2">
          <div className={`h-3 w-16 ${sk}`} />
          <div className={`h-6 w-32 ${sk}`} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`h-3 w-16 ${sk}`} />
          <div className={`h-6 w-32 ${sk}`} />
        </div>
      </section>
    </main>
  );
}
