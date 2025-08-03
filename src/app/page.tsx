'use client';

import Link from 'next/link';
import { Brain, Shield, Heart, Users, Zap, Star, ArrowRight, Play, BarChart3, Award, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/EntryCard';
import EmotionIcon, { floatingEmotions } from '@/components/EmotionIcon';
import RecentSessions from '@/components/RecentSessions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 mb-16">
            {/* Floating Emotions */}
            <div className="flex justify-center space-x-8 mb-8">
              {floatingEmotions.map((emotion, index) => (
                <div
                  key={emotion.emotion}
                  className={`animate-hero-float`}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <EmotionIcon
                    emotion={emotion.emotion}
                    icon={emotion.icon}
                    size="lg"
                    showLabel={false}
                    className="opacity-80 hover:opacity-100"
                  />
                </div>
              ))}
            </div>

            {/* Main Hero Content */}
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Brain className="h-12 w-12 text-mind-accent animate-pulse-soft" />
                <h1 className="text-5xl md:text-7xl font-bold text-gradient">
                  MindMosaic
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                Your Mind, Gently Heard — AI Self-Check Support
              </p>
              
              <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                Revolutionary AI-powered mental health platform designed specifically for university students. 
                Get instant, empathetic guidance while maintaining complete anonymity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-mind-yellow/30 to-mind-orange/30 border border-mind-accent/50 hover:from-mind-yellow/40 hover:to-mind-orange/40 text-lg px-8 py-6 mind-glow transition-all duration-500 hover:scale-105"
                >
                  <Link href="/form">
                    Start Free Self-Check
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-mind-accent/30 hover:bg-mind-yellow/10 text-lg px-8 py-6 transition-all duration-300"
                >
                  <Link href="#demo">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-white/60 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-mind-accent" />
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-mind-accent" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-mind-accent" />
                  <span>University Approved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="max-w-2xl mx-auto mt-12">
            <RecentSessions />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-mind-soft-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient count-up">10K+</div>
              <div className="text-white/70 text-sm mt-2">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient count-up">50+</div>
              <div className="text-white/70 text-sm mt-2">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient count-up">95%</div>
              <div className="text-white/70 text-sm mt-2">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient count-up">24/7</div>
              <div className="text-white/70 text-sm mt-2">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Why Students Choose <span className="text-gradient">MindMosaic</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Built specifically for the unique challenges of university life with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <FeatureCard>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-mind-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white">100% Private & Anonymous</h3>
                <p className="text-white/70 leading-relaxed">
                  Zero personal data collection. No accounts, no tracking, no history stored. 
                  Your mental health journey stays completely private.
                </p>
              </div>
            </FeatureCard>

            <FeatureCard>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-mind-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white">Advanced AI Support</h3>
                <p className="text-white/70 leading-relaxed">
                  Powered by state-of-the-art AI models trained specifically for empathetic, 
                  non-judgmental mental health support.
                </p>
              </div>
            </FeatureCard>

            <FeatureCard>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 flex items-center justify-center">
                  <Users className="h-8 w-8 text-mind-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white">Student-Focused Design</h3>
                <p className="text-white/70 leading-relaxed">
                  Created by understanding real university challenges: academic pressure, 
                  social anxiety, career stress, and life transitions.
                </p>
              </div>
            </FeatureCard>

            <FeatureCard>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-mind-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white">Instant Response</h3>
                <p className="text-white/70 leading-relaxed">
                  Get immediate support when you need it most. No waiting lists, 
                  no appointments, no barriers to mental health care.
                </p>
              </div>
            </FeatureCard>

            <FeatureCard>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-mind-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white">Emotion Recognition</h3>
                <p className="text-white/70 leading-relaxed">
                  Advanced sentiment analysis helps provide more personalized and 
                  contextually appropriate support responses.
                </p>
              </div>
            </FeatureCard>

            <FeatureCard>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/20 to-mind-orange/20 border border-mind-accent/30 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-mind-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white">Global Accessibility</h3>
                <p className="text-white/70 leading-relaxed">
                  Available 24/7 from anywhere in the world. Support multiple languages 
                  and cultural contexts for international students.
                </p>
              </div>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-mind-soft-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              How <span className="text-gradient">MindMosaic</span> Works
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Simple, secure, and supportive - get the help you need in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/30 to-mind-orange/30 border-2 border-mind-accent/50 flex items-center justify-center text-2xl font-bold text-mind-accent">
                1
              </div>
              <h3 className="text-xl font-semibold text-white">Share Your Feelings</h3>
              <p className="text-white/70 leading-relaxed">
                Write about what&apos;s on your mind in a safe, judgment-free space. 
                No registration required - just start typing.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/30 to-mind-orange/30 border-2 border-mind-accent/50 flex items-center justify-center text-2xl font-bold text-mind-accent">
                2
              </div>
              <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
              <p className="text-white/70 leading-relaxed">
                Our advanced AI analyzes your emotional state and crafts a personalized, 
                empathetic response tailored to your specific situation.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-mind-yellow/30 to-mind-orange/30 border-2 border-mind-accent/50 flex items-center justify-center text-2xl font-bold text-mind-accent">
                3
              </div>
              <h3 className="text-xl font-semibold text-white">Get Support</h3>
              <p className="text-white/70 leading-relaxed">
                Receive compassionate guidance, coping strategies, and resources. 
                Connect with professional help if recommended.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Trusted by Students Worldwide
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Real testimonials from students who found support through MindMosaic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glass-effect p-6 rounded-2xl card-hover">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-mind-accent fill-current" />
                ))}
              </div>
              <p className="text-white/80 mb-4 italic">
                "MindMosaic helped me through my worst semester. The AI responses felt genuinely caring and gave me practical advice I could actually use."
              </p>
              <div className="text-sm text-white/60">— Sarah, Psychology Major</div>
            </div>

            <div className="glass-effect p-6 rounded-2xl card-hover">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-mind-accent fill-current" />
                ))}
              </div>
              <p className="text-white/80 mb-4 italic">
                "I was skeptical about AI therapy, but this platform really understood my anxiety. The anonymity made it easier to open up."
              </p>
              <div className="text-sm text-white/60">— Marcus, Engineering Student</div>
            </div>

            <div className="glass-effect p-6 rounded-2xl card-hover">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-mind-accent fill-current" />
                ))}
              </div>
              <p className="text-white/80 mb-4 italic">
                "Available 24/7 when campus counseling wasn't. MindMosaic was there during my 3am breakdown and helped me find clarity."
              </p>
              <div className="text-sm text-white/60">— Alex, International Student</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-mind-yellow/10 to-mind-orange/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready to Transform Your Mental Health Journey?
            </h2>
            
            <p className="text-xl text-white/80 leading-relaxed">
              Join thousands of students who&apos;ve found support, clarity, and hope through MindMosaic. 
              Your mental wellbeing matters, and help is just one click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-mind-yellow/40 to-mind-orange/40 border border-mind-accent/60 hover:from-mind-yellow/50 hover:to-mind-orange/50 text-lg px-12 py-6 mind-glow transition-all duration-300"
              >
                <Link href="/form">
                  Start Your Free Self-Check
                  <Heart className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-mind-accent/40 hover:bg-mind-yellow/10 text-lg px-8 py-6"
              >
                <Link href="/privacy">Learn About Privacy →</Link>
              </Button>
            </div>

            <div className="text-sm text-white/60 mt-8">
              No signup required • Completely anonymous • Always free
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
