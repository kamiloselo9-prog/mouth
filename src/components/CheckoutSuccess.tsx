import { useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../store/useCart';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart entirely upon reaching success page
    clearCart();
    window.scrollTo(0, 0);
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#F7F6F4] text-[#1A1A1A] font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-[40px] shadow-sm border border-[#E6E2DA] p-10 md:p-14 text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={2} />
        </div>
        
        <h1 className="text-3xl font-light mb-4">Dziękujemy za zamówienie!</h1>
        <p className="text-[#737373] leading-relaxed mb-10">
          Płatność została potwierdzona. Otrzymasz wiadomość e-mail ze wszystkimi informacjami o zamówieniu oraz numerem do śledzenia przesyłki.
        </p>

        <button 
          onClick={() => window.location.hash = '#home'}
          className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold hover:bg-[#2C2C2C] uppercase tracking-[0.15em] inline-flex items-center gap-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Wróć na stronę główną
        </button>
      </div>
    </div>
  );
}
