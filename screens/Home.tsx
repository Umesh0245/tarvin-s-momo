
import React, { useMemo } from 'react';
import { useAppStore } from '../components/Store';
import { IOSHeader } from '../components/UI';
import { format } from 'date-fns';
import { TrendingUp, Droplets, ShieldCheck, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const { customers, deliveries } = useAppStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const stats = useMemo(() => {
    const todayDeliveries = deliveries.filter(d => d.date === today);
    return {
      totalLitres: todayDeliveries.reduce((acc, d) => acc + d.quantity, 0),
      totalAmount: todayDeliveries.reduce((acc, d) => acc + d.totalAmount, 0),
      count: todayDeliveries.length,
      remaining: Math.max(0, customers.length - todayDeliveries.length)
    };
  }, [deliveries, customers, today]);

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#FBFBFD]">
      <IOSHeader title="Overview" subtitle={format(new Date(), 'MMM do')} vibrant />
      
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 flex flex-col gap-5">
        <div className="vibrant-gradient rounded-2xl p-6 text-white relative overflow-hidden shrink-0 shadow-xl animate-up">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={80} />
            </div>
            
            <div className="relative z-10 flex flex-col gap-6">
                <div>
                    <p className="text-[#FFB347] font-black text-[11px] tracking-[0.3em] uppercase mb-1 drop-shadow-md">Daily Revenue</p>
                    <h2 className="text-4xl font-black tabular-nums tracking-tighter drop-shadow-md">₹{stats.totalAmount.toLocaleString()}</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                    <div>
                        <p className="text-white font-black text-[9px] uppercase tracking-widest mb-0.5 opacity-90">Total Yield</p>
                        <p className="text-xl font-black tabular-nums">{stats.totalLitres.toFixed(1)}<span className="text-[10px] ml-1 text-white/80">LTR</span></p>
                    </div>
                    <div>
                        <p className="text-white font-black text-[9px] uppercase tracking-widest mb-0.5 opacity-90">Outstanding</p>
                        <p className="text-xl font-black tabular-nums">{stats.remaining}<span className="text-[10px] ml-1 text-white/80">LEFT</span></p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-4 animate-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center px-1">
                <h3 className="text-[11px] font-black text-[#0A1A2F] uppercase tracking-[0.2em]">Drop Schedule</h3>
                <span className="text-[9px] font-black text-[#007AFF] uppercase tracking-widest bg-[#007AFF]/10 border border-[#007AFF]/20 px-3 py-1 rounded-full">Active Sync</span>
            </div>

            {customers.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-4 bg-white rounded-2xl border-2 border-slate-100">
                    <Droplets size={32} className="text-[#007AFF]" />
                    <p className="text-slate-600 font-black text-[10px] uppercase tracking-widest text-center px-8">Register people to begin.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2 pb-10">
                    {customers.slice(0, 15).map(c => {
                        const delivered = deliveries.find(d => d.customerId === c.id && d.date === today);
                        return (
                            <div key={c.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border-2 border-slate-50 active:bg-slate-100 transition-all btn-touch">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all shadow-sm ${delivered ? 'bg-[#007AFF] text-white' : 'bg-slate-200 text-slate-700'}`}>
                                      {c.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-[#0A1A2F] text-[15px] truncate tracking-tight leading-none">{c.name}</p>
                                        <p className="text-[10px] font-black text-[#007AFF] uppercase tracking-widest mt-1.5">{c.phone || 'Direct Client'}</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-sm ${delivered ? 'bg-[#2ECC71] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {delivered ? `${delivered.quantity}L OK` : 'WAITING'}
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
