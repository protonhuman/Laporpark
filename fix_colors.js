const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('d:/Website/Lapor Park/ba-parkir/src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace text colors
    content = content.replace(/text-white/g, 'text-slate-800');
    content = content.replace(/text-slate-200/g, 'text-slate-700');
    content = content.replace(/text-slate-300/g, 'text-slate-600');
    content = content.replace(/text-slate-400/g, 'text-slate-500');
    
    // Fix backgrounds for layout/sidebar
    content = content.replace(/bg-black\/80/g, 'bg-background neo-card');
    content = content.replace(/bg-black\/95/g, 'bg-background neo-card');
    content = content.replace(/border-white\/\[0\.06\]/g, 'border-transparent shadow-[4px_0_10px_rgba(163,177,198,0.5)]');
    
    // Fix some hover states
    content = content.replace(/hover:text-white/g, 'hover:text-slate-900');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
