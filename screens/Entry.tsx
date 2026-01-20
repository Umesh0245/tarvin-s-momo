
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../components/Store';
import { IOSHeader, IOSButton, IOSInput } from '../components/UI';
import { format } from 'date-fns';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const Entry: React.FC = () => {
  const { customers, addDelivery } = useAppStore();
  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedCustomer = customers.find(c => c.id === customerId);

  useEffect(() => {
    if (selectedCustomer) {
      setPrice(selectedCustomer.defaultPrice);
    }
  }, [selectedCustomer]);

  const resetForm = () => {
    setCustomerId('');
    setQuantity(1);
    setStatus('idle');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
        setErrorMessage('Select a customer first');
        setStatus('error');
        return;
    }
    
    if (new Date(date) > new Date()) {
        setErrorMessage('Future dates not allowed');
        setStatus('error');
        return;
    }

    if (quantity <= 0) {
        setErrorMessage('Quantity must be greater than 0');
        setStatus('error');
        return;
    }

    const success = addDelivery({
      customerId,
      date,
      quantity,
      priceAtTime: price,
      totalAmount: Number((quantity * price).toFixed(2))
    });

    if (success) {
      setStatus('success');
      // Briefly show success then allow next entry
      setTimeout(() => {
        setCustomerId('');
        setQuantity(1);
        setStatus('idle');
      }, 1500);
    } else {
      setErrorMessage('Entry already exists for this date');
      setStatus('error');
    }
  };

  const presets = [0.25, 0.5, 1, 1.5, 2, 5];

  return (
    <div className="flex-1 overflow-y-auto pb-32 fade-in">
      {/* Fixed: iOSHeader -> IOSHeader */}
      <IOSHeader title="Add Entry" subtitle="New delivery record">
        <button onClick={resetForm} className="p-2 text-slate-400 active:text-slate-600 transition-colors">
          <RefreshCw size={20} />
        </button>
      </IOSHeader>

      <form onSubmit={handleSubmit} className="px-6 flex flex-col gap-6 mt-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Select Customer</label>
          <div className="relative">
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="bg-gray-100 border-2 border-transparent focus:border-blue-500/10 focus:bg-white rounded-xl px-4 py-4 outline-none text-slate-900 w-full appearance-none font-medium"
            >
              <option value="">-- Tap to Select --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>

        {/* Fixed: iOSInput -> IOSInput */}
        <IOSInput 
          label="Delivery Date" 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
        />

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Quantity (Litres)</label>
          <div className="grid grid-cols-3 gap-2">
            {presets.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setQuantity(p)}
                className={`py-3.5 rounded-xl font-bold transition-all active:scale-95 ${quantity === p ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-gray-200 text-slate-600'}`}
              >
                {p} L
              </button>
            ))}
          </div>
          {/* Fixed: iOSInput -> IOSInput */}
          <IOSInput 
            label="Adjust or Enter Manually" 
            type="number" 
            step="0.01"
            value={quantity} 
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            {/* Fixed: iOSInput -> IOSInput */}
            <IOSInput 
                label="Price/L" 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} 
            />
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Total Bill</label>
                <div className="bg-blue-50 text-blue-700 rounded-xl px-4 py-4 font-bold border border-blue-100/50">
                    ₹{(quantity * price).toFixed(2)}
                </div>
            </div>
        </div>

        <div className="mt-4">
            {status === 'success' ? (
                <div className="flex items-center justify-center gap-3 p-5 bg-green-100 text-green-700 rounded-2xl font-bold animate-pulse">
                    <CheckCircle2 size={24} />
                    Entry Saved
                </div>
            ) : status === 'error' ? (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 p-4 bg-red-100 text-red-700 rounded-2xl font-bold">
                        <AlertCircle size={20} />
                        {errorMessage}
                    </div>
                    {/* Fixed: iOSButton -> IOSButton */}
                    <IOSButton onClick={() => setStatus('idle')} variant="secondary">Try Again</IOSButton>
                </div>
            ) : (
                /* Fixed: iOSButton -> IOSButton */
                <IOSButton type="submit" disabled={!customerId} className="w-full py-5 text-lg shadow-xl shadow-blue-500/10">
                  Save Delivery
                </IOSButton>
            )}
        </div>
      </form>
    </div>
  );
};

export default Entry;
