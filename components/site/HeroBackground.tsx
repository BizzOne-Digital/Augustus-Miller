'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { resolveImageSrc } from '@/lib/images';

interface HeroBackgroundProps {
  src: string;
  alt: string;
  priority?: boolean;
  objectPosition?: string;
  className?: string;
  theme?: 'dark-navy' | 'deep-midnight';
}

export default function HeroBackground({
  src,
  alt,
  priority = true,
  objectPosition = 'object-center',
  className = '',
  theme = 'deep-midnight'
}: HeroBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  const isMidnight = theme === 'deep-midnight';
  // Lightened scrim: the photography now reads clearly while headline contrast holds.
  const baseBg = isMidnight ? 'from-[#061426]/85' : 'from-[#0A2540]/82';
  const viaBg = isMidnight ? 'via-[#061426]/55' : 'via-[#0A2540]/52';
  const toBg = isMidnight ? 'to-[#061426]/30' : 'to-[#0A2540]/28';
  const bottomBg = isMidnight ? 'from-[#061426]/90' : 'from-[#0A2540]/90';

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Cinematic Scale & Fade Image Container */}
      <motion.div
        initial={shouldReduceMotion ? { scale: 1, opacity: 0.75 } : { scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.75 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full"
      >
        <Image
          src={resolveImageSrc(src)}
          alt={alt}
          fill
          priority={priority}
          className={`object-cover ${objectPosition}`}
          sizes="100vw"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Brand Color Dual Gradients for Maximum Legibility */}
      <div className={`absolute inset-0 bg-gradient-to-r ${baseBg} ${viaBg} ${toBg}`} />
      <div className={`absolute inset-0 bg-gradient-to-t ${bottomBg} via-transparent to-black/25`} />

      {/* Subtle Warm Gold Ambient Depth Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8973E]/14 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-[#DFC37C]/8 rounded-full blur-2xl pointer-events-none" />

      {/* Hairline gold light at the section base for a crisper edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8973E]/45 to-transparent pointer-events-none" />
    </div>
  );
}
