
import React, { useState } from 'react';
import { useAppStore } from '../components/Store';
import { IOSHeader, IOSButton, IOSInput, IOSCard } from '../components/UI';
import { Plus, User, Trash2, Edit2, X, Search, Phone } from 'lucide-react';

const Customers: React.FC = () => {
  const { customers, addCustomer, deleteCustomer, updateCustomer } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', defaultPrice: 60 });
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  ).sort((a, b) => a.name.localeCompare(b.name));

  const resetForm = () => {
    setFormData({ name: '', phone: '', address: '', defaultPrice: 60 });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name) return;
    
    if (editingId) {
      const existing = customers.find(c => c.id === editingId);
      if (existing) updateCustomer({ ...existing, ...formData });
    } else {
      addCustomer(formData);
    }
    resetForm();
  };

  const handleEdit = (c: any) => {
    setFormData({ name: c.name, phone: c.phone, address: c.address, defaultPrice: c.defaultPrice });
    setEditingId(c.id);
    setIsAdding(true);
  };

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#FBFBFD]">
      <IOSHeader title="People" subtitle={`${customers.length} Accounts`} />

      <div className="px-4 pt-4 shrink-0">
        {!isAdding && (
          <div className="relative mb-3 animate-up">
            <input 
              type="text" 
              placeholder="Search by name or mobile..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none font-black text-[#0A1A2F] text-base focus:border-[#007AFF] transition-all shadow-sm"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#007AFF]" size={18} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-20">
        {isAdding ? (
          <div className="animate-up">
            <IOSCard className="p-6 flex flex-col gap-5 border-2 border-slate-100 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-1">
                  <h3 className="font-black text-xl text-[#0A1A2F] tracking-tight">{editingId ? 'Edit Account' : 'New Client'}</h3>
                  <button onClick={resetForm} className="text-slate-500 p-2 btn-touch"><X size={24}/></button>
              </div>
              <IOSInput label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rahul Verma" />
              <IOSInput label="Mobile Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="10-digit mobile" />
              <IOSInput label="Default Rate (₹/L)" type="number" value={formData.defaultPrice} onChange={e => setFormData({...formData, defaultPrice: parseFloat(e.target.value) || 0})} />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <IOSButton variant="secondary" onClick={resetForm} className="py-4">Dismiss</IOSButton>
                <IOSButton onClick={() => handleSubmit()} variant="azure" className="py-4 shadow-lg">Confirm</IOSButton>
              </div>
            </IOSCard>
          </div>
        ) : (
          <div className="flex flex-col gap-3 animate-up">
            {filtered.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <User size={32} />
                </div>
                <p className="text-slate-600 font-black text-xs uppercase tracking-widest">No active accounts found</p>
              </div>
            ) : (
              filtered.map(c => (
                <div key={c.id} className="bg-white border-2 border-slate-50 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 bg-[#0A1A2F] text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-black text-[#0A1A2F] truncate tracking-tight leading-none mb-1.5">{c.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#007AFF] uppercase tracking-widest bg-[#007AFF]/5 px-2 py-0.5 rounded-md border border-[#007AFF]/10">₹{c.defaultPrice}/L</span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{c.phone || 'NO MOBILE'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-4">
                    <button onClick={() => handleEdit(c)} className="w-10 h-10 flex items-center justify-center text-slate-400 active:text-[#007AFF] btn-touch"><Edit2 size={20} /></button>
                    <button onClick={() => { if(confirm('Permanently remove this account?')) deleteCustomer(c.id); }} className="w-10 h-10 flex items-center justify-center text-slate-400 active:text-red-600 btn-touch"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))
            )}
            <button onClick={() => setIsAdding(true)} className="mt-4 p-5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:bg-slate-50 transition-all">
                <Plus size={18} /> Add New Client
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
