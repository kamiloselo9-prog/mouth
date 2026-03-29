import { useModal } from "../store/useModal";

export default function Footer() {
  const { openModal } = useModal();
  return (
    <footer className="w-full bg-[#1A1A1A] text-white py-20 px-6 sm:px-12 ">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
        
        <div className="col-span-1 md:col-span-3">
          <div className="mb-8">
            <img src="/glowsmile-removebg.png" alt="GlowSmile Logo" className="h-32 object-contain brightness-0 invert" />
          </div>
          <p className="text-[#9CA3AF] text-lg font-light leading-relaxed max-w-sm mb-8">
            Pewność siebie zaczyna się od Twojego uśmiechu. Zbudowany z pasją w poszukiwaniu idealnej estetyki i zdrowia.
          </p>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-[#737373]">Zakupy</h4>
          <ul className="space-y-5">
            <li><a href="#product" className="text-base text-[#E6E2DA] hover:text-white transition-colors">1 opakowanie</a></li>
            <li><a href="#product" className="text-base text-[#E6E2DA] hover:text-white transition-colors">Pakiet 2 + 1 GRATIS</a></li>
            <li><a href="#product" className="text-base text-[#E6E2DA] hover:text-white transition-colors">Zestaw 3 + 2 GRATIS</a></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-[#737373]">Wsparcie</h4>
          <ul className="space-y-5">
            <li><a href="#faq" className="text-base text-[#E6E2DA] hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#track" className="text-base font-bold text-white transition-colors flex items-center gap-2">Śledź zamówienie <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span></a></li>
            <li><a href="#" className="text-base text-[#E6E2DA] hover:text-white transition-colors">Dostawa & Zwroty</a></li>
            <li><a href="#" className="text-base text-[#E6E2DA] hover:text-white transition-colors">Napisz do nas</a></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-[#737373]">Informacje</h4>
          <ul className="space-y-3">
            <li><button onClick={() => openModal('search')} className="text-base text-[#E6E2DA] hover:text-white transition-colors text-left w-full">Szukaj</button></li>
            <li><button onClick={() => openModal('terms')} className="text-base text-[#E6E2DA] hover:text-white transition-colors text-left w-full">Regulamin sklepu</button></li>
            <li><button onClick={() => openModal('privacy')} className="text-base text-[#E6E2DA] hover:text-white transition-colors text-left w-full">Polityka prywatności</button></li>
            <li><button onClick={() => openModal('delivery')} className="text-base text-[#E6E2DA] hover:text-white transition-colors text-left w-full">Dostawa i płatności</button></li>
            <li><button onClick={() => openModal('returns')} className="text-base text-[#E6E2DA] hover:text-white transition-colors text-left w-full">Zwroty i reklamacje</button></li>
            <li><button onClick={() => openModal('legal')} className="text-base text-[#E6E2DA] hover:text-white transition-colors text-left w-full">Nota prawna</button></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-3">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-[#737373]">Bądź na bieżąco</h4>
          <p className="text-[#9CA3AF] text-base font-light mb-6">Zapisz się by otrzymywać najnowsze powiadomienia na temat pielęgnacji uśmiechu i nowe produkty ekskluzywnie u nas jako pierwszy.</p>
          <div className="flex border-b border-[#2D2D2D] pb-3 group relative overflow-hidden">
            <input 
              type="email" 
              placeholder="Twój email..." 
              className="bg-transparent outline-none text-base w-full text-white placeholder:text-[#737373] font-light z-10 relative" 
            />
            <button className="text-sm text-white uppercase tracking-[0.1em] font-bold transition-opacity z-10 relative pointer-events-auto hover:text-[#9CA3AF]">
              Zapisz
            </button>
          </div>
        </div>

      </div>

      <div className="max-w-[1400px] mx-auto mt-24 pt-10  flex flex-col md:flex-row justify-between items-center gap-6 text-sm tracking-wider text-[#737373] font-light">
        <p>© 2026 GlowSmile. Wszelkie prawa zastrzeżone.</p>
        <div className="flex gap-8">
          <button onClick={() => openModal('privacy')} className="hover:text-white transition-colors">Polityka Prywatności</button>
          <button onClick={() => openModal('terms')} className="hover:text-white transition-colors">Regulamin Sklepu</button>
        </div>
      </div>
    </footer>
  );
}
