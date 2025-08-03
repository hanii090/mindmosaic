'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, Heart, ArrowRight, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useGSAPAnimation, staggerAnimation } from '@/lib/animations';
import { useRef } from 'react';

interface SavedSession {
  sessionId: string;
  timestamp: string;
  userInput: string;
  detectedEmotion: string;
  aiResponse: {
    mainMessage: string;
    suggestions: string[];
  };
}

export default function RecentSessionsPage() {
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const pageRef = useGSAPAnimation('fadeInUp');
  const sessionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved sessions from localStorage
    const loadSavedSessions = () => {
      try {
        const sessions = localStorage.getItem('mindmosaic_saved_sessions');
        if (sessions) {
          const parsedSessions = JSON.parse(sessions);
          setSavedSessions(parsedSessions.slice(0, 3)); // Keep only last 3
        }
      } catch (error) {
        console.error('Error loading saved sessions:', error);
      }
    };

    loadSavedSessions();
  }, []);

  useEffect(() => {
    // Animate session cards
    if (sessionsRef.current && savedSessions.length > 0) {
      const cards = sessionsRef.current.querySelectorAll('.session-card');
      staggerAnimation(cards);
    }
  }, [savedSessions]);

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = savedSessions.filter(session => session.sessionId !== sessionId);
    setSavedSessions(updatedSessions);
    
    try {
      localStorage.setItem('mindmosaic_saved_sessions', JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error updating saved sessions:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main ref={pageRef} className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-6 mb-12">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mind-yellow/30 to-mind-orange/30 border border-mind-accent/50 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-mind-accent animate-pulse-soft" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">
                  Recent <span className="text-gradient">Sessions</span>
                </h1>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                  Revisit your previous emotional support sessions and continue your mental wellness journey.
                </p>
              </div>
            </div>

            {/* Sessions List */}
            <div ref={sessionsRef} className="space-y-6">
              {savedSessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="glass-effect p-8 rounded-2xl border border-mind-accent/20">
                    <Heart className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Saved Sessions</h3>
                    <p className="text-white/60 mb-6">
                      You haven't saved any sessions yet. Complete a self-check to start building your emotional wellness history.
                    </p>
                    <Button asChild size="lg">
                      <Link href="/form">
                        Start Your First Session
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                savedSessions.map((session, index) => (
                  <div 
                    key={session.sessionId} 
                    className="session-card glass-effect p-6 rounded-2xl border border-mind-accent/20 hover:border-mind-accent/40 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-mind-accent animate-pulse-soft"></div>
                        <span className="text-white/60 text-sm">
                          {formatTimestamp(session.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-mind-accent/20 text-mind-accent border border-mind-accent/30">
                          {session.detectedEmotion}
                        </span>
                        <Button
                          onClick={() => handleDeleteSession(session.sessionId)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Your Input:</h4>
                        <p className="text-white/70 text-sm bg-white/5 p-3 rounded-lg border border-white/10">
                          {session.userInput.length > 150 
                            ? session.userInput.substring(0, 150) + '...' 
                            : session.userInput}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">AI Response:</h4>
                        <p className="text-white/70 text-sm bg-mind-accent/5 p-3 rounded-lg border border-mind-accent/20">
                          {session.aiResponse.mainMessage.length > 200 
                            ? session.aiResponse.mainMessage.substring(0, 200) + '...' 
                            : session.aiResponse.mainMessage}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <span className="text-white/50 text-xs">
                          Session #{index + 1}
                        </span>
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                        >
                          <Link href={`/result?session=${session.sessionId}`}>
                            View Full Session
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div className="text-center mt-12 space-y-4">
              <Button asChild size="lg" variant="default">
                <Link href="/form">
                  <Heart className="mr-2 h-5 w-5" />
                  Start New Session
                </Link>
              </Button>
              
              <div>
                <Button asChild variant="ghost">
                  <Link href="/">← Back to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
