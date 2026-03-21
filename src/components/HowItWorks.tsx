import { motion } from 'framer-motion';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-40 px-6   relative overflow-hidden">
      
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-24">
        
        {/* Visual Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full relative"
        >
          {/* Breathing decoration behind image */}
          <div className="absolute -inset-4 bg-[#EAE6DF] rounded-[48px] animate-breath blur-lg opacity-50 pointer-events-none"></div>

          <div className="aspect-[4/5] w-full bg-[#111827] rounded-[40px] overflow-hidden relative shadow-2xl shadow-[#1A1A1A]/10 border border-[#E6E2DA] z-10">
            <img 
              src="/mouth4.png" 
              alt="Spokojna sypialnia premium" 
              className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent pointer-events-none"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              viewport={{ once: true }}
              className="absolute bottom-10 left-10 right-10 backdrop-blur-md bg-white/10 p-6 rounded-3xl border border-white/20"
            >
               <p className="text-white font-medium text-xl leading-snug">
                 "3 sekundy przed snem, ułamek poranka. Efekt odczuwasz przez cały dzień."
               </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Text Side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full"
        >
          <span className="inline-block px-4 py-1.5 bg-[#EAE6DF] text-[#1A1A1A] rounded-full text-[10px] uppercase font-bold tracking-widest mb-6 border border-[#E6E2DA]">
            Rytuał zasypiania
          </span>
          <h2 className="text-4xl md:text-[56px] font-light mb-12 text-[#1A1A1A] tracking-tight leading-[1.1]">
            Prostota jest <br />najwyższą formą luksusu.
          </h2>
          
          <div className="space-y-14 relative">
            {/* Subtle connecting line */}
            <div className="absolute left-4 top-4 bottom-10 w-[1px] bg-gradient-to-b from-[#E6E2DA] via-[#E6E2DA] to-transparent"></div>

            {[
              { step: '01', title: 'Przygotuj płótno', text: 'Oczyść i osusz skórę wokół ust. Upewnij się, że nie ma na niej silnych kremów, by zagwarantować perfekcyjne, bezpieczne przyleganie na całą noc.' },
              { step: '02', title: 'Aplikuj z uważnością', text: 'Delikatnie odklej taśmę. Złącz usta w naturalny sposób i nałóż ją poziomo. Nasz porowaty materiał od razu zaczyna oddychać razem z Tobą.' },
              { step: '03', title: 'Zanurz się w sen', text: 'Podczas zasypiania, Twoje ciało kotwiczy się w oddechu przez nos, co natychmiastowo aktywuje układ przywspółczulny, wyciszając umysł.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-10 group relative z-10">
                <div className="w-8 h-8 rounded-full bg-white border border-[#E6E2DA] shadow-sm flex items-center justify-center text-xs font-bold text-[#737373] group-hover:border-[#1A1A1A] group-hover:text-[#1A1A1A] transition-all bg-white relative z-20">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-medium mb-3 text-[#1A1A1A]">{item.title}</h3>
                  <p className="text-[#737373] font-light leading-relaxed text-lg">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
