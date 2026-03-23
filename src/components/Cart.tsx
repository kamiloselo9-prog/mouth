import { ArrowLeft, Trash2, Plus, Minus, Truck, ShieldCheck, Shield } from 'lucide-react';
import { useCart } from '../store/useCart';

export default function Cart() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCart();
  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-[#F7F6F4] text-[#1A1A1A] font-sans pb-32">
      <div className="bg-white border-b border-[#E6E2DA] sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-medium text-[#737373] hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kontynuuj zakupy
          </button>
          <div className="text-xl font-medium tracking-[0.2em] text-[#1A1A1A]">KOSZYK</div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 lg:py-16">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-light mb-4">Twój koszyk jest pusty</h2>
            <p className="text-[#737373] mb-8">Nie dodano jeszcze żadnych zestawów Sleep Tape.</p>
            <button 
              onClick={() => window.location.hash = '#product'}
              className="px-10 py-4 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold hover:bg-[#2C2C2C] uppercase tracking-widest inline-block"
            >
              Przejdź do sklepu
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl font-light mb-6">Produkty w koszyku</h2>
              
              <div className="bg-white rounded-[24px] border border-[#E6E2DA] shadow-sm overflow-hidden">
                {items.map((item, index) => (
                  <div key={item.id} className={`p-6 flex flex-col sm:flex-row items-center gap-6 ${index !== items.length - 1 ? 'border-b border-[#EAE6DF]' : ''}`}>
                    <div className="w-24 h-24 bg-[#F7F6F4] rounded-[16px] border border-[#E6E2DA] flex items-center justify-center p-2 flex-shrink-0">
                      <img src={item.image} alt="Sleep Tape" className="w-full h-full object-cover mix-blend-multiply rounded-lg" />
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                      <div className="font-bold text-lg text-[#1A1A1A]">Sleep Tape, {item.amount} sztuk</div>
                      <div className="text-[#737373] text-sm mt-1">{item.desc}</div>
                      <div className="font-medium text-[#1A1A1A] text-lg mt-3 sm:hidden">
                        {(item.price * item.quantity).toFixed(2).replace('.', ',')} zł
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-[#F7F6F4] border border-[#E6E2DA] rounded-full p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-[#1A1A1A] transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-[#1A1A1A] transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="hidden sm:block font-medium text-lg min-w-[80px] text-right">
                        {(item.price * item.quantity).toFixed(2).replace('.', ',')} zł
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[#A3A3A3] hover:text-red-500 transition-colors p-2"
                        title="Usuń z koszyka"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="bg-white p-8 rounded-[32px] border border-[#E6E2DA] shadow-[0_10px_40px_rgba(0,0,0,0.03)] lg:sticky top-28">
                <h3 className="text-xl font-medium mb-6">Podsumowanie</h3>
                
                <div className="py-4 border-b border-[#EAE6DF] space-y-4">
                  <div className="flex justify-between text-[#404040]">
                     <span>Produkty</span>
                     <span>{total.toFixed(2).replace('.', ',')} zł</span>
                  </div>
                  <div className="flex justify-between text-[#404040]">
                     <span className="text-[#10B981] font-bold uppercase text-xs tracking-widest">Wysyłka: Darmowa</span>
                  </div>
                </div>

                <div className="py-6 flex justify-between items-end">
                   <div>
                     <div className="text-sm text-[#737373] uppercase tracking-widest font-bold mb-1">Razem</div>
                   </div>
                   <div className="text-[32px] font-medium text-[#1A1A1A] leading-none">
                     {total.toFixed(2).replace('.', ',')} zł
                   </div>
                </div>

                <button 
                  onClick={() => window.location.hash = '#checkout'}
                  className="w-full py-5 bg-[#1A1A1A] text-white rounded-full text-base font-semibold hover:bg-[#2C2C2C] hover:scale-[1.02] shadow-xl uppercase tracking-[0.1em] outline-none flex items-center justify-center transition-all mb-8"
                >
                  Przejdź do Kasy
                </button>

                {/* Trust Elements */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80">
                    <Truck className="w-5 h-5" strokeWidth={1.5} />
                    <span>Szybka Wysyłka</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80">
                    <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
                    <span>Możliwości Zabezpieczenia</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80">
                    <Shield className="w-5 h-5" strokeWidth={1.5} />
                    <span>Gwarancja Satysfakcji</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
