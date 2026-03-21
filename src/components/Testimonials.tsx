import { motion } from 'framer-motion';

const testimonials = [
  { 
    quote: "Testowałem trackery i setki supli. Nic tak bardzo nie zboostowało mojego snu głębokiego, jak po prostu wmuszenie nosowego oddechu tą taśmą.", 
    author: "Michał T.", 
    role: "Przedsiębiorca & Biohaker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    verified: true 
  },
  { 
    quote: "Klej jest bezbłędny. Brak podrażnień rano, brak śladów, a chłopak ostatecznie przestał narzekać na moje chrapanie.", 
    author: "Oliwia W.", 
    role: "Trener Personalny",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    verified: true 
  },
  { 
    quote: "Brzmiało abstrakcyjnie dopóki nie zastosowałem. Budzę się niesamowicie ostry, bez zamglenia umysłu i wielkiego suchara w ustach.", 
    author: "Dawid L.", 
    role: "Zweryfikowany Klient",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    verified: true 
  }
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-40 px-6  ">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="inline-block px-4 py-1.5 bg-[#EAE6DF] text-[#1A1A1A] rounded-full text-[10px] uppercase font-bold tracking-widest mb-6 border border-[#E6E2DA]">
              Dowód w liczbach
            </span>
            <h2 className="text-4xl md:text-[56px] font-light text-[#1A1A1A] tracking-tight">Klienci, którzy odzyskali poranki.</h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-6 bg-white px-8 py-5 rounded-[24px] shadow-sm border border-[#E6E2DA]"
          >
             <div className="text-[40px] font-medium text-[#1A1A1A] leading-none">4.9</div>
             <div className="flex flex-col pt-1">
                <div className="flex gap-1 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#1A1A1A] fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <div className="text-[10px] text-[#737373] uppercase tracking-wider font-bold">15,000+ Opinii</div>
             </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="p-12 border border-[#E6E2DA] rounded-[40px] bg-white hover:shadow-2xl hover:shadow-[#1A1A1A]/5 transition-all duration-700 flex flex-col justify-between min-h-[350px] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAE6DF]/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#1A1A1A] fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
              </div>
              <p className="text-[#1A1A1A] text-xl font-light leading-relaxed mb-12">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-5 relative z-10">
                <img src={t.avatar} alt={t.author} className="w-14 h-14 rounded-full object-cover border border-[#E6E2DA] shadow-sm group-hover:scale-110 transition-transform duration-500" />
                <div>
                  <div className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
                    {t.author}
                    {t.verified && <span className="bg-[#EAE6DF] text-[#1A1A1A] text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest font-bold">Kupiony</span>}
                  </div>
                  <div className="text-xs text-[#737373] mt-1 font-medium">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
