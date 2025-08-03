'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Send, ArrowLeft, Heart, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormCard } from '@/components/EntryCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThinkingLoader } from '@/components/LottieLoader';
import { submitJournalEntry } from '@/app/actions';
import { getFormState, getCharCountDisplay, sanitizeContent } from '@/lib/validation';
import { syncCurrentSession } from '@/lib/localStorage';

export default function FormPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Get real-time form validation state
  const formState = getFormState(input);
  const charDisplay = getCharCountDisplay(input);

  const handleSubmit = async () => {
    setError('');
    
    // Validate before submission
    if (!formState.isValid) {
      setError(formState.errors[0] || 'Please fix the errors above');
      return;
    }
    
    startTransition(async () => {
      try {
        const sanitizedContent = sanitizeContent(input);
        const formData = new FormData();
        formData.append('content', sanitizedContent);
        
        const result = await submitJournalEntry(formData);
        
        if (result.success) {
          // Sync to localStorage for offline access
          syncCurrentSession(
            result.sessionId,
            sanitizedContent,
            result.aiResponse,
            result.emotionAnalysis
          );
          
          router.push(`/result?session=${result.sessionId}`);
        } else {
          setError(result.error || 'Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error('Form submission failed:', error);
        setError('Unable to submit your entry. Please check your connection and try again.');
      }
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 px-4 py-2 border border-mind-accent/30 rounded-xl text-white hover:bg-mind-yellow/10 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12 space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mind-yellow/30 to-mind-orange/30 border border-mind-accent/50 flex items-center justify-center">
                <Brain className="h-8 w-8 text-mind-accent animate-pulse-soft" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Share What&apos;s on Your <span className="text-gradient">Mind</span>
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                This is a safe, judgment-free space. Share your thoughts, feelings, or concerns, 
                and receive personalized support from our AI companion.
              </p>
            </div>

            {/* Privacy Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-mind-accent" />
                <span>100% Anonymous</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-mind-accent" />
                <span>AI-Powered Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-mind-accent" />
                <span>Evidence-Based</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-3xl mx-auto">
            <FormCard>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                <div className="space-y-4">
                  <label htmlFor="content" className="block text-lg font-medium text-white">
                    What would you like to share today?
                  </label>
                  
                  <div className="space-y-2">
                    <Textarea
                      id="content"
                      name="content"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="I've been feeling... or I've been struggling with... or Today I experienced..."
                      className="min-h-[200px] bg-white/5 border-mind-accent/20 focus:border-mind-accent/50 text-white placeholder:text-white/50 text-lg leading-relaxed resize-none"
                      disabled={isPending}
                      required
                    />
                    
                    {/* Character Count and Validation */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        {formState.isValid ? (
                          <div className="flex items-center text-green-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>Ready to submit</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-400">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>{formState.errors[0] || 'Keep writing...'}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`${
                          charDisplay.color === 'green' ? 'text-green-400' :
                          charDisplay.color === 'yellow' ? 'text-yellow-400' :
                          charDisplay.color === 'red' ? 'text-red-400' : 'text-white/50'
                        }`}>
                          {charDisplay.display}
                        </span>
                        <span className="text-white/30">|</span>
                        <span className="text-white/50">
                          {formState.wordCount} words
                        </span>
                      </div>
                    </div>

                    {/* Validation Messages */}
                    {formState.errors.length > 0 && (
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        {formState.errors.map((error, index) => (
                          <div key={index} className="flex items-center text-yellow-300 text-sm">
                            <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
                            <span>{error}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {formState.warnings.length > 0 && (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        {formState.warnings.map((warning, index) => (
                          <div key={index} className="flex items-center text-blue-300 text-sm">
                            <Heart className="h-4 w-4 mr-2 shrink-0" />
                            <span>{warning}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  {isPending ? (
                    <div className="flex flex-col items-center space-y-4">
                      <ThinkingLoader />
                      <p className="text-white/80 text-center">
                        Your thoughts are being carefully analyzed...
                        <br />
                        <span className="text-sm text-white/60">This may take a moment</span>
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!formState.isValid || isPending}
                      className="bg-gradient-to-r from-mind-yellow/30 to-mind-orange/30 border border-mind-accent/50 hover:from-mind-yellow/40 hover:to-mind-orange/40 disabled:opacity-50 disabled:cursor-not-allowed text-lg px-8 py-6 mind-glow transition-all duration-300"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Get AI Support
                    </Button>
                  )}
                </div>
              </form>
            </FormCard>

            {/* Support Information */}
            <div className="mt-12 space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">
                  What to Expect
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 flex items-center justify-center">
                      <span className="text-2xl">🤗</span>
                    </div>
                    <h4 className="font-medium text-white">Empathetic Response</h4>
                    <p className="text-sm text-white/70">
                      Receive a warm, understanding response that validates your feelings
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 flex items-center justify-center">
                      <span className="text-2xl">💡</span>
                    </div>
                    <h4 className="font-medium text-white">Practical Strategies</h4>
                    <p className="text-sm text-white/70">
                      Get actionable coping techniques tailored to your situation
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <h4 className="font-medium text-white">Growth Focused</h4>
                    <p className="text-sm text-white/70">
                      Find hope, perspective, and paths forward for your wellbeing
                    </p>
                  </div>
                </div>
              </div>

              {/* Crisis Resources */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <h4 className="font-semibold text-red-300 mb-3">
                  🚨 Need Immediate Help?
                </h4>
                <p className="text-red-200 text-sm mb-3">
                  If you&apos;re in crisis or having thoughts of self-harm, please reach out immediately:
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a 
                    href="tel:988" 
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg px-4 py-2 text-red-200 hover:text-red-100 transition-colors"
                  >
                    📞 Crisis Lifeline: 988
                  </a>
                  <a 
                    href="sms:741741" 
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg px-4 py-2 text-red-200 hover:text-red-100 transition-colors"
                  >
                    💬 Text: HOME to 741741
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
