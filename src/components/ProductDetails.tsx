import { motion } from 'framer-motion';

export default function ProductDetails() {
  return (
    <section className="py-40 px-6   relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 z-10"
        >
          <span className="inline-block px-4 py-1.5 bg-[#EAE6DF] text-[#1A1A1A] rounded-full text-[10px] uppercase font-bold tracking-[0.2em] mb-6 border border-[#E6E2DA]">
              Materiałoznawstwo
          </span>
          <h2 className="text-4xl md:text-[56px] font-light mb-8 text-[#1A1A1A] tracking-tight">Anatomia komfortu.</h2>
          <p className="text-[#737373] max-w-2xl mx-auto text-xl font-light leading-relaxed">
            Spędziliśmy miesiące testując kleje, włókna i materiały, aby znaleźć idealny balans pomiędzy mocnym trzymaniem, a absolutną bezbolesnością rano.
          </p>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="w-full relative min-h-[500px] bg-white rounded-[40px] overflow-hidden mb-24 shadow-2xl shadow-[#1A1A1A]/5 border border-[#E6E2DA] group flex items-center justify-center p-12"
        >
          {/* Subtle slow spinning ambient glow behind product box */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#1A1A1A]/5 blur-[70px] rounded-full pointer-events-none animate-breath"></div>
          
          <img 
              src="/mouth5.png" 
              alt="Tekstura materiału z bliska"
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000 transform scale-105 group-hover:scale-100"
          />

          <div className="relative z-10">
            <div className="w-[180px] h-[60px] bg-white rounded-full border-2 border-[#E6E2DA] flex flex-col justify-center items-center shadow-2xl shadow-[#1A1A1A]/20 transform rotate-[-5deg] group-hover:rotate-[0deg] transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]">
               <div className="w-24 h-[3px] bg-[#EAE6DF] rounded-full border border-[#E6E2DA]/50" />
            </div>

            {/* Calling out materials */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
               className="absolute top-[-100px] left-[-150px] text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-[#E6E2DA] shadow-sm transform rotate-[5deg]"
            >
              Medyczna, oddychająca taśma
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }}
               className="absolute bottom-[-100px] right-[-150px] text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-[#E6E2DA] shadow-sm transform rotate-[-3deg]"
            >
              Hipoalergiczny, czysty klej
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 w-full max-w-5xl mx-auto text-left relative z-10">
          <div className="bg-white p-10 rounded-[32px] border border-[#E6E2DA] shadow-sm hover:shadow-xl transition-shadow duration-500">
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white mb-6 font-bold text-sm">01</div>
            <h4 className="font-medium text-2xl text-[#1A1A1A] mb-4">Mikroporowata Budowa</h4>
            <p className="text-[#737373] font-light text-lg leading-relaxed">
              Utkana z niewidocznych gołym okiem porów. Skóra może normalnie oddychać pod plastrem, co eliminuje ryzyko zbierania się wilgoci i powstawania podrażnień.
            </p>
          </div>
          <div className="bg-white p-10 rounded-[32px] border border-[#E6E2DA] shadow-sm hover:shadow-xl transition-shadow duration-500">
             <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white mb-6 font-bold text-sm">02</div>
            <h4 className="font-medium text-2xl text-[#1A1A1A] mb-4">Klej bez łez</h4>
            <p className="text-[#737373] font-light text-lg leading-relaxed">
              Zastosowaliśmy specjalistyczny klej w technologii bezlateksowej, która trzyma pewnie przez całe 8 godzin, ale zdejmuje się rano jednym płynnym ruchem nie rwąc włosków.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
