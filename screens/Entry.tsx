
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../components/Store';
import { IOSHeader, IOSButton, IOSInput } from '../components/UI';
import { format } from 'date-fns';
import { CheckCircle2, AlertCircle, ShoppingBag, Plus, Minus } from 'lucide-react';

const Entry: React.FC = () => {
  const { customers, addDelivery } = useAppStore();
  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const selectedCustomer = customers.find(c => c.id === customerId);

  useEffect(() => {
    if (selectedCustomer) setPrice(selectedCustomer.defaultPrice);
  }, [selectedCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return setError('Please select a client'), setStatus('error');
    
    const success = addDelivery({
      customerId, date, quantity, priceAtTime: price,
      totalAmount: Number((quantity * price).toFixed(2))
    });

    if (success) {
      setStatus('success');
      setTimeout(() => { setCustomerId(''); setQuantity(1); setStatus('idle'); }, 1200);
    } else {
      setError('Entry already logged');
      setStatus('error');
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#FBFBFD]">
      <IOSHeader title="Log Entry" subtitle="Accounting Terminal" vibrant />
      
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-slate-100 flex flex-col gap-5 animate-up">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-[#0051a8] uppercase tracking-widest ml-1">Client Account</label>
            <div className="relative">
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="bg-white border-2 border-slate-200 rounded-xl px-4 py-3 outline-none text-[#0A1A2F] w-full font-black appearance-none transition-all focus:border-[#007AFF] text-base shadow-sm"
              >
                <option value="">Choose registered person...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ShoppingBag size={18} />
              </div>
            </div>
          </div>

          <IOSInput label="Date of Delivery" type="date" value={date} onChange={e => setDate(e.target.value)} />

          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-black text-[#0051a8] uppercase tracking-widest ml-1">Volume Selection (L)</label>
            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1, 1.5, 2].map(p => (
                <button key={p} type="button" onClick={() => setQuantity(p)} className={`py-3 rounded-xl font-black text-sm transition-all btn-touch shadow-sm border-2 ${quantity === p ? 'bg-[#007AFF] border-[#007AFF] text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-1 bg-slate-50 p-2 rounded-xl border-2 border-slate-100">
                <button type="button" onClick={() => setQuantity(prev => Math.max(0, prev - 0.1))} className="w-10 h-10 bg-white shadow-sm border-2 border-slate-200 rounded-lg flex items-center justify-center text-[#0A1A2F] font-black text-xl btn-touch">-</button>
                <div className="flex-1 text-center">
                    <span className="text-xl font-black tabular-nums text-[#0A1A2F]">{quantity.toFixed(1)}</span>
                    <span className="text-[10px] font-black ml-1 text-slate-500 uppercase tracking-widest">LTR</span>
                </div>
                <button type="button" onClick={() => setQuantity(prev => prev + 0.1)} className="w-10 h-10 bg-white shadow-sm border-2 border-slate-200 rounded-lg flex items-center justify-center text-[#0A1A2F] font-black text-xl btn-touch">+</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t-2 border-slate-100">
              <IOSInput label="Rate (₹/L)" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} />
              <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-[#F39C12] uppercase tracking-widest ml-1">Total Due</label>
                  <div className="bg-[#F39C12] text-white rounded-xl px-4 py-3 font-black text-xl flex items-center justify-center tabular-nums shadow-sm border-2 border-[#F39C12]">
                      ₹{(quantity * price).toFixed(0)}
                  </div>
              </div>
          </div>
        </div>

        <div className="mt-2 pb-16 animate-up" style={{ animationDelay: '0.15s' }}>
            {status === 'success' ? (
                <div className="flex items-center justify-center gap-3 p-5 bg-[#2ECC71] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] shadow-lg">
                    <CheckCircle2 size={20} /> Verified Record
                </div>
            ) : status === 'error' ? (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 p-5 bg-red-50 text-red-600 rounded-2xl font-black text-[12px] uppercase tracking-widest border-2 border-red-100">
                        <AlertCircle size={18} /> {error}
                    </div>
                    <IOSButton onClick={() => setStatus('idle')} variant="secondary" className="py-4">Back to Log</IOSButton>
                </div>
            ) : (
                <IOSButton type="submit" disabled={!customerId} variant="azure" className="w-full py-4 text-base shadow-lg">Save Transaction</IOSButton>
            )}
        </div>
      </form>
    </div>
  );
};

export default Entry;
