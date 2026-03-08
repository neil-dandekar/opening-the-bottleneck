import { Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import siteContent from "@/config/siteContent";

const NAV_ITEMS = [
  { label: "Top", href: "#top" },
  { label: "Problem", href: "#project" },
  { label: "Results", href: "#results" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Conclusion", href: "#conclusion" },
  { label: "References", href: "#references" }
];

export default function TopNav() {
  const effectiveToolLink = siteContent.toolLink ?? siteContent.demoLink;
  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.href.replace("#", "")), []);
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const [bubbleStyle, setBubbleStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const linkRefs = useRef({});
  const navTrackRef = useRef(null);

  useEffect(() => {
    const getActiveSection = () => {
      const currentY = window.scrollY + window.innerHeight * 0.35;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;
        if (currentY >= section.offsetTop) current = id;
      }

      return current;
    };

    let frame = null;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        setActiveId(getActiveSection());
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  useEffect(() => {
    const activeLink = linkRefs.current[activeId];
    const navTrack = navTrackRef.current;
    if (!activeLink || !navTrack) return;

    const updateBubble = () => {
      setBubbleStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        opacity: 1
      });
    };

    updateBubble();
    window.addEventListener("resize", updateBubble);
    navTrack.addEventListener("scroll", updateBubble, { passive: true });
    return () => {
      window.removeEventListener("resize", updateBubble);
      navTrack.removeEventListener("scroll", updateBubble);
    };
  }, [activeId]);

  return (
    <nav className="fixed top-4 inset-x-0 z-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3">
        <div
          ref={navTrackRef}
          className="relative flex items-center justify-start sm:justify-center gap-1 md:gap-2 rounded-full border border-zinc-200/80 dark:border-zinc-700/80 bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md shadow-lg px-2 py-1.5 w-full overflow-x-auto"
        >
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-700/70 transition-all duration-300 ease-out"
            style={{
              left: `${bubbleStyle.left}px`,
              width: `${bubbleStyle.width}px`,
              opacity: bubbleStyle.opacity
            }}
          />
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              ref={(element) => {
                linkRefs.current[item.href.replace("#", "")] = element;
              }}
              className={`relative z-10 px-2.5 md:px-3 py-1.5 text-[11px] md:text-sm rounded-full transition-colors whitespace-nowrap ${
                activeId === item.href.replace("#", "")
                  ? "text-blue-800 dark:text-blue-100"
                  : "text-zinc-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-300"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
          <a
            href={effectiveToolLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs md:text-sm font-medium shadow-lg shadow-blue-600/20 transition-colors"
          >
            <Play className="h-3.5 w-3.5" />
            Tool
          </a>
        </div>
      </div>
    </nav>
  );
}
