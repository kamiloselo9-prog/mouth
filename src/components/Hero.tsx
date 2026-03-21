import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Truck, ShieldCheck, Check } from 'lucide-react';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  
  return (
    <section ref={ref} id="hero" className="relative w-full min-h-screen overflow-hidden flex items-center bg-[#F7F6F4]">
      {/* Background Image structure - Static (Fixed movement) */}
      <div className="absolute inset-0 w-full h-full z-0 bg-[#F7F6F4]">
        
        {/* Odcięte zdjęcie, lekko rozciągnięte mocniej w lewą stronę zgodnie z prośbą */}
        <div className="absolute top-0 right-0 w-full md:w-[85%] lg:w-[75%] h-full">
          <img 
            src="/banner.webp"
            alt="Naturalnie zrelaksowana kobieta rano po przespanej nocy"
            className="w-full h-full object-cover object-[30%_center] contrast-[1.05] brightness-[1.03] saturate-[1.05]"
          />
          {/* Biało-kremowy efekt najeżdżający na zdjęcie od lewej (rozmycie/gradient) */}
          <div className="absolute inset-y-0 left-0 w-[55%] md:w-[45%] bg-gradient-to-r from-[#F7F6F4] via-[#F7F6F4]/95 to-transparent"></div>
        </div>

        {/* Ambient glow nad zdjęciem */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-white/30 blur-[130px] mix-blend-screen pointer-events-none rounded-full"></div>
      </div>

      {/* Ten sam biało-kremowy efekt najeżdżający silnie na zdjęcie OD DOŁU. 
          Jest przymocowany sztywno do końca sekcji, przez co nie ukazuje szarpania przy animacji parallax. */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-t from-[#F7F6F4] via-[#F7F6F4]/90 to-transparent z-[5] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 pt-28 pb-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="max-w-[550px]"
        >
           <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#737373] mb-6">
             Sprawdzony wybór tysięcy użytkowników
           </span>

           <h1 className="text-[52px] md:text-[68px] font-light tracking-tight text-[#1A1A1A] leading-[1.05] mb-6 drop-shadow-sm">
             Zamknij usta.<br />
             <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#1A1A1A] to-[#737373]">Otwórz lepszy sen.</span>
           </h1>
           
           <p className="text-xl text-[#1A1A1A]/80 font-light leading-relaxed mb-10 drop-shadow-sm">
             Prosty nawyk, który pomaga poprawić jakość snu, wspiera naturalne oddychanie i pozwala obudzić się naprawdę wypoczętym.
           </p>

           {/* 3 Quick Benefits */}
           <div className="flex flex-col gap-4 mb-12">
             <div className="flex items-center gap-4 text-[#1A1A1A]">
                <div className="w-6 h-6 rounded-full bg-[#EAE6DF] border border-[#D6CFC4]/50 flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5 text-[#1A1A1A]" strokeWidth={2.5} />
                </div>
                <span className="font-medium text-[17px] tracking-wide drop-shadow-sm">Komfort przez całą noc</span>
             </div>
             <div className="flex items-center gap-4 text-[#1A1A1A]">
                <div className="w-6 h-6 rounded-full bg-[#EAE6DF] border border-[#D6CFC4]/50 flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5 text-[#1A1A1A]" strokeWidth={2.5} />
                </div>
                <span className="font-medium text-[17px] tracking-wide drop-shadow-sm">Delikatny dla skóry (hipoalergiczny)</span>
             </div>
             <div className="flex items-center gap-4 text-[#1A1A1A]">
                <div className="w-6 h-6 rounded-full bg-[#EAE6DF] border border-[#D6CFC4]/50 flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5 text-[#1A1A1A]" strokeWidth={2.5} />
                </div>
                <span className="font-medium text-[17px] tracking-wide drop-shadow-sm">Wspiera naturalne oddychanie nocą</span>
             </div>
           </div>

           {/* CTA & Mini Trust Proof */}
           <div className="flex flex-col sm:flex-row items-center gap-6">
             <button 
               onClick={() => window.location.hash = '#product'}
               className="w-full sm:w-auto px-10 py-5 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold hover:bg-[#2C2C2C] hover:scale-[1.03] transition-all duration-500 shadow-xl shadow-[#1A1A1A]/20 uppercase tracking-[0.15em] outline-none"
             >
               Zacznij spać lepiej
             </button>
             
             <div className="flex flex-col text-[11px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest gap-2 mt-2 sm:mt-0">
               <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#1A1A1A]" /> Wysyłka w 24h</span>
               <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#1A1A1A]" /> Bezpieczne płatności</span>
             </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
