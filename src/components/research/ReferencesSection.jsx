import FadeInSection from "./FadeInSection";

export default function ReferencesSection({ data }) {
  if (!data || !Array.isArray(data.items) || data.items.length === 0) return null;

  return (
    <section id="references" className="py-16 md:py-20 scroll-mt-28">
      <div className="max-w-5xl mx-auto px-6">
        <FadeInSection>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">
            {data.heading ?? "References"}
          </h2>
          <div className="h-1 w-12 rounded-full bg-blue-600 mb-8" />
        </FadeInSection>

        <FadeInSection delay={100}>
          <ol className="space-y-4">
            {data.items.map((reference, index) => (
              <li
                key={`${reference.title}-${index}`}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8"
              >
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {reference.href ? (
                    <a
                      href={reference.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      {reference.title}
                    </a>
                  ) : (
                    reference.title
                  )}
                </p>
                <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                  {reference.authors}
                </p>
                <p className="mt-1 text-base text-zinc-700 dark:text-zinc-300">
                  {reference.venue}{reference.year ? `, ${reference.year}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </FadeInSection>
      </div>
    </section>
  );
}
