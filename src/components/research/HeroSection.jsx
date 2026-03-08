import { FileText, Github, Play, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeInSection from "./FadeInSection";

function getAuthorEmail(author) {
  if (typeof author.link === "string" && author.link.startsWith("mailto:")) {
    return author.link.replace("mailto:", "");
  }

  return author.affiliation || "N/A";
}

function AuthorChip({ name, affiliation, link }) {
  const email = getAuthorEmail({ affiliation, link });
  const inner = (
    <span className="flex flex-col items-center text-center leading-tight">
      <span className="font-medium text-zinc-900 dark:text-zinc-100">{name}</span>
      <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{email}</span>
    </span>
  );

  if (typeof link === "string" && link.length > 0 && link !== "#") {
    const isMailto = link.startsWith("mailto:");
    return (
      <a
        href={link}
        target={isMailto ? undefined : "_blank"}
        rel={isMailto ? undefined : "noopener noreferrer"}
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {inner}
      </a>
    );
  }

  return inner;
}

export default function HeroSection({ content }) {
  const effectiveToolLink = content.toolLink ?? content.demoLink;
  const effectivePaperLink = content.paperLink ?? content.paperPlaceholderLink ?? content.codeLink;
  const scrollToReferences = () => {
    document.getElementById("references")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="top" className="relative min-h-[100svh] w-full flex items-center scroll-mt-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-100/40 dark:bg-blue-900/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-5xl mx-auto text-center px-6 pt-24 pb-12 md:pt-28 md:pb-16">
        <FadeInSection>
          {content.venue && (
            <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {content.venue}
            </span>
          )}
        </FadeInSection>

        <FadeInSection delay={80}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-white">
            {content.title}
          </h1>
        </FadeInSection>

        <FadeInSection delay={160}>
          <p className="mt-5 text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {content.tagline}
          </p>
        </FadeInSection>

        <FadeInSection delay={240}>
          <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm">
            {content.authors.map((author) => (
              <span key={author.name} className="flex items-center">
                <AuthorChip {...author} />
              </span>
            ))}
          </div>
        </FadeInSection>

        <FadeInSection delay={320}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <a href={content.codeLink} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> Code
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <a href={effectivePaperLink} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" /> Paper
              </a>
            </Button>

            <Button
              variant="outline"
              className="border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              onClick={scrollToReferences}
            >
              <Quote className="mr-2 h-4 w-4" /> References
            </Button>
          </div>
        </FadeInSection>

        <FadeInSection delay={400}>
          <div className="mt-8 inline-flex max-w-full items-center gap-4 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 px-4 py-3 md:px-5 backdrop-blur-sm shadow-md shadow-zinc-900/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300 whitespace-nowrap">
              Try The Tool
            </p>
            <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
            <Button
              asChild
              variant="ghost"
              className="!bg-blue-700 hover:!bg-blue-800 !text-white dark:!text-white px-5 py-2.5 text-sm shadow-md shadow-blue-700/20"
            >
              <a href={effectiveToolLink} target="_blank" rel="noopener noreferrer">
                <Play className="mr-2 h-4 w-4" /> Open Live Tool
              </a>
            </Button>
          </div>
        </FadeInSection>

      </div>
    </section>
  );
}
