'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Heart, AlertCircle, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/EntryCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              asChild
              variant="ghost"
              className="text-white/70 hover:text-white"
            >
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 mb-12">
              <div className="flex items-center justify-center space-x-3">
                <Shield className="h-10 w-10 text-mind-blue animate-pulse-soft" />
                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  Privacy & Ethics
                </h1>
              </div>
              
              <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                Your privacy and wellbeing are our top priorities. Here's how we protect you 
                and approach mental health support responsibly.
              </p>
            </div>

            {/* Key Principles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <FeatureCard>
                <div className="space-y-4">
                  <Lock className="h-10 w-10 text-mind-peach" />
                  <h3 className="text-xl font-semibold text-white">100% Anonymous</h3>
                  <p className="text-white/70 leading-relaxed">
                    We never collect names, emails, phone numbers, or any personally identifiable information. 
                    Your identity remains completely private.
                  </p>
                </div>
              </FeatureCard>

              <FeatureCard>
                <div className="space-y-4">
                  <Eye className="h-10 w-10 text-mind-blue" />
                  <h3 className="text-xl font-semibold text-white">No Tracking</h3>
                  <p className="text-white/70 leading-relaxed">
                    We don't use cookies for tracking, analytics, or advertising. 
                    Your browsing behavior and usage patterns are not monitored.
                  </p>
                </div>
              </FeatureCard>

              <FeatureCard>
                <div className="space-y-4">
                  <Heart className="h-10 w-10 text-mind-lavender" />
                  <h3 className="text-xl font-semibold text-white">Supportive, Not Clinical</h3>
                  <p className="text-white/70 leading-relaxed">
                    Our AI provides emotional support and guidance, not medical diagnosis or treatment. 
                    Always consult professionals for clinical needs.
                  </p>
                </div>
              </FeatureCard>

              <FeatureCard>
                <div className="space-y-4">
                  <Users className="h-10 w-10 text-mind-peach" />
                  <h3 className="text-xl font-semibold text-white">Student-Centered</h3>
                  <p className="text-white/70 leading-relaxed">
                    Designed specifically for university students, understanding the unique 
                    challenges of academic life and young adulthood.
                  </p>
                </div>
              </FeatureCard>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-8">
              {/* Data Handling */}
              <div className="glass-effect p-8 rounded-2xl">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Shield className="h-6 w-6 text-mind-blue mr-3" />
                  How We Handle Your Data
                </h2>
                
                <div className="space-y-4 text-white/80">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <div>
                      <strong>Anonymous Processing:</strong> Your text is processed without any connection to your identity
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <div>
                      <strong>Temporary Storage:</strong> Responses are stored locally on your device only
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <div>
                      <strong>No Server Logs:</strong> We don't keep logs of your conversations or IP addresses
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <div>
                      <strong>Encrypted Transmission:</strong> All data is transmitted securely using HTTPS encryption
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Ethics */}
              <div className="glass-effect p-8 rounded-2xl">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Zap className="h-6 w-6 text-mind-peach mr-3" />
                  Our AI Approach
                </h2>
                
                <div className="space-y-4 text-white/80">
                  <p className="leading-relaxed">
                    Our AI is designed to be empathetic, non-judgmental, and supportive. It's trained to:
                  </p>
                  
                  <ul className="space-y-3 ml-4">
                    <li className="flex items-start space-x-3">
                      <span className="text-mind-peach">•</span>
                      <span>Provide emotional validation and support</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-mind-peach">•</span>
                      <span>Suggest healthy coping strategies and resources</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-mind-peach">•</span>
                      <span>Recognize when professional help may be beneficial</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-mind-peach">•</span>
                      <span>Avoid making diagnoses or providing medical advice</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Important Disclaimers */}
              <div className="glass-effect p-8 rounded-2xl border border-yellow-400/30">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <AlertCircle className="h-6 w-6 text-yellow-400 mr-3" />
                  Important Disclaimers
                </h2>
                
                <div className="space-y-4 text-white/80">
                  <div className="bg-yellow-400/10 p-4 rounded-lg border border-yellow-400/20">
                    <h3 className="font-semibold text-yellow-400 mb-2">Not a Replacement for Professional Care</h3>
                    <p className="text-sm">
                      MindMosaic is designed to provide supportive guidance and emotional validation. 
                      It is not a substitute for professional mental health treatment, therapy, or medical care.
                    </p>
                  </div>
                  
                  <div className="bg-red-400/10 p-4 rounded-lg border border-red-400/20">
                    <h3 className="font-semibold text-red-400 mb-2">Crisis Situations</h3>
                    <p className="text-sm mb-2">
                      If you're experiencing thoughts of self-harm, suicidal ideation, or are in immediate danger, 
                      please contact emergency services or a crisis helpline immediately:
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <a href="tel:988" className="text-red-300 hover:text-red-200">Crisis Lifeline: 988</a>
                      <a href="tel:911" className="text-red-300 hover:text-red-200">Emergency: 911</a>
                      <a href="https://www.crisistextline.org/" target="_blank" rel="noopener noreferrer" className="text-red-300 hover:text-red-200">
                        Text HOME to 741741
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-blue-400/10 p-4 rounded-lg border border-blue-400/20">
                    <h3 className="font-semibold text-blue-400 mb-2">When to Seek Professional Help</h3>
                    <p className="text-sm">
                      Consider speaking with a mental health professional if you experience persistent symptoms, 
                      significant distress, or if your daily functioning is impacted. Your campus likely offers 
                      counseling services specifically for students.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="glass-effect p-8 rounded-2xl">
                <h2 className="text-2xl font-semibold text-white mb-6">Contact & Support</h2>
                
                <div className="space-y-4 text-white/80">
                  <p className="leading-relaxed">
                    If you have questions about our privacy practices, ethical approach, or technical concerns:
                  </p>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-mind-blue">📧</span>
                      <a href="mailto:support@mindmosaic.app" className="text-mind-blue hover:text-mind-peach transition-colors">
                        support@mindmosaic.app
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-mind-lavender">🕐</span>
                      <span className="text-white/60">Available 24/7 for technical support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <p className="text-white/70 mb-6">
                Ready to check in with your mental wellbeing in a safe, private environment?
              </p>
              
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-mind-peach/20 to-mind-blue/20 border border-mind-peach/50 hover:from-mind-peach/30 hover:to-mind-blue/30 text-lg px-8 py-6 mind-glow"
              >
                <Link href="/form">Start Your Self-Check →</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
