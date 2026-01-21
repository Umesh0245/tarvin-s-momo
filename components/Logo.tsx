
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<LogoProps> = ({ className = "", size = 100 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
        {/* Outer Circular Border */}
        <circle cx="100" cy="100" r="95" fill="white" stroke="#0A1A2F" strokeWidth="2"/>
        <circle cx="100" cy="100" r="85" fill="#0A1A2F" />
        
        {/* Milk Splash Background */}
        <path d="M40 100C40 60 70 40 100 40C130 40 160 60 160 100C160 140 130 170 100 170C70 170 40 140 40 100Z" fill="#FBFBFD" />
        <path d="M100 35C120 35 140 45 155 60C170 75 180 95 180 120C180 145 160 175 130 185C100 195 60 185 40 160C20 135 20 100 40 70C60 40 80 35 100 35Z" fill="#FBFBFD" opacity="0.8" />
        
        {/* Buffalo Head Representation */}
        <g transform="translate(60, 65) scale(0.8)">
            {/* Horns */}
            <path d="M5 30C-10 10 10 -10 40 5" stroke="#3E2723" strokeWidth="8" strokeLinecap="round" />
            <path d="M95 30C110 10 90 -10 60 5" stroke="#3E2723" strokeWidth="8" strokeLinecap="round" />
            
            {/* Head Shape */}
            <path d="M25 25C25 10 75 10 75 25C75 40 65 75 50 75C35 75 25 40 25 25Z" fill="#5D4037" />
            <path d="M30 30C30 20 70 20 70 30C70 45 60 70 50 70C40 70 30 45 30 30Z" fill="#3E2723" />
            
            {/* Eyes */}
            <circle cx="42" cy="35" r="3" fill="white" />
            <circle cx="58" cy="35" r="3" fill="white" />
            
            {/* Muzzle */}
            <ellipse cx="50" cy="55" rx="15" ry="10" fill="#8D6E63" />
            <circle cx="45" cy="55" r="2" fill="#3E2723" />
            <circle cx="55" cy="55" r="2" fill="#3E2723" />
        </g>
        
        {/* Arched Text Placeholder representation */}
        <path id="curve" d="M 40,100 A 60,60 0 1,1 160,100" fill="transparent" />
        <text className="font-black" style={{ fontSize: '14px', fill: '#0A1A2F', fontWeight: 900 }}>
          <textPath href="#curve" startOffset="50%" textAnchor="middle">TARVIN'S</textPath>
        </text>
        
        <path id="curveBottom" d="M 40,100 A 60,60 0 1,0 160,100" fill="transparent" />
        <text className="font-black" style={{ fontSize: '10px', fill: '#0A1A2F', fontWeight: 900 }}>
          <textPath href="#curveBottom" startOffset="50%" textAnchor="middle">MOO MOO EXPRESS</textPath>
        </text>
      </svg>
      
      {/* Fallback to image if file exists, overlays on top */}
      <img 
        src="./logo.png" 
        alt="" 
        className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500"
        onLoad={(e) => (e.currentTarget.style.opacity = '1')}
      />
    </div>
  );
};
