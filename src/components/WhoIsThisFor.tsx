import { motion } from 'framer-motion';
import { Leaf, Award, Smile, Wind } from 'lucide-react';

export default function WhoIsThisFor() {
  return (
    <section className="py-32 px-6 bg-[#1A1A1A] text-white relative">
      {/* Bardzo miękkie, ambientowe przejście z jasnego na ciemne tło */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#F7F6F4] via-[#F7F6F4]/40 to-transparent pointer-events-none -translate-y-full"></div>
      
      {/* Absolute Glows */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-white opacity-[0.01] blur-[150px] animate-breath pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto text-center relative z-10 pt-20">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white rounded-full text-[10px] uppercase font-bold tracking-widest mb-6 border border-white/20">
              Dla Kogo?
          </span>
          <h2 className="text-4xl md:text-[56px] font-light mb-8 tracking-tight">Dla tych, którzy odmawiają kompromisów.</h2>
          <p className="text-[#9CA3AF] max-w-3xl mx-auto text-xl font-light leading-relaxed mb-20">
            Niezależnie od tego, czy zależy Ci na ekstremalnej wydajności w pracy, eliminacji uciążliwego chrapania dla partnera, czy po prostu na końcu koszmarnej suchości rano.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: 0.1 }}
             className="bg-[#2C2C2C]/40 backdrop-blur-xl p-10 rounded-[32px] border border-white/5 text-left flex flex-col justify-between"
           >
             <Award className="w-8 h-8 mb-8 text-white/80" strokeWidth={1.5} />
             <div>
               <h4 className="font-semibold text-lg mb-2">High Performers</h4>
               <p className="text-sm text-[#9CA3AF] font-light">Lepsze skupienie, więcej tlenku azotu i regeneracja układu nerwowego dla ambitnych.</p>
             </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: 0.2 }}
             className="bg-[#2C2C2C]/40 backdrop-blur-xl p-10 rounded-[32px] border border-white/5 text-left flex flex-col justify-between"
           >
             <Smile className="w-8 h-8 mb-8 text-white/80" strokeWidth={1.5} />
             <div>
               <h4 className="font-semibold text-lg mb-2">Głośno Chrapiący</h4>
               <p className="text-sm text-[#9CA3AF] font-light">Zminimalizuj uciążliwe dźwięki, które niszczą jakość snu Twoją i Twojego partnera.</p>
             </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: 0.3 }}
             className="bg-[#2C2C2C]/40 backdrop-blur-xl p-10 rounded-[32px] border border-white/5 text-left flex flex-col justify-between"
           >
             <Wind className="w-8 h-8 mb-8 text-white/80" strokeWidth={1.5} />
             <div>
               <h4 className="font-semibold text-lg mb-2">Osoby z suchymi ustami</h4>
               <p className="text-sm text-[#9CA3AF] font-light">Odzyskaj zdrową mikroflorę jamy ustnej. Obudź się bez potrzeby natychmiastowego picia wody.</p>
             </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: 0.4 }}
             className="bg-[#2C2C2C]/40 backdrop-blur-xl p-10 rounded-[32px] border border-white/5 text-left flex flex-col justify-between"
           >
             <Leaf className="w-8 h-8 mb-8 text-white/80" strokeWidth={1.5} />
             <div>
               <h4 className="font-semibold text-lg mb-2">Pielęgnujący urode</h4>
               <p className="text-sm text-[#9CA3AF] font-light">Oddech przez nos promuje lepsze napięcie mięśni twarzy i redukuje zaczerwienienia.</p>
             </div>
           </motion.div>
        </div>
      </div>
      
      {/* Bardzo miękkie, ambientowe przejście do kolejnej jasnej sekcji */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#F7F6F4] via-[#1A1A1A]/40 to-transparent pointer-events-none translate-y-full z-10"></div>
    </section>
  );
}
