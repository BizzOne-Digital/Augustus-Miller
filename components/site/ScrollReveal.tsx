'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  blur?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.55,
  direction = 'up',
  distance = 18,
  blur = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitialOffset = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      case 'none':
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...getInitialOffset(),
        ...(blur ? { filter: 'blur(4px)' } : {}),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        ...(blur ? { filter: 'blur(0px)' } : {}),
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayStart?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.08,
  delayStart = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayStart,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}> = ({ children, className = '', distance = 16, direction = 'up' }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getOffset = () => {
    switch (direction) {
      case 'right': // Starts to the right (+x), moves left to 0 (Right -> Left entrance)
        return { x: distance, y: 0 };
      case 'left': // Starts to the left (-x), moves right to 0
        return { x: -distance, y: 0 };
      case 'down':
        return { x: 0, y: -distance };
      case 'none':
        return { x: 0, y: 0 };
      case 'up':
      default:
        return { x: 0, y: distance };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.52,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

interface RotatingTaglineProps {
  messages: string[];
  intervalMs?: number;
  className?: string;
}

export const RotatingTagline: React.FC<RotatingTaglineProps> = ({
  messages,
  intervalMs = 4200,
  className = '',
}) => {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (messages.length <= 1 || shouldReduceMotion) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [messages.length, intervalMs, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <span className={className}>{messages[0]}</span>;
  }

  return (
    <span className={`inline-block overflow-hidden align-baseline ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {messages[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default ScrollReveal;
