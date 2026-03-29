import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Truck, MapPin, Package, Loader2 } from 'lucide-react';
import { useCart } from '../store/useCart';

const deliveryMethods = [
  { id: 'inpost', name: 'Paczkomat InPost', price: 0, icon: BoxIcon },
  { id: 'courier', name: 'Kurier', price: 0, icon: TruckIcon },
];

function BoxIcon(props: any) {
  return <Package {...props} />;
}
function TruckIcon(props: any) {
  return <Truck {...props} />;
}

export default function Checkout() {
  const { items, getCartTotal } = useCart();
  const cartTotal = getCartTotal();

  const totalAmountInPacks = items.reduce((acc: number, item: any) => acc + (item.amount * item.quantity), 0);
  const shippingPrice = totalAmountInPacks <= 14 ? 14.90 : 0;
  
  const [delivery, setDelivery] = useState({ ...deliveryMethods[0], price: shippingPrice });

  useEffect(() => {
    setDelivery(prev => ({ ...prev, price: shippingPrice }));
  }, [shippingPrice]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Point selection state
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  // Custom API Search state
  const [searchCity, setSearchCity] = useState('');
  const [searchPostalCode, setSearchPostalCode] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [hasSearched, setHasSearched] = useState(false);
  const [pointList, setPointList] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const total = cartTotal + delivery.price;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Podaj imię";
    if (!formData.lastName.trim()) newErrors.lastName = "Podaj nazwisko";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Podaj poprawny email";

    const phoneClean = formData.phone.replace(/[\s-]/g, '');
    if (!/(?:\+48)?\d{9}$/.test(phoneClean)) newErrors.phone = "Wpisz poprawny polski numer (9 cyfr)";

    if (delivery.id === 'courier' && !formData.street.trim()) newErrors.street = "Podaj ulicę i numer";
    if (delivery.id === 'courier' && !/^\d{2}-\d{3}$/.test(formData.postalCode)) newErrors.postalCode = "Poprawny format: 00-000";
    if (delivery.id === 'courier' && !formData.city.trim()) newErrors.city = "Podaj miasto";

    if (delivery.id === 'inpost' && !selectedPoint) newErrors.delivery = "Musisz wyszukać i wybrać punkt odbioru InPost.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        setIsSubmitting(true);
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            delivery,
            customerData: formData,
            pointData: selectedPoint
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Network error');
        }

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout session returned');
        }
      } catch (err: any) {
        console.error(err);
        alert(`Wystąpił błąd przy inicjowaniu płatności: ${err.message}`);
        setIsSubmitting(false);
      }
    }
  };

  const handleSearchPaczkomat = async () => {
    setSearchError('');
    const city = searchCity.trim();
    const postalCode = searchPostalCode.trim();

    if (!city || !postalCode) {
      setSearchError('Wpisz miasto i kod pocztowy.');
      return;
    }

    if (!/^\d{2}-\d{3}$/.test(postalCode)) {
      setSearchError('Podaj poprawny kod pocztowy w formacie 00-000.');
      return;
    }

    setSearchLoading(true);
    try {
      const combinedQuery = `${postalCode} ${city}, Polska`;
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(combinedQuery)}`);
      const geoData = await geoResponse.json();

      if (geoData && geoData.length > 0) {
        const lat = parseFloat(geoData[0].lat);
        const lon = parseFloat(geoData[0].lon);

        // Fetch 5 nearest lockers from public Easypack API
        const inpostResponse = await fetch(`https://api-pl-points.easypack24.net/v1/points?relative_point=${lat},${lon}&limit=5&type=parcel_locker`);
        const inpostData = await inpostResponse.json();

        if (inpostData && inpostData.items && inpostData.items.length > 0) {
          setPointList(inpostData.items);
          setHasSearched(true);
        } else {
          setSearchError('Brak paczkomatów w pobliżu tej lokalizacji.');
        }
      } else {
        setSearchError('Nie udało się znaleźć dokładnej lokalizacji. Sprawdź kod pocztowy i miasto.');
      }
    } catch (err) {
      console.error('Błąd wyszukiwania:', err);
      setSearchError('Wystąpił błąd sieci. Spróbuj ponownie.');
    } finally {
      setSearchLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] text-[#1A1A1A] font-sans flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-light mb-4">Twój koszyk jest pusty</h2>
        <button onClick={() => window.location.hash = '#product'} className="px-10 py-4 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold hover:bg-[#2C2C2C] uppercase tracking-widest">
          Wróć do sklepu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#1A1A1A] font-sans overflow-x-hidden pb-32 lg:pb-0">

      <div className="bg-white border-b border-[#E6E2DA] sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.location.hash = '#cart'}
            className="flex items-center gap-2 text-sm font-medium text-[#737373] hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Wróć do koszyka
          </button>
          <div className="text-xl font-medium tracking-[0.2em] text-[#1A1A1A]">KASA</div>
          <div className="w-16"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-16">

        {/* LEWA KOLUMNA: DANE I DOSTAWA */}
        <div className="w-full lg:w-[55%] flex flex-col gap-10">

          {/* SEKACJA: DANE KLIENTA */}
          <section>
            <div>
              <h2 className="text-2xl font-light mb-2">Dane kontaktowe</h2>
              <p className="text-[#737373] text-sm mb-6">Podaj dane do zamówienia.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-[#E6E2DA] flex flex-col gap-5">

              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full relative">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#737373] ml-4 mb-1 block">Imię</label>
                  <input name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full bg-[#F7F6F4] rounded-2xl px-5 py-3.5 outline-none transition-colors border ${errors.firstName ? 'border-red-500' : 'border-transparent focus:border-[#1A1A1A]'}`} placeholder="Jan" />
                  {errors.firstName && <span className="text-red-500 text-xs mt-1 ml-4 block font-medium">{errors.firstName}</span>}
                </div>
                <div className="w-full relative">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#737373] ml-4 mb-1 block">Nazwisko</label>
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full bg-[#F7F6F4] rounded-2xl px-5 py-3.5 outline-none transition-colors border ${errors.lastName ? 'border-red-500' : 'border-transparent focus:border-[#1A1A1A]'}`} placeholder="Kowalski" />
                  {errors.lastName && <span className="text-red-500 text-xs mt-1 ml-4 block font-medium">{errors.lastName}</span>}
                </div>
              </div>

              <div className="w-full relative">
                <label className="text-xs font-bold uppercase tracking-wider text-[#737373] ml-4 mb-1 block">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className={`w-full bg-[#F7F6F4] rounded-2xl px-5 py-3.5 outline-none transition-colors border ${errors.email ? 'border-red-500' : 'border-transparent focus:border-[#1A1A1A]'}`} placeholder="jan.kowalski@email.com" />
                {errors.email && <span className="text-red-500 text-xs mt-1 ml-4 block font-medium">{errors.email}</span>}
              </div>

              <div className="w-full relative">
                <label className="text-xs font-bold uppercase tracking-wider text-[#737373] ml-4 mb-1 block">Telefon</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#737373] font-medium">+48</span>
                  <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className={`w-full bg-[#F7F6F4] rounded-2xl pl-14 pr-5 py-3.5 outline-none transition-colors border ${errors.phone ? 'border-red-500' : 'border-transparent focus:border-[#1A1A1A]'}`} placeholder="123 456 789" />
                </div>
                {errors.phone && <span className="text-red-500 text-xs mt-1 ml-4 block font-medium">{errors.phone}</span>}
              </div>
            </div>
          </section>

          {/* SEKCJA: METODA DOSTAWY */}
          <section>
            <div>
              <h2 className="text-2xl font-light mb-2">Wybierz metodę dostawy</h2>
              <p className="text-[#737373] text-sm mb-6">Dopasuj sposób dostawy do swoich preferencji.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deliveryMethods.map((method) => {
                const isActive = delivery.id === method.id;
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    onClick={() => {
                      setDelivery(method);
                      setErrors(prev => ({ ...prev, delivery: '' }));
                    }}
                    className={`relative bg-white p-5 rounded-[24px] border-[2px] cursor-pointer transition-all duration-300 ${isActive ? 'border-[#1A1A1A] shadow-md' : 'border-[#E6E2DA] hover:border-[#1A1A1A]/40'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center flex-shrink-0 ${isActive ? 'border-[#1A1A1A] bg-[#1A1A1A]' : 'border-[#D6CFC4] bg-white'}`}>
                        {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-[#1A1A1A]' : 'text-[#A3A3A3]'}`} strokeWidth={1.5} />
                      <div className="flex-grow">
                        <div className="font-semibold text-[#1A1A1A] text-[15px]">{method.name}</div>
                        {shippingPrice > 0 ? (
                          <div className="text-[#1A1A1A] font-bold text-sm uppercase tracking-wider">{shippingPrice.toFixed(2).replace('.', ',')} zł</div>
                        ) : (
                          <div className="text-[#10B981] font-bold text-sm uppercase tracking-wider">Darmowa</div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* PACZKOMAT INPOST LOGIC - CLEAN LIST ONLY */}
            <AnimatePresence>
              {delivery.id === 'inpost' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className={`bg-white p-6 rounded-[24px] border ${errors.delivery ? 'border-red-500' : 'border-[#E6E2DA]'}`}>

                    {!selectedPoint ? (
                      <div className="flex flex-col gap-0">
                        <h3 className="font-semibold text-[15px] mb-4">Znajdź paczkomat w swojej okolicy</h3>

                        {/* Search Form always visible when point not selected */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-2">
                          <div className="w-full sm:w-1/3 relative">
                            <input
                              value={searchPostalCode}
                              onChange={(e) => setSearchPostalCode(e.target.value)}
                              className="w-full bg-[#F7F6F4] rounded-[16px] px-5 py-3.5 outline-none transition-colors border border-transparent focus:border-[#1A1A1A] text-sm"
                              placeholder="Kod pocztowy"
                            />
                          </div>
                          <div className="w-full sm:w-2/3 relative">
                            <input
                              value={searchCity}
                              onChange={(e) => setSearchCity(e.target.value)}
                              className="w-full bg-[#F7F6F4] rounded-[16px] px-5 py-3.5 outline-none transition-colors border border-transparent focus:border-[#1A1A1A] text-sm"
                              placeholder="Miasto"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSearchPaczkomat();
                                }
                              }}
                            />
                          </div>
                        </div>

                        {searchError && <p className="text-red-500 text-xs font-medium px-2 py-2">{searchError}</p>}

                        <button
                          type="button"
                          onClick={handleSearchPaczkomat}
                          disabled={searchLoading}
                          className="w-full mt-3 py-3.5 bg-[#1A1A1A] text-white border border-[#1A1A1A] hover:bg-[#2C2C2C] rounded-[16px] text-sm font-semibold transition-colors flex items-center justify-center gap-2 group"
                        >
                          {searchLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <MapPin className="w-4 h-4 text-white" />}
                          Pokaż najbliższe paczkomaty
                        </button>

                        {/* Pure React List - No Maps */}
                        {hasSearched && pointList.length > 0 && (
                          <div className="pt-6 mt-6 border-t border-[#EAE6DF] flex flex-col gap-3">
                            <p className="text-sm font-medium text-[#1A1A1A] mb-2">Wybierz jeden z najbliższych punktów:</p>

                            {pointList.map(point => (
                              <div
                                key={point.name}
                                onClick={() => {
                                  setSelectedPoint({
                                    name: point.name,
                                    address: `${point.address.line1}, ${point.address.line2}`,
                                    city: point.address_details?.city || '',
                                    code: point.name
                                  });
                                  setErrors(prev => ({ ...prev, delivery: '' }));
                                }}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white border border-[#EAE6DF] rounded-[16px] cursor-pointer hover:border-[#1A1A1A] hover:shadow-sm transition-all group"
                              >
                                <div className="w-12 h-12 bg-[#FFCE00]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFCE00]/20 transition-colors">
                                  <Package className="w-6 h-6 text-[#FFCE00]" />
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-start sm:items-center mb-1 gap-2">
                                    <span className="font-bold text-[#1A1A1A] text-[15px]">{point.name}</span>
                                    <span className="text-xs font-semibold text-[#A3A3A3] bg-[#F7F6F4] px-2 py-1 rounded-md whitespace-nowrap">~{Math.round(point.distance)} m</span>
                                  </div>
                                  <div className="text-[#737373] text-sm font-light mb-1">{point.address.line1}, {point.address.line2}</div>
                                  {point.location_description && (
                                    <div className="text-[#A3A3A3] text-xs italic">{point.location_description}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#FFCE00]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-[#FFCE00]" />
                            </div>
                            <div>
                              <div className="font-bold text-[#1A1A1A] text-[15px]">{selectedPoint.name}</div>
                              <div className="text-[#737373] text-sm font-light">{selectedPoint.address}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedPoint(null)}
                            className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] underline underline-offset-4 hover:opacity-70"
                          >
                            Zmień punkt
                          </button>
                        </div>
                      </div>
                    )}

                    {errors.delivery && <span className="text-red-500 text-xs mt-3 block font-medium">{errors.delivery}</span>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* KURIER LOGIC */}
            <AnimatePresence>
              {delivery.id === 'courier' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex flex-col pt-4"
                >
                  <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-[#E6E2DA] flex flex-col gap-5">
                    <h3 className="font-semibold text-[15px] mb-2">Adres do dostawy</h3>
                    <div className="w-full relative">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#737373] ml-4 mb-1 block">Ulica i numer lokalu</label>
                      <input name="street" value={formData.street} onChange={handleInputChange} className={`w-full bg-[#F7F6F4] rounded-2xl px-5 py-3.5 outline-none transition-colors border ${errors.street ? 'border-red-500' : 'border-transparent focus:border-[#1A1A1A]'}`} placeholder="Kwiatowa 15/2" />
                      {errors.street && <span className="text-red-500 text-xs mt-1 ml-4 block font-medium">{errors.street}</span>}
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                      <div className="w-1/3 relative">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#737373] ml-4 mb-1 block">Kod pocztowy</label>
                        <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={`w-full bg-[#F7F6F4] rounded-2xl px-5 py-3.5 outline-none transition-colors border ${errors.postalCode ? 'border-red-500' : 'border-transparent focus:border-[#1A1A1A]'}`} placeholder="00-000" />
                        {errors.postalCode && <span className="text-red-500 text-xs mt-1 ml-4 block font-medium">{errors.postalCode}</span>}
                      </div>
                      <div className="w-2/3 relative">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#737373] ml-4 mb-1 block">Miasto</label>
                        <input name="city" value={formData.city} onChange={handleInputChange} className={`w-full bg-[#F7F6F4] rounded-2xl px-5 py-3.5 outline-none transition-colors border ${errors.city ? 'border-red-500' : 'border-transparent focus:border-[#1A1A1A]'}`} placeholder="Warszawa" />
                        {errors.city && <span className="text-red-500 text-xs mt-1 ml-4 block font-medium">{errors.city}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* PRAWA KOLUMNA: PODSUMOWANIE PAKIETÓW I ZAMÓWIENIA */}
        <div className="w-full lg:w-[45%] lg:relative h-full">
          <div className="lg:sticky lg:top-28 bg-white lg:bg-transparent rounded-t-[40px] lg:rounded-none lg:shadow-none shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t lg:border-none border-[#E6E2DA] p-6 pt-8 pb-32 lg:p-0 z-30 fixed lg:static bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto lg:overflow-visible">

            <div className="bg-white lg:p-8 lg:rounded-[32px] lg:shadow-sm lg:border lg:border-[#E6E2DA]">
              <h3 className="text-lg font-semibold mb-6 hidden lg:block">Podsumowanie Koszyka</h3>

              {/* Items List */}
              <div className="flex flex-col gap-4 mb-6 max-h-[250px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b border-[#EAE6DF] last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-[#F7F6F4] rounded-[16px] border border-[#E6E2DA] flex items-center justify-center flex-shrink-0">
                      <img src={item.image} alt="GlowSmile" className="w-10 h-10 object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold text-[#1A1A1A] text-sm">GlowSmile x{item.quantity}</div>
                      <div className="text-[#737373] text-xs font-light">{item.amount} sztuk ({item.desc})</div>
                    </div>
                    <div className="font-medium text-[#1A1A1A] text-sm whitespace-nowrap">
                      {(item.price * item.quantity).toFixed(2).replace('.', ',')} zł
                    </div>
                  </div>
                ))}
              </div>

              <div className="py-4 border-t border-b border-[#EAE6DF] space-y-3">
                <div className="flex justify-between items-center text-[15px] text-[#404040] font-light">
                  <span>Wartość produktów</span>
                  <span>{cartTotal.toFixed(2).replace('.', ',')} zł</span>
                </div>
                <div className="flex justify-between items-center text-[15px] text-[#404040] font-light">
                  <span>Dostawa ({delivery.name})</span>
                  {delivery.price > 0 ? (
                    <span className="text-[#1A1A1A] font-bold text-sm">{delivery.price.toFixed(2).replace('.', ',')} zł</span>
                  ) : (
                    <span className="text-[#10B981] font-bold uppercase text-xs tracking-widest">Darmowa</span>
                  )}
                </div>

                {/* Dodanie wybranego punktu InPost do Summary */}
                {delivery.id === 'inpost' && selectedPoint && (
                  <div className="pt-2 flex flex-col items-end text-[12px] text-[#A3A3A3]">
                    <span>Wybrany punkt:</span>
                    <span className="font-medium text-[#1A1A1A]">{selectedPoint.name}</span>
                    <span>{selectedPoint.address}</span>
                  </div>
                )}
              </div>

              <div className="py-6 flex justify-between items-end">
                <div>
                  <div className="text-[13px] text-[#737373] uppercase tracking-widest font-bold mb-1">Do zapłaty</div>
                  <div className="text-xs text-[#A3A3A3] font-light">Zawiera podatek VAT</div>
                </div>
                <div className="text-[32px] font-medium text-[#1A1A1A] leading-none">
                  {total.toFixed(2).replace('.', ',')} zł
                </div>
              </div>

              <div className="fixed lg:static bottom-0 left-0 w-full p-4 lg:p-0 bg-white lg:bg-transparent border-t lg:border-none border-[#EAE6DF] z-50">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 lg:py-4 bg-[#1A1A1A] text-white rounded-full text-base font-semibold hover:bg-[#2C2C2C] disabled:bg-[#A3A3A3] hover:scale-[1.02] disabled:scale-100 transition-all duration-300 shadow-2xl lg:shadow-[#1A1A1A]/20 uppercase tracking-[0.15em] outline-none flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Szybka płatność <div className="w-px h-4 bg-white/20 mx-1 hidden sm:block"></div>
                      <span className="hidden sm:inline font-normal text-sm lowercase opacity-80">(Stripe / Blik / Karta)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 lg:mt-6 hidden lg:flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/60 justify-center">
                  <ShieldCheck className="w-4 h-4" /> Bezpieczna płatność Stripe
                </div>
                <div className="text-center text-[#A3A3A3] text-[11px] font-light">Wysyłka następnego dnia roboczego</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
