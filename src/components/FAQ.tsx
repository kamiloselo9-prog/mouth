import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { question: 'Czy bezpiecznie jest zaklejać usta na noc?', answer: 'Tak. Wbrew pozorom, ludzkie ciało jest naturalnie przystosowane do oddychania przez nos podczas snu, a usta służą głównie do spożywania posiłków i mówienia. Nasza taśma jest w pełni bezpieczna, a dzięki otworowi na środku, pozwala na minimalny przepływ powietrza, więc nie ma uczucia uwięzienia.' },
  { question: 'A co jeśli obudzę się w nocy, z zatkanym nosem?', answer: 'Drobny katar to często objaw przewlekłego oddychania ustami. Paradoksalnie, wymuszenie oddechu nosowego poprzez taśmę u wielu osób udrażnia drogi oddechowe po kilku minutach (tzw. zjawisko tlenku azotu). Jeśli dyskomfort jest zbyt duży, jednym pociągnięciem palca ściągasz taśmę.' },
  { question: 'Czy zrywanie tego rano bardzo boli?', answer: 'Absolutnie nie! I to jest jedna z głównych różnic. Używamy specjalistycznego hipoalergicznego kleju żelowego. Taśma chwyta pewnie przez całą noc, ale rano zdejmujesz ją jednym delikatnym ruchem, nie rwie ona skóry ani zarostu.' },
  { question: 'Mam brodę lub wąsy, czy klej chwyci?', answer: 'Przy gęstym zaroście klej ma nieco utrudnione zadanie, ale wystarczy lekko ułożyć wąsy i umieścić pasek poziomo by skleił obie wargi bezpośrednio. Dla najlepszego efektu upewnij się, że zarost jest na 100% suchy, bez żadnych olejków tuż przed snem.' },
  { question: 'Po jakim czasie odczuję różnicę podczas dnia?', answer: 'Od pierwszego użycia. Koniec z suchością w ustach czuć od razu. Poprawa parametrów głębokiego snu z reguły normuje się po pierwszych 3 nocach, jak tylko Twoje ciało zaadaptuje się do nowej, prawidłowej ruty.' }
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
            Masz prawo być sceptyczny. Śpieszmy z konkretnymi odpowiedziami, abyś mógł spać spokojnie.
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
