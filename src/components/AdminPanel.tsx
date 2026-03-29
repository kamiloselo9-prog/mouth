import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  Lock,
  Edit2,
  X,
  FileText
} from 'lucide-react';

type Order = {
  orderId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  packageName: string;
  quantity: number;
  deliveryMethod: string;
  totalAmount: number;
  inpostPointName?: string;
  inpostPointAddress?: string;
  courierAddress?: string;
  trackingNumber: string;
  status: string;
  createdAt: string;
  note?: string;
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('wszystkie');
  
  // Login State
  const [loginInput, setLoginInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin-orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (response.status === 401) {
           // Silent fail if initial load fails (user not logged in)
        } else {
           setError('Błąd połączenia z bazą danych.');
        }
      }
    } catch (err) {
      setError('Błąd podczas pobierania zamówień.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginInput })
      });
      if (response.ok) {
        setIsAuthenticated(true);
        fetchOrders();
      } else {
        const data = await response.json();
        setError(data.error || 'Nieprawidłowe hasło');
      }
    } catch (err) {
      setError('Błąd serwera. Spróbuj ponownie.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin-logout');
    setIsAuthenticated(false);
    setOrders([]);
  };

  const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const response = await fetch('/api/admin-orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, ...updates })
      });
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(prev => prev.map(o => o.orderId === orderId ? updatedOrder : o));
        if (selectedOrder?.orderId === orderId) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (err) {
      alert('Nie udało się zaktualizować zamówienia.');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.lastName.toLowerCase().includes(search.toLowerCase()) || 
      o.firstName.toLowerCase().includes(search.toLowerCase()) || 
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'wszystkie' || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center px-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-[40px] shadow-sm border border-[#E6E2DA] p-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-black/10">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Panel administracyjny</h1>
          <p className="text-[#86868b] text-sm mb-10">Wprowadź hasło dostępu, aby zarządzać zamówieniami GlowSmile.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <input 
                type="password" 
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Hasło..."
                className="w-full px-6 py-4 bg-[#F5F5F7] border border-transparent rounded-2xl focus:border-[#1A1A1A] focus:bg-white outline-none transition-all text-sm font-semibold text-center tracking-[0.2em] placeholder:tracking-normal"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs font-bold uppercase tracking-wider">{error}</p>}
            </div>
            
            <button 
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl text-sm font-bold uppercase tracking-[0.15em] hover:bg-[#2C2C2C] disabled:bg-gray-400 transition-all flex items-center justify-center gap-3 mt-6"
            >
              {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Zaloguj'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F9] text-[#1D1D1F] font-sans antialiased">
      
      {/* Sidebar Details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-[#F0F0F0] flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                   <h2 className="text-lg font-bold">Szczegóły zamówienia</h2>
                   <p className="text-[11px] text-[#86868b] font-mono tracking-wider uppercase">{selectedOrder.orderId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-[#F5F5F7] rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-8 space-y-12 pb-24">
              <div className="grid grid-cols-2 gap-8">
                 <section>
                    <h3 className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.15em] mb-4">Klient</h3>
                    <p className="font-bold text-lg">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                    <p className="text-[#515154] text-sm">{selectedOrder.email}</p>
                    <p className="text-[#515154] text-sm">{selectedOrder.phone}</p>
                 </section>
                 <section>
                    <h3 className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.15em] mb-4">Status & Wysyłka</h3>
                    <div className="flex flex-col gap-3">
                       <select 
                         value={selectedOrder.status}
                         onChange={(e) => handleUpdateOrder(selectedOrder.orderId, { status: e.target.value })}
                         className="px-4 py-2 bg-[#F5F5F7] border-none rounded-xl text-xs font-bold font-sans outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                       >
                         <option value="W trakcie realizacji">W trakcie realizacji</option>
                         <option value="Wysłano">Wysłano</option>
                         <option value="W paczkomacie">W paczkomacie</option>
                       </select>
                       <div className="relative">
                          <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#A1A1A6]" />
                          <input 
                            type="text"
                            value={selectedOrder.trackingNumber}
                            onChange={(e) => handleUpdateOrder(selectedOrder.orderId, { trackingNumber: e.target.value.toUpperCase() })}
                            placeholder="Numer śledzenia..."
                            className="w-full px-4 py-2 bg-[#F5F5F7] border-none rounded-xl text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                          />
                       </div>
                    </div>
                 </section>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.15em] pb-2 border-b border-[#F0F0F0]">Informacje o Produkcie</h3>
                <div className="flex justify-between items-center text-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F5F5F7] rounded-xl flex items-center justify-center">
                         <Package className="w-6 h-6 text-[#1A1A1A]" />
                      </div>
                      <div>
                        <p className="font-bold">{selectedOrder.packageName}</p>
                        <p className="text-[#86868b] text-xs">Ilość: {selectedOrder.quantity}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-lg">{selectedOrder.totalAmount.toFixed(2)} zł</p>
                      <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block">OPŁACONE</p>
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.15em] pb-2 border-b border-[#F0F0F0]">Dane do dostawy</h3>
                <div className="p-6 bg-[#F5F5F7] rounded-3xl">
                   <div className="flex items-center gap-2 mb-2">
                       {selectedOrder.deliveryMethod === 'Paczkomat InPost' ? <Package className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                       <span className="font-bold text-sm">{selectedOrder.deliveryMethod}</span>
                   </div>
                   <p className="text-sm text-[#515154] leading-relaxed whitespace-pre-wrap">
                      {selectedOrder.inpostPointName ? `${selectedOrder.inpostPointName}\n${selectedOrder.inpostPointAddress}` : selectedOrder.courierAddress}
                   </p>
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.15em] flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Notatki wewnętrzne
                 </h3>
                 <textarea 
                   value={selectedOrder.note || ''}
                   onChange={(e) => handleUpdateOrder(selectedOrder.orderId, { note: e.target.value })}
                   placeholder="Dodaj notatkę... (np. termin wysyłki, specjalne prośby)"
                   className="w-full p-6 bg-[#F5F5F7] border-none rounded-3xl text-sm min-h-[120px] outline-none focus:ring-2 focus:ring-[#1A1A1A] resize-none"
                 />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-[#F0F0F0] px-8 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
           <div className="flex items-center gap-2 select-none">
             <img src="/glowsmile-removebg.png" alt="GlowSmile Logo" className="h-24 object-contain" />
             <span className="text-xs bg-[#1A1A1A] text-white px-2 py-0.5 rounded align-top uppercase">ADMIN</span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex bg-[#F0F0F2] p-1 rounded-xl">
                 {['wszystkie', 'W trakcie realizacji', 'Wysłano', 'W paczkomacie'].map(st => (
                   <button 
                     key={st}
                     onClick={() => setStatusFilter(st)}
                     className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${statusFilter === st ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-[#86868b] hover:text-[#1A1A1A]'}`}
                   >
                     {st === 'wszystkie' ? 'Wszystkie' : st}
                   </button>
                 ))}
              </div>

              <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1A6]" />
                 <input 
                   type="text"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Szukaj zamówień..."
                   className="w-full bg-[#F0F0F2] border-none rounded-xl py-2 pl-10 pr-4 text-xs font-semibold focus:bg-[#EAEAEA] outline-none"
                 />
              </div>

              <button 
                onClick={handleLogout}
                className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest border border-red-100 px-4 py-2 rounded-xl hover:bg-red-50"
              >
                Wyloguj
              </button>
           </div>
        </div>
      </header>
      
      <main className="pt-32 px-12 pb-24 max-w-[1600px] mx-auto animate-in fade-in duration-700">
        <div className="flex items-center justify-between mb-10">
           <div>
              <h1 className="text-4xl font-bold mb-2">Zarządzanie zamówieniami</h1>
              <p className="text-sm text-[#86868b]">Wyświetlasz listę wszystkich zamówień opłaconych przez Stripe.</p>
           </div>
           <div className="flex items-center gap-10">
              <div className="text-center">
                 <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Nowe</p>
                 <p className="text-2xl font-bold">{orders.filter(o => o.status === 'W trakcie realizacji').length}</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Obsłużone</p>
                 <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status !== 'W trakcie realizacji').length}</p>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[32px] border border-[#F0F0F0] shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F9F9FB] border-b border-[#F0F0F0]">
                  <th className="px-8 py-5 text-[10px] font-bold text-[#A1A1A6] uppercase tracking-widest">Numer / Data</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#A1A1A6] uppercase tracking-widest">Klient</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#A1A1A6] uppercase tracking-widest">Pakiet</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#A1A1A6] uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#A1A1A6] uppercase tracking-widest text-right">Kwota</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#A1A1A6] uppercase tracking-widest text-center">Akcja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                 {loading ? (
                    <tr>
                      <td colSpan={6} className="py-24 text-center">
                         <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#1A1A1A] mb-4" />
                         <span className="text-sm font-medium text-[#86868b]">Synchronizacja z bazą danych...</span>
                      </td>
                    </tr>
                 ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-24 text-center text-[#86868b] text-sm">
                        Brak zamówień do wyświetlenia.
                      </td>
                    </tr>
                 ) : filteredOrders.map(order => (
                   <tr key={order.orderId} onClick={() => setSelectedOrder(order)} className="group cursor-pointer hover:bg-[#F9F9FB] transition-colors">
                      <td className="px-8 py-6">
                         <p className="font-mono text-xs font-bold mb-1 tracking-tight">{order.trackingNumber}</p>
                         <p className="text-[10px] text-[#A1A1A6] uppercase font-bold tracking-tighter">
                            {new Date(order.createdAt).toLocaleDateString()}
                         </p>
                      </td>
                      <td className="px-8 py-6">
                         <p className="font-bold text-sm">{order.firstName} {order.lastName}</p>
                         <p className="text-[11px] text-[#86868b]">{order.email}</p>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-[10px] font-bold bg-[#F0F0F2] px-3 py-1 rounded-full uppercase tracking-wider">{order.packageName}</span>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                           order.status === 'W trakcie realizacji' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                           order.status === 'Wysłano' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                           'bg-green-50 text-green-600 border-green-100'
                         }`}>
                           {order.status}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right font-bold text-[15px]">
                         {order.totalAmount.toFixed(2)} zł
                      </td>
                      <td className="px-8 py-6 text-center">
                         <ChevronRight className="w-5 h-5 text-[#E6E2DA] group-hover:text-[#1A1A1A] transition-all" />
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  );
}
