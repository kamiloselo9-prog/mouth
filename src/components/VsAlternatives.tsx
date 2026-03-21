import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Check, Minus } from 'lucide-react';

const sleepTapeFeatures = [
  "Komfort przez całą noc",
  "Delikatny dla skóry (hipoalergiczny)",
  "Utrzymuje się całą noc",
  "Wspiera naturalne oddychanie",
  "Lepsza jakość snu i regeneracja"
];

const genericFeatures = [
  "Może powodować dyskomfort",
  "Zależy od materiału",
  "Często odkleja się w nocy",
  "Ograniczona przepuszczalność",
  "Nierówna jakość snu"
];

export default function VsAlternatives() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.95, 1, 1, 0.95]);
  
  // Fully Symmetrical Background Transition (In on Enter, Out on Exit)
  // Mapping: 0=Start at bottom, 0.5=Fully centered/top, 1=Gone at top
  const bgOpacity = useTransform(scrollYProgress, 
    [0, 0.4, 0.6, 1], 
    [0, 1, 1, 0]
  );

  return (
    <section ref={containerRef} id="comparison" className="relative h-screen py-12 px-6 flex items-center overflow-hidden bg-white">
      
      {/* Dynamic Background with scroll-controlled opacity to prevent bleeding */}
      <motion.div 
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#D6CFC4] z-0"
      >
        <div className="absolute inset-0 bg-[#0F172A]/40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[#EAE6DF] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      </motion.div>

      <motion.div style={{ opacity, scale }} className="max-w-[1400px] mx-auto z-10 relative w-full translate-y-[-2%]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 lg:mb-12"
        >
          <span className="inline-block px-5 py-1.5 bg-white/5 backdrop-blur-md text-white/90 rounded-full text-[10px] uppercase font-bold tracking-widest mb-4 border border-white/10 shadow-sm">
              Świadomy Wybór
          </span>
          <h2 className="text-3xl md:text-[48px] font-light mb-4 text-white tracking-tight drop-shadow-sm leading-tight">Poczuj prawdziwą różnicę.</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Porównaj nasz produkt z rynkowym standardem i wybierz regenerację.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 max-w-[1100px] mx-auto items-center lg:items-stretch">
          
          {/* KARTA LEFT: SLEEP TAPE */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full bg-white p-8 lg:p-12 rounded-[40px] shadow-[0_0_60px_rgba(255,255,255,0.05)] border border-[#E6E2DA] relative z-20 lg:scale-[1.05] hover:scale-[1.07] transition-all duration-700"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap shadow-xl">
              Sleep Tape
            </div>

            <div className="text-center mb-8 lg:mb-10 mt-2">
              <h3 className="text-2xl text-[#1A1A1A] font-semibold tracking-wide">Nasz Produkt</h3>
              <div className="w-10 h-[2px] bg-[#1A1A1A]/10 mx-auto mt-4"></div>
            </div>

            <div className="space-y-4 lg:space-y-6">
              {sleepTapeFeatures.map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-[#EAE6DF] border border-[#D6CFC4]/50 flex items-center justify-center flex-shrink-0 shadow-sm">
                     <Check className="w-4 h-4 text-[#1A1A1A]" strokeWidth={2.5} />
                   </div>
                   <div className="text-[#1A1A1A] font-medium leading-relaxed text-[15px] lg:text-[16px]">{text}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* KARTA RIGHT: INNE TAŚMY */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex-1 w-full bg-white/5 backdrop-blur-md border border-white/10 p-8 lg:p-12 rounded-[40px] opacity-60 lg:scale-[0.95] hover:opacity-80 transition-all duration-700"
          >
            <div className="text-center mb-8 lg:mb-10 mt-2">
              <h3 className="text-xl text-white/90 font-medium tracking-wide">Zwykłe taśmy</h3>
              <div className="w-10 h-px bg-white/20 mx-auto mt-4"></div>
            </div>

            <div className="space-y-4 lg:space-y-6">
              {genericFeatures.map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                     <Minus className="w-4 h-4 text-white/30" strokeWidth={2} />
                   </div>
                   <div className="text-white/40 font-light leading-relaxed text-[15px] lg:text-[16px]">{text}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
      
      {/* Bottom Soft Transition - Very Subtle */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/5 to-transparent pointer-events-none z-10 opacity-20"></div>
    </section>
  );
}
