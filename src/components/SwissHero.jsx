import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import BA14Square from "./BA14Square";

const PALETTE = ["#1F6FEB", "#F9413A", "#FFCE00", "#00A884", "#6D28D9"];

function transitionTo(navigate, url) {
  const root = document.body;
  const overlay = document.createElement("div");
  overlay.setAttribute(
    "class",
    "fixed inset-0 z-[999] pointer-events-none bg-white/0 dark:bg-black/0 transition-all duration-200"
  );
  root.appendChild(overlay);
  
  requestAnimationFrame(() => {
    overlay.classList.add("bg-white/100", "dark:bg-black/100");
    root.classList.add("[&_*]:transition-all", "[&_main]:opacity-90");
  });
  
  setTimeout(() => {
    navigate(url);
    overlay.remove();
  }, 180);
}

export default function SwissHero() {
  const navigate = useNavigate();
  const [colorIndex, setColorIndex] = useState(0);

  // Auto-cycle through colors every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((i) => (i + 1) % PALETTE.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts to manually cycle colors
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setColorIndex((i) => (i + 1) % PALETTE.length);
      if (e.key === "ArrowLeft") setColorIndex((i) => (i - 1 + PALETTE.length) % PALETTE.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0B0B0B] dark:text-white">
      <Header activeLink="home" />

      {/* Hero Section */}
      <section className="mx-auto max-w-[1400px] px-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 items-center py-16 md:py-24">
        {/* Left: Headline */}
        <div className="order-2 md:order-1">
          <h1 className="text-[clamp(64px,10vw,180px)] leading-[0.9] font-extrabold tracking-[-0.02em] select-none">
            Lock In<span className="align-top">.</span>
          </h1>
          
          {/* Down arrow indicator */}
          <div className="mt-16 opacity-40 select-none" aria-hidden="true">
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0V36M12 36L6 30M12 36L18 30" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* Right: Large BA14 Square CTA */}
        <div className="order-1 md:order-2 flex md:justify-end">
          <BA14Square
            colorIndex={colorIndex}
            onClick={() => transitionTo(navigate, "/ba14")}
          />
        </div>
      </section>
    </main>
  );
}
