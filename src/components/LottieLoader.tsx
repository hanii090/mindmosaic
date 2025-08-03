'use client';

import { cn } from '@/lib/utils';
import { Loader2, Brain, Heart, MessageCircle } from 'lucide-react';

interface LottieLoaderProps {
  type?: 'typing' | 'thinking' | 'processing' | 'heart';
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function LottieLoader({ 
  type = 'thinking', 
  message, 
  className, 
  size = 'md' 
}: LottieLoaderProps) {
  const renderIcon = () => {
    switch (type) {
      case 'typing':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-mind-peach rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-mind-blue rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-mind-lavender rounded-full animate-bounce"></div>
          </div>
        );
      case 'thinking':
        return <Brain className={cn(sizeClasses[size], 'text-mind-peach animate-pulse-soft')} />;
      case 'processing':
        return <Loader2 className={cn(sizeClasses[size], 'text-mind-blue animate-spin')} />;
      case 'heart':
        return <Heart className={cn(sizeClasses[size], 'text-mind-peach animate-pulse-soft')} />;
      default:
        return <MessageCircle className={cn(sizeClasses[size], 'text-mind-lavender animate-pulse-soft')} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center space-y-3', className)}>
      <div className="flex items-center justify-center p-3 rounded-full glass-effect">
        {renderIcon()}
      </div>
      
      {message && (
        <p className="text-white/70 text-sm text-center animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

// Predefined loader configurations
export function TypingLoader({ message = "AI is typing..." }: { message?: string }) {
  return <LottieLoader type="typing" message={message} size="md" />;
}

export function ThinkingLoader({ message = "Analyzing your feelings..." }: { message?: string }) {
  return <LottieLoader type="thinking" message={message} size="lg" />;
}

export function ProcessingLoader({ message = "Processing response..." }: { message?: string }) {
  return <LottieLoader type="processing" message={message} size="md" />;
}
