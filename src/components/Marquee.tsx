const brands = [
  "Bielenda",
  "Rossmann",
  "Ziaja",
  "Douglas",
  "Bielenda",
  "Rossmann",
  "Ziaja",
  "Douglas"
];

// Powielamy tablicę, tworząc dwie potężne bliźniacze połowy 
// aby zapobiec urywaniu się paska na ogromnych ekranach ultrawide.
const marqueeItems = [...brands, ...brands, ...brands, ...brands];

export default function Marquee() {
  return (
    <section className="w-full py-20 pb-28 overflow-hidden relative bg-[#F7F6F4]">
      <div className="max-w-[1400px] mx-auto text-center mb-12 relative z-10">
        <span className="inline-block px-5 py-2 bg-[#EAE6DF]/60 text-[#1A1A1A] rounded-full text-[10px] uppercase font-bold tracking-[0.2em] border border-[#E6E2DA]">
          Sprzedawane w całej Europie
        </span>
      </div>

      {/* Subtelny ambient glow z tyłu (nadaje głębi tekstom) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[120px] bg-white/70 blur-[80px] pointer-events-none rounded-[100%]"></div>

      {/* Kontener z maską przejścia eliminującą twarde brzegi na końcach ekranu */}
      <div 
        className="relative w-full flex items-center overflow-hidden"
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
      >
        <div 
          className="flex animate-marquee items-center justify-start gap-16 md:gap-32 w-max"
          style={{ animationDuration: '45s' }}
        >
          {marqueeItems.map((brand, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-light text-[#1A1A1A]/40 uppercase tracking-[0.3em] whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
