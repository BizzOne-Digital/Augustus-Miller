'use client';

import React from 'react';
import Link from 'next/link';

interface MillerLogoProps {
  variant?: 'full' | 'horizontal' | 'mark' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  width?: number;
  height?: number;
  className?: string;
  withLink?: boolean;
}

export const MillerLogo: React.FC<MillerLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  width,
  height,
  className = '',
  withLink = false
}) => {
  // Dimension mapping
  const getDims = () => {
    if (width && height) return { width, height };
    if (variant === 'horizontal') {
      switch (size) {
        case 'sm': return { width: 190, height: 44 };
        case 'lg': return { width: 290, height: 68 };
        case 'xl': return { width: 360, height: 84 };
        case 'md':
        default: return { width: 240, height: 56 };
      }
    } else {
      switch (size) {
        case 'sm': return { width: 64, height: 64 };
        case 'lg': return { width: 220, height: 220 };
        case 'xl': return { width: 320, height: 320 };
        case 'md':
        default: return { width: 140, height: 140 };
      }
    }
  };

  const dims = getDims();

  // The circular seal SVG based precisely on miller.jpg
  const SealSVG = ({ w, h }: { w: number; h: number }) => (
    <svg
      viewBox="0 0 500 500"
      width={w}
      height={h}
      className="select-none overflow-visible drop-shadow-sm transition-transform duration-300"
      aria-label="Miller Group of Company LLC Official Seal Logo"
    >
      <defs>
        {/* Rich Metallic Gold Gradients */}
        <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFC37C" />
          <stop offset="35%" stopColor="#C8973E" />
          <stop offset="70%" stopColor="#996F22" />
          <stop offset="100%" stopColor="#D8AC4F" />
        </linearGradient>

        <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4A244" />
          <stop offset="50%" stopColor="#F5D77F" />
          <stop offset="100%" stopColor="#C8973E" />
        </linearGradient>

        {/* Corporate Deep Navy */}
        <linearGradient id="navyShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14345C" />
          <stop offset="100%" stopColor="#081A33" />
        </linearGradient>

        {/* Arc Ribbon gradient */}
        <linearGradient id="ribbonGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A244" />
          <stop offset="100%" stopColor="#AC7D26" />
        </linearGradient>
      </defs>

      {/* Outer Golden Border Rings */}
      <circle cx="250" cy="250" r="238" fill="#FFFFFF" stroke="url(#goldRimGrad)" strokeWidth="14" />
      <circle cx="250" cy="250" r="227" fill="none" stroke="#0A2540" strokeWidth="3" />

      {/* Central White Inner Canvas */}
      <circle cx="250" cy="250" r="224" fill="#FFFFFF" />

      {/* Decorative City Skyline Silhouette in Navy Behind the House */}
      <g id="city-skyline" fill="#0A2540">
        {/* Left tall tower */}
        <rect x="258" y="180" width="34" height="85" />
        <rect x="296" y="145" width="42" height="120" />
        <polygon points="296,145 317,125 338,145" />
        <rect x="342" y="195" width="38" height="70" />
        <rect x="384" y="215" width="30" height="50" />

        {/* Windows in towers */}
        <g fill="#FFFFFF" opacity="0.9">
          {/* Windows on mid tower */}
          <rect x="264" y="190" width="6" height="7" />
          <rect x="278" y="190" width="6" height="7" />
          <rect x="264" y="205" width="6" height="7" />
          <rect x="278" y="205" width="6" height="7" />
          <rect x="264" y="220" width="6" height="7" />
          <rect x="278" y="220" width="6" height="7" />

          {/* Windows on tallest tower */}
          <rect x="304" y="160" width="8" height="9" />
          <rect x="320" y="160" width="8" height="9" />
          <rect x="304" y="177" width="8" height="9" />
          <rect x="320" y="177" width="8" height="9" />
          <rect x="304" y="194" width="8" height="9" />
          <rect x="320" y="194" width="8" height="9" />
          <rect x="304" y="211" width="8" height="9" />
          <rect x="320" y="211" width="8" height="9" />
          <rect x="304" y="228" width="8" height="9" />
          <rect x="320" y="228" width="8" height="9" />

          {/* Windows on right tower */}
          <rect x="350" y="205" width="7" height="7" />
          <rect x="365" y="205" width="7" height="7" />
          <rect x="350" y="220" width="7" height="7" />
          <rect x="365" y="220" width="7" height="7" />
        </g>
      </g>

      {/* Iconic Serif 'M' Initial in Gold & Navy */}
      {/* Gold Left Half of 'M' */}
      <path
        d="M 145 260 L 145 100 L 195 100 L 250 205 L 250 255 Z"
        fill="url(#goldRimGrad)"
      />
      <polygon points="125,100 160,100 145,108" fill="url(#goldRimGrad)" />

      {/* Navy Right Half of 'M' */}
      <path
        d="M 250 205 L 305 100 L 355 100 L 355 260 L 320 260 L 320 155 L 265 255 Z"
        fill="#0A2540"
      />
      <polygon points="340,100 375,100 355,108" fill="#0A2540" />

      {/* Dynamic Swoosh Arc cutting through the M */}
      <path
        d="M 130 270 Q 220 120 400 135 C 340 140 215 155 165 275 Z"
        fill="url(#goldRimGrad)"
      />
      <path
        d="M 132 270 Q 222 122 400 135 C 340 137 218 152 168 274 Z"
        fill="#0A2540"
        opacity="0.25"
      />

      {/* Residential House Silhouette with Chimney & Gable Roof */}
      <g id="residential-house" fill="#0A2540">
        {/* Chimney */}
        <rect x="200" y="210" width="16" height="24" />
        {/* Main Gable Roof */}
        <polygon points="250,215 165,268 335,268" />
        {/* House Body / Base */}
        <rect x="180" y="266" width="140" height="8" fill="#0A2540" />
        {/* Gable Attic Window (White 4-pane) */}
        <rect x="244" y="240" width="12" height="12" fill="#FFFFFF" />
        <rect x="249.5" y="240" width="1" height="12" fill="#0A2540" />
        <rect x="244" y="245.5" width="12" height="1" fill="#0A2540" />
      </g>

      {/* Prestige Serif Typography: MILLER */}
      <text
        x="250"
        y="328"
        textAnchor="middle"
        fontFamily="'Times New Roman', Georgia, serif"
        fontWeight="800"
        fontSize="54"
        letterSpacing="7"
        fill="#0A2540"
      >
        MILLER
      </text>

      {/* Gold Divider & "GROUP OF COMPANY LLC" */}
      <line x1="75" y1="344" x2="105" y2="344" stroke="#C8973E" strokeWidth="2.5" />
      <text
        x="250"
        y="350"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="17.5"
        letterSpacing="4"
        fill="#0A2540"
      >
        GROUP OF COMPANY LLC
      </text>
      <line x1="395" y1="344" x2="425" y2="344" stroke="#C8973E" strokeWidth="2.5" />

      {/* Curved Fan Arc Banner for the 7 Service Divisions */}
      <g id="seven-services-arc">
        {/* Curved Base Background Ribbon */}
        <path
          d="M 50 350 Q 250 495 450 350 L 460 380 Q 250 515 40 380 Z"
          fill="#0A2540"
        />

        {/* 7 Vertical / Fan Divisions matching miller.jpg */}
        {/* 1. Financial & Small Business Consultancy (Navy) */}
        <path d="M 48 352 L 115 372 L 105 450 L 45 375 Z" fill="#0A2540" stroke="#FFFFFF" strokeWidth="0.8" />
        <circle cx="78" cy="385" r="16" fill="#0A2540" />
        {/* Mini Chart Icon */}
        <rect x="68" y="385" width="4" height="10" fill="#FFFFFF" />
        <rect x="74" y="380" width="4" height="15" fill="#FFFFFF" />
        <rect x="80" y="375" width="4" height="20" fill="#FFFFFF" />
        <text x="80" y="415" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="700">FINANCIAL &</text>
        <text x="80" y="423" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="600">CONSULTANCY</text>

        {/* 2. Property Rental (Gold) */}
        <path d="M 115 372 L 172 384 L 165 474 L 105 450 Z" fill="url(#ribbonGold)" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* House & Key */}
        <polygon points="139,388 128,398 150,398" fill="#FFFFFF" />
        <rect x="132" y="398" width="14" height="10" fill="#FFFFFF" />
        <circle cx="146" cy="404" r="3.5" fill="#0A2540" />
        <text x="138" y="432" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="700">PROPERTY</text>
        <text x="138" y="442" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="700">RENTAL</text>

        {/* 3. General Construction (Navy) */}
        <path d="M 172 384 L 228 391 L 225 487 L 165 474 Z" fill="#0A2540" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Crane & Bricks */}
        <line x1="200" y1="392" x2="200" y2="415" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="188" y1="395" x2="212" y2="395" stroke="#FFFFFF" strokeWidth="2" />
        <rect x="194" y="410" width="12" height="6" fill="#FFFFFF" />
        <text x="200" y="445" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="700">GENERAL</text>
        <text x="200" y="455" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="600">CONSTRUCTION</text>

        {/* 4. Repairs (Gold) */}
        <path d="M 228 391 L 282 391 L 285 487 L 225 487 Z" fill="url(#ribbonGold)" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Wrench */}
        <circle cx="255" cy="402" r="7" fill="none" stroke="#FFFFFF" strokeWidth="3" />
        <line x1="255" y1="409" x2="255" y2="425" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        <text x="255" y="455" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700">REPAIRS</text>

        {/* 5. Handyman Service (Navy) */}
        <path d="M 282 391 L 338 384 L 345 474 L 285 487 Z" fill="#0A2540" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Worker Icon */}
        <circle cx="310" cy="400" r="5" fill="#FFFFFF" />
        <path d="M 302 400 Q 310 393 318 400 Z" fill="#FFFFFF" />
        <path d="M 300 417 C 300 410 320 410 320 417 Z" fill="#FFFFFF" />
        <text x="312" y="445" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="700">HANDYMAN</text>
        <text x="312" y="455" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="700">SERVICE</text>

        {/* 6. Transportation Services (Gold) */}
        <path d="M 338 384 L 395 372 L 405 450 L 345 474 Z" fill="url(#ribbonGold)" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Box Truck */}
        <rect x="360" y="398" width="18" height="11" fill="#FFFFFF" rx="1" />
        <rect x="378" y="402" width="7" height="7" fill="#FFFFFF" />
        <circle cx="366" cy="411" r="2.5" fill="#0A2540" />
        <circle cx="381" cy="411" r="2.5" fill="#0A2540" />
        <text x="372" y="432" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="700">TRANSPORTATION</text>
        <text x="372" y="442" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="700">SERVICES</text>

        {/* 7. IT Services (Navy) */}
        <path d="M 395 372 L 460 350 L 460 375 L 405 450 Z" fill="#0A2540" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Monitor & Gear */}
        <rect x="420" y="382" width="18" height="12" fill="none" stroke="#FFFFFF" strokeWidth="2" rx="1" />
        <line x1="429" y1="394" x2="429" y2="399" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="438" cy="393" r="3.5" fill="#C8973E" />
        <text x="432" y="415" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="700">IT</text>
        <text x="432" y="423" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="700">SERVICES</text>
      </g>
    </svg>
  );

  // Mark-only (Center emblem without arc)
  const MarkSVG = ({ w, h }: { w: number; h: number }) => (
    <svg viewBox="0 0 400 400" width={w} height={h} className="select-none overflow-visible drop-shadow-sm">
      <defs>
        <linearGradient id="markGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFC37C" />
          <stop offset="50%" stopColor="#C8973E" />
          <stop offset="100%" stopColor="#996F22" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="192" fill="#FFFFFF" stroke="url(#markGold)" strokeWidth="10" />
      <circle cx="200" cy="200" r="183" fill="none" stroke="#0A2540" strokeWidth="2.5" />
      
      {/* Skyline */}
      <g fill="#0A2540">
        <rect x="206" y="145" width="28" height="70" />
        <rect x="238" y="115" width="34" height="100" />
        <polygon points="238,115 255,98 272,115" />
        <rect x="275" y="155" width="30" height="60" />
        <g fill="#FFFFFF" opacity="0.9">
          <rect x="212" y="155" width="5" height="6" />
          <rect x="223" y="155" width="5" height="6" />
          <rect x="244" y="128" width="6" height="7" />
          <rect x="257" y="128" width="6" height="7" />
          <rect x="244" y="142" width="6" height="7" />
          <rect x="257" y="142" width="6" height="7" />
        </g>
      </g>

      {/* Gold & Navy M */}
      <path d="M 115 210 L 115 80 L 155 80 L 200 165 L 200 210 Z" fill="url(#markGold)" />
      <polygon points="100,80 130,80 115,88" fill="url(#markGold)" />
      <path d="M 200 165 L 245 80 L 285 80 L 285 210 L 255 210 L 255 125 L 212 210 Z" fill="#0A2540" />
      <polygon points="275,80 300,80 285,88" fill="#0A2540" />

      {/* Swoosh */}
      <path d="M 105 220 Q 180 95 325 110 C 275 115 175 125 135 225 Z" fill="url(#markGold)" />

      {/* House */}
      <polygon points="200,175 130,218 270,218" fill="#0A2540" />
      <rect x="145" y="217" width="110" height="7" fill="#0A2540" />
      <rect x="195" y="195" width="10" height="10" fill="#FFFFFF" />
      
      {/* MILLER */}
      <text x="200" y="272" textAnchor="middle" fontFamily="'Times New Roman', Georgia, serif" fontWeight="800" fontSize="44" letterSpacing="6" fill="#0A2540">
        MILLER
      </text>
      <text x="200" y="295" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="13" letterSpacing="3.5" fill="#0A2540">
        GROUP OF COMPANY LLC
      </text>
    </svg>
  );

  const renderContent = () => {
    if (variant === 'full' || variant === 'badge') {
      return (
        <div className={`inline-flex flex-col items-center justify-center ${className}`}>
          <SealSVG w={dims.width} h={dims.height} />
        </div>
      );
    }

    if (variant === 'mark') {
      return (
        <div className={`inline-flex items-center justify-center ${className}`}>
          <MarkSVG w={dims.width} h={dims.height} />
        </div>
      );
    }

    // Horizontal lockup (Emblem Mark + Typographic Brand Signature)
    return (
      <div className={`inline-flex items-center gap-3 md:gap-3.5 group ${className}`}>
        <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
          <SealSVG w={dims.height} h={dims.height} />
        </div>
        <div className="flex flex-col justify-center leading-none text-left">
          <span className="font-serif font-extrabold tracking-wider text-[#0A2540] text-lg md:text-xl uppercase transition-colors group-hover:text-[#C8973E]">
            MILLER
          </span>
          <span className="font-sans font-bold text-[10px] md:text-[11px] tracking-[0.2em] text-[#C8973E] uppercase mt-0.5">
            GROUP OF COMPANY LLC
          </span>
          <span className="hidden sm:block text-[9px] text-slate-500 font-medium tracking-wide mt-1">
            One Group. Many Solutions.
          </span>
        </div>
      </div>
    );
  };

  if (withLink) {
    return (
      <Link href="/" className="inline-block transition-opacity hover:opacity-95" title="Miller Group of Company LLC">
        {renderContent()}
      </Link>
    );
  }

  return renderContent();
};

export default MillerLogo;
