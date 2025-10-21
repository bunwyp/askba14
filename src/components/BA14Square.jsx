import React from "react";

const PALETTE = ["#1F6FEB", "#F9413A", "#FFCE00", "#00A884", "#6D28D9"];

function nextDistinctColor(index) {
  // Pick a different vibrant color for the shaded side
  return PALETTE[(index + 1) % PALETTE.length];
}

function InnerShadowText({ sizePct = 12 }) {
  // Render centered BA / 14 with SVG inner shadow for true debossed look
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
      <defs>
        {/* Inner shadow filter for letterpress effect */}
        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="1" result="offOut" />
          <feGaussianBlur in="offOut" stdDeviation="1.25" result="blurOut" />
          <feComposite in="SourceAlpha" in2="blurOut" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
          <feColorMatrix in="innerShadow" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" />
        </filter>
      </defs>

      {/* Centered stack: BA over 14 */}
      <g filter="url(#innerShadow)" style={{ mixBlendMode: "multiply" }}>
        <text
          x="50"
          y="42"
          textAnchor="middle"
          style={{
            fontFamily: 'Inter, Helvetica Neue, Arial, system-ui, sans-serif',
            fontWeight: 800,
            letterSpacing: `${0.05 * sizePct}px`,
            fontSize: `${sizePct}px`,
          }}
          fill="currentColor"
        >
          BA
        </text>
        <text
          x="50"
          y="62"
          textAnchor="middle"
          style={{
            fontFamily: 'Inter, Helvetica Neue, Arial, system-ui, sans-serif',
            fontWeight: 800,
            letterSpacing: `${0.05 * sizePct}px`,
            fontSize: `${sizePct}px`,
          }}
          fill="currentColor"
        >
          14
        </text>
      </g>
      
      {/* Top highlight for crisp letterpress */}
      <g opacity="0.09" style={{ mixBlendMode: "screen" }}>
        <text
          x="50"
          y="41"
          textAnchor="middle"
          style={{
            fontFamily: 'Inter, Helvetica Neue, Arial, system-ui, sans-serif',
            fontWeight: 800,
            letterSpacing: `${0.05 * sizePct}px`,
            fontSize: `${sizePct}px`,
          }}
          fill="#FFFFFF"
        >
          BA
        </text>
        <text
          x="50"
          y="61"
          textAnchor="middle"
          style={{
            fontFamily: 'Inter, Helvetica Neue, Arial, system-ui, sans-serif',
            fontWeight: 800,
            letterSpacing: `${0.05 * sizePct}px`,
            fontSize: `${sizePct}px`,
          }}
          fill="#FFFFFF"
        >
          14
        </text>
      </g>
    </svg>
  );
}

export default function BA14Square({ colorIndex = 0, onClick }) {
  const face = PALETTE[colorIndex % PALETTE.length];
  const side = nextDistinctColor(colorIndex);

  return (
    <button
      onClick={onClick}
      aria-label="Go to BA14"
      className="relative group outline-none focus-visible:ring-2 focus-visible:ring-black/80 dark:focus-visible:ring-white/80 focus-visible:ring-offset-8"
      style={{
        width: "clamp(560px, 48vw, 720px)",
        aspectRatio: "1 / 1",
        filter: "drop-shadow(0 18px 32px rgba(0,0,0,0.13))",
      }}
    >
      {/* SVG cube: square front face + right slanted side */}
      <svg 
        viewBox="0 0 105 100" 
        className="w-full h-full transition-transform duration-[180ms] ease-out will-change-transform group-hover:-translate-y-0.5 group-active:translate-y-px"
      >
        {/* Front face */}
        <rect x="0" y="0" width="100" height="100" fill={face} />
        
        {/* Right side face (slanted) with distinct vibrant color */}
        <polygon points="100,0 105,5 105,95 100,100" fill={side} />
      </svg>

      {/* Embossed BA/14 centered seal */}
      <div
        className="absolute inset-0 flex items-center justify-center text-black/[0.16] dark:text-white/[0.12] transition-all duration-[130ms] group-hover:text-black/[0.20] group-hover:dark:text-white/[0.16] group-active:text-black/[0.24] group-active:dark:text-white/[0.20]"
        aria-hidden="true"
      >
        <InnerShadowText sizePct={12} />
      </div>
    </button>
  );
}
