export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] text-white py-20 px-6 sm:px-12 ">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
        
        <div className="col-span-1 md:col-span-4">
          <div className="text-2xl font-semibold tracking-[0.2em] mb-8 text-white">SLEEP TAPE</div>
          <p className="text-[#9CA3AF] text-lg font-light leading-relaxed max-w-sm mb-8">
            Fundament Twojego każdego dnia zaczyna się w nocy. Zbudowany z pasją w poszukiwaniu idealnej odnowy biologicznej.
          </p>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-[#737373]">Zakupy</h4>
          <ul className="space-y-5">
            <li><a href="#" className="text-base text-[#E6E2DA] hover:text-white transition-colors">Pakiet 30-dniowy</a></li>
            <li><a href="#" className="text-base text-[#E6E2DA] hover:text-white transition-colors">Subskrypcja (-15%)</a></li>
            <li><a href="#" className="text-base text-[#E6E2DA] hover:text-white transition-colors">Prezenty / Vouchery</a></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-[#737373]">Wsparcie</h4>
          <ul className="space-y-5">
            <li><a href="#faq" className="text-base text-[#E6E2DA] hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="text-base text-[#E6E2DA] hover:text-white transition-colors">Dostawa & Zwroty</a></li>
            <li><a href="#" className="text-base text-[#E6E2DA] hover:text-white transition-colors">Napisz do nas</a></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-[#737373]">Bądź na bieżąco</h4>
          <p className="text-[#9CA3AF] text-base font-light mb-6">Zapisz się by otrzymywać najnowsze wieści na temat snu, optymalizacji ciała i nowe produkty ekskluzywnie u nas jako pierwszy.</p>
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
        <p>© 2026 Sleep Tape. Wszelkie prawa zastrzeżone.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Polityka Prywatności</a>
          <a href="#" className="hover:text-white transition-colors">Regulamin Sklepu</a>
        </div>
      </div>
    </footer>
  );
}
