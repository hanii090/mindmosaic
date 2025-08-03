
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { buttonClickAnimation } from '@/lib/animations';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mind-accent/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-mind-yellow/30 to-mind-orange/30 border border-mind-accent/50 text-white hover:from-mind-yellow/40 hover:to-mind-orange/40 hover:scale-105 hover:shadow-lg hover:shadow-mind-accent/20",
        destructive:
          "bg-gradient-to-r from-red-500/30 to-red-600/30 border border-red-500/50 text-white hover:from-red-500/40 hover:to-red-600/40 hover:scale-105",
        outline:
          "border border-mind-accent/30 bg-transparent text-white hover:bg-mind-accent/10 hover:text-mind-accent hover:border-mind-accent/50 hover:scale-105",
        secondary:
          "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105",
        ghost: 
          "text-white/70 hover:bg-white/10 hover:text-white hover:scale-105",
        link: 
          "text-mind-accent underline-offset-4 hover:underline hover:scale-105",
        premium:
          "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 text-white hover:from-purple-500/40 hover:to-pink-500/40 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20",
        success:
          "bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/50 text-white hover:from-green-500/40 hover:to-emerald-500/40 hover:scale-105",
        glass:
          "bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:scale-105"
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-8 text-lg",
        xl: "h-16 rounded-2xl px-10 text-xl",
        icon: "h-11 w-11",
      },
      glow: {
        none: "",
        soft: "hover:shadow-lg hover:shadow-mind-accent/20",
        medium: "hover:shadow-xl hover:shadow-mind-accent/30",
        strong: "hover:shadow-2xl hover:shadow-mind-accent/40 animate-pulse-soft",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "soft"
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glow, asChild = false, loading, icon, children, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (buttonRef.current) {
        buttonClickAnimation(buttonRef.current);
      }
      onClick?.(e);
    };

    React.useImperativeHandle(ref, () => buttonRef.current!);

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, glow, className }))}
        ref={buttonRef}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {icon && !loading && icon}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
