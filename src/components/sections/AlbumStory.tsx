import { FadeIn } from "@/components/animations/FadeIn";

export interface AlbumDetail {
  label: string;
  value: string;
}

interface AlbumStoryProps {
  text?: string;
  details: AlbumDetail[];
}

// The words and the facts of a shoot, side by side, before the photos take over
export function AlbumStory({ text, details }: AlbumStoryProps) {
  if (!text && details.length === 0) return null;

  return (
    <section className="px-[var(--container-padding-x)] py-[var(--space-16)] md:py-[var(--space-24)]">
      <div className="mx-auto grid max-w-[max(48rem,170svh)] gap-12 md:grid-cols-[minmax(0,1fr)_minmax(12rem,18rem)] md:gap-24">
        {text && (
          <FadeIn>
            <p className="max-w-[40rem] whitespace-pre-line font-body text-lg leading-relaxed text-text/90 md:text-xl">
              {text}
            </p>
          </FadeIn>
        )}
        {details.length > 0 && (
          <FadeIn delay={0.1} className="md:col-start-2">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-1">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="eyebrow text-muted">{detail.label}</dt>
                  <dd className="mt-2 text-base text-text">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
