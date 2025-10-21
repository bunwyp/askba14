import React, { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCheck, NotebookText, Timer, BookMarked, Calculator, Sun, Moon } from "lucide-react";
import GPACalculator from "./GPACalculator";
import CalendarToDo from "./CalendarToDo";
import Flashcards from "./Flashcards";

/**
 * BA14 Grid — Apple × Swiss blend
 * - One-tap EN/粵 language toggle in unified pill control
 * - One-tap Light/Dark mode with Sun/Moon icon
 * - System preference on first load, localStorage persistence
 * - Strict grid (3×2), Apple-style cards, Swiss left/bottom alignment
 * - Responsive (1/2/3 cols), ≥44px hit targets, WCAG AA
 */

// ---- Theme hook -------------------------------------------------------------
function useTheme() {
  const getDefault = () => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };
  const [theme, setTheme] = useState(getDefault);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "light") root.classList.remove("dark");
    else {
      // system
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = () => root.classList.toggle("dark", mql.matches);
      apply();
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme] as const;
}

// ---- Language hook ----------------------------------------------------------
function useLang() {
  const [lang, setLang] = useState<string>(() => localStorage.getItem("lang") || "EN");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);
  return [lang, setLang] as const;
}

// ---- i18n -------------------------------------------------------------------
const STR = {
  EN: {
    home: "Home",
    ba14: "BA14",
    gpa: "GPA Calculator",
    cal: "Calendar + To-Do",
    anki: "Flashcards",
    focus: "Focus Timer",
    notes: "Notes / Outline",
    habit: "Habit & Streaks",
    langAria: "Current language EN. Click to switch to 粵.",
    themeAria: (dark: boolean) => dark ? "Switch to light mode" : "Switch to dark mode",
  },
  粵: {
    home: "主頁",
    ba14: "BA14",
    gpa: "GPA計算器",
    cal: "行事曆＋待辦",
    anki: "記憶卡",
    focus: "專注計時",
    notes: "筆記／大綱",
    habit: "習慣連勝",
    langAria: "目前語言：粵語。撳一下轉英文。",
    themeAria: (dark: boolean) => dark ? "轉去光模式" : "轉去暗模式",
  },
} as const;

// ---- Card component ---------------------------------------------------------
function Tile({
  title,
  icon,
  accent,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[5/4] rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_1px_rgba(0,0,0,0.6),0_10px_30px_rgba(0,0,0,0.45)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_2px_2px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)] active:-translate-y-px focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0B0B0D] p-4 sm:p-6 w-full text-left touch-manipulation"
      style={{ 
        borderColor: `color-mix(in srgb, ${accent} 0%, currentColor)`,
      }}
      aria-label={title}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `color-mix(in srgb, ${accent} 15%, currentColor)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
      }}
    >
      {/* Accent diagonal wedge (top-right) */}
      <span
        className="absolute right-0 top-0 h-16 w-24 sm:h-24 sm:w-40"
        style={{ 
          background: accent,
          clipPath: "polygon(100% 0, 0 0, 100% 100%)"
        }}
        aria-hidden="true"
      />

      {/* Icon (top-left, SF Symbols style, 2px stroke) */}
      <div 
        className="absolute left-4 top-4 sm:left-6 sm:top-6" 
        style={{ color: accent }} 
        aria-hidden="true"
      >
        <div className="scale-90 sm:scale-100 md:scale-110">
          {icon}
        </div>
      </div>

      {/* Title (bottom-left, SF Pro Semibold 18-20px, tracking -1) */}
      <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 text-base sm:text-lg md:text-[21px] font-semibold tracking-[-0.01em] leading-tight text-[#1D1D1F] dark:text-white">
        {title}
      </div>

      {/* Chevron (bottom-right, 30-50% opacity) */}
      <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 text-xl sm:text-2xl text-[#1D1D1F]/30 dark:text-white/30 group-hover:text-[#1D1D1F]/50 dark:group-hover:text-white/50 transition-opacity duration-150">
        ›
      </div>
    </button>
  );
}

// ---- Unified control pill (one-tap language + theme) -----------------------
function ControlPill({ 
  lang, 
  onLangToggle, 
  theme, 
  onThemeToggle,
  langAria,
  themeAria
}: { 
  lang: string; 
  onLangToggle: () => void; 
  theme: string;
  onThemeToggle: () => void;
  langAria: string;
  themeAria: string;
}) {
  const isDark = useMemo(() => 
    theme === "system" 
      ? document.documentElement.classList.contains("dark") 
      : theme === "dark", 
    [theme]
  );

  return (
    <div className="inline-flex items-center gap-0 rounded-full border border-black/10 dark:border-white/20 bg-white dark:bg-[#1C1C1E] shadow-[0_1px_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
      {/* Language toggle */}
      <button
        onClick={onLangToggle}
        className="min-w-[44px] min-h-[44px] px-4 text-[15px] font-medium text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-l-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 focus:ring-inset"
        aria-label={langAria}
      >
        {lang}
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-black/10 dark:bg-white/20" aria-hidden="true" />

      {/* Theme toggle */}
      <button
        onClick={onThemeToggle}
        className="min-w-[44px] min-h-[44px] px-3 inline-flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 rounded-r-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 focus:ring-inset"
        aria-label={themeAria}
      >
        {isDark ? <Sun size={18} className="text-[#1D1D1F] dark:text-white" /> : <Moon size={18} className="text-[#1D1D1F] dark:text-white" />}
      </button>
    </div>
  );
}

// ---- Page -------------------------------------------------------------------
export default function BA14GridPage() {
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();
  const [showGPA, setShowGPA] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLeavingPage, setIsLeavingPage] = useState(false);
  
  const t = (k: keyof typeof STR["EN"]) => {
    const str = lang === "EN" ? STR.EN[k] : (STR as any)["粵"][k];
    return typeof str === "function" ? str : str;
  };

  const isDark = useMemo(() => 
    theme === "system" 
      ? document.documentElement.classList.contains("dark") 
      : theme === "dark", 
    [theme]
  );

  const toggleLang = () => setLang(lang === "EN" ? "粵" : "EN");
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const handleOpenGPA = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowGPA(true);
      setIsTransitioning(false);
    }, 150);
  };

  const handleOpenCalendar = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowCalendar(true);
      setIsTransitioning(false);
    }, 150);
  };

  const handleOpenFlashcards = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowFlashcards(true);
      setIsTransitioning(false);
    }, 150);
  };

  const handleBackToLanding = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLeavingPage(true);
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 300);
  };

  const tiles = [
    { key: "gpa", icon: <Calculator strokeWidth={2} />, accent: "#0A84FF", onClick: handleOpenGPA },
    { key: "cal", icon: <Calendar strokeWidth={2} />, accent: "#FF9F0A", onClick: handleOpenCalendar },
    { key: "anki", icon: <BookMarked strokeWidth={2} />, accent: "#FFD60A", onClick: handleOpenFlashcards },
  ];

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0B0B0D] dark:text-white transition-colors duration-200">
      {/* Page Transition Overlay */}
      {isLeavingPage && (
        <div className="fixed inset-0 bg-white dark:bg-[#0B0B0D] z-50 animate-fadeIn" />
      )}

      {/* Header */}
      <header className={`sticky top-0 z-10 bg-white/80 dark:bg-[#0B0B0D]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 transition-all duration-300 ${isTransitioning || isLeavingPage ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
          {/* Left: clickable BA14 label */}
          <a href="/index.html" onClick={handleBackToLanding} className="min-w-0 group touch-manipulation">
            <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#86868B] dark:text-white/60 group-hover:text-[#1D1D1F] dark:group-hover:text-white transition-colors">BA14</div>
          </a>

          {/* Right: unified control pill */}
          <div className="flex items-center gap-3">
            <ControlPill 
              lang={lang}
              onLangToggle={toggleLang}
              theme={theme}
              onThemeToggle={toggleTheme}
              langAria={t("langAria")}
              themeAria={t("themeAria")(isDark)}
            />
          </div>
        </div>
      </header>

      {/* Grid */}
      <section className={`mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 transition-all duration-300 ${isTransitioning || isLeavingPage ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {tiles.map(({ key, icon, accent, onClick }) => (
          <Tile key={key} title={t(key as any)} icon={icon} accent={accent} onClick={onClick} />
        ))}
      </section>

      {/* GPA Calculator Modal */}
      {showGPA && <GPACalculator theme={theme} lang={lang} onClose={() => setShowGPA(false)} />}
      
      {/* Calendar + To-Do Modal */}
      {showCalendar && <CalendarToDo theme={theme} lang={lang} onClose={() => setShowCalendar(false)} />}
      
      {/* Flashcards Modal */}
      {showFlashcards && <Flashcards theme={theme} lang={lang} onClose={() => setShowFlashcards(false)} />}
    </main>
  );
}
