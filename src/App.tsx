import { motion, useScroll, useSpring, useTransform, animate } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Benefits from './components/Benefits';
import VsAlternatives from './components/VsAlternatives';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import Cart from './components/Cart';
import CheckoutSuccess from './components/CheckoutSuccess';
import TrackOrder from './components/TrackOrder';
import AdminPanel from './components/AdminPanel';
import Modal from './components/Modal';

function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    
    const handleResize = () => {
      checkMobile();
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollY } = useScroll();
  
  // Custom Smooth Scroll with inertia (desktop only)
  const smoothY = useSpring(scrollY, {
    damping: 25,
    stiffness: 120,
    restDelta: 0.001
  });

  const y = useTransform(smoothY, (value) => -value);

  // SNAP LOGIC: One-way forward transition to Comparison (desktop only)
  const lastScrollY = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      if (isMobile || isSnapping) {
        lastScrollY.current = latest;
        return;
      }

      const isScrollingDown = latest > lastScrollY.current;
      lastScrollY.current = latest;

      const benefitsSection = document.getElementById('benefits');
      const comparisonSection = document.getElementById('comparison');
      
      if (benefitsSection && comparisonSection) {
        const bEnd = benefitsSection.offsetTop + benefitsSection.offsetHeight;
        const comparisonTop = comparisonSection.offsetTop;

        // One-way Forward Trigger: 
        if (isScrollingDown && latest > bEnd - 150 && latest < comparisonTop - 100) {
          setIsSnapping(true);
          
          animate(window.scrollY, comparisonTop, {
            type: "tween",
            ease: [0.65, 0, 0.35, 1],
            duration: 1.2,
            onUpdate: (val) => window.scrollTo(0, val),
            onComplete: () => {
              setTimeout(() => setIsSnapping(false), 500);
            }
          });
        }
      }
    });

    return () => unsubscribe();
  }, [scrollY, isSnapping, isMobile]);

  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHash = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (currentHash === '#admin') {
    return <AdminPanel />;
  }

  if (currentHash.startsWith('#success')) {
    return <CheckoutSuccess />;
  }

  if (currentHash === '#track') {
    return (
      <div className="bg-[#F7F6F4] text-[#1A1A1A] font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Header isHomepage={false} />
        <TrackOrder />
        <Footer />
      </div>
    );
  }

  if (currentHash === '#cart') {
    return (
      <div className="bg-[#F7F6F4] text-[#1A1A1A] font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Header isHomepage={false} />
        <Cart />
        <Footer />
      </div>
    );
  }

  if (currentHash === '#checkout') {
    return <Checkout />;
  }

  if (currentHash === '#product') {
    return (
      <div className="bg-[#F7F6F4] text-[#1A1A1A] font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Header isHomepage={false} />
        <ProductDetails />
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-brand-bg)] text-[#1A1A1A] font-sans antialiased overflow-x-hidden relative">
      {!isMobile && <div style={{ height: contentHeight }} />}

      <Header isHomepage={true} />
      
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[#EAE6DF] opacity-40 blur-[150px] animate-breath"></div>
        <div className="absolute top-[50%] right-[-10%] w-[800px] h-[800px] bg-white opacity-40 blur-[150px] animate-breath" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        ref={contentRef}
        style={!isMobile ? { y } : {}}
        className={!isMobile ? "fixed top-0 left-0 w-full flex flex-col z-10" : "relative w-full flex flex-col z-10"}
      >
        <Hero />
        <Marquee />
        <Benefits />
        <VsAlternatives />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
      </motion.div>
      <Modal />
      <Analytics />
    </div>
  );
}

export default App;
