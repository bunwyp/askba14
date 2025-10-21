import React, { useState } from "react";
import Header from "./Header";

const TILES = [
  { en: "GPA Calculator", yue: "功績點計算", color: "#1F6FEB", icon: "calculate" },
  { en: "Calendar + To-Do", yue: "行事曆＋待辦", color: "#F9413A", icon: "calendar" },
  { en: "Anki Flashcards", yue: "Anki 記憶卡", color: "#FFCE00", icon: "cards" },
  { en: "Focus Timer", yue: "專注計時", color: "#00A884", icon: "timer" },
  { en: "Notes / Outline", yue: "筆記／大綱", color: "#6D28D9", icon: "notes" },
  { en: "Habit & Streaks", yue: "習慣連勝", color: "#F97316", icon: "check" },
];

function TileIcon({ type, className }) {
  const icons = {
    calculate: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6M9 15h6"/>
      </svg>
    ),
    calendar: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    cards: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z"/>
        <path d="M8 4v16M16 4v16"/>
      </svg>
    ),
    timer: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    notes: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
    check: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <path d="M22 4L12 14.01l-3-3"/>
      </svg>
    ),
  };
  return icons[type] || null;
}

function SealedLabel({ text, index }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <filter id={`innerShadow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="1" result="offOut" />
          <feGaussianBlur in="offOut" stdDeviation="1.25" result="blurOut" />
          <feComposite in="SourceAlpha" in2="blurOut" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
          <feColorMatrix in="innerShadow" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.14 0" />
        </filter>
      </defs>
      <text 
        x="50" 
        y="55" 
        textAnchor="middle" 
        fontFamily="Inter, Helvetica Neue, Arial, sans-serif" 
        fontWeight="700" 
        fontSize="10" 
        letterSpacing="0.02em"
        filter={`url(#innerShadow-${index})`} 
        fill="currentColor"
      >
        {text}
      </text>
    </svg>
  );
}

export default function BA14Page() {
  const [selected, setSelected] = useState(null);
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  const t = (en, yue) => (lang === "en" ? en : yue);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0B0B0B] dark:text-white">
      <Header activeLink="ba14" lang={lang} setLang={setLang} />

      <section className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
        {/* Breadcrumb */}
        <nav className="mb-12 text-sm text-black/60 dark:text-white/60">
          <a href="/" className="hover:text-black dark:hover:text-white transition-colors">
            {t("Home", "主頁")}
          </a>
          <span className="mx-2">/</span>
          <span className="text-black dark:text-white">BA14</span>
        </nav>

        {/* 3×2 Swiss Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TILES.map((tile, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`
                group relative aspect-[1.1/1] select-none outline-none 
                transition-all duration-[120ms] ease-out
                hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,0,0,0.13)]
                active:translate-y-0
                focus-visible:ring-2 focus-visible:ring-black/80 dark:focus-visible:ring-white/80
                ${selected === i ? 'ring-1 ring-black dark:ring-white ring-inset' : ''}
              `}
              style={{ 
                backgroundColor: tile.color,
                filter: selected === i ? 'none' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.10))'
              }}
              aria-label={t(tile.en, tile.yue)}
            >
              {/* Icon at top-left */}
              <div className="absolute top-8 left-8">
                <TileIcon 
                  type={tile.icon} 
                  className="w-8 h-8 text-black/25 dark:text-white/30" 
                />
              </div>

              {/* Sealed label at bottom */}
              <div className="absolute bottom-8 left-8 right-8 text-black/[0.14] dark:text-white/[0.12] group-hover:text-black/[0.20] group-hover:dark:text-white/[0.18] transition-all duration-[120ms]">
                <SealedLabel text={t(tile.en, tile.yue)} index={i} />
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
