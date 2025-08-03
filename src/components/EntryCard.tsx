'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EntryCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'form' | 'result' | 'feature';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const variantClasses = {
  default: 'glass-effect border-mind-yellow/20',
  form: 'glass-effect border-mind-orange/30 mind-glow',
  result: 'glass-effect border-mind-amber/30 bg-gradient-to-br from-mind-yellow/5 to-mind-orange/10',
  feature: 'glass-effect border-mind-accent/30 hover:border-mind-accent/50 hover:bg-mind-yellow/10 card-hover',
};

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

export default function EntryCard({ 
  children, 
  className, 
  variant = 'default', 
  size = 'md' 
}: EntryCardProps) {
  return (
    <div className={cn(
      'rounded-2xl transition-all duration-500 hover:scale-[1.01]',
      'backdrop-blur-lg shadow-xl',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

// Specialized card components
export function FormCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <EntryCard variant="form" size="lg" className={cn('max-w-2xl mx-auto', className)}>
      {children}
    </EntryCard>
  );
}

export function ResultCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <EntryCard variant="result" size="lg" className={cn('max-w-3xl mx-auto', className)}>
      {children}
    </EntryCard>
  );
}

export function FeatureCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <EntryCard 
      variant="feature" 
      size="md" 
      className={cn('h-full hover:shadow-2xl cursor-pointer', className)}
    >
      {children}
    </EntryCard>
  );
}
