
import React, { useState, useEffect } from 'react';
import { AppProvider } from './components/Store';
import { TabType } from './types';
import { Home as HomeIcon, PlusCircle, Users, BarChart2, Delete, ShieldCheck } from 'lucide-react';
import HomeScreen from './screens/Home';
import EntryScreen from './screens/Entry';
import CustomersScreen from './screens/Customers';
import ReportsScreen from './screens/Reports';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'splash' | 'auth' | 'app'>('splash');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [pin, setPin] = useState<string>('');
  const CORRECT_PIN = "1234";

  useEffect(() => {
    const timer = setTimeout(() => setAppState('auth'), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin === CORRECT_PIN) {
        setTimeout(() => setAppState('app'), 200);
      } else if (newPin.length === 4) {
        setTimeout(() => setPin(''), 400);
      }
    }
  };

  if (appState === 'splash') {
    return (
      <div className="h-full w-full vibrant-gradient flex flex-col items-center justify-center text-white p-10 relative overflow-hidden">
        {/* Ambient glow effects for depth */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-azure-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]"></div>
        
        <div className="flex flex-col items-center gap-8 relative z-10 scale-110">
          <div className="w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border-4 border-white/30 animate-bounce-slow">
             <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=400&auto=format&fit=crop" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <h1 className="brand-text text-5xl font-black italic tracking-tighter drop-shadow-2xl text-white">Tarvin's</h1>
            <div className="mt-3 flex items-center gap-3 justify-center">
                <div className="h-[2px] w-8 bg-[#F39C12]"></div>
                <p className="text-[10px] font-black tracking-[0.6em] text-[#F39C12] uppercase drop-shadow-md">Express</p>
                <div className="h-[2px] w-8 bg-[#F39C12]"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse [animation-delay:200ms]"></div>
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse [animation-delay:400ms]"></div>
            </div>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Accounting v2.0</p>
        </div>
      </div>
    );
  }

  if (appState === 'auth') {
    return (
      <div className="h-full w-full bg-[#FBFBFD] flex flex-col items-center px-10 safe-area-top">
        <div className="mt-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl border-2 border-slate-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=200&auto=format&fit=crop" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-black text-[#0A1A2F] tracking-tight">Security Access</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Enter your 4-digit pin</p>
            
            <div className="mt-10 flex justify-center gap-5">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-[#007AFF] border-[#007AFF] scale-125 shadow-[0_0_15px_rgba(0,122,255,0.4)]' : 'border-slate-300'}`}></div>
                ))}
            </div>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-5 mb-16 w-full max-w-xs">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} onClick={() => handlePinInput(num.toString())} className="h-16 bg-white border-2 border-slate-50 rounded-full flex items-center justify-center text-2xl font-black text-[#0A1A2F] btn-touch shadow-sm active:bg-slate-100">{num}</button>
            ))}
            <div className="flex items-center justify-center text-slate-200"><ShieldCheck size={24} /></div>
            <button onClick={() => handlePinInput("0")} className="h-16 bg-white border-2 border-slate-50 rounded-full flex items-center justify-center text-2xl font-black text-[#0A1A2F] btn-touch shadow-sm active:bg-slate-100">0</button>
            <button onClick={() => setPin(prev => prev.slice(0, -1))} className="h-16 flex items-center justify-center text-slate-400 btn-touch active:text-[#0A1A2F]"><Delete size={24} /></button>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <div className="h-full w-full flex flex-col bg-[#FBFBFD] relative overflow-hidden">
        <main className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'entry' && <EntryScreen />}
            {activeTab === 'customers' && <CustomersScreen />}
            {activeTab === 'reports' && <ReportsScreen />}
        </main>

        <nav className="shrink-0 h-[84px] bg-white/95 ios-blur border-t-2 border-slate-100 flex items-start justify-around px-4 pt-3 pb-safe safe-area-bottom z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <TabButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<HomeIcon size={22} />} label="Stats" />
          <TabButton active={activeTab === 'entry'} onClick={() => setActiveTab('entry')} icon={<PlusCircle size={22} />} label="Log" />
          <TabButton active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={<Users size={22} />} label="People" />
          <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<BarChart2 size={22} />} label="Ledger" />
        </nav>
      </div>
    </AppProvider>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5 flex-1 transition-all py-1 select-none">
    <div className={`transition-all duration-300 ${active ? 'text-[#007AFF] scale-110 drop-shadow-[0_0_8px_rgba(0,122,255,0.3)]' : 'text-slate-400'}`}>{icon}</div>
    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${active ? 'text-[#007AFF]' : 'text-slate-400'}`}>{label}</span>
  </button>
);

export default App;
