import { useEffect, useState } from "react";
import BackToTopButton from "@/components/research/BackToTopButton";
import FooterSection from "@/components/research/FooterSection";
import HeroSection from "@/components/research/HeroSection";
import ProjectBodySection from "@/components/research/ProjectBodySection";
import ReferencesSection from "@/components/research/ReferencesSection";
import ScrollProgressBar from "@/components/research/ScrollProgressBar";
import ThemeToggle from "@/components/research/ThemeToggle";
import TopNav from "@/components/research/TopNav";
import siteContent from "@/config/siteContent";

export default function Home() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-zinc-950" : "bg-white"}`}>
      <ScrollProgressBar />
      <TopNav />
      <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
      <BackToTopButton />

      <HeroSection content={siteContent} />

      <div className="max-w-5xl mx-auto px-6">
        <hr className="border-zinc-200 dark:border-zinc-800" />
      </div>

      <ProjectBodySection data={siteContent.body} />
      <ReferencesSection data={siteContent.references} />
      <FooterSection data={siteContent.footer} />
    </div>
  );
}
