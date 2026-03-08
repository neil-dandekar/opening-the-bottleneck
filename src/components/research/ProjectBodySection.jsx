import { useState } from "react";
import { ArrowRight, ChevronDown, ExternalLink, EyeOff, SlidersHorizontal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import cbllmImage from "@/assets/cbllm.png";
import FadeInSection from "./FadeInSection";

function LeadBlock({ eyebrow, lead, support, citation, maxWidth = "max-w-5xl" }) {
  return (
    <div className={maxWidth}>
      <p className="text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-blue-700 dark:text-blue-300">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight leading-[1.08] text-zinc-950 dark:text-white">
        {lead}
      </h2>
      <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-4xl">{support}</p>
      {citation && (
        <p className="mt-4 text-sm md:text-base text-zinc-500 dark:text-zinc-400">
          {citation.text}{" "}
          <a href={citation.href} className="text-blue-700 dark:text-blue-300 hover:underline">
            See references
          </a>
          .
        </p>
      )}
    </div>
  );
}

function SectionTitleBlock({ title, support, maxWidth = "max-w-5xl" }) {
  return (
    <div className={maxWidth}>
      <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight leading-[1.08] text-zinc-950 dark:text-white">
        {title}
      </h2>
      {support && <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-4xl">{support}</p>}
    </div>
  );
}

function StoryChip({ children, tone = "neutral" }) {
  const toneStyles = {
    neutral: "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300",
    blue: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-100",
    rose: "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-100"
  };

  return <span className={`inline-flex rounded-full border px-3.5 py-2 text-sm font-medium ${toneStyles[tone]}`}>{children}</span>;
}

function DiagramArrow() {
  return <ArrowRight className="h-5 w-5 text-zinc-400 dark:text-zinc-600 shrink-0 hidden sm:block" />;
}

function DiagramNode({ label, tone = "neutral", children, className = "" }) {
  const toneStyles = {
    neutral: "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950",
    dark: "border-zinc-800 dark:border-zinc-700 bg-zinc-950 text-white",
    blue: "border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30"
  };

  return (
    <div className={`rounded-2xl border p-4 md:p-5 min-w-0 flex-1 ${toneStyles[tone]} ${className}`}>
      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function MiniInputVisual() {
  return (
    <div className="space-y-2">
      <div className="h-2.5 w-20 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-2.5 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function MiniOutputVisual({ tone = "neutral" }) {
  const toneStyles = {
    neutral: {
      badge: "bg-zinc-900 dark:bg-zinc-100",
      line: "bg-zinc-200 dark:bg-zinc-800"
    },
    rose: {
      badge: "bg-rose-500 dark:bg-rose-400",
      line: "bg-rose-100 dark:bg-rose-950/60"
    },
    blue: {
      badge: "bg-blue-600 dark:bg-blue-400",
      line: "bg-blue-100 dark:bg-blue-950/60"
    }
  };
  const styles = toneStyles[tone];

  return (
    <div className="space-y-2">
      <div className={`h-7 w-20 rounded-full ${styles.badge}`} />
      <div className={`h-2.5 w-full rounded-full ${styles.line}`} />
      <div className={`h-2.5 w-3/4 rounded-full ${styles.line}`} />
    </div>
  );
}

function BlackBoxCore() {
  return (
    <div className="relative flex h-[7rem] items-center justify-center overflow-hidden rounded-[1.2rem] bg-zinc-950 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_0,transparent_58%)]" />
      <div className="absolute inset-0 grid grid-cols-4 gap-2 p-4 opacity-35 blur-[1px]">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} className="h-3 w-3 rounded-full bg-zinc-400/70" />
        ))}
      </div>
      <div className="relative z-10 rounded-full border border-white/15 bg-white/5 p-3">
        <EyeOff className="h-8 w-8 text-zinc-200" />
      </div>
    </div>
  );
}

function ComparisonCard({ eyebrow, title, sentence, chips, diagram, tone = "neutral" }) {
  const toneStyles = {
    neutral: "border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50",
    blue: "border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/25",
    rose: "border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/20"
  };

  return (
    <div className={`rounded-[1.6rem] border p-6 md:p-7 h-full ${toneStyles[tone]}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{title}</h3>
      <div className="mt-6">{diagram}</div>
      <p className="mt-6 text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">{sentence}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {chips.map((chip) => (
          <StoryChip key={chip} tone={tone}>
            {chip}
          </StoryChip>
        ))}
      </div>
    </div>
  );
}

function ScenarioCard({ label, diagram, tone = "neutral" }) {
  const toneStyles = {
    neutral: "border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50",
    blue: "border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/25",
    rose: "border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/20"
  };

  return (
    <div className={`rounded-[1.4rem] border p-4 md:p-5 h-full ${toneStyles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="mt-3">{diagram}</div>
    </div>
  );
}

function PatientNoteCard({ label, detail, text }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3.5 md:p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{label}</p>
        {detail && <p className="text-xs text-zinc-500 dark:text-zinc-400">{detail}</p>}
      </div>
      <p className="mt-2.5 text-sm md:text-base leading-relaxed text-zinc-800 dark:text-zinc-200">"{text}"</p>
    </div>
  );
}

function OutputBadge({ label, tone = "neutral" }) {
  const toneStyles = {
    neutral: "border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200",
    rose: "border-rose-200 dark:border-rose-800 bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200",
    blue: "border-blue-200 dark:border-blue-800 bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200"
  };

  return <div className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${toneStyles[tone]}`}>{label}</div>;
}

function ScenarioOutputCard({ label, value, tone = "neutral", text }) {
  const toneStyles = {
    neutral: "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950",
    rose: "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30",
    blue: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30"
  };

  return (
    <div className={`rounded-2xl border p-3.5 md:p-4 ${toneStyles[tone]}`}>
      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="mt-3">
        <OutputBadge tone={tone} label={value} />
      </div>
      {text && <p className="mt-2.5 text-xs md:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{text}</p>}
    </div>
  );
}

function DiagnosisBlackBoxDiagram({ label, text, outputLabel }) {
  return (
    <div className="space-y-3">
      <PatientNoteCard label="Input" detail={label} text={text} />
      <div className="grid sm:grid-cols-[0.95fr_auto_1.05fr] gap-3 items-stretch sm:items-center">
        <div className="rounded-2xl border border-zinc-800 dark:border-zinc-700 bg-zinc-950 text-white p-3.5 md:p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Model reasoning</p>
          <div className="mt-3">
            <BlackBoxCore />
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-zinc-400 dark:text-zinc-600 shrink-0 hidden sm:block" />
        <div>
          <ScenarioOutputCard
            label="Output"
            value={outputLabel}
            tone="rose"
            text="The decision is visible, but what drove it is not."
          />
        </div>
      </div>
    </div>
  );
}

function ConceptBar({ label, value, tone = "blue" }) {
  const toneStyles = {
    blue: "bg-blue-600 dark:bg-blue-400",
    neutral: "bg-zinc-900 dark:bg-zinc-200"
  };

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div className={`h-full rounded-full ${toneStyles[tone]}`} style={{ width: value }} />
      </div>
    </div>
  );
}

function DiagnosisInterventionDiagram({ label, text, outputLabel }) {
  return (
    <div className="space-y-3">
      <PatientNoteCard label="Input" detail={label} text={text} />
      <div className="grid sm:grid-cols-[1.15fr_auto_0.9fr] gap-3 items-stretch sm:items-center">
        <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 md:p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Concept bottleneck</p>
          <div className="mt-2.5 space-y-2.5">
            <ConceptBar label="Chest pain" value="84%" />
            <ConceptBar label="Breathing difficulty" value="79%" />
            <ConceptBar label="Urgency" value="72%" />
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-blue-950/50 px-3 py-1.5 text-xs font-medium text-blue-800 dark:text-blue-200">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Increase critical concepts
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-zinc-400 dark:text-zinc-600 shrink-0 hidden sm:block" />
        <div>
          <ScenarioOutputCard
            label="Output"
            value={outputLabel}
            tone="blue"
            text="The concepts are visible, so the decision can be inspected and steered."
          />
        </div>
      </div>
    </div>
  );
}

function WorkflowPanel({ eyebrow, title, caption, children }) {
  return (
    <div className="rounded-[1.6rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 md:p-6 h-full shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">{eyebrow}</p>
      <h3 className="mt-3 text-xl md:text-[1.45rem] font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{title}</h3>
      <div className="mt-5">{children}</div>
      <p className="mt-5 text-sm md:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{caption}</p>
    </div>
  );
}

function ProductScreenshotVisual() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3">
      <img
        src={cbllmImage}
        alt="CB-LLM interface screenshot"
        className="w-full h-auto rounded-[1rem] bg-white"
      />
    </div>
  );
}

function CapabilityEvidence({ id, label, caption }) {
  const visual = {
    baseline: <ProductScreenshotVisual />,
    edit: <EditWorkflowVisual />,
    compare: <CompareWorkflowVisual />
  }[id] ?? <BaselineWorkflowVisual />;

  return (
    <div className="mt-5 rounded-[1.4rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="mt-4">{visual}</div>
      <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{caption}</p>
    </div>
  );
}

function InsightCard({ title, context, intervention, outcome, takeaway }) {
  return (
    <div className="rounded-[1.6rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-7 shadow-sm">
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{title}</h3>
      <div className="mt-5 space-y-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p><span className="font-semibold text-zinc-950 dark:text-zinc-100">Context:</span> {context}</p>
        <p><span className="font-semibold text-zinc-950 dark:text-zinc-100">Intervention:</span> {intervention}</p>
        <p><span className="font-semibold text-zinc-950 dark:text-zinc-100">Observed outcome:</span> {outcome}</p>
        <p><span className="font-semibold text-zinc-950 dark:text-zinc-100">Takeaway:</span> {takeaway}</p>
      </div>
    </div>
  );
}

function ContributionColumn({ label, items, tone = "neutral" }) {
  const toneStyles = {
    neutral: "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
    blue: "border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/25"
  };

  return (
    <div className={`rounded-[1.6rem] border p-6 md:p-7 ${toneStyles[tone]}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{label}</p>
      <ul className="mt-5 space-y-3 list-disc pl-5">
        {items.map((item) => (
          <li key={item} className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DemoStepCard({ index, title, text }) {
  return (
    <div className="rounded-[1.6rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 md:p-6 shadow-sm">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">{index}</div>
      <h3 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{text}</p>
    </div>
  );
}

function SmallPill({ children, tone = "neutral" }) {
  const toneStyles = {
    neutral: "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-300",
    blue: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-200"
  };

  return <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${toneStyles[tone]}`}>{children}</span>;
}

function BaselineWorkflowVisual() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        <SmallPill>Task: Classification</SmallPill>
        <SmallPill>Model: CB-LLM</SmallPill>
        <SmallPill>Example: Dataset row</SmallPill>
      </div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
        <MiniInputVisual />
      </div>
      <div className="grid sm:grid-cols-[1.2fr_0.8fr] gap-3">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Top concepts</p>
          <div className="mt-3 space-y-3">
            <ConceptBar label="Urgency" value="72%" tone="neutral" />
            <ConceptBar label="Risk" value="64%" tone="neutral" />
            <ConceptBar label="Symptoms" value="58%" tone="neutral" />
          </div>
        </div>
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Baseline output</p>
          <div className="mt-3">
            <OutputBadge tone="blue" label="Predicted class" />
          </div>
          <div className="mt-4 space-y-2">
            <ConceptBar label="Confidence" value="81%" />
            <ConceptBar label="Concept coverage" value="67%" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderRow({ label, baseline, edited, changed = false }) {
  return (
    <div className={`rounded-xl border p-3 ${changed ? "border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30" : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950"}`}>
      <div className="flex items-center justify-between gap-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        <span>{label}</span>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">{baseline}</span>
          <ArrowRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" />
          <span className={changed ? "text-blue-700 dark:text-blue-200" : "text-zinc-500 dark:text-zinc-400"}>{edited}</span>
        </div>
      </div>
      <div className="mt-3 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div className={`relative h-full rounded-full ${changed ? "bg-blue-600 dark:bg-blue-400" : "bg-zinc-500 dark:bg-zinc-400"}`} style={{ width: edited }}>
          {changed && <span className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-white bg-blue-500 dark:bg-blue-300" />}
        </div>
      </div>
    </div>
  );
}

function EditWorkflowVisual() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <SmallPill tone="blue">Editable concepts</SmallPill>
        <SmallPill>Reset</SmallPill>
      </div>
      <SliderRow label="Urgency" baseline="72%" edited="88%" changed />
      <SliderRow label="Respiratory concern" baseline="61%" edited="79%" changed />
      <SliderRow label="General fatigue" baseline="44%" edited="44%" />
      <div className="pt-2 flex flex-wrap gap-2">
        <SmallPill tone="blue">2 concepts changed</SmallPill>
        <SmallPill>Baseline preserved</SmallPill>
      </div>
    </div>
  );
}

function CompareWorkflowVisual() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-4 space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Baseline</p>
          <div className="mt-3">
            <OutputBadge label="Low-risk label" />
          </div>
          <div className="mt-4 space-y-2">
            <ConceptBar label="Confidence" value="81%" tone="neutral" />
          </div>
        </div>
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Intervened</p>
          <div className="mt-3">
            <OutputBadge tone="blue" label="Escalate for review" />
          </div>
          <div className="mt-4 space-y-2">
            <ConceptBar label="Confidence" value="74%" />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">What changed</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <SmallPill tone="blue">Urgency +16%</SmallPill>
          <SmallPill tone="blue">Respiratory concern +18%</SmallPill>
          <SmallPill>Output shifted</SmallPill>
        </div>
      </div>
    </div>
  );
}

function InterventionMeaningStrip({ heading, text }) {
  return (
    <div className="rounded-[1.6rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-7 shadow-sm">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-center">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-900/60 p-4 md:p-5">
          <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Natural value</p>
              <div className="mt-3 space-y-3">
                <ConceptBar label="Urgency" value="72%" tone="neutral" />
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-zinc-400 dark:text-zinc-600 hidden sm:block" />
            <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Edited value</p>
              <div className="mt-3 space-y-3">
                <ConceptBar label="Urgency" value="88%" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">{heading}</p>
          <p className="mt-3 text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

function TechnicalMarkdown({ children }) {
  return (
    <div className="max-w-none text-[1.02rem] leading-8 text-zinc-700 dark:text-zinc-300">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="my-4">{children}</p>,
          h3: ({ children }) => (
            <h3 className="mt-8 mb-3 text-xl md:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-6 mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{children}</h4>
          ),
          ul: ({ children }) => <ul className="my-4 space-y-2 list-disc pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="my-4 space-y-2 list-decimal pl-6">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-zinc-950 dark:text-zinc-100">{children}</strong>,
          code: ({ inline, children }) =>
            inline ? (
              <code className="rounded bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 text-[0.95em] text-zinc-900 dark:text-zinc-100">{children}</code>
            ) : (
              <code className="block overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100">
                {children}
              </code>
            ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 rounded-r-xl border-l-4 border-blue-500 bg-blue-50/70 dark:bg-blue-950/20 px-5 py-3 text-zinc-700 dark:text-zinc-300">
              {children}
            </blockquote>
          )
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

function TechnicalSchematic({ children }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 px-4 py-3 overflow-x-auto">
      <div className="min-w-max font-mono text-sm text-zinc-700 dark:text-zinc-300">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {children}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function TechnicalAccordionItem({ title, summary, body, schematic, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[1.4rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full px-5 md:px-6 py-5 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{title}</h3>
            <p className="mt-2 text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">{summary}</p>
          </div>
          <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-300 shrink-0">
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </span>
        </div>
      </button>

      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="px-5 md:px-6 pb-6">
            {schematic && (
              <div className="mb-6">
                <TechnicalSchematic>{schematic}</TechnicalSchematic>
              </div>
            )}
            <div className="rounded-[1.2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 px-5 md:px-6 py-4 md:py-5">
              <TechnicalMarkdown>{body}</TechnicalMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaperReference({ label, title, href }) {
  const isInternal = href?.startsWith("#");
  return (
    <a
      href={href}
      target={isInternal ? undefined : "_blank"}
      rel={isInternal ? undefined : "noreferrer"}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 text-sm md:text-base text-zinc-700 dark:text-zinc-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
    >
      <span className="font-medium">{label}:</span>
      <span>{title}</span>
      {!isInternal && <ExternalLink className="h-4 w-4" />}
    </a>
  );
}

function ArchitectureCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 md:p-6 h-full">
      <h4 className="text-lg md:text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{title}</h4>
      <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{text}</p>
    </div>
  );
}

function TrainingStage({ index, title, caption }) {
  return (
    <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm">
      <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-semibold">{index}</div>
      <h4 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-zinc-100">{title}</h4>
      <p className="mt-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{caption}</p>
    </div>
  );
}

function ClassificationPipelineDiagram({ stages }) {
  return (
    <div className="rounded-[1.6rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-5 md:p-6">
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div key={stage.title} className="space-y-3">
            <TrainingStage index={index + 1} title={stage.title} caption={stage.caption} />
            {index < stages.length - 1 && <div className="flex justify-center"><ArrowRight className="h-5 w-5 rotate-90 text-zinc-400 dark:text-zinc-600" /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TechnicalCard({ title, text, visual, tone = "neutral" }) {
  const toneStyles = {
    neutral: "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
    blue: "border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/25"
  };

  return (
    <div className={`rounded-[1.4rem] border p-5 md:p-6 ${toneStyles[tone]}`}>
      <h4 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{title}</h4>
      {visual && <div className="mt-4">{visual}</div>}
      <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">{text}</p>
    </div>
  );
}

function ClassificationInferenceVisual() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-900/60 p-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <DiagramNode label="Input text">
          <MiniInputVisual />
        </DiagramNode>
        <DiagramArrow />
        <DiagramNode label="Concept bottleneck" tone="blue" className="md:flex-[1.2]">
          <div className="space-y-3">
            <ConceptBar label="Concept 1" value="71%" />
            <ConceptBar label="Concept 2" value="58%" />
            <ConceptBar label="Concept 3" value="66%" />
          </div>
        </DiagramNode>
        <DiagramArrow />
        <DiagramNode label="Sparse head + class">
          <MiniOutputVisual tone="blue" />
        </DiagramNode>
      </div>
    </div>
  );
}

function ClassificationInterventionVisual() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-900/60 p-4 space-y-4">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Intervened concept</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">overpriced</span>
          <SmallPill tone="blue">deactivated</SmallPill>
        </div>
      </div>
      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Before</p>
          <div className="mt-3">
            <OutputBadge label="Negative" tone="neutral" />
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-zinc-400 dark:text-zinc-600 hidden sm:block" />
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">After</p>
          <div className="mt-3">
            <OutputBadge label="Positive" tone="blue" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CalloutCard({ children }) {
  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/25 p-5 md:p-6">
      <p className="text-sm md:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</p>
    </div>
  );
}

function GenerationArchitectureDiagram() {
  return (
    <div className="rounded-[1.6rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-5 md:p-6 space-y-4">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Prompt / prefix</p>
        <div className="mt-3">
          <MiniInputVisual />
        </div>
      </div>
      <div className="flex justify-center"><ArrowRight className="h-5 w-5 rotate-90 text-zinc-400 dark:text-zinc-600" /></div>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Backbone hidden state</p>
        <div className="mt-3 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">CBL branch</p>
          <div className="mt-3 space-y-3">
            <ConceptBar label="Concept 1" value="64%" />
            <ConceptBar label="Concept 2" value="81%" />
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Unsupervised branch</p>
            <SmallPill tone="blue">training only detector</SmallPill>
          </div>
          <div className="mt-3 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
      <div className="flex justify-center"><ArrowRight className="h-5 w-5 rotate-90 text-zinc-400 dark:text-zinc-600" /></div>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Concatenate to final layer to next token</p>
        <div className="mt-3">
          <MiniOutputVisual tone="blue" />
        </div>
      </div>
    </div>
  );
}

function ObjectiveTile({ title, text }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm h-full">
      <h4 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">{title}</h4>
      <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{text}</p>
    </div>
  );
}

export default function ProjectBodySection({ data }) {
  if (!data) return null;

  return (
    <>
      <section id="project" className="py-14 md:py-16 scroll-mt-28">
        <div className="w-full max-w-[82rem] mx-auto px-6 md:px-8">
          <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-6 md:p-8 lg:p-10 shadow-sm">
          <FadeInSection>
            <div className="max-w-3xl">
              <p className="text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-blue-700 dark:text-blue-300">
                {data.story.eyebrow}
              </p>
              <h2 className="mt-3 text-[1.9rem] md:text-[2.2rem] lg:text-[2.5rem] font-semibold tracking-tight leading-[1.08] text-zinc-950 dark:text-white">
                {data.story.lead}
              </h2>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-2xl">
                {data.story.support}
              </p>
              {data.story.credit && (
                <p className="mt-4 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                  {data.story.credit.text}{" "}
                  <a href={data.story.credit.href} className="text-blue-700 dark:text-blue-300 hover:underline">
                    See references
                  </a>
                  .
                </p>
              )}
            </div>
          </FadeInSection>

          <FadeInSection delay={220}>
            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {data.story.scenario.heading}
              </h3>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-3xl">
                {data.story.scenario.intro}
              </p>
            </div>
          </FadeInSection>

          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <FadeInSection delay={320}>
              <ScenarioCard
                label="Traditional black-box"
                tone="rose"
                diagram={
                  <DiagnosisBlackBoxDiagram
                    label={data.story.scenario.inputLabel}
                    text={data.story.scenario.inputExample}
                    outputLabel={data.story.scenario.blackBox.outputLabel}
                  />
                }
              />
            </FadeInSection>

            <FadeInSection delay={380}>
              <ScenarioCard
                label="CB-LLM with concept intervention"
                tone="blue"
                diagram={
                  <DiagnosisInterventionDiagram
                    label={data.story.scenario.inputLabel}
                    text={data.story.scenario.inputExample}
                    outputLabel={data.story.scenario.intervention.outputLabel}
                  />
                }
              />
            </FadeInSection>
          </div>
          </div>
        </div>
      </section>

      <section id="results" className="py-16 md:py-20 bg-zinc-50/60 dark:bg-zinc-900/40 scroll-mt-28">
        <div className="max-w-[82rem] mx-auto px-6 md:px-8">
          <FadeInSection>
            <div className="max-w-4xl">
              <p className="text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-blue-700 dark:text-blue-300">
                {data.results.eyebrow}
              </p>
              <h2 className="mt-4 text-[2rem] md:text-[2.4rem] lg:text-[2.7rem] font-semibold tracking-tight leading-[1.08] text-zinc-950 dark:text-white">
                {data.results.lead}
              </h2>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-3xl">
                {data.results.support}
              </p>
            </div>
          </FadeInSection>

          <div className="max-w-5xl mt-10 space-y-6">
            <FadeInSection delay={100}>
              <WorkflowPanel
                eyebrow={data.results.workflow[0].eyebrow}
                title={data.results.workflow[0].title}
                caption={data.results.workflow[0].text}
              >
                <CapabilityEvidence
                  id={data.results.workflow[0].id}
                  label="UI snapshot"
                  caption={data.results.workflow[0].evidenceCaption}
                />
              </WorkflowPanel>
            </FadeInSection>

            <FadeInSection delay={160}>
              <WorkflowPanel
                eyebrow={data.results.workflow[1].eyebrow}
                title={data.results.workflow[1].title}
                caption={data.results.workflow[1].text}
              >
                <CapabilityEvidence
                  id={data.results.workflow[1].id}
                  label="UI snapshot"
                  caption={data.results.workflow[1].evidenceCaption}
                />
              </WorkflowPanel>
            </FadeInSection>

            <FadeInSection delay={220}>
              <WorkflowPanel
                eyebrow={data.results.workflow[2].eyebrow}
                title={data.results.workflow[2].title}
                caption={data.results.workflow[2].text}
              >
                <CapabilityEvidence
                  id={data.results.workflow[2].id}
                  label="UI snapshot"
                  caption={data.results.workflow[2].evidenceCaption}
                />
              </WorkflowPanel>
            </FadeInSection>
          </div>

          <FadeInSection delay={280}>
            <div className="grid lg:grid-cols-2 gap-6 mt-12">
              <ContributionColumn
                label={data.results.capabilitiesHeading}
                items={data.results.capabilityBullets}
                tone="blue"
              />
              <ContributionColumn
                label={data.results.insightsHeading}
                items={data.results.insightBullets}
              />
            </div>
          </FadeInSection>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-20 scroll-mt-28">
        <div className="max-w-[82rem] mx-auto px-6 md:px-8">
          <FadeInSection>
            <SectionTitleBlock
              title={data.howItWorks.title}
              support={data.howItWorks.support}
              maxWidth="max-w-6xl"
            />
          </FadeInSection>

          <FadeInSection delay={80}>
            <div className="mt-10">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {data.howItWorks.software.heading}
              </h3>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-5xl">
                {data.howItWorks.software.intro}
              </p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-5 mt-6">
            {data.howItWorks.software.layers.map((layer, index) => (
              <FadeInSection key={layer.title} delay={120 + index * 60}>
                <ArchitectureCard title={layer.title} text={layer.text} />
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={320}>
            <div className="mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-5 md:p-6">
              <h4 className="text-lg md:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {data.howItWorks.software.flowHeading}
              </h4>
              <ol className="mt-4 list-decimal pl-6 space-y-2">
                {data.howItWorks.software.flowSteps.map((step) => (
                  <li key={step} className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{step}</li>
                ))}
              </ol>
            </div>
          </FadeInSection>

          <FadeInSection delay={380}>
            <div className="mt-12">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {data.howItWorks.ml.heading}
              </h3>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-5xl">
                {data.howItWorks.ml.intro}
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={440}>
            <div className="mt-6">
              <PaperReference
                label={data.howItWorks.reference.label}
                title={data.howItWorks.reference.title}
                href={data.howItWorks.reference.href}
              />
            </div>
          </FadeInSection>

          <FadeInSection delay={500}>
            <div className="mt-8">
              <div className="max-w-4xl mx-auto rounded-[1.8rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 md:p-6 shadow-sm">
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 text-center">
                  {data.howItWorks.diagram.title}
                </h3>
                <p className="mt-3 text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 text-center max-w-3xl mx-auto">
                  {data.howItWorks.diagram.caption}
                </p>

                <div className="mt-6 rounded-[1.2rem] border border-zinc-200 bg-white p-3 md:p-4">
                  <img
                    src={cbllmImage}
                    alt={data.howItWorks.diagram.title}
                    className="w-full h-auto rounded-lg bg-white"
                  />
                </div>

                <p className="mt-4 text-sm md:text-base leading-relaxed text-zinc-500 dark:text-zinc-400 text-center">
                  Reference:{" "}
                  <a
                    href={data.howItWorks.reference.href}
                    className="text-blue-700 dark:text-blue-300 hover:underline"
                  >
                    Sun, Chung-En; Oikarinen, Tuomas; Ustun, Berk; Weng, Tsui-Wei (2025), {data.howItWorks.reference.title}
                  </a>
                </p>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={560}>
            <div className="mt-10 max-w-4xl mx-auto space-y-5">
              {data.howItWorks.sections.map((section) => (
                <TechnicalAccordionItem
                  key={section.id}
                  title={section.title}
                  summary={section.summary}
                  body={section.body}
                  schematic={section.schematic}
                  defaultOpen={section.defaultOpen}
                />
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {data.conclusion && (
        <section id="conclusion" className="py-16 md:py-20 bg-zinc-50/60 dark:bg-zinc-900/40 scroll-mt-28">
          <div className="max-w-5xl mx-auto px-6">
            <FadeInSection>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3">
                {data.conclusion.heading}
              </h2>
              <div className="h-1 w-12 rounded-full bg-blue-600 mb-8" />
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-4xl">
                {data.conclusion.intro}
              </p>
            </FadeInSection>

            <FadeInSection delay={120}>
              <div className="mt-10 rounded-[1.6rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-7">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {data.conclusion.scopeHeading}
                </h3>

                <ul className="mt-6 list-disc pl-6 space-y-3">
                  {data.conclusion.scopeItems.map((item) => (
                    <li key={item.title} className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.title}:</span> {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInSection>

          </div>
        </section>
      )}
    </>
  );
}
