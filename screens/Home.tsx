
import React, { useMemo } from 'react';
import { useAppStore } from '../components/Store';
import { IOSHeader, IOSCard } from '../components/UI';
import { format } from 'date-fns';
import { Users, TrendingUp, ChevronRight, Droplets } from 'lucide-react';

const Home: React.FC = () => {
  const { customers, deliveries } = useAppStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const stats = useMemo(() => {
    const todayDeliveries = deliveries.filter(d => d.date === today);
    const totalLitres = todayDeliveries.reduce((acc, d) => acc + d.quantity, 0);
    const totalAmount = todayDeliveries.reduce((acc, d) => acc + d.totalAmount, 0);
    
    return {
      todayDeliveries: todayDeliveries.length,
      totalLitres: Number(totalLitres.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      customerCount: customers.length
    };
  }, [deliveries, customers, today]);

  return (
    <div className="flex-1 overflow-y-auto pb-32 fade-in">
      <IOSHeader title="Moo Moo Express" subtitle={format(new Date(), 'EEEE, MMMM do')} />
      
      <div className="px-6 space-y-5 mt-2">
        <div className="bg-[#1b3a57] rounded-[2.8rem] p-8 text-white milk-shadow relative overflow-hidden group">
            <div className="absolute inset-0 cow-pattern opacity-[0.05]"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <p className="text-[#b8860b] font-black text-[10px] tracking-[0.3em] uppercase mb-1">Today's Earnings</p>
                        <h2 className="text-5xl font-black">₹{stats.totalAmount}</h2>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                        <TrendingUp size={24} className="text-[#b8860b]" />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                    <div>
                        <p className="text-white/30 font-bold text-[9px] uppercase tracking-[0.2em] mb-1">Total Milk</p>
                        <p className="text-2xl font-black">{stats.totalLitres}<span className="text-sm text-[#b8860b] ml-1">L</span></p>
                    </div>
                    <div>
                        <p className="text-white/30 font-bold text-[9px] uppercase tracking-[0.2em] mb-1">Pending Drops</p>
                        <p className="text-2xl font-black">{stats.customerCount - stats.todayDeliveries}<span className="text-sm text-white/30 ml-2">Left</span></p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end px-1">
                <h3 className="text-xl font-black text-[#1b3a57] tracking-tight">Recent Activity</h3>
                <span className="text-[10px] font-black text-[#b8860b] uppercase tracking-widest bg-[#b8860b]/10 px-3 py-1.5 rounded-full">Live</span>
            </div>

            {customers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-[#1b3a57]/5">
                    <Droplets size={48} className="mx-auto text-[#1b3a57]/10 mb-4" />
                    <p className="text-[#1b3a57]/40 font-bold italic text-sm px-10">Start by adding customers in the 'People' tab.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {customers.slice(0, 5).map(c => {
                        const deliveryToday = deliveries.find(d => d.customerId === c.id && d.date === today);
                        return (
                            <div key={c.id} className="group bg-white rounded-[2.2rem] p-5 flex items-center justify-between border border-[#1b3a57]/5 shadow-sm active:bg-gray-50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-xl transition-colors ${deliveryToday ? 'bg-[#b8860b] text-white' : 'bg-[#1b3a57]/5 text-[#1b3a57]/20'}`}>
                                      {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black text-[#1b3a57] text-lg">{c.name}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.phone || 'NO CONTACT'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-widest ${deliveryToday ? 'bg-[#1b3a57] text-white shadow-lg shadow-[#1b3a57]/10' : 'bg-slate-100 text-slate-400 opacity-60'}`}>
                                        {deliveryToday ? `${deliveryToday.quantity}L` : 'PENDING'}
                                    </div>
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

export default Home;
