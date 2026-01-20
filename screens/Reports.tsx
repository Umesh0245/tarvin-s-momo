
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../components/Store';
import { IOSHeader, IOSCard, IOSInput } from '../components/UI';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isSameDay } from 'date-fns';
import { Calendar, Trash2, Download } from 'lucide-react';

const Reports: React.FC = () => {
  const { customers, getDeliveriesForRange, deleteDelivery } = useAppStore();
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

  const handleExport = () => {
    if (filteredDeliveries.length === 0) {
      alert("No data to export for the selected range.");
      return;
    }

    try {
      // 1. Generate all dates in the selected range for columns
      const dateInterval = eachDayOfInterval({
        start: parseISO(startDate),
        end: parseISO(endDate)
      });
      const dateStrings = dateInterval.map(d => format(d, 'yyyy-MM-dd'));
      const displayDates = dateInterval.map(d => format(d, 'dd-MMM'));

      // 2. Identify customers to include
      const customersToExport = selectedCustomerId === 'all' 
        ? customers.filter(c => filteredDeliveries.some(d => d.customerId === c.id))
        : customers.filter(c => c.id === selectedCustomerId);

      // 3. Prepare CSV Headers: [Name, Date1, Date2, ..., Total L, Total Amount]
      const headers = ["Customer Name", ...displayDates, "Total Litres", "Total Amount (₹)"];
      
      const csvRows = [];
      csvRows.push(headers.join(","));

      // 4. Create a row for each customer
      customersToExport.forEach(cust => {
        const rowData = [cust.name];
        let customerTotalL = 0;
        let customerTotalAmt = 0;

        dateStrings.forEach(dateStr => {
          const delivery = filteredDeliveries.find(d => d.customerId === cust.id && d.date === dateStr);
          if (delivery) {
            rowData.push(delivery.quantity.toString());
            customerTotalL += delivery.quantity;
            customerTotalAmt += delivery.totalAmount;
          } else {
            rowData.push(""); // Blank for no delivery
          }
        });

        rowData.push(customerTotalL.toFixed(2));
        rowData.push(customerTotalAmt.toFixed(2));
        csvRows.push(rowData.join(","));
      });

      // 5. Create Daily Totals Row (Bottom Summary)
      const dailyTotalsRow = ["DAILY TOTAL"];
      dateStrings.forEach(dateStr => {
        const dayTotal = filteredDeliveries
          .filter(d => d.date === dateStr)
          .reduce((sum, d) => sum + d.quantity, 0);
        dailyTotalsRow.push(dayTotal > 0 ? dayTotal.toFixed(2) : "");
      });
      // Grand Totals for the summary row
      dailyTotalsRow.push(summary.litres.toFixed(2));
      dailyTotalsRow.push(summary.amount.toFixed(2));
      csvRows.push(dailyTotalsRow.join(","));

      // 6. Generate and Download
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      const fileName = `Milk_Register_${startDate}_to_${endDate}.csv`;
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Export failed", error);
      alert("An error occurred while generating the report. Please check your date range.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32 fade-in">
      <IOSHeader title="Accounting" subtitle="Reports & Statements" />

      <div className="px-6 space-y-5 mt-4">
        <IOSCard className="space-y-5 border-blue-50">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Customer Filter</label>
            <div className="relative">
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="bg-gray-100 border-none rounded-xl px-4 py-4 outline-none text-slate-900 w-full appearance-none font-bold"
              >
                <option value="all">All Customers</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <IOSInput label="From" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <IOSInput label="To" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </IOSCard>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-lg">
            <p className="text-xl font-black">{summary.litres.toFixed(1)}L</p>
            <p className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Total Milk</p>
          </div>
          <div className="bg-blue-600 text-white rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-lg">
            <p className="text-xl font-black">₹{summary.amount.toFixed(0)}</p>
            <p className="text-[9px] uppercase font-bold text-blue-200 tracking-tighter">Total Bill</p>
          </div>
          <div className="bg-white text-slate-800 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-gray-100">
            <p className="text-xl font-black">{summary.days}</p>
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-tighter">Deliveries</p>
          </div>
        </div>

        <div className="mt-4">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-black text-lg text-slate-800 tracking-tight">Delivery Logs</h3>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-4 py-2 rounded-full active:scale-95 transition-transform"
                >
                    <Download size={16} /> DOWNLOAD REGISTER
                </button>
            </div>

            {filteredDeliveries.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-gray-100">
                    <p className="text-slate-300 font-medium">No records found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredDeliveries.map(d => {
                        const cust = customers.find(c => c.id === d.customerId);
                        return (
                            <div key={d.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-center shadow-sm active:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-slate-800">{format(new Date(d.date), 'dd MMM')}</p>
                                            <span className="text-slate-300">|</span>
                                            <p className="text-sm font-bold text-slate-600 truncate max-w-[80px]">{cust?.name || '---'}</p>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{d.quantity}L @ ₹{d.priceAtTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-black text-blue-600 text-lg">₹{d.totalAmount}</p>
                                    <button 
                                        onClick={() => { if(confirm('Delete this record permanently?')) deleteDelivery(d.id); }}
                                        className="text-gray-200 hover:text-red-400 active:text-red-600 p-1"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
