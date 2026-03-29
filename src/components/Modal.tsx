import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Truck, RefreshCcw, FileText, Scale } from 'lucide-react';
import { useModal } from '../store/useModal';
import { useEffect, useState } from 'react';

const Modal = () => {
  const { type, isOpen, closeModal } = useModal();
  const [searchTerm, setSearchTerm] = useState('');

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  const renderContent = () => {
    switch (type) {
      case 'search':
        return (
          <div className="py-12">
            <h2 className="text-3xl font-light mb-8 text-center flex items-center justify-center gap-3">
              <Search className="w-8 h-8 opacity-40" />
              Szukaj produktów
            </h2>
            <div className="relative max-w-xl mx-auto">
              <input
                autoFocus
                type="text"
                placeholder="Czego szukasz? (np. GlowSmile 30)"
                className="w-full bg-[#F7F6F4] border-b-2 border-[#1A1A1A] py-4 px-2 outline-none text-2xl font-light placeholder:text-[#9CA3AF]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="mt-8 text-center text-[#737373]">
                <p>Zacznij pisać, aby wyszukać...</p>
              </div>
            </div>
          </div>
        );
      case 'terms':
        return (
          <div className="prose prose-sm max-w-none prose-neutral">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6" /> Regulamin Sklepu
            </h2>
            <div className="space-y-4 text-[#4B5563] leading-relaxed overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
              <p><strong>§1 Postanowienia ogólne</strong></p>
              <p>1. Regulamin określa zasady korzystania ze sklepu internetowego GlowSmile.</p>
              <p>2. Właścicielem sklepu i administratorem danych jest GlowSmile (kontakt: glowsmile@int.pl).</p>
              <p><strong>§2 Zawarcie umowy</strong></p>
              <p>Umowa sprzedaży zostaje zawarta w momencie potwierdzenia zamówienia przez sprzedawcę po dokonaniu płatności przez kupującego.</p>
              <p><strong>§3 Ceny i Płatności</strong></p>
              <p>Wszystkie ceny są cenami brutto. Obsługujemy płatności elektroniczne oraz karty płatnicze.</p>
              <p><strong>§4 Dostawa</strong></p>
              <p>Termin realizacji zamówienia wynosi zazwyczaj 24-48h od momentu zaksięgowania wpłaty.</p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="prose prose-sm max-w-none prose-neutral">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Scale className="w-6 h-6" /> Polityka Prywatności
            </h2>
            <div className="space-y-4 text-[#4B5563] leading-relaxed overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
              <p>Twoja prywatność jest dla nas priorytetem. Dbamy o to, aby Twoje dane były bezpieczne.</p>
              <p><strong>Administrator danych:</strong> GlowSmile (kontakt: glowsmile@int.pl)</p>
              <p><strong>Cele przetwarzania:</strong> Realizacja zamówień, kontakt z klientem, cele marketingowe (za zgodą).</p>
              <p><strong>Pliki cookies:</strong> Sklep korzysta z plików cookies w celu zapewnienia poprawnego działania oraz analizy ruchu.</p>
            </div>
          </div>
        );
      case 'delivery':
        return (
          <div className="prose prose-sm max-w-none prose-neutral">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Truck className="w-6 h-6" /> Dostawa i Płatności
            </h2>
            <div className="space-y-6 text-[#4B5563] leading-relaxed overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">Metody Dostawy</h3>
                <ul className="list-disc pl-5">
                  <li>InPost Paczkomat 24/7 (Darmowa dostawa)</li>
                  <li>Kurier InPost / DHL (Darmowa dostawa)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">Metody Płatności</h3>
                <ul className="list-disc pl-5">
                  <li>Karty płatnicze (Visa, Mastercard)</li>
                  <li>Blik / Przelewy24 (via Stripe)</li>
                  <li>Apple Pay / Google Pay</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'returns':
        return (
          <div className="prose prose-sm max-w-none prose-neutral">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <RefreshCcw className="w-6 h-6" /> Zwroty i Reklamacje
            </h2>
            <div className="space-y-4 text-[#4B5563] leading-relaxed overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
              <p><strong>Zwroty:</strong> Klient ma prawo odstąpić od umowy bez podania przyczyny w ciągu 14 dni od otrzymania towaru, pod warunkiem, że produkt nie był używany i jest w oryginalnym opakowaniu (ze względów higienicznych).</p>
              <p><strong>Reklamacje:</strong> W przypadku wadliwego towaru prosimy o kontakt na adres: glowsmile@int.pl. Odpowiemy w ciągu 14 dni.</p>
            </div>
          </div>
        );
      case 'legal':
        return (
          <div className="prose prose-sm max-w-none prose-neutral">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Scale className="w-6 h-6" /> Nota Prawna
            </h2>
            <div className="space-y-4 text-[#4B5563] leading-relaxed overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
              <p><strong>Dane kontaktowe:</strong></p>
              <p>GlowSmile<br />
              Email: glowsmile@int.pl<br />
              NIP: (W trakcie uzupełniania)<br />
              REGON: (W trakcie uzupełniania)</p>
              <p>Wszelkie materiały na stronie są chronione prawem autorskim.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-md z-[100] cursor-pointer"
          />

          {/* Liquid Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#F7F6F4] text-[#1A1A1A] transition-all flex h-10 w-10 items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 md:p-12">
                {renderContent()}
              </div>

              {type !== 'search' && (
                <div className="px-8 pb-8 md:px-12 md:pb-12 text-center">
                  <button
                    onClick={closeModal}
                    className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold hover:bg-[#2C2C2C] transition-all"
                  >
                    Zamknij
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
