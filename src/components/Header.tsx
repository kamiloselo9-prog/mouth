import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../store/useCart';
import { motion, useScroll } from 'framer-motion';
import PromoBanner from './PromoBanner';

export default function Header({ isHomepage = false }: { isHomepage?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl ' : 'bg-transparent'
      }`}
    >
      {isHomepage && <PromoBanner />}
      
      <div className={`max-w-[1400px] mx-auto flex items-center justify-between px-6 transition-all duration-500 ${
        isScrolled ? 'py-4' : 'py-6'
      }`}>
        <a href="#" className="text-xl font-medium tracking-[0.2em] text-[#1A1A1A] hover:opacity-70 transition-opacity">
          SLEEP TAPE
        </a>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#737373]">
          <a href="#how-it-works" className="hover:text-[#1A1A1A] transition-colors">Jak to działa</a>
          <a href="#benefits" className="hover:text-[#1A1A1A] transition-colors">Korzyści</a>
          <a href="#reviews" className="hover:text-[#1A1A1A] transition-colors">Opinie</a>
          <a href="#faq" className="hover:text-[#1A1A1A] transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.hash = '#cart'}
            className="flex items-center justify-center relative hover:opacity-70 transition-opacity p-2"
          >
            <ShoppingCart className="w-5 h-5 text-[#1A1A1A]" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#E53E3E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </button>

          <button 
            onClick={() => window.location.hash = '#product'}
            className="hidden md:block px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#2C2C2C] transition-colors shadow-lg shadow-[#1A1A1A]/10"
          >
            Zamów teraz
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#1A1A1A]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
