import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && 
         window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return [isDark, setIsDark];
}

function useLang() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return [lang, setLang];
}

export default function Header({ activeLink }) {
  const [isDark, setIsDark] = useDarkMode();
  const [lang, setLang] = useLang();
  const location = useLocation();

  const t = (en, yue) => (lang === "en" ? en : yue);

  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-10 bg-white/90 dark:bg-[#0B0B0B]/90 backdrop-blur-sm border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
        {/* Wordmark */}
        <Link 
          to="/" 
          className="text-base font-normal tracking-wide hover:opacity-60 transition-opacity"
        >
          okalpha
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm">
          <Link 
            to="/" 
            className={`
              relative hover:opacity-60 transition-opacity
              ${isHome ? 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-black dark:after:bg-white' : ''}
            `}
          >
            {t("Home", "主頁")}
          </Link>
          
          <Link 
            to="/about" 
            className="hover:opacity-60 transition-opacity"
          >
            {t("About", "關於")}
          </Link>

          {/* Language Toggle */}
          <button
            className="text-[10px] font-medium tracking-wider uppercase text-black/60 dark:text-white/60 hover:opacity-100 transition-opacity flex items-center gap-1"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            aria-label="Toggle language"
          >
            <span className={lang === "en" ? "text-black dark:text-white" : "opacity-40"}>
              EN
            </span>
            <span className="opacity-30">/</span>
            <span className={lang === "zh" ? "text-black dark:text-white" : "opacity-40"}>
              粵
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            className="w-7 h-7 flex items-center justify-center border border-black/20 dark:border-white/20 hover:opacity-60 transition-opacity"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
