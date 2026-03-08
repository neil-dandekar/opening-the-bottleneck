import FadeInSection from "./FadeInSection";

export default function MotivationSection({ data }) {
  const hasImage = Boolean(data.image);

  return (
    <section id="motivation" className="py-16 md:py-20 bg-zinc-50/60 dark:bg-zinc-900/40 scroll-mt-28">
      <div className="max-w-5xl mx-auto px-6">
        <FadeInSection>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">{data.heading}</h2>
          <div className="h-1 w-12 rounded-full bg-blue-600 mb-8" />
        </FadeInSection>

        <div className={hasImage ? "grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 items-start" : ""}>
          <FadeInSection delay={100}>
            <p className={`text-base leading-relaxed text-zinc-600 dark:text-zinc-400 ${hasImage ? "" : "max-w-3xl"}`}>
              {data.text}
            </p>
          </FadeInSection>

          {hasImage && (
            <FadeInSection delay={200}>
              <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                <img src={data.image} alt={data.heading} className="w-full object-cover" />
              </div>
              {data.imageCaption && (
                <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500 italic">{data.imageCaption}</p>
              )}
            </FadeInSection>
          )}
        </div>
      </div>
    </section>
  );
}
