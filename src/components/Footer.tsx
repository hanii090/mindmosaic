'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-r from-mind-dark via-mind-soft-black to-mind-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-yellow/30 flex items-center justify-center">
                <span className="text-mind-yellow font-bold">M</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-mind-yellow to-mind-orange bg-clip-text text-transparent">
                MindMosaic
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Empowering university students with AI-powered mental health support. 
              Your privacy, our priority.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/50 hover:text-mind-yellow transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-white/50 hover:text-mind-yellow transition-colors">
                <span className="sr-only">Instagram</span>
                📸
              </a>
              <a href="#" className="text-white/50 hover:text-mind-yellow transition-colors">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Product</h3>
            <div className="space-y-3">
              <Link 
                href="/form" 
                className="block text-white/70 hover:text-mind-yellow transition-colors duration-300 text-sm"
              >
                Self-Check Tool
              </Link>
              <Link 
                href="#features" 
                className="block text-white/70 hover:text-mind-yellow transition-colors duration-300 text-sm"
              >
                Features
              </Link>
              <Link 
                href="#pricing" 
                className="block text-white/70 hover:text-mind-yellow transition-colors duration-300 text-sm"
              >
                Pricing
              </Link>
              <Link 
                href="/admin" 
                className="block text-white/70 hover:text-mind-yellow transition-colors duration-300 text-sm"
              >
                Admin Portal
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Support</h3>
            <div className="space-y-3">
              <Link 
                href="/privacy" 
                className="block text-white/70 hover:text-mind-yellow transition-colors duration-300 text-sm"
              >
                Privacy & Ethics
              </Link>
              <a 
                href="mailto:support@mindmosaic.app" 
                className="block text-white/70 hover:text-mind-yellow transition-colors duration-300 text-sm"
              >
                Contact Support
              </a>
              <a 
                href="#" 
                className="block text-white/70 hover:text-mind-yellow transition-colors duration-300 text-sm"
              >
                Help Center
              </a>
              <a 
                href="https://www.crisis-text-line.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-white/70 hover:text-mind-orange transition-colors duration-300 text-sm"
              >
                Crisis Support →
              </a>
            </div>
          </div>

          {/* Emergency */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center">
              <span className="text-red-400 mr-2">🚨</span>
              Emergency
            </h3>
            <div className="space-y-3">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-300 font-medium text-sm mb-2">Crisis Resources:</p>
                <div className="space-y-1">
                  <a href="tel:988" className="block text-red-200 hover:text-red-100 transition-colors text-sm font-medium">
                    Crisis Lifeline: 988
                  </a>
                  <a href="tel:911" className="block text-red-200 hover:text-red-100 transition-colors text-sm font-medium">
                    Emergency: 911
                  </a>
                  <a href="sms:741741" className="block text-red-200 hover:text-red-100 transition-colors text-sm">
                    Text: HOME to 741741
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/50 text-sm">
            © 2024 MindMosaic. Built with ❤️ for student mental wellness.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/privacy" className="text-white/50 hover:text-mind-yellow transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/50 hover:text-mind-yellow transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-white/50 hover:text-mind-yellow transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
