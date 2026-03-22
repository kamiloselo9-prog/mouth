import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Package, Truck, Search, Loader2 } from 'lucide-react';
import { useCart } from '../store/useCart';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearCart();
    window.scrollTo(0, 0);

    // Extract session_id from URL hash (/#success?session_id=...)
    const hash = window.location.hash;
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      const searchParams = new URLSearchParams(hash.slice(queryIndex + 1));
      const sessionId = searchParams.get('session_id');
      if (sessionId) {
        fetchOrder(sessionId);
      }
    }
  }, [clearCart]);

  const fetchOrder = async (sessionId: string) => {
    setLoading(true);
    try {
      // Need a slight delay because Stripe Webhook might be saving to Supabase at the same time
      // Wait 3 seconds to be safe
      await new Promise(r => setTimeout(r, 2000));
      
      const response = await fetch(`/api/get-order?id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F4] text-[#1A1A1A] font-sans flex flex-col items-center py-16 px-6">
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-sm border border-[#E6E2DA] overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 md:p-12 text-center border-b border-[#F0EFE9]">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-light mb-4">Dziękujemy za zamówienie!</h1>
          <p className="text-[#737373] leading-relaxed max-w-md mx-auto">
            Twoja płatność została pomyślnie przetworzona. Poniżej znajdziesz szczegóły podsumowania.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-8 md:p-12 space-y-8 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
              <p className="text-[#737373] text-sm font-medium">Przygotowujemy podsumowanie...</p>
            </div>
          ) : order ? (
            <div className="space-y-8">
              {/* Order Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-4">
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-widest text-[#A3A3A3] mb-1">Status zamówienia</span>
                    <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold text-xs border border-blue-100">
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-widest text-[#A3A3A3] mb-1">Numer śledzenia</span>
                    <span className="font-mono text-[15px] font-bold text-[#1A1A1A] tracking-wider select-all">{order.trackingNumber}</span>
                  </div>
                </div>
                <div className="space-y-4">
                   <div>
                    <span className="block text-[11px] font-bold uppercase tracking-widest text-[#A3A3A3] mb-1">Data zakupu</span>
                    <span className="text-[#1A1A1A] font-medium">{new Date(order.createdAt).toLocaleDateString('pl-PL')}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-widest text-[#A3A3A3] mb-1">Kupujący</span>
                    <span className="text-[#1A1A1A] font-medium">{order.firstName} {order.lastName}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="p-6 bg-[#F9F8F6] rounded-3xl border border-[#F0EFE9] flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#F0EFE9] flex-shrink-0">
                  {order.deliveryMethod === 'Paczkomat InPost' ? <Package className="w-6 h-6 text-[#1A1A1A]" /> : <Truck className="w-6 h-6 text-[#1A1A1A]" />}
                </div>
                <div className="flex-grow">
                  <span className="block text-[11px] font-bold uppercase tracking-widest text-[#A3A3A3] mb-1">Wybrana dostawa</span>
                  <p className="font-bold text-[#1A1A1A] text-[15px] mb-1">{order.deliveryMethod}</p>
                  <p className="text-[#737373] text-sm leading-relaxed">
                    {order.inpostPointName ? `${order.inpostPointName} - ${order.inpostPointAddress}` : order.courierAddress}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#F0EFE9] text-center">
                 <p className="text-[#737373] text-[13px] italic">
                   Email z potwierdzeniem został właśnie wysłany na adres: <span className="font-semibold text-[#1A1A1A] not-italic">{order.email}</span>
                 </p>
              </div>
            </div>
          ) : (
             <div className="text-center py-6">
                <p className="text-[#737373] text-sm">Przetwarzamy ostatnie detale Twojego zamówienia. Otrzymasz numer śledzenia w wiadomości e-mail w ciągu kilku minut.</p>
             </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 md:p-12 bg-[#F9F8F6] border-t border-[#F0EFE9] flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            type="button"
            onClick={() => window.location.hash = '#home'}
            className="w-full sm:w-auto px-10 py-4 bg-[#1A1A1A] text-white rounded-full text-base font-semibold hover:bg-[#2C2C2C] uppercase tracking-[0.15em] inline-flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="w-4 h-4" /> Wróć do sklepu
          </button>
          
          <button 
            type="button"
            onClick={() => window.location.hash = '#track'}
            className="w-full sm:w-auto px-10 py-4 bg-white border border-[#1A1A1A] text-[#1A1A1A] rounded-full text-base font-semibold hover:bg-[#F0F0F0] uppercase tracking-[0.15em] inline-flex items-center justify-center gap-3 transition-all"
          >
            <Search className="w-4 h-4" /> Śledź paczkę
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-center text-[#A3A3A3] text-xs font-medium uppercase tracking-widest">
        Dziękujemy za zaufanie w Sleep Tape
      </p>
    </div>
  );
}
