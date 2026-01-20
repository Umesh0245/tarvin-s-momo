
import React, { useState, useEffect } from 'react';
import { AppProvider } from './components/Store';
import { TabType } from './types';
import { Home as HomeIcon, PlusCircle, Users, BarChart2, Milk, Lock, Delete, ChevronRight, ShieldCheck } from 'lucide-react';
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
    const timer = setTimeout(() => setAppState('auth'), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin === CORRECT_PIN) {
        setTimeout(() => setAppState('app'), 300);
      } else if (newPin.length === 4) {
        setTimeout(() => setPin(''), 500);
      }
    }
  };

  const removeLast = () => setPin(prev => prev.slice(0, -1));

  if (appState === 'splash') {
    return (
      <div className="h-screen w-screen bg-[#1b3a57] flex flex-col items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[300px] h-[300px] border border-white/10 rounded-full animate-[ping_3s_infinite]"></div>
            <div className="absolute w-[450px] h-[450px] border border-white/5 rounded-full animate-[ping_4s_infinite]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center scale-up">
          <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.2)] mb-10 overflow-hidden border-[10px] border-[#b8860b] p-2">
             <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=400&auto=format&fit=crop" alt="Tarvin's Moo Moo Express" className="w-full h-full object-cover rounded-full" />
          </div>
          
          <div className="text-center">
            <h1 className="brand-text text-5xl font-black tracking-tighter mb-2 italic">Tarvin's</h1>
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-black tracking-[0.2em] text-[#b8860b] uppercase">MOO MOO</h2>
                <h3 className="text-xs font-black tracking-[0.5em] text-white/50 uppercase mt-1">EXPRESS</h3>
            </div>
            <p className="text-white/30 mt-14 text-[10px] font-black tracking-[0.3em] uppercase">100% Pure Buffalo Milk</p>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'auth') {
    return (
      <div className="h-screen w-screen bg-[#fdfbf7] flex flex-col p-8 fade-in overflow-hidden">
        <div className="mt-16 text-center">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-[#b8860b] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=200&auto=format&fit=crop" alt="Moo Moo Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-black text-[#1b3a57] leading-tight mb-2">Moo Moo Express</h2>
            <p className="text-[#b8860b] font-bold text-xs uppercase tracking-[0.3em]">Enter Secure PIN</p>
        </div>

        <div className="mt-14 flex justify-center gap-8">
            {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-5 h-5 rounded-full transition-all duration-300 ${pin.length > i ? 'bg-[#1b3a57] scale-125' : 'bg-[#1b3a57]/10'}`}></div>
            ))}
        </div>

        <div className="mt-auto grid grid-cols-3 gap-5 mb-10">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button 
                  key={num} 
                  onClick={() => handlePinInput(num.toString())}
                  className="h-24 bg-white border border-[#1b3a57]/5 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-[#1b3a57] active:bg-[#1b3a57] active:text-white active:scale-95 transition-all shadow-md"
                >
                    {num}
                </button>
            ))}
            <div className="flex items-center justify-center text-[#1b3a57]/10 text-xs font-black uppercase tracking-widest italic">MOO MOO</div>
            <button 
                onClick={() => handlePinInput("0")}
                className="h-24 bg-white border border-[#1b3a57]/5 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-[#1b3a57] active:bg-[#1b3a57] active:text-white active:scale-95 transition-all shadow-md"
            >
                0
            </button>
            <button 
                onClick={removeLast}
                className="h-24 flex items-center justify-center text-[#b8860b] active:scale-90 transition-transform"
            >
                <Delete size={32} />
            </button>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'entry': return <EntryScreen />;
      case 'customers': return <CustomersScreen />;
      case 'reports': return <ReportsScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <AppProvider>
      <div className="h-full flex flex-col bg-[#fdfbf7] text-[#1b3a57] overflow-hidden">
        <div className="flex-1 relative flex flex-col h-full overflow-hidden">
            {renderScreen()}
        </div>

        <nav className="h-[100px] bg-white/80 ios-blur border-t border-[#1b3a57]/5 flex items-start justify-around px-5 pt-4 pb-safe safe-area-bottom fixed bottom-0 w-full z-30">
          <TabButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<HomeIcon size={24} />} label="Home" />
          <TabButton active={activeTab === 'entry'} onClick={() => setActiveTab('entry')} icon={<PlusCircle size={24} />} label="Log" />
          <TabButton active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={<Users size={24} />} label="People" />
          <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<BarChart2 size={24} />} label="Bill" />
        </nav>
      </div>
    </AppProvider>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 flex-1 transition-all outline-none relative group py-2">
    <div className={`transition-all duration-300 z-10 ${active ? 'text-[#1b3a57] scale-125' : 'text-slate-300 group-active:scale-90'}`}>
      {icon}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${active ? 'text-[#b8860b]' : 'text-slate-300 opacity-60'}`}>
      {label}
    </span>
    {active && (
      <div className="absolute top-[-5px] w-12 h-2 bg-[#1b3a57] rounded-full animate-pulse"></div>
    )}
  </button>
);

export default App;
