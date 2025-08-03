'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please check your email and password.');
      } else {
        // Check if user is actually authenticated
        const session = await getSession();
        if (session?.user?.role === 'admin') {
          router.push('/admin');
        } else {
          setError('Access denied. Admin privileges required.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8 space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 border border-red-500/50 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-red-400 animate-pulse-soft" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">
                  Admin <span className="text-gradient">Access</span>
                </h1>
                <p className="text-white/70">
                  Secure dashboard for system analytics and monitoring
                </p>
              </div>
            </div>

            {/* Login Form */}
            <div className="glass-effect p-8 rounded-2xl border border-mind-accent/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Demo Credentials Notice */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                  <p className="text-blue-400 text-sm font-medium mb-2">Demo Credentials</p>
                  <p className="text-white/70 text-xs">
                    Email: admin@mindmosaic.app<br />
                    Password: mindmosaic2024
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-white font-medium">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-mind-accent/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-mind-accent/50 focus:border-mind-accent/50"
                    placeholder="Enter admin email"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-white font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-white/5 border border-mind-accent/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-mind-accent/50 focus:border-mind-accent/50"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full bg-gradient-to-r from-red-500/30 to-orange-500/30 border border-red-500/50 hover:from-red-500/40 hover:to-orange-500/40 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Access Dashboard</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-mind-accent/10">
                <div className="flex items-center justify-center space-x-2 text-white/50 text-xs">
                  <Shield className="h-4 w-4" />
                  <span>Secure admin authentication required</span>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Button 
                asChild 
                variant="ghost" 
                className="text-white/70 hover:text-white"
              >
                <Link href="/">← Back to MindMosaic</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
