import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { question: 'Czy bezpiecznie jest używać pasków wybielających w domu?', answer: 'Tak. Paski Guru Nanda zostały zaprojektowane przez profesjonalistów z myślą o maksymalnym bezpieczeństwie dla szkliwa, dzięki czemu możesz osiągnąć dentystyczny efekt bezpiecznie i samodzielnie.' },
  { question: 'Czy moje zęby staną się nadwrażliwe?', answer: 'Innowacyjna formuła nie zawiera bardzo inwazyjnych utleniaczy, które często powodują dyskomfort i nadwrażliwość na zimno. Kuracja jest delikatna, a zarazem skuteczna.' },
  { question: 'Czy paski przesuwają się pod wpływem śliny?', answer: 'Absolutnie nie! To jedna z różnic pomiędzy tanimi plastrami z apteki. Wykorzystujemy technologię dry strip, więc paski przylegają z całej siły bez względu na poziom nawilżenia jamy ustnej.' },
  { question: 'Jak działa żel na paskach i czy usuwa plamy?', answer: 'Żel na paskach aktywuje się w kontakcie ze szkliwem, wnikając w mikropory zębów. Skutecznie rozbija cząsteczki barwników pochodzących z kawy, herbaty czy wina, przywracając naturalną biel bez uszkadzania struktury zęba.' },
  { question: 'Po jakim czasie zauważę pierwsze efekty kuracji?', answer: 'Pierwsze efekty można często dostrzec już po zdjęciu pierwszego lub drugiego paska, gdzie osad jest błyskawicznie usuwany. Docelowy, biały odcień wymaga od 7 do 14 zabiegów.' }
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-40 px-6  ">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-[#EAE6DF] text-[#1A1A1A] rounded-full text-[10px] uppercase font-bold tracking-widest mb-6 border border-[#E6E2DA]">
              Ekspert Radzi
          </span>
          <h2 className="text-4xl md:text-[56px] font-light mb-6 text-[#1A1A1A] tracking-tight">Najczęstsze wątpliwości.</h2>
          <p className="text-[#737373] max-w-xl mx-auto text-xl font-light">
            Masz prawo być sceptyczny. Śpieszymy z konkretnymi odpowiedziami, abyś mógł uśmiechać się od ucha do ucha.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-[#E6E2DA] bg-[#F7F6F4] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <button 
                className="w-full flex justify-between items-center p-8 text-left focus:outline-none"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-lg text-[#1A1A1A] pr-8">{faq.question}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open === i ? 'bg-[#1A1A1A] text-white' : 'bg-[#E6E2DA]/50 text-[#1A1A1A]'}`}>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-500 ease-out ${open === i ? 'rotate-180' : ''}`} 
                    strokeWidth={2}
                  />
                </div>
              </button>
              
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-8 pt-2 text-[#737373] font-light text-lg leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
