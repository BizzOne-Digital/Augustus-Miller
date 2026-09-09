'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/** Official brand seal asset (Miller Group of Company LLC) */
export const MILLER_LOGO_SRC = '/assets/Logo/logo.png';

/** Intrinsic pixel size of the seal artwork */
const SEAL_W = 491;
const SEAL_H = 508;
/** Seal outline: centre (246.5, 263), radius 244 - expressed against the artwork box */
const SEAL_CLIP = 'ellipse(49.69% 48.03% at 50.2% 51.77%)';

interface MillerLogoProps {
  variant?: 'full' | 'horizontal' | 'mark' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  width?: number;
  height?: number;
  className?: string;
  withLink?: boolean;
  priority?: boolean;
}

export const MillerLogo: React.FC<MillerLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  width,
  height,
  className = '',
  withLink = false,
  priority = false
}) => {
  // Dimension mapping (unchanged public API)
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

  /**
   * The official seal artwork.
   *
   * The source PNG is 491x508 with a TRANSPARENT interior - only the artwork ink
   * (gold rim, navy lettering, service tiles) is opaque. So we render it over a
   * white plate shaped to the seal's own circle, which keeps the crest legible on
   * dark navy surfaces (hero card, footer, admin sidebar) and is invisible on white.
   *
   * Geometry measured from the asset: circle centre (246.5, 263), radius 244.
   */
  const Seal = ({ size: box, extraClass = '' }: { size: number; extraClass?: string }) => {
    const boxWidth = box * (SEAL_W / SEAL_H); // keep the crest perfectly round

    return (
      <span
        className={`relative inline-block shrink-0 ${extraClass}`}
        style={{ width: boxWidth, height: box }}
      >
        {/* White plate tucked just under the gold rim */}
        <span
          aria-hidden="true"
          className="absolute rounded-full bg-white shadow-[0_10px_30px_-12px_rgba(10,37,64,0.45)]"
          style={{ left: '2.14%', top: '5.31%', width: '96.13%', height: '92.91%' }}
        />
        <Image
          src={MILLER_LOGO_SRC}
          alt="Miller Group of Company LLC Official Seal Logo"
          width={SEAL_W}
          height={SEAL_H}
          priority={priority}
          sizes={`${Math.round(boxWidth)}px`}
          // Clipped to the seal outline so stray canvas specks never show
          style={{ width: '100%', height: '100%', clipPath: SEAL_CLIP }}
          className="relative select-none object-contain"
        />
      </span>
    );
  };

  const renderContent = () => {
    if (variant === 'full' || variant === 'badge') {
      const box = Math.min(dims.width, dims.height);
      return (
        <div className={`inline-flex flex-col items-center justify-center ${className}`}>
          <Seal
            size={box}
            extraClass="transition-transform duration-500 ease-out hover:scale-[1.03]"
          />
        </div>
      );
    }

    if (variant === 'mark') {
      const box = Math.min(dims.width, dims.height);
      return (
        <div className={`inline-flex items-center justify-center ${className}`}>
          <Seal size={box} extraClass="transition-transform duration-300 ease-out hover:scale-105" />
        </div>
      );
    }

    // Horizontal lockup (Emblem Mark + Typographic Brand Signature)
    return (
      <div className={`inline-flex items-center gap-3 md:gap-3.5 group ${className}`}>
        <div className="relative shrink-0 transition-transform duration-300 ease-out group-hover:scale-105">
          <Seal size={dims.height} />
        </div>
        <div className="flex flex-col justify-center leading-none text-left">
          <span className="font-serif font-extrabold tracking-wider text-[#0A2540] text-base md:text-lg xl:text-xl uppercase whitespace-nowrap transition-colors group-hover:text-[#C8973E]">
            MILLER
          </span>
          <span className="font-sans font-bold text-[9px] md:text-[10px] xl:text-[11px] tracking-[0.14em] xl:tracking-[0.2em] text-[#C8973E] uppercase mt-0.5 whitespace-nowrap">
            GROUP OF COMPANY LLC
          </span>
          <span className="hidden xl:block text-[9px] text-slate-500 font-medium tracking-wide mt-1 whitespace-nowrap">
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
