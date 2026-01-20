
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../components/Store';
import { IOSHeader, IOSCard, IOSInput, IOSButton } from '../components/UI';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { Calendar, Trash2, Download, ShieldCheck, UploadCloud, ChevronDown, PieChart } from 'lucide-react';

const Reports: React.FC = () => {
  const { customers, getDeliveriesForRange, deleteDelivery, exportDatabase, importDatabase } = useAppStore();
  const [selectedCustomerId, setSelectedCustomerId] = useState('all');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  const filteredDeliveries = useMemo(() => {
    return getDeliveriesForRange(selectedCustomerId, startDate, endDate);
  }, [selectedCustomerId, startDate, endDate, getDeliveriesForRange]);

  const summary = useMemo(() => {
    return filteredDeliveries.reduce((acc, d) => ({
      litres: acc.litres + d.quantity,
      amount: acc.amount + d.totalAmount,
      days: acc.days + 1
    }), { litres: 0, amount: 0, days: 0 });
  }, [filteredDeliveries]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (confirm('Importing will OVERWRITE current data. Proceed?')) {
        const success = await importDatabase(file);
        if (success) alert('Restore Complete.');
        else alert('Import Failure.');
      }
    }
  };

  const handleExport = () => {
    if (filteredDeliveries.length === 0) return alert("No records for selected period.");
    try {
      const dateInterval = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) });
      const dateStrings = dateInterval.map(d => format(d, 'yyyy-MM-dd'));
      const displayDates = dateInterval.map(d => format(d, 'dd-MMM'));
      const customersToExport = selectedCustomerId === 'all' 
        ? customers.filter(c => filteredDeliveries.some(d => d.customerId === c.id))
        : customers.filter(c => c.id === selectedCustomerId);

      const headers = ["Client", ...displayDates, "Total L", "Total ₹"];
      const csvRows = [headers.join(",")];

      customersToExport.forEach(cust => {
        const rowData = [cust.name];
        let totalL = 0;
        let totalAmt = 0;
        dateStrings.forEach(ds => {
          const delivery = filteredDeliveries.find(d => d.customerId === cust.id && d.date === ds);
          if (delivery) {
            rowData.push(delivery.quantity.toString());
            totalL += delivery.quantity;
            totalAmt += delivery.totalAmount;
          } else rowData.push("");
        });
        rowData.push(totalL.toFixed(1), totalAmt.toFixed(0));
        csvRows.push(rowData.join(","));
      });

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Ledger_${startDate}_${endDate}.csv`);
      link.click();
    } catch (e) { alert("Export error."); }
  };

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#FBFBFD]">
      <IOSHeader title="Ledger" subtitle="Audit & Settlement" vibrant />

      <div className="px-4 pt-5 shrink-0 flex flex-col gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-slate-100 flex flex-col gap-5 animate-up">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-[#0051a8] uppercase tracking-widest ml-1">View Statement For</label>
            <div className="relative">
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="bg-white border-2 border-slate-200 rounded-xl px-4 py-3 outline-none text-[#0A1A2F] w-full font-black appearance-none transition-all shadow-sm focus:border-[#007AFF] text-sm"
              >
                <option value="all">Full Portfolio Statement</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#007AFF]" size={18} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <IOSInput label="Start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <IOSInput label="End" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 animate-up" style={{ animationDelay: '0.05s' }}>
          <div className="bg-[#007AFF] text-white rounded-2xl p-4 text-center shadow-md">
            <p className="text-xl font-black tabular-nums tracking-tighter">{summary.litres.toFixed(1)}L</p>
            <p className="text-[9px] uppercase font-black text-white/90 tracking-widest mt-1">Milk</p>
          </div>
          <div className="bg-[#F39C12] text-white rounded-2xl p-4 text-center shadow-md">
            <p className="text-xl font-black tabular-nums tracking-tighter">₹{summary.amount.toFixed(0)}</p>
            <p className="text-[9px] uppercase font-black text-white/90 tracking-widest mt-1">Cash</p>
          </div>
          <div className="bg-[#0A1A2F] text-white rounded-2xl p-4 text-center shadow-md">
            <p className="text-xl font-black tabular-nums tracking-tighter">{summary.days}</p>
            <p className="text-[9px] uppercase font-black text-white/90 tracking-widest mt-1">Ops</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 mt-8 pb-32">
        <div className="flex justify-between items-center mb-5 px-1 animate-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-black text-[13px] text-[#0A1A2F] uppercase tracking-[0.2em]">Transaction Log</h3>
            <button onClick={handleExport} className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest bg-[#007AFF] px-5 py-2.5 rounded-full btn-touch shadow-md">
                <Download size={14} /> Get CSV
            </button>
        </div>

        <div className="flex flex-col gap-2.5 mb-10 animate-up" style={{ animationDelay: '0.15s' }}>
            {filteredDeliveries.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border-2 border-slate-100 flex flex-col items-center gap-3">
                    <PieChart size={32} className="text-slate-200" />
                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">No entries found</p>
                </div>
            ) : (
                filteredDeliveries.map(d => {
                    const cust = customers.find(c => c.id === d.customerId);
                    return (
                        <div key={d.id} className="bg-white border-2 border-slate-50 rounded-2xl p-4 flex justify-between items-center shadow-sm active:bg-slate-50 transition-all btn-touch">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="bg-[#007AFF]/10 w-10 h-10 rounded-xl flex items-center justify-center text-[#007AFF]">
                                  <Calendar size={20} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-black text-sm text-[#0A1A2F] tabular-nums tracking-tight">{format(parseISO(d.date), 'dd MMM')}</p>
                                        <p className="text-[10px] font-black text-[#007AFF] uppercase tracking-widest truncate max-w-[80px]">{cust?.name}</p>
                                    </div>
                                    <p className="text-[10px] font-black text-[#F39C12] uppercase tracking-[0.2em] mt-1.5">{d.quantity}L • ₹{d.priceAtTime}/L</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 shrink-0">
                                <p className="font-black text-[#0A1A2F] text-xl tabular-nums tracking-tighter">₹{d.totalAmount.toFixed(0)}</p>
                                <button onClick={() => { if(confirm('Delete record?')) deleteDelivery(d.id); }} className="text-slate-300 hover:text-red-600 btn-touch p-2"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>

        <div className="bg-slate-100 rounded-[2rem] p-8 space-y-6 mb-16 animate-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#007AFF]" size={24} />
                <h3 className="font-black text-[#0A1A2F] text-xs uppercase tracking-[0.2em]">Security Console</h3>
            </div>
            <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                Vault backup ensures your ledger is safe. Export to your phone storage weekly to prevent data loss.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
                <button onClick={exportDatabase} className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-slate-200 p-6 rounded-2xl text-[9px] font-black uppercase tracking-widest text-[#0A1A2F] btn-touch shadow-sm">
                   <Download size={22} className="text-[#F39C12]" /> 
                   <span>Back Up</span>
                </button>
                <label className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-slate-200 p-6 rounded-2xl text-[9px] font-black uppercase tracking-widest text-[#0A1A2F] btn-touch shadow-sm cursor-pointer">
                   <UploadCloud size={22} className="text-[#007AFF]" />
                   <span>Restore</span>
                   <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
