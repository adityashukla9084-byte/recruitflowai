const fs = require('fs');

let css = `
@import url('https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import "tailwindcss";

/* ── Luxury Premium Theme ── */
:root {
  /* Surfaces */
  --bg-primary: #050505;
  --bg-secondary: #0A0A0A;
  --bg-card: #0F0F0F;
  --bg-card-hover: #171717;
  --bg-sidebar: #0A0A0A;
  --bg-input: #0F0F0F;
  --bg-gradient-from: #050505;
  --bg-gradient-via: #0A0A0A;
  --bg-gradient-to: #050505;

  /* Text scale - Maximized contrast */
  --text-primary: #FFFFF0; /* Ivory */
  --text-secondary: #E4E4E7; /* Zinc 200 */
  --text-muted: #A1A1AA; /* Zinc 400 */
  --text-accent: #D4AF37; /* Muted Gold */

  /* Borders */
  --border-primary: #27272A;
  --border-card: #27272A;
  --border-input: #27272A;

  /* Action accents */
  --accent: #D4AF37;
  --accent-hover: #C5A028;

  /* Dot pattern background */
  --dot-pattern: rgba(212, 175, 55, 0.05);

  /* Shadows */
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(212, 175, 55, 0.05);
  --shadow-card-hover: 0 12px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.05), inset 0 0 0 1px rgba(212, 175, 55, 0.15);

  /* Semantic tags colors */
  --rf-match-high: #4ADE80;
  --rf-match-mid: #FBBF24;
  --rf-match-low: #F87171;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6, .font-display {
  font-family: 'General Sans', sans-serif;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}
`;

fs.writeFileSync('app/globals.css', css);

let p = fs.readFileSync('app/page.tsx', 'utf-8');

// Colors replacement mapping to luxury theme
p = p.replace(/bg-white/g, 'bg-[#050505]');
p = p.replace(/bg-gray-50/g, 'bg-[#0A0A0A]');
p = p.replace(/text-gray-900/g, 'text-[#FFFFF0]');
p = p.replace(/text-gray-800/g, 'text-zinc-200');
p = p.replace(/text-gray-700/g, 'text-zinc-300');
p = p.replace(/text-gray-600/g, 'text-zinc-300');
p = p.replace(/text-gray-500/g, 'text-zinc-400');
p = p.replace(/text-black/g, 'text-[#FFFFF0]');
p = p.replace(/text-\[\#0A0E1A\]/g, 'text-black');
p = p.replace(/text-\[\#06111A\]/g, 'text-black');

// Re-adjust any leftover dark colors just in case
p = p.replace(/text-slate-400/g, 'text-zinc-300'); // Increase contrast from slate-400 to zinc-300
p = p.replace(/text-slate-300/g, 'text-zinc-200');
p = p.replace(/text-slate-200/g, 'text-zinc-100');
p = p.replace(/text-slate-100/g, 'text-[#FFFFF0]');
p = p.replace(/text-\[\#9CA3AF\]/g, 'text-zinc-300'); // Higher contrast
p = p.replace(/text-\[\#6B7280\]/g, 'text-zinc-400'); // Higher contrast
p = p.replace(/text-xs text-\[\#6B7280\]/g, 'text-xs text-zinc-400');

// Borders
p = p.replace(/border-gray-200/g, 'border-zinc-800');
p = p.replace(/border-gray-300/g, 'border-zinc-700');
p = p.replace(/border-white\/\[0\.08\]/g, 'border-[#D4AF37]/20');
p = p.replace(/border-white\/5/g, 'border-[#D4AF37]/10');
p = p.replace(/border-white\/\[0\.12\]/g, 'border-[#D4AF37]/25');
p = p.replace(/border-white\/\[0\.18\]/g, 'border-[#D4AF37]/30');
p = p.replace(/border-teal-400\/25/g, 'border-[#D4AF37]/30');
p = p.replace(/border-cyan-400\/30/g, 'border-[#D4AF37]/30');
p = p.replace(/border-indigo-400\/30/g, 'border-[#D4AF37]/30');

// Backgrounds for cards
p = p.replace(/bg-white\/\[0\.035\]/g, 'bg-[#111111]');
p = p.replace(/bg-white\/\[0\.06\]/g, 'bg-[#171717]');
p = p.replace(/bg-\[\#111827\]/g, 'bg-[#0A0A0A]');
p = p.replace(/bg-\[\#0A0E1A\]\/55/g, 'bg-[#050505]/80');
p = p.replace(/bg-\[\#0A0E1A\]/g, 'bg-[#050505]');

// Accents
p = p.replace(/text-teal-300/g, 'text-[#D4AF37]');
p = p.replace(/text-teal-200/g, 'text-[#D4AF37]');
p = p.replace(/text-cyan-300/g, 'text-[#D4AF37]');
p = p.replace(/text-cyan-400/g, 'text-[#D4AF37]');
p = p.replace(/text-indigo-300/g, 'text-[#D4AF37]');
p = p.replace(/text-violet-300/g, 'text-[#D4AF37]');
p = p.replace(/text-\[\#14B8A6\]/g, 'text-[#D4AF37]');
p = p.replace(/text-\[\#4ADE80\]/g, 'text-[#FFFFF0]'); // Was green, switch to Ivory for high contrast or keep semantic
p = p.replace(/text-rose-400/g, 'text-rose-300'); // Better contrast
p = p.replace(/text-amber-400/g, 'text-amber-300'); // Better contrast

// Badge Backgrounds
p = p.replace(/bg-teal-400\/10/g, 'bg-[#D4AF37]/10');
p = p.replace(/bg-cyan-400\/10/g, 'bg-[#D4AF37]/10');
p = p.replace(/bg-\[\#14B8A6\]\/10/g, 'bg-[#D4AF37]/10');
p = p.replace(/bg-indigo-400\/10/g, 'bg-[#D4AF37]/10');
p = p.replace(/bg-violet-400\/10/g, 'bg-[#D4AF37]/10');

// Borders of Badges
p = p.replace(/border-\[\#14B8A6\]\/20/g, 'border-[#D4AF37]/30');
p = p.replace(/border-\[\#14B8A6\]\/15/g, 'border-[#D4AF37]/25');

// Buttons
p = p.replace(/bg-[#050505] text-[#FFFFF0] hover:bg-gray-800/g, 'bg-[#D4AF37] text-black hover:bg-[#C5A028]');
p = p.replace(/bg-[#050505] text-[#FFFFF0]/g, 'bg-[#D4AF37] text-black');
p = p.replace(/bg-black text-[#FFFFF0] hover:bg-gray-800/g, 'bg-[#D4AF37] text-black hover:bg-[#C5A028]');
p = p.replace(/bg-black text-[#FFFFF0]/g, 'bg-[#D4AF37] text-black');
p = p.replace(/bg-black/g, 'bg-[#D4AF37]');

// Make sure primary links/buttons are highly legible
p = p.replace(/hover:text-white/g, 'hover:text-[#FFFFF0]');

// Ensure button text is bold
p = p.replace(/font-bold/g, 'font-bold tracking-wide');
p = p.replace(/font-semibold/g, 'font-semibold tracking-wide');

fs.writeFileSync('app/page.tsx', p);
console.log('Luxury theme applied');
