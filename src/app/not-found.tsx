import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 border border-orange-500/50 flex items-center justify-center">
              <span className="text-4xl">😕</span>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-white">
              Page <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Not Found</span>
            </h1>
            <p className="text-white/70">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/"
              className="w-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-500/50 hover:from-blue-500/40 hover:to-purple-500/40 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="w-full bg-white/5 border border-white/20 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-white/50 text-sm">
              If you believe this is an error, please contact support or try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
