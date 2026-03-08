import { CheckCircle2 } from "lucide-react";
import FadeInSection from "./FadeInSection";

export default function ResultsSection({ data }) {
  const findingsHeading = data.findingsHeading ?? "Key Findings";

  return (
    <section id="results" className="py-16 md:py-20 scroll-mt-28">
      <div className="max-w-5xl mx-auto px-6">
        <FadeInSection>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">{data.heading}</h2>
          <div className="h-1 w-12 rounded-full bg-blue-600 mb-10" />
        </FadeInSection>

        {data.figures?.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {data.figures.map((figure, index) => (
              <FadeInSection key={figure.caption ?? index} delay={index * 120}>
                <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md">
                  <img src={figure.image} alt={figure.caption} className="w-full object-cover h-56" />
                </div>
                {figure.caption && (
                  <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500 italic">{figure.caption}</p>
                )}
              </FadeInSection>
            ))}
          </div>
        )}

        <FadeInSection delay={300}>
          <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-5">
              {findingsHeading}
            </h3>
            <ul className="space-y-4">
              {data.findings.map((finding, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
