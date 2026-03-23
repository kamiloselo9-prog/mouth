const PROMO_TEXT = "Darmowa dostawa tylko dziś • Ponad 37 000 zadowolonych klientów • Bestseller w Glow Up • Darmowa dostawa tylko dziś •";
const ITEMS = Array(10).fill(PROMO_TEXT);

export default function PromoBanner() {
  return (
    <div className="w-full bg-[#092319] py-2.5 overflow-hidden relative z-[60] border-b border-white/5">
      <div className="flex animate-marquee-slow whitespace-nowrap pause-on-hover w-max">
        <div className="flex items-center gap-4">
          {ITEMS.map((text, i) => (
            <span 
              key={i} 
              className="text-[11px] md:text-xs font-medium text-white/90 uppercase tracking-[0.15em] flex items-center"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
