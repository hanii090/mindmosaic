'use client';

import { cn } from '@/lib/utils';

interface EmotionIconProps {
  emotion: string;
  icon: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-8xl',
};

const emotionColors = {
  happy: 'text-mind-yellow',
  sad: 'text-mind-orange',
  anxious: 'text-mind-amber',
  calm: 'text-mind-warm',
  angry: 'text-red-400',
  neutral: 'text-gray-400',
  excited: 'text-mind-accent',
  tired: 'text-purple-400',
};

export default function EmotionIcon({ 
  emotion, 
  icon, 
  className, 
  showLabel = true, 
  size = 'md' 
}: EmotionIconProps) {
  const emotionKey = emotion.toLowerCase() as keyof typeof emotionColors;
  const colorClass = emotionColors[emotionKey] || emotionColors.neutral;

  return (
    <div className={cn(
      'flex flex-col items-center space-y-2 group cursor-pointer transition-all duration-300',
      className
    )}>
      <div className={cn(
        'p-4 rounded-full glass-effect group-hover:scale-110 transition-transform duration-300',
        'group-hover:mind-glow'
      )}>
        <span className={cn(
          'block transition-all duration-300 group-hover:animate-pulse-soft',
          sizeClasses[size],
          colorClass
        )}>
          {icon}
        </span>
      </div>
      
      {showLabel && (
        <div className="text-center">
          <span className={cn(
            'font-medium capitalize transition-colors duration-300',
            'text-white/80 group-hover:text-white',
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
          )}>
            {emotion}
          </span>
        </div>
      )}
    </div>
  );
}

// Predefined emotion sets for easy use
export const commonEmotions = [
  { emotion: 'happy', icon: '😊' },
  { emotion: 'sad', icon: '😢' },
  { emotion: 'anxious', icon: '😰' },
  { emotion: 'calm', icon: '😌' },
  { emotion: 'angry', icon: '😠' },
  { emotion: 'excited', icon: '🤗' },
  { emotion: 'tired', icon: '😴' },
  { emotion: 'neutral', icon: '😐' },
];

export const floatingEmotions = [
  { emotion: 'support', icon: '💬' },
  { emotion: 'care', icon: '❤️' },
  { emotion: 'sad', icon: '😞' },
  { emotion: 'happy', icon: '😃' },
];
