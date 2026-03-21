const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const appFile = path.join(__dirname, 'src', 'App.tsx');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));
files.push(appFile);

const replacements = [
  { old: /#FCFCFC/g, new: '#F7F6F4' },
  { old: /#0F1218/g, new: '#1A1A1A' },
  { old: /#21252C/g, new: '#2C2C2C' },
  { old: /#F4F5F7/g, new: '#EAE6DF' }, // softer beige for cards
  { old: /#E8EAED/g, new: '#E6E2DA' }, // sand tone for borders
  { old: /#6B7280/g, new: '#737373' }  // muted text
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(r => {
    content = content.replace(r.old, r.new);
  });
  fs.writeFileSync(file, content);
});

console.log('Colors replaced successfully!');
