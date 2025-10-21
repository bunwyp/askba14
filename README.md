# BA14 — Swiss/International Typographic Style Website

A minimalist two-page website following strict Swiss design principles with a large geometric CTA and interaction panel.

## 🎯 Features

### Global
- **Two Themes**: Light (white) and Dark (near-black #0B0B0B)
- **Typography**: Bold neo-grotesk (Helvetica Neue) with tight kerning
- **Bilingual**: EN / 粵 (English / Traditional Cantonese)
- **No Noise**: Zero gradients, textures, or skeuomorphic effects
- **WCAG Compliant**: Meets contrast accessibility standards

### Home Page
- **Large Square CTA**: 46-48vw on desktop, 86-90vw on mobile
- **Centered BA/14 Seal**: Letterpress debossed effect, tone-on-tone
- **Compact Shadow**: Soft drop shadow (18px Y-offset, 16px blur)
- **Color Cycling**: Auto-rotates through 5 palette colors
- **Micro-Interactions**: Lift on hover (2px), depress on press (1px)
- **Navigation**: Click square to go to BA14 page

### BA14 Page
- **3×2 Swiss Grid**: 6 equal blocks with strict gutters
- **Sealed Labels**: Letterpress effect matching main square
- **6 Tools**:
  1. GPA Calculator (功績點計算)
  2. Calendar + To-Do (行事曆＋待辦)
  3. Anki Flashcards (Anki 記憶卡)
  4. Focus Timer (專注計時)
  5. Notes / Outline (筆記／大綱)
  6. Habit & Streaks (習慣連勝)

## 🎨 Brand Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Blue | `#1F6FEB` | Primary |
| Red | `#F9413A` | Alert |
| Yellow | `#FFCE00` | Highlight |
| Green | `#00A884` | Success |
| Purple | `#6D28D9` | Info |
| Orange | `#F97316` | Energy |

## 📁 File Structure

```
├── index.html       # Home page with hero
├── ba14.html        # BA14 tools page
├── styles.css       # Complete Swiss-style CSS
├── script.js        # Language, theme, interactions
└── README.md        # Documentation
```

## 🚀 Usage

1. **Local Development**:
   ```bash
   npx http-server -p 8000
   ```
   Open `http://localhost:8000`

2. **No Build Required**: Pure HTML/CSS/JS

## 🎛️ Interactions

### Home Square CTA
- **Idle**: Static with centered BA/14 seal
- **Hover**: Lifts 2px, shadow shortens 6%, seal deepens (170-200ms)
- **Active**: Depresses 1px, seal intensifies (120-140ms)
- **Focus**: 2px ring outline for keyboard navigation
- **Click**: Navigates to `/ba14.html`

### BA14 Panel Blocks
- **Hover**: Lift 1px, label brightens 6-8% (120ms)
- **Click**: Selects with 1px keyline border

## 🌓 Theme Toggle

Click the circle icon in the header to switch:
- **Light Mode**: White background, black text
- **Dark Mode**: Near-black (#0B0B0B), white text

Theme persists in localStorage.

## 🌐 Language Toggle

Click **EN / 粵** to switch:
- **EN**: English labels
- **粵**: Traditional Cantonese (繁體中文)

Language persists in localStorage.

## 📱 Responsive

- **Desktop**: 2400px max-width, generous spacing
- **Tablet**: 2-column grid, adjusted square size
- **Mobile**: Single column, 86-90vw square

## 🎨 Design Principles

✅ Flat, high-contrast colors  
✅ Strict baseline grid  
✅ Generous negative space  
✅ Sharp edges (no rounded corners)  
✅ Subtle micro-interactions (120-200ms)  
✅ Letterpress seal effects  

❌ No gradients  
❌ No textures/grain  
❌ No long shadows  
❌ No bounce/glow  
❌ No skeuomorphism  

## 🛠️ Customization

### Change Palette
Edit CSS custom properties in `styles.css`:

```css
:root {
    --color-blue: #1F6FEB;
    --color-red: #F9413A;
    /* ... */
}
```

### Add New BA14 Tool
Add to `ba14.html` panel grid:

```html
<button class="panel-block" data-color="blue" 
        data-en="Tool Name" data-zh="工具名稱">
    <svg class="block-icon">...</svg>
    <span class="block-label">Tool Name</span>
</button>
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

**Style**: Swiss/International Typographic Minimalism  
**Resolution**: Optimized for 2400×1350+ viewports  
**Version**: 2.0 — BA14 System
