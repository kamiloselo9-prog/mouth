import React, { useState } from 'react';
import { Search, Loader2, Package, Truck, Calendar, MapPin, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TrackOrder() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`/api/get-order?tracking=${trackingNumber.trim().toUpperCase()}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        const errData = await response.json();
        setError(errData.error || 'Nie znaleziono zamówienia o podanym numerze.');
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Wystąpił błąd sieci. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#1A1A1A] font-sans pt-32 pb-24 px-6 flex flex-col items-center">
      
      {/* Header Info */}
      <div className="text-center mb-12 max-w-lg mx-auto">
        <h1 className="text-4xl md:text-5xl font-light mb-6">Śledź zamówienie</h1>
        <p className="text-[#737373] text-[15px] leading-relaxed">
          Wprowadź swój numer śledzenia (np. A1B2C3D4) otrzymany w wiadomości e-mail, 
          aby sprawdzić aktualny status przesyłki GlowSmile.
        </p>
      </div>

      {/* Tracking Form Card */}
      <div className="w-full max-w-xl bg-white rounded-[40px] shadow-sm border border-[#E6E2DA] p-8 md:p-12 mb-10 overflow-hidden">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-grow relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3A3A3]" />
            <input 
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Wpisz numer śledzenia..."
              className="w-full bg-[#F7F6F4] border border-transparent focus:border-[#1A1A1A] focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all text-sm font-semibold tracking-wider placeholder:tracking-normal"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl text-sm font-bold uppercase tracking-[0.15em] hover:bg-[#2C2C2C] disabled:bg-[#A3A3A3] transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Szukaj <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {error && (
          <div className="p-5 bg-red-50 text-red-700 rounded-3xl border border-red-100 text-sm font-medium flex items-center justify-center gap-3">
             {error}
          </div>
        )}

        {/* RESULTS SECTION */}
        {order && (
          <div className="mt-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#F9F8F6] rounded-3xl border border-[#F0EFE9]">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#F0EFE9]">
                    <Tag className="w-6 h-6 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-[#A3A3A3] mb-0.5">Twoje paczki</span>
                    <p className="font-bold text-[#1A1A1A] text-[15px]">{order.packageName} (x{order.quantity})</p>
                  </div>
               </div>
               <div className="flex flex-col items-start md:items-end">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#A3A3A3] mb-1">Status</span>
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-[11px] border border-blue-200 uppercase tracking-wider">
                    {order.status}
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px]">
              <div className="space-y-6">
                <div className="flex gap-4">
                   <Calendar className="w-5 h-5 text-[#A3A3A3]" />
                   <div>
                     <span className="block font-bold uppercase tracking-widest text-[#A3A3A3] text-[11px] mb-1">Data zamówienia</span>
                     <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('pl-PL')}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <MapPin className="w-5 h-5 text-[#A3A3A3]" />
                   <div>
                     <span className="block font-bold uppercase tracking-widest text-[#A3A3A3] text-[11px] mb-1">Adres dostawy</span>
                     <p className="font-medium text-[#1A1A1A]">{order.deliveryMethod}</p>
                     <p className="text-[#737373] mt-1 leading-relaxed">
                       {order.inpostPointName ? `${order.inpostPointName}\n${order.inpostPointAddress}` : order.courierAddress}
                     </p>
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                   {order.deliveryMethod === 'Paczkomat InPost' ? <Package className="w-5 h-5 text-[#A3A3A3]" /> : <Truck className="w-5 h-5 text-[#A3A3A3]" />}
                   <div>
                     <span className="block font-bold uppercase tracking-widest text-[#A3A3A3] text-[11px] mb-1">Numer śledzenia</span>
                     <p className="font-mono font-bold text-[15px] tracking-wider">{order.trackingNumber}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <ShieldCheck className="w-5 h-5 text-[#A3A3A3]" />
                   <div>
                     <span className="block font-bold uppercase tracking-widest text-[#A3A3A3] text-[11px] mb-1">Kupujący</span>
                     <p className="font-medium">{order.firstName} {order.lastName.charAt(0)}.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!order && !loading && (
        <div className="text-center text-[#A3A3A3] text-[11px] font-bold uppercase tracking-widest max-w-[280px]">
          Nie otrzymałeś numeru? Skontaktuj się z nami poprzez formularz kontaktowy.
        </div>
      )}

    </div>
  );
}
