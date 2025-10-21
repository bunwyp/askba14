# BA14 — React + Tailwind Swiss Hero

A modern React implementation of the Swiss/International Typographic Style website with Vite, Tailwind CSS, and React Router.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:8000**

### 3. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Shared header with nav, lang, theme
│   ├── SwissHero.jsx       # Home page hero component
│   ├── BA14Square.jsx      # Large CTA square with seal
│   └── BA14Page.jsx        # BA14 tools page with 3×2 grid
├── App.jsx                 # Router setup
├── main.jsx               # React entry point
└── index.css              # Tailwind imports

index-react.html           # HTML template
package.json               # Dependencies
vite.config.js            # Vite configuration
tailwind.config.js        # Tailwind configuration
postcss.config.js         # PostCSS configuration
```

## ✨ Features

### Components

#### **SwissHero** (Home Page)
- Large "Lock In." headline with tight kerning
- 46-48vw responsive square CTA (min 560px)
- Auto-cycles through 5 palette colors every 3.5s
- Keyboard shortcuts: Arrow keys to manually cycle colors
- Smooth page transition animation on click
- Navigates to `/ba14` route

#### **BA14Square**
- Centered BA/14 seal with SVG letterpress effect
- Right-side slanted face with distinct vibrant color
- Compact drop shadow (18px offset, 32px blur)
- Hover: lifts 2px, seal deepens (180ms)
- Active: depresses 1px, seal intensifies (130ms)
- Focus ring for accessibility

#### **BA14Page**
- 3×2 responsive grid (3 cols desktop, 2 tablet, 1 mobile)
- 6 sealed blocks with distinct colors
- Icons at top-left, sealed labels at bottom
- Hover: lift 1px, label brightens 6-8%
- Click to select (adds outline keyline)

#### **Header**
- Persistent across both pages
- Active page underline indicator
- EN / 粵 language toggle (persists in localStorage)
- Light/Dark theme toggle (persists in localStorage)

## 🎨 Palette

| Color | Hex | Component |
|-------|-----|-----------|
| Blue | `#1F6FEB` | Variant 0 |
| Red | `#F9413A` | Variant 1 |
| Yellow | `#FFCE00` | Variant 2 |
| Green | `#00A884` | Variant 3 |
| Purple | `#6D28D9` | Variant 4 |
| Orange | `#F97316` | BA14 tile |

## 🎛️ Interactions

### Home Square
- **Auto-cycle**: Changes color every 3.5 seconds
- **Manual cycle**: Use ← → arrow keys
- **Hover**: Lift 2px, shadow adjusts (180ms ease-out)
- **Click**: Page transition → navigate to /ba14
- **Focus**: 2px ring with 8px offset

### BA14 Tiles
- **Hover**: Lift 1px, shadow expands (120ms ease-out)
- **Click**: Select with 1px outline ring
- **Focus**: Keyboard accessible with focus rings

## 🌐 Localization

Toggle **EN / 粵** in header to switch between:
- **English**: All labels in English
- **Traditional Cantonese** (繁體中文): All labels translated

Preference persists across sessions via `localStorage`.

## 🌓 Dark Mode

Click the circle icon in header to toggle:
- **Light Mode**: White (#FFFFFF) background, black text
- **Dark Mode**: Near-black (#0B0B0B) background, white text

All components adapt colors automatically. Theme persists in `localStorage`.

## 📱 Responsive

- **Desktop** (1400px+): Full 2-column hero, 3-column grid
- **Tablet** (768px-1400px): 2-column grid, adjusted square
- **Mobile** (<768px): Single column, 86-90vw square

Square size: `clamp(560px, 48vw, 720px)`

## 🛠️ Customization

### Change Colors

Edit `PALETTE` array in `SwissHero.jsx` and `BA14Square.jsx`:

```jsx
const PALETTE = ["#1F6FEB", "#F9413A", "#FFCE00", "#00A884", "#6D28D9"];
```

### Add BA14 Tool

Edit `TILES` array in `BA14Page.jsx`:

```jsx
{ 
  en: "New Tool", 
  yue: "新工具", 
  color: "#FF6B6B", 
  icon: "custom" 
}
```

Then add icon SVG in `TileIcon` component.

### Adjust Square Size

Modify inline style in `BA14Square.jsx`:

```jsx
style={{
  width: "clamp(500px, 45vw, 680px)", // Adjust here
  aspectRatio: "1 / 1",
}}
```

## 🎯 Design Principles

✅ Flat, high-contrast Swiss design  
✅ Strict grid system with generous negative space  
✅ Neo-grotesk typography (Inter/Helvetica)  
✅ Letterpress debossed seals  
✅ Subtle micro-interactions (120-200ms)  
✅ WCAG contrast compliant  

❌ No gradients or textures  
❌ No rounded bubbly fonts  
❌ No long cast shadows  
❌ No bounce or glow effects  

## 🌐 Browser Support

- Chrome/Edge 100+
- Firefox 100+
- Safari 15+

Requires modern browser with SVG filter support.

## 📦 Tech Stack

- **React 18** - UI library
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Utility-first CSS
- **React Router 6** - Client-side routing
- **PostCSS** - CSS processing

---

**Style**: Swiss/International Typographic Minimalism  
**Version**: 2.0 — React + Tailwind Implementation
