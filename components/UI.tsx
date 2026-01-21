
import React from 'react';
import { BrandLogo } from './Logo';

export const IOSButton: React.FC<{ 
  onClick?: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'gold' | 'azure' | 'ghost';
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', type = 'button', disabled }) => {
  const styles = {
    primary: 'bg-[#0A1A2F] text-white shadow-md',
    secondary: 'bg-white border-2 border-slate-200 text-[#0A1A2F]',
    danger: 'bg-red-600 text-white shadow-md',
    gold: 'bg-[#F39C12] text-white shadow-md shadow-[#F39C12]/30',
    azure: 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/30',
    ghost: 'bg-transparent text-slate-600'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-touch px-5 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 select-none tracking-tight text-sm ${styles[variant]} ${disabled ? 'opacity-30 grayscale' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const IOSCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[1.5rem] border-2 border-slate-100 shadow-sm p-5 ${className}`}>
    {children}
  </div>
);

export const IOSInput: React.FC<{ 
  label: string; 
  placeholder?: string; 
  value: string | number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  step?: string;
}> = ({ label, placeholder, value, onChange, type = 'text', className = '', step }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className}`}>
    <label className="text-[10px] font-black text-[#0051a8] uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      step={step}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-white border-2 border-slate-200 focus:border-[#007AFF] focus:ring-0 rounded-xl px-4 py-3 outline-none text-[#0A1A2F] font-black w-full transition-all tabular-nums text-base placeholder:text-slate-400"
    />
  </div>
);

export const IOSHeader: React.FC<{ title: string; subtitle?: string; children?: React.ReactNode; vibrant?: boolean }> = ({ title, subtitle, children, vibrant }) => (
  <div className={`px-5 pt-12 pb-5 flex flex-col gap-0.5 safe-area-top sticky top-0 z-40 shrink-0 ${vibrant ? 'vibrant-gradient text-white shadow-lg' : 'bg-white/95 ios-blur border-b-2 border-slate-100'}`}>
    <div className="flex justify-between items-center">
      <div className="flex-1 min-w-0">
        <h1 className={`text-2xl font-black tracking-tight truncate drop-shadow-sm ${vibrant ? 'text-white' : 'text-[#0A1A2F]'}`}>{title}</h1>
        {subtitle && <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${vibrant ? 'text-white/90' : 'text-[#d48900]'}`}>{subtitle}</p>}
      </div>
      <div className="shrink-0 flex items-center gap-3">
        {children}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border-2 shadow-sm bg-white ${vibrant ? 'border-white/40' : 'border-slate-200'}`}>
           <BrandLogo size={40} />
        </div>
      </div>
    </div>
  </div>
);
