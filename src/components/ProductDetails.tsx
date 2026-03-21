import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Star, Check, Shield } from 'lucide-react';
import { useCart } from '../store/useCart';

const images = [
  "/mouth.png",
  "/mouth2.png",
  "/mouth3.png",
  "/mouth4.png",
  "/mouth5.png"
];

const packages = [
  { id: 1, amount: 30, desc: "1 opakowanie", price: "39,99", originalPrice: "49,99", unitPrice: "39,99 zł", popular: false, best: false },
  { id: 2, amount: 60, desc: "2 opakowania", price: "69,99", originalPrice: "99,98", unitPrice: "34,99 zł / opak.", popular: true, best: false },
  { id: 3, amount: 90, desc: "3 opakowania", price: "89,99", originalPrice: "149,97", unitPrice: "29,99 zł / opak.", popular: false, best: true },
];

export default function ProductDetails() {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [selectedPack, setSelectedPack] = useState(packages[2]);
  const { addItem } = useCart();

  // Ensure window starts at top when loading product page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full flex-grow pt-32 pb-24 px-6 md:px-12 lg:px-20 bg-[#F7F6F4]">
      <div className="max-w-[1400px] mx-auto bg-white rounded-[40px] shadow-sm border border-[#E6E2DA] overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT: Image Gallery */}
        <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-14 bg-[#F7F6F4]/50 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full aspect-square rounded-[32px] overflow-hidden bg-white border border-[#E6E2DA] shadow-sm mb-8 relative flex items-center justify-center p-4 lg:p-8"
          >
             <motion.img 
               key={activeImage}
               initial={{ opacity: 0.5, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.4 }}
               src={activeImage} 
               alt="Sleep Tape Product" 
               className="w-full h-full object-cover mix-blend-multiply rounded-[20px]"
             />
          </motion.div>
          
          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-4 w-full justify-start hide-scrollbar">
            {images.map((img, i) => (
              <button 
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-24 h-24 rounded-[20px] bg-white border-[2px] overflow-hidden flex-shrink-0 transition-all duration-300 ${activeImage === img ? 'border-[#1A1A1A] opacity-100 shadow-md' : 'border-[#E6E2DA] opacity-60 hover:opacity-100 hover:border-[#1A1A1A]/50'}`}
              >
                <img src={img} alt={`Miniatura ${i+1}`} className="w-full h-full object-cover mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info & Purchase */}
        <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-16 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <span className="flex items-center text-[#F59E0B] text-base gap-1">
                   <Star className="w-4 h-4 fill-current" />
                   <Star className="w-4 h-4 fill-current" />
                   <Star className="w-4 h-4 fill-current" />
                   <Star className="w-4 h-4 fill-current" />
                   <Star className="w-4 h-4 fill-current" />
                 </span>
                 <a href="#reviews" className="text-[#1A1A1A]/60 font-medium text-sm hover:text-[#1A1A1A] underline-offset-4 hover:underline transition-colors">(480+ Opinii)</a>
               </div>
               <span className="text-[10px] uppercase tracking-widest font-bold text-[#E53E3E] bg-[#E53E3E]/10 px-3 py-1.5 rounded-full">
                 Bestseller
               </span>
            </div>
            
            <h1 className="text-4xl md:text-[52px] font-light text-[#1A1A1A] tracking-tight mb-6 leading-tight">SLEEP TAPE</h1>
            <p className="text-[#737373] text-lg lg:text-xl font-light leading-relaxed mb-10 max-w-xl">
              Produkt zaprojektowany z myślą o komforcie i jakości snu. Oddychający materiał i hipoalergiczny klej dla spokojnej, zregenerowanej nocy.
            </p>

            {/* Price Display */}
            <div className="mb-8 flex items-end gap-5">
              <span className="text-[44px] font-medium text-[#1A1A1A] leading-none">{selectedPack.price} zł</span>
              <span className="text-[22px] text-[#A3A3A3] line-through font-light decoration-1 pb-1">{selectedPack.originalPrice} zł</span>
            </div>

            {/* Packages */}
            <div className="flex flex-col gap-4 mb-10">
              {packages.map((pack) => {
                const isActive = selectedPack.id === pack.id;
                return (
                  <div 
                    key={pack.id}
                    onClick={() => setSelectedPack(pack)}
                    className={`relative w-full border-[2px] rounded-[24px] p-5 cursor-pointer transition-all duration-300 flex items-center justify-between group overflow-hidden ${isActive ? 'border-[#1A1A1A] bg-[#F7F6F4]/50 shadow-md' : 'border-[#E6E2DA] hover:border-[#1A1A1A]/30'}`}
                  >
                     {/* Badges */}
                     {pack.best && (
                       <div className="absolute top-0 right-0 bg-[#1A1A1A] text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-bl-[16px] rounded-tr-[20px] shadow-sm">
                         Najlepszy wybór
                       </div>
                     )}
                     {pack.popular && (
                       <div className="absolute top-0 right-0 bg-[#EAE6DF] text-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-bl-[16px] rounded-tr-[20px]">
                         Najczęściej wybierane
                       </div>
                     )}

                     <div className="flex items-center gap-5 relative z-10 w-1/2">
                        <div className={`w-6 h-6 rounded-full border-[2px] flex items-center justify-center transition-colors flex-shrink-0 ${isActive ? 'border-[#1A1A1A] bg-[#1A1A1A]' : 'border-[#D6CFC4] bg-white group-hover:border-[#1A1A1A]/50'}`}>
                          {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex flex-col">
                           <div className="font-semibold text-[#1A1A1A] text-lg lg:text-[20px]">{pack.amount} sztuk</div>
                           <div className="text-[#737373] text-sm font-light mt-0.5">{pack.desc}</div>
                        </div>
                     </div>

                     <div className="text-right relative z-10 w-1/2 mt-3 md:mt-0 flex flex-col justify-end">
                        <div className="font-medium text-[#1A1A1A] text-xl mb-1">{pack.price} zł</div>
                        <div className="text-[#A3A3A3] text-xs font-light">
                          {pack.unitPrice}
                        </div>
                     </div>
                  </div>
                )
              })}
            </div>

            {/* CTA */}
            <button 
              onClick={() => {
                addItem({
                  id: selectedPack.id,
                  amount: selectedPack.amount,
                  desc: selectedPack.desc,
                  price: parseFloat(selectedPack.price.replace(',', '.')),
                  image: activeImage,
                });
                window.location.hash = '#cart';
              }}
              className="w-full py-5 lg:py-6 bg-[#1A1A1A] text-white rounded-full text-base font-semibold hover:bg-[#2C2C2C] hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-[#1A1A1A]/20 uppercase tracking-[0.15em] outline-none mb-10 flex items-center justify-center gap-3"
            >
              Dodaj do koszyka <span className="opacity-60 text-sm font-normal normal-case">/ {selectedPack.price} zł</span>
            </button>

            {/* Trust Elements */}
            <div className="flex flex-wrap items-center justify-between gap-y-6 gap-x-4 pt-8 border-t border-[#EAE6DF]">
              <div className="flex items-center gap-3 text-[11px] lg:text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80">
                <Truck className="w-5 h-5 text-[#1A1A1A]" strokeWidth={1.5} />
                <span>Wysyłka: ok. 10 dni</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] lg:text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80">
                <ShieldCheck className="w-5 h-5 text-[#1A1A1A]" strokeWidth={1.5} />
                <span>Bezpieczne Płatności</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] lg:text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80">
                <Shield className="w-5 h-5 text-[#1A1A1A]" strokeWidth={1.5} />
                <span>Gwarancja Satysfakcji</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
      
      {/* Bottom Information Grid */}
      <div className="max-w-[1400px] mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Dlaczego Sleep Tape? */}
         <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-[#E6E2DA] shadow-sm flex flex-col justify-center">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A] mb-8 relative inline-block">
              Dlaczego Sleep Tape?
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#1A1A1A]"></div>
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-[#F7F6F4] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#1A1A1A]" strokeWidth={2} />
                </div>
                <span className="text-[#404040] text-base font-light leading-relaxed">Medyczny, perforowany materiał pozwalający skórze oddychać – 100% bezpieczny każdej nocy.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-[#F7F6F4] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#1A1A1A]" strokeWidth={2} />
                </div>
                <span className="text-[#404040] text-base font-light leading-relaxed">Hipoalergiczny, czysto opracowany klej – mocno trzyma na skórze w nocy, gwarantując zupełnie bezbolesne zdejmowanie.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-[#F7F6F4] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#1A1A1A]" strokeWidth={2} />
                </div>
                <span className="text-[#404040] text-base font-light leading-relaxed">Miękkie brzegi i delikatna elastyczność w pełni dopasowująca się do anatomii twarzy.</span>
              </li>
            </ul>
         </div>

         {/* Reviews */}
         <div id="reviews" className="bg-[#1A1A1A] p-8 lg:p-12 rounded-[40px] border border-[#2D2D2D] shadow-2xl flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-8 relative inline-block z-10">
              Co mówią użytkownicy
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-white/40"></div>
            </h4>
            
            <div className="space-y-6 relative z-10">
              {/* Review 1 */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                   <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <p className="text-[#A3A3A3] text-base font-light italic leading-relaxed">"Rewelacja, czuję jakbym w końcu przesypiał pełne 8 godzin, chociaż śpię krócej. Brak suchości w ustach, brak chrapania. Plastry trzymają mega dobrze."</p>
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">— Michał K., Zweryfikowany klient</p>
              </div>

              <div className="w-full h-px bg-white/10"></div>

              {/* Review 2 */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                   <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <p className="text-[#A3A3A3] text-base font-light italic leading-relaxed">"O wiele skuteczniejsze niż tanie alternatywy z apteki. Różnicę widać też przy zdejmowaniu – w ogóle nie ciągną za skórę i nie zostawiają śladów z kleju."</p>
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">— Dawid R., Zweryfikowany klient</p>
              </div>
            </div>
         </div>
      </div>
    </main>
  );
}
