
import React from 'react';

export const IOSButton: React.FC<{ 
  onClick?: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'brand';
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', type = 'button', disabled }) => {
  const variants = {
    primary: 'bg-[#1b3a57] text-white active:bg-[#122a3f] active:scale-[0.98] shadow-lg shadow-[#1b3a57]/20',
    secondary: 'bg-white border-2 border-[#1b3a57]/10 text-[#1b3a57] active:bg-gray-50 active:scale-[0.98]',
    danger: 'bg-red-500 text-white active:bg-red-600 active:scale-[0.98]',
    ghost: 'bg-transparent text-[#1b3a57] active:bg-[#1b3a57]/5',
    brand: 'bg-[#b8860b] text-white active:bg-[#916a08] active:scale-[0.98] shadow-xl shadow-[#b8860b]/30'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-5 rounded-[2rem] font-black transition-all duration-300 flex items-center justify-center gap-3 select-none tracking-tight ${variants[variant]} ${disabled ? 'opacity-30 grayscale pointer-events-none' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const IOSCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[2.8rem] shadow-[0_15px_40px_rgba(27,58,87,0.04)] border border-[#1b3a57]/5 p-7 ${className}`}>
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
  <div className={`flex flex-col gap-2.5 w-full ${className}`}>
    <label className="text-[10px] font-black text-[#1b3a57]/30 uppercase tracking-[0.25em] ml-2">{label}</label>
    <input
      type={type}
      step={step}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-[#1b3a57]/5 border-2 border-transparent focus:border-[#1b3a57]/10 focus:bg-white rounded-[1.8rem] px-6 py-5 outline-none text-[#1b3a57] font-bold w-full transition-all"
    />
  </div>
);

export const IOSHeader: React.FC<{ title: string; subtitle?: string; children?: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="px-6 pt-16 pb-8 bg-[#fdfbf7]/90 ios-blur sticky top-0 z-20 flex flex-col gap-1 safe-area-top border-b border-[#1b3a57]/5">
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <h1 className="text-3xl font-[900] tracking-tight text-[#1b3a57]">{title}</h1>
        {subtitle && <p className="text-[11px] text-[#b8860b] font-black uppercase tracking-[0.25em] mt-1.5">{subtitle}</p>}
      </div>
      <div className="shrink-0 flex items-center gap-4">
        {children}
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#1b3a57] overflow-hidden shadow-xl border-2 border-[#b8860b]">
           <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=200&auto=format&fit=crop" alt="Tarvin's" className="w-full h-full object-cover rounded-full" />
        </div>
      </div>
    </div>
  </div>
);
