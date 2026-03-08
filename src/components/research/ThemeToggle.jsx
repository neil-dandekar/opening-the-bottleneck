import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle({ dark, onToggle }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="fixed top-[4.25rem] right-4 sm:top-5 sm:right-5 z-50 !rounded-full !h-11 !w-11 p-0 aspect-square backdrop-blur-md bg-white/70 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 shadow-lg hover:scale-105 transition-transform"
    >
      {dark ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </Button>
  );
}
