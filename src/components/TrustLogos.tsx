import { Shield, Truck, RefreshCcw, ThumbsUp } from 'lucide-react';

export default function TrustLogos() {
  return (
    <section className="py-24 px-6  overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col space-y-24">
        
        {/* Partner Logos placeholder */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#737373] mb-10">Zaufali nam eksperci i sportowcy powiązani z:</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            {["VOGUE", "GQ", "FORBES", "WIRED", "WHOOP"].map((logo, i) => (
               <div key={i} className="text-xl md:text-3xl font-bold tracking-[0.4em] text-[#1A1A1A] select-none pointer-events-none">
                 {logo}
               </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto w-full  pt-20">
           <div className="flex flex-col items-center text-center group">
             <div className="w-14 h-14 rounded-full bg-[#EAE6DF] flex items-center justify-center mb-6 border border-[#E6E2DA] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors duration-500 text-[#1A1A1A]">
               <Shield className="w-6 h-6" strokeWidth={1.5} />
             </div>
             <div className="text-xs uppercase tracking-[0.15em] font-bold mb-2 text-[#1A1A1A]">Szyfrowana Kasa</div>
             <div className="text-sm text-[#737373] font-light max-w-[150px]">Płatności w 100% bezpieczne</div>
           </div>
           
           <div className="flex flex-col items-center text-center group">
             <div className="w-14 h-14 rounded-full bg-[#EAE6DF] flex items-center justify-center mb-6 border border-[#E6E2DA] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors duration-500 text-[#1A1A1A]">
               <Truck className="w-6 h-6" strokeWidth={1.5} />
             </div>
             <div className="text-xs uppercase tracking-[0.15em] font-bold mb-2 text-[#1A1A1A]">Ekspresowy Transport</div>
             <div className="text-sm text-[#737373] font-light max-w-[150px]">Paczkomaty lub Kurier w 24h</div>
           </div>
           
           <div className="flex flex-col items-center text-center group">
             <div className="w-14 h-14 rounded-full bg-[#EAE6DF] flex items-center justify-center mb-6 border border-[#E6E2DA] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors duration-500 text-[#1A1A1A]">
               <RefreshCcw className="w-6 h-6" strokeWidth={1.5} />
             </div>
             <div className="text-xs uppercase tracking-[0.15em] font-bold mb-2 text-[#1A1A1A]">Bezproblemowy zwrot</div>
             <div className="text-sm text-[#737373] font-light max-w-[150px]">Aż do 30 dni na odesłanie</div>
           </div>
           
           <div className="flex flex-col items-center text-center group">
             <div className="w-14 h-14 rounded-full bg-[#EAE6DF] flex items-center justify-center mb-6 border border-[#E6E2DA] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors duration-500 text-[#1A1A1A]">
               <ThumbsUp className="w-6 h-6" strokeWidth={1.5} />
             </div>
             <div className="text-xs uppercase tracking-[0.15em] font-bold mb-2 text-[#1A1A1A]">Gwarancja Snu</div>
             <div className="text-sm text-[#737373] font-light max-w-[150px]">Jeśli nie zobaczysz efektu, oddamy kasę.</div>
           </div>
        </div>

      </div>
    </section>
  );
}
