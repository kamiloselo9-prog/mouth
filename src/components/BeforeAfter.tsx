import { motion } from 'framer-motion';
import { XCircle, CheckCircle } from 'lucide-react';

export default function BeforeAfter() {
  return (
    <section className="py-40 px-6 ">
      <div className="max-w-[1400px] mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <span className="inline-block px-4 py-1.5 bg-[#EAE6DF] text-[#1A1A1A] rounded-full text-[10px] uppercase font-bold tracking-widest mb-6 border border-[#E6E2DA]">
              Faktyczny Kontrast
          </span>
          <h2 className="text-4xl md:text-[56px] font-light mb-6 text-[#1A1A1A] tracking-tight">Różnica, którą poczujesz od razu.</h2>
          <p className="text-[#737373] max-w-2xl mx-auto text-xl font-light leading-relaxed">
            Twój sposób oddychania podczas snu dyktuje poziom Twojej biologicznej energii.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto text-left">
          {/* Before - Zwykły sen */}
          <motion.div 
            initial={{ opacity: 0, x: -30, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0)' }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-[#EAE6DF] p-12 md:p-16 rounded-[40px] border border-[#E6E2DA] opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
          >
             <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <XCircle className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-light text-[#1A1A1A]">Oddychanie ustami</h3>
             </div>
             
             <ul className="space-y-8">
               <li className="flex flex-col gap-2">
                 <span className="font-semibold text-[#1A1A1A] text-lg">Suche usta i zła higiena</span>
                 <span className="text-[#737373] font-light">Ślina odparowuje szybciej, zostawiając doskonałe środowisko dla rozwoju bakterii i próchnicy.</span>
               </li>
               <li className="flex flex-col gap-2">
                 <span className="font-semibold text-[#1A1A1A] text-lg">Chrapanie i mikrowybudzenia</span>
                 <span className="text-[#737373] font-light">Tkanki w jamie ustnej opadają, blokując drogi oddechowe i wywołując uciążliwe wibracje dla Ciebie i partnera.</span>
               </li>
               <li className="flex flex-col gap-2">
                 <span className="font-semibold text-[#1A1A1A] text-lg">Senność poranna</span>
                 <span className="text-[#737373] font-light">Mniejsza saturacja tlenu we krwi sprawia, że budzisz się zmęczony mimo przespanej nocy.</span>
               </li>
             </ul>
          </motion.div>

          {/* After - Z taśmą */}
          <motion.div 
            initial={{ opacity: 0, x: 30, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0)' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-white p-12 md:p-16 rounded-[40px] border border-[#E6E2DA] shadow-2xl shadow-[#1A1A1A]/5 relative overflow-hidden transform hover:-translate-y-2 transition-transform duration-700"
          >
             {/* Subtelny ambient w udanym kafelku */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] rounded-full pointer-events-none animate-breath"></div>

             <div className="flex items-center gap-5 mb-10 relative z-10">
                <div className="w-14 h-14 rounded-full bg-[#E6E2DA] flex items-center justify-center text-[#1A1A1A] shadow-sm">
                  <CheckCircle className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-medium text-[#1A1A1A]">Ze Sleep Tape</h3>
             </div>
             
             <ul className="space-y-8 relative z-10">
               <li className="flex flex-col gap-2">
                 <span className="font-semibold text-[#1A1A1A] text-lg">Wyrzut Tlenku Azotu (NO)</span>
                 <span className="text-[#737373] font-light">Nos działa jako filtr i rozszerza naczynia krwionośne, diametralnie poprawiając wchłanianie tlenu.</span>
               </li>
               <li className="flex flex-col gap-2">
                 <span className="font-semibold text-[#1A1A1A] text-lg">Harmonia i cisza nocna</span>
                 <span className="text-[#737373] font-light">Zamknięte usta i stabilna pozycja języka skutecznie zapobiegają wibracjom i chrapaniu.</span>
               </li>
               <li className="flex flex-col gap-2">
                 <span className="font-semibold text-[#1A1A1A] text-lg">Poranna świeżość</span>
                 <span className="text-[#737373] font-light">Zatrzymujesz nawilżenie, budząc się z gotowością do działania, bez potrzeby walki z suchością gardła.</span>
               </li>
             </ul>

             <div className="absolute top-8 right-8">
               <span className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full font-bold shadow-lg shadow-[#1A1A1A]/20">Cel</span>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
