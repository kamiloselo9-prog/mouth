import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="py-44 px-6 bg-[#1A1A1A] w-full flex justify-center text-center overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white opacity-[0.02] blur-[100px] rounded-full animate-breath pointer-events-none"></div>
      
      <div className="max-w-[800px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block px-5 py-2 border border-white/20 bg-white/5 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] mb-10 text-white backdrop-blur-md">
            Rozpocznij dzisiaj
          </span>
          <h2 className="text-5xl md:text-[72px] font-light tracking-tight text-white mb-8 leading-[1.05]">
            Gotowy by w końcu <br/> <span className="font-semibold px-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">odpocząć</span> jak należy?
          </h2>
          <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-14 font-light leading-relaxed">
            Doświadcz głębokiego wpływu nieprzerwanego snu REM i poranków pełnych energii. Dołącz do elitarnej grupy tysięcy budzących się z potężną witalnością.
          </p>
          
          <button className="px-12 py-6 bg-white text-[#1A1A1A] rounded-full text-lg font-bold hover:bg-[#E6E2DA] hover:scale-[1.03] transition-all duration-300 shadow-2xl shadow-white/10 focus:ring-4 focus:ring-white/50 outline-none">
            Zdobądź Zestaw na 30 Nocy
          </button>

          <p className="mt-8 text-xs text-[#737373] font-medium uppercase tracking-[0.1em]">
            Darmowa dostawa od 150 zł
          </p>
        </motion.div>
      </div>
    </section>
  );
}
