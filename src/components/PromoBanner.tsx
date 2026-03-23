const PROMO_TEXT = "DARMOWA DOSTAWA TYLKO DZIŚ • ";
const ITEMS = Array(20).fill(PROMO_TEXT);

export default function PromoBanner() {
  return (
    <div className="w-full bg-[#1A1A1A] py-3.5 overflow-hidden relative z-[60] border-b border-white/5">
      <div className="flex animate-marquee-slow whitespace-nowrap pause-on-hover w-max">
        <div className="flex items-center gap-6">
          {ITEMS.map((text, i) => (
            <span 
              key={i} 
              className="text-xs md:text-sm font-semibold text-white uppercase tracking-[0.2em] flex items-center"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
