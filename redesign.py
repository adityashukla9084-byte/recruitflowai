import re
import os

page_path = 'app/page.tsx'
css_path = 'app/globals.css'

with open(page_path, 'r', encoding='utf-8') as f:
    page = f.read()

# 1. Remove specific gradient texts
page = re.sub(r'bg-gradient-to-r from-teal-300 via-cyan-300 to-cyan-400 bg-clip-text text-transparent', 'text-black', page)
page = re.sub(r'bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent', 'text-black', page)
page = re.sub(r'bg-gradient-to-r from-indigo-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent', 'text-black', page)
page = re.sub(r'bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent', 'text-black', page)
page = re.sub(r'bg-gradient-to-r from-violet-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent', 'text-black', page)

# 2. Change dark backgrounds to clean light ones
page = re.sub(r'bg-\[\#0A0E1A\]', 'bg-white', page)
page = re.sub(r'bg-\[\#080D18\]', 'bg-gray-50', page)
page = re.sub(r'bg-\[\#111827\]', 'bg-white', page)
page = re.sub(r'bg-\[\#06111A\]', 'bg-white', page)

# 3. Change text colors for light mode
page = re.sub(r'text-\[\#F5F5F4\]', 'text-gray-900', page)
page = re.sub(r'text-\[\#F8FAFC\]', 'text-gray-900', page)
page = re.sub(r'text-\[\#9CA3AF\]', 'text-gray-600', page)
page = re.sub(r'text-slate-100', 'text-gray-900', page)
page = re.sub(r'text-slate-200', 'text-gray-800', page)
page = re.sub(r'text-slate-300', 'text-gray-700', page)
page = re.sub(r'text-slate-400', 'text-gray-500', page)
page = re.sub(r'text-white', 'text-gray-900', page)
page = re.sub(r'text-\[\#14B8A6\]', 'text-black', page) # Primary accent becomes black

# 4. Remove glows and 3D background images
page = re.sub(r'<div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">.*?</div>\s*</div>', '', page, flags=re.DOTALL)
page = re.sub(r'<div className="absolute inset-0 z-0">.*?</div>', '', page, flags=re.DOTALL)
page = re.sub(r'bg-\[radial-gradient.*?\]', 'bg-transparent', page)
page = re.sub(r'animate-pulse', '', page)
page = re.sub(r'animate-laser-scan', 'hidden', page)
page = re.sub(r'mouse-spotlight', 'hidden', page)
page = re.sub(r'backdrop-blur-xl', '', page)
page = re.sub(r'backdrop-blur-md', '', page)
page = re.sub(r'backdrop-blur-sm', '', page)
page = re.sub(r'backdrop-blur-lg', '', page)

# 5. Fix border colors to light mode
page = re.sub(r'border-white/\[0\.\d+\]', 'border-gray-200', page)
page = re.sub(r'border-\[\#14B8A6\]/20', 'border-gray-300', page)
page = re.sub(r'border-teal-400/25', 'border-gray-200', page)

# 6. Change buttons to solid monochrome
page = re.sub(r'bg-gradient-to-r from-teal-400 to-cyan-400', 'bg-black text-white hover:bg-gray-800', page)
page = re.sub(r'bg-gradient-to-r from-teal-600 to-teal-600 hover:to-cyan-500', 'bg-black text-white hover:bg-gray-800', page)
page = re.sub(r'bg-gradient-to-r from-teal-500 via-indigo-500 to-cyan-400', 'bg-black text-white', page)
page = re.sub(r'bg-\[\#14B8A6\]', 'bg-black', page)

# 7. Replace <Brain> with <Briefcase> or something similar
page = re.sub(r'<Brain', '<Layers', page)
page = re.sub(r'import \{[\s\S]*?\} from "lucide-react";', lambda m: m.group(0).replace('Brain,', 'Layers,'), page)


with open(page_path, 'w', encoding='utf-8') as f:
    f.write(page)

# CSS replacement
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

css = re.sub(r'/\* ── Tactical Noise Overlay.*', '', css, flags=re.DOTALL)
css = re.sub(r'--bg-primary: #060B18;', '--bg-primary: #FAFAFA;', css)
css = re.sub(r'--bg-secondary: #080D21;', '--bg-secondary: #F4F4F5;', css)
css = re.sub(r'--bg-card: rgba\(15, 23, 42, 0.7\);', '--bg-card: #FFFFFF;', css)
css = re.sub(r'--text-primary: #F5F5F4;', '--text-primary: #09090B;', css)
css = re.sub(r'--text-secondary: #9CA3AF;', '--text-secondary: #52525B;', css)
css = re.sub(r'--text-muted: #6B7280;', '--text-muted: #71717A;', css)
css = re.sub(r'--border-primary: rgba\(255, 255, 255, 0.06\);', '--border-primary: #E4E4E7;', css)
css = re.sub(r'background: linear-gradient\(135deg, #14B8A6 0%, #22D3EE 100%\) !important;', 'background: #000000 !important; color: #FFFFFF !important;', css)
css = re.sub(r'box-shadow: 0 4px 15px rgba\(20, 184, 166, 0.3\) !important;', 'box-shadow: none !important;', css)
css = re.sub(r'border-color: #22D3EE !important;', 'border-color: #000000 !important;', css)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("Replacement complete.")
