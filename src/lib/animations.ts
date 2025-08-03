'use client';

import { useEffect, useRef } from 'react';

// Hook for GSAP animations (will be enhanced when GSAP is properly imported)
export function useGSAPAnimation() {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // For now, we'll use CSS animations
    // This will be replaced with actual GSAP when it's properly set up
    const element = elementRef.current;
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      // Animate in
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 100);
    }
  }, []);

  return elementRef;
}

// Page transition animations
export function pageEnterAnimation(element: HTMLElement) {
  if (!element) return;
  
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  
  setTimeout(() => {
    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 50);
}

// Floating animation for emojis
export function floatingAnimation(element: HTMLElement, delay = 0) {
  if (!element) return;
  
  element.style.animation = `float 3s ease-in-out infinite ${delay}s`;
}

// Button click animation
export function buttonClickAnimation(element: HTMLElement) {
  if (!element) return;
  
  element.style.transform = 'scale(0.95)';
  element.style.transition = 'transform 0.1s ease-out';
  
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 100);
}

// Form submission animation
export function formSubmitAnimation(element: HTMLElement) {
  if (!element) return;
  
  element.style.transform = 'scale(1.02)';
  element.style.filter = 'brightness(1.1)';
  element.style.transition = 'all 0.2s ease-out';
  
  setTimeout(() => {
    element.style.transform = 'scale(1)';
    element.style.filter = 'brightness(1)';
  }, 200);
}
