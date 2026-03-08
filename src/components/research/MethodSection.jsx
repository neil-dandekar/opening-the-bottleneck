import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import FadeInSection from "./FadeInSection";

export default function MethodSection({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <section id="method" className="py-16 md:py-20 scroll-mt-28">
      <div className="max-w-5xl mx-auto px-6">
        <FadeInSection>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">{data.heading}</h2>
          <div className="h-1 w-12 rounded-full bg-blue-600 mb-8" />
        </FadeInSection>

        <FadeInSection delay={100}>
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-3xl mb-10">{data.text}</p>
        </FadeInSection>

        {data.image && (
          <FadeInSection delay={200}>
            <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg mb-3">
              <img src={data.image} alt={data.heading} className="w-full object-cover max-h-[400px]" />
            </div>
            {data.imageCaption && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 italic mb-8">{data.imageCaption}</p>
            )}
          </FadeInSection>
        )}

        {data.technicalDetails && (
          <FadeInSection delay={300}>
            <button
              onClick={() => setOpen((value) => !value)}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-4"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
              {open ? "Hide" : "Show"} Technical Details
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                open ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
              }`}
            >
              <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
                <div className="max-w-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="my-3">{children}</p>,
                      strong: ({ children }) => (
                        <strong className="text-zinc-700 dark:text-zinc-300">{children}</strong>
                      )
                    }}
                  >
                    {data.technicalDetails}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </FadeInSection>
        )}
      </div>
    </section>
  );
}
