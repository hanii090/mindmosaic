'use client';

import Link from 'next/link';
import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-mind-yellow/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Brain className="h-5 w-5 text-mind-accent group-hover:animate-pulse-soft" />
            </div>
            <span className="text-xl font-bold text-gradient">
              MindMosaic
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-white/80 hover:text-mind-yellow transition-colors duration-300"
            >
              Home
            </Link>
            <Link 
              href="/form" 
              className="text-white/80 hover:text-mind-yellow transition-colors duration-300"
            >
              Self-Check
            </Link>
            <Link 
              href="/privacy" 
              className="text-white/80 hover:text-mind-yellow transition-colors duration-300"
            >
              Privacy
            </Link>
            <Button 
              asChild 
              className="bg-gradient-to-r from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 hover:from-mind-yellow/30 hover:to-mind-orange/30 transition-all duration-300"
            >
              <Link href="/form">Start Check</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-mind-yellow/10 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-white/80 hover:text-mind-yellow transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/form" 
                className="text-white/80 hover:text-mind-yellow transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Self-Check
              </Link>
              <Link 
                href="/privacy" 
                className="text-white/80 hover:text-mind-yellow transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Privacy
              </Link>
              <Button 
                asChild 
                className="bg-gradient-to-r from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 w-full"
              >
                <Link href="/form" onClick={() => setIsMobileMenuOpen(false)}>
                  Start Check
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
