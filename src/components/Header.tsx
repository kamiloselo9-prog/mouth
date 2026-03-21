import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 ${
        isScrolled ? 'py-4 bg-white/80 backdrop-blur-xl ' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="text-xl font-medium tracking-[0.2em] text-[#1A1A1A]">
          SLEEP TAPE
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#737373]">
          <a href="#how-it-works" className="hover:text-[#1A1A1A] transition-colors">Jak to działa</a>
          <a href="#benefits" className="hover:text-[#1A1A1A] transition-colors">Korzyści</a>
          <a href="#reviews" className="hover:text-[#1A1A1A] transition-colors">Opinie</a>
          <a href="#faq" className="hover:text-[#1A1A1A] transition-colors">FAQ</a>
        </nav>

        <button className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#2C2C2C] transition-colors shadow-lg shadow-[#1A1A1A]/10">
          Zamów teraz
        </button>
      </div>
    </motion.header>
  );
}
