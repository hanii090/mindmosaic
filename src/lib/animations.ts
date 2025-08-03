'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Enhanced GSAP animation hook
export function useGSAPAnimation(animationType: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn' = 'fadeInUp') {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state
    gsap.set(element, { 
      opacity: 0,
      ...getInitialState(animationType)
    });

    // Animate in with GSAP
    gsap.to(element, {
      opacity: 1,
      ...getFinalState(animationType),
      duration: 0.8,
      ease: "power2.out",
      delay: 0.1
    });

    return () => {
      // Cleanup
      gsap.killTweensOf(element);
    };
  }, [animationType]);

  return elementRef;
}

function getInitialState(type: string) {
  switch (type) {
    case 'fadeInUp':
      return { y: 30 };
    case 'slideInLeft':
      return { x: -50 };
    case 'slideInRight':
      return { x: 50 };
    case 'scaleIn':
      return { scale: 0.8 };
    default:
      return {};
  }
}

function getFinalState(type: string) {
  switch (type) {
    case 'fadeInUp':
      return { y: 0 };
    case 'slideInLeft':
    case 'slideInRight':
      return { x: 0 };
    case 'scaleIn':
      return { scale: 1 };
    default:
      return {};
  }
}

// Enhanced page transition animations with GSAP
export function pageEnterAnimation(element: HTMLElement) {
  if (!element) return;
  
  gsap.fromTo(element, {
    opacity: 0,
    y: 50,
    scale: 0.95
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1,
    ease: "power3.out"
  });
}

// Enhanced floating animation for emojis
export function floatingAnimation(element: HTMLElement, delay = 0) {
  if (!element) return;
  
  gsap.to(element, {
    y: "-=15",
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
    delay: delay
  });
}

// Enhanced button click animation with GSAP
export function buttonClickAnimation(element: HTMLElement) {
  if (!element) return;
  
  gsap.to(element, {
    scale: 0.95,
    duration: 0.1,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: "back.out(1.7)"
      });
    }
  });
}

// Enhanced form submission animation
export function formSubmitAnimation(element: HTMLElement) {
  if (!element) return;
  
  gsap.to(element, {
    scale: 1.02,
    duration: 0.2,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.3)"
      });
    }
  });
}

// Stagger animation for lists
export function staggerAnimation(elements: NodeListOf<Element> | Element[]) {
  if (!elements.length) return;
  
  gsap.fromTo(elements, {
    opacity: 0,
    y: 30
  }, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out"
  });
}

// Card hover animations
export function cardHoverIn(element: HTMLElement) {
  if (!element) return;
  
  gsap.to(element, {
    y: -8,
    scale: 1.02,
    duration: 0.3,
    ease: "power2.out"
  });
}

export function cardHoverOut(element: HTMLElement) {
  if (!element) return;
  
  gsap.to(element, {
    y: 0,
    scale: 1,
    duration: 0.3,
    ease: "power2.out"
  });
}

// Loading spinner animation
export function spinnerAnimation(element: HTMLElement) {
  if (!element) return;
  
  gsap.to(element, {
    rotation: 360,
    duration: 1,
    repeat: -1,
    ease: "none"
  });
}
