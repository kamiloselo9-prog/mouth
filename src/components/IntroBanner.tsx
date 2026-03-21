import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function IntroBanner() {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={ref} className="relative w-full h-screen overflow-hidden flex items-center justify-center ">
      {/* Tło statyczne bez parallaxu */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/mouth.png" 
          alt="Świeżość poranka i wyspana osoba" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/40 to-[#1A1A1A]/10"></div>
        <div className="absolute inset-0 bg-[#D6CFC4]/10 mix-blend-multiply"></div>
      </div>

      {/* Kontent na środku */}
      <motion.div 
        style={{ opacity: opacityText, y: yText }}
        className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center mt-24"
      >
        <motion.div
           initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
           animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <span className="inline-block px-5 py-2 border border-white/20 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] mb-8 text-white backdrop-blur-md bg-white/10 shadow-sm">
            Codzienna Odnowa
          </span>
          <h1 className="text-5xl md:text-[80px] font-light tracking-tight text-white mb-8 leading-[1.05] drop-shadow-lg">
            Obudź się wypoczęty.<br/>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D6CFC4]">Każdego dnia.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#E6E2DA] max-w-2xl mx-auto mb-14 font-light leading-relaxed drop-shadow-md">
            Prosty nawyk, który pomaga zadbać o spokojniejszy sen i komfort nocnego oddychania.
          </p>
          
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-12 py-5 bg-[#1A1A1A] border border-[#2C2C2C] text-white rounded-full text-sm font-semibold hover:bg-[#2C2C2C] hover:scale-[1.03] transition-all duration-500 shadow-2xl shadow-[#1A1A1A]/50 outline-none hover:shadow-xl uppercase tracking-widest"
          >
            Zobacz jak to działa
          </button>
        </motion.div>
      </motion.div>

      {/* Subtelny Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
      >
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">Odkryj</div>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/70 to-transparent"></div>
      </motion.div>
    </section>
  );
}
