
import React, { useState } from 'react';
import { useAppStore } from '../components/Store';
import { IOSHeader, IOSButton, IOSInput, IOSCard } from '../components/UI';
import { Plus, User, MapPin, Phone, Trash2, Edit2, X } from 'lucide-react';

const Customers: React.FC = () => {
  const { customers, addCustomer, deleteCustomer, updateCustomer } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', defaultPrice: 60 });

  const resetForm = () => {
    setFormData({ name: '', phone: '', address: '', defaultPrice: 60 });
    setIsAdding(false);
    setEditingId(null);
  };

  // Fixed: Made event optional to support both form submission and button click
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name) return;
    
    if (editingId) {
      const existing = customers.find(c => c.id === editingId);
      if (existing) {
        updateCustomer({ ...existing, ...formData });
      }
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
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Fixed: iOSHeader -> IOSHeader */}
      <IOSHeader title="Customers" subtitle={`${customers.length} registered clients`}>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </button>
        )}
      </IOSHeader>

      {isAdding ? (
        <div className="px-6 animate-in slide-in-from-bottom duration-300">
          {/* Fixed: iOSCard -> IOSCard */}
          <IOSCard className="p-6 flex flex-col gap-4 border-2 border-blue-100">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-xl">{editingId ? 'Edit Customer' : 'New Customer'}</h3>
                <button onClick={resetForm} className="text-slate-400 p-1"><X size={24}/></button>
            </div>
            {/* Fixed: iOSInput -> IOSInput */}
            <IOSInput label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <IOSInput label="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <IOSInput label="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <IOSInput label="Default Price (₹/L)" type="number" value={formData.defaultPrice} onChange={e => setFormData({...formData, defaultPrice: parseFloat(e.target.value) || 0})} />
            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Fixed: iOSButton -> IOSButton */}
              <IOSButton variant="secondary" onClick={resetForm}>Cancel</IOSButton>
              {/* Fixed: Wrapped handleSubmit to match onClick: () => void signature */}
              <IOSButton onClick={() => handleSubmit()}>{editingId ? 'Update' : 'Add'}</IOSButton>
            </div>
          </IOSCard>
        </div>
      ) : (
        <div className="px-6 space-y-4">
          {customers.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <User size={32} />
              </div>
              <p className="text-slate-500 font-medium">No customers yet.</p>
              <p className="text-sm text-slate-400">Tap the + button to add one.</p>
            </div>
          ) : (
            customers.map(c => (
              /* Fixed: iOSCard -> IOSCard */
              <IOSCard key={c.id} className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{c.name}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-0.5">
                      <Phone size={14} />
                      <span>{c.phone || 'N/A'}</span>
                    </div>
                  </div>
                  {c.address && (
                    <div className="flex items-start gap-1 text-slate-400 text-xs italic">
                      <MapPin size={12} className="mt-0.5 shrink-0" />
                      <span>{c.address}</span>
                    </div>
                  )}
                  <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold w-fit uppercase">
                    Rate: ₹{c.defaultPrice}/L
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(c)} className="p-2 text-slate-400 hover:text-blue-500"><Edit2 size={20} /></button>
                  <button onClick={() => { if(confirm('Delete customer and all history?')) deleteCustomer(c.id); }} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={20} /></button>
                </div>
              </IOSCard>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Customers;