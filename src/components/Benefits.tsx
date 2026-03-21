import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Moon, Wind, ShieldCheck } from 'lucide-react';
import WaveSeparator from './WaveSeparator';

const benefits = [
  {
    icon: <Moon className="w-8 h-8" strokeWidth={1.5} />,
    title: "Głęboki sen REM",
    description: "Zmusza organizm do oddychania przez nos, co drastycznie zwiększa produkcję tlenku azotu i wydłuża fazy głębokiego snu."
  },
  {
    icon: <Wind className="w-8 h-8" strokeWidth={1.5} />,
    title: "Noce bez chrapania",
    description: "Mechanicznie zapobiega otwieraniu się ust, skutecznie redukując lub całkowicie eliminując problem chrapania."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />,
    title: "Bezpieczny dla skóry",
    description: "Medyczny, hipoalergiczny klej, który zdejmuje się rano bezboleśnie, nie zostawiając żadnych śladów na twarzy."
  }
];

export default function Benefits() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} id="benefits" className="relative min-h-screen flex items-center pt-32 pb-40 px-6 overflow-hidden bg-gradient-to-b from-white via-white to-[#F7F6F4]">
      <WaveSeparator />
      
      <div className="max-w-[1400px] mx-auto z-10 relative w-full">
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]) }}
          className="text-center mb-32"
        >
          <span className="inline-block px-5 py-2 bg-[#EAE6DF]/50 text-[#1A1A1A] rounded-full text-[10px] uppercase font-bold tracking-[0.2em] mb-6 border border-[#E6E2DA]">
              Nauka o śnie
          </span>
          <h2 className="text-4xl md:text-[56px] font-light mb-8 text-[#1A1A1A] tracking-tight">Zaprojektowane dla głębokiej odnowy.</h2>
          <p className="text-[#737373] max-w-2xl mx-auto text-xl font-light leading-relaxed">
            Przeprojektowaliśmy nocne oddychanie. Zmień fragmentowany, płytki sen w głęboką, nieprzerwaną regenerację Twojego ciała.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {benefits.map((b, i) => {
             // Individual parallax hook would be better, but we can map offset based on index
             const start = 0.1 + (i * 0.1);
             const end = start + 0.4;
             
             // eslint-disable-next-line react-hooks/rules-of-hooks
             const y = useTransform(scrollYProgress, [start, end], [100, 0]);
             // eslint-disable-next-line react-hooks/rules-of-hooks
             const opacity = useTransform(scrollYProgress, [start, start + 0.2], [0, 1]);

             return (
              <motion.div
                key={i}
                style={{ y, opacity }}
                className="group flex flex-col items-start text-left bg-white p-14 rounded-[40px] border border-[#E6E2DA]/50 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgb(0,0,0,0.07)] transform hover:-translate-y-3 transition-all duration-700 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#F7F6F4]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="z-10 w-20 h-20 rounded-[28px] bg-[#F7F6F4] flex items-center justify-center mb-10 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors duration-700 text-[#1A1A1A] border border-[#E6E2DA]/50 shadow-inner group-hover:scale-105 transform">
                  {b.icon}
                </div>
                <h3 className="z-10 text-2xl font-medium mb-4 text-[#1A1A1A]">{b.title}</h3>
                <p className="z-10 text-[#737373] font-light leading-relaxed text-lg">
                  {b.description}
                </p>
              </motion.div>
             );
          })}
        </div>
      </div>
    </section>
  );
}
