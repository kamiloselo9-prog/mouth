const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

const replacements = [
  { old: /border-y border-\[#E6E2DA\]/g, new: '' },
  { old: /border-t border-\[#E6E2DA\]/g, new: '' },
  { old: /border-b border-\[#E6E2DA\]/g, new: '' },
  { old: /border-y border-\[#2C2C2C\]/g, new: '' },
  { old: /border-t border-\[#2C2C2C\]/g, new: '' },
  { old: /border-b border-\[#2C2C2C\]/g, new: '' },
  { old: /bg-white/g, new: 'bg-transparent' }, // replace some hard white backgrounds with transparent to let gradients flow, BUT be careful not to ruin cards.
];

// Instead of global bg-white, let's just do targeted replacements.
// Let's just do the borders first.
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove hard borders from sections
  content = content.replace(/border-y border-\[#E6E2DA\]/g, '');
  content = content.replace(/border-t border-\[#E6E2DA\]/g, '');
  content = content.replace(/border-b border-\[#E6E2DA\]/g, '');
  content = content.replace(/border-y border-\[#2C2C2C\]/g, '');
  content = content.replace(/border-t border-\[#2C2C2C\]/g, '');
  content = content.replace(/border-b border-\[#2C2C2C\]/g, '');
  
  // To make transitions elegant, we will use a global wave/gradient approach.
  // We'll replace bg-[#F7F6F4] and bg-[#FCFCFC] with bg-transparent in section roots
  // where we want to rely on the App.tsx background or soft gradients.
  // Actually, let's inject soft gradients into App.tsx and make sections transparent.
  // Wait, if we make sections transparent, the App.tsx background (#F7F6F4) will show through, making it perfectly seamless!
  
  // Let's remove solid backgrounds from section roots to let them blend, except for Dark sections.
  content = content.replace(/className="([^"]*)bg-\[#F7F6F4\]([^"]*)"/g, (match, p1, p2) => {
    if (match.includes('section')) return `className="${p1}${p2}"`;
    return match;
  });
  
  // Remove bg-white from sections only (heuristic: starts with `<section className="...bg-white...`)
  content = content.replace(/<section([^>]*)bg-white([^>]*)>/g, '<section$1$2>');
  // Also remove bg-[#F7F6F4] from sections
  content = content.replace(/<section([^>]*)bg-\[#F7F6F4\]([^>]*)>/g, '<section$1$2>');
  
  fs.writeFileSync(file, content);
});

console.log('Borders and section hard backgrounds removed successfully!');
