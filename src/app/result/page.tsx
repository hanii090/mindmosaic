'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Brain, Heart, ArrowLeft, RefreshCw, Save, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResultCard } from '@/components/EntryCard';
import EmotionIcon from '@/components/EmotionIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThinkingLoader } from '@/components/LottieLoader';
import { ZephyrResponse } from '@/lib/together';
import { EmotionAnalysis } from '@/lib/replicate';

interface ResultData {
  sessionId: string;
  aiResponse?: ZephyrResponse;
  emotionAnalysis?: EmotionAnalysis;
}

interface FeedbackData {
  rating: number;
  helpful: boolean;
  comments: string;
}

// Feedback Collection Component
function FeedbackSection({ sessionId }: { sessionId: string }) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    helpful: false,
    comments: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (feedback.rating === 0) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          rating: feedback.rating,
          helpful: feedback.helpful,
          comments: feedback.comments
        })
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
        <h4 className="font-semibold text-green-300 mb-2">Thank You! 🙏</h4>
        <p className="text-green-200 text-sm">
          Your feedback helps us improve MindMosaic for everyone.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-mind-accent/20 rounded-xl p-6">
      <h4 className="font-semibold text-white mb-4">How was this session?</h4>
      
      {/* Rating */}
      <div className="mb-4">
        <p className="text-white/80 text-sm mb-3">Rate your experience:</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setFeedback(prev => ({ ...prev, rating }))}
              className={`p-2 rounded-lg transition-colors ${
                feedback.rating >= rating 
                  ? 'bg-mind-yellow/30 text-mind-yellow' 
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      {/* Helpful */}
      <div className="mb-4">
        <p className="text-white/80 text-sm mb-3">Was this helpful?</p>
        <div className="flex gap-3">
          <button
            onClick={() => setFeedback(prev => ({ ...prev, helpful: true }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              feedback.helpful 
                ? 'bg-green-500/30 text-green-300' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            👍 Yes
          </button>
          <button
            onClick={() => setFeedback(prev => ({ ...prev, helpful: false }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              !feedback.helpful && feedback.rating > 0
                ? 'bg-red-500/30 text-red-300' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            👎 No
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="mb-4">
        <p className="text-white/80 text-sm mb-3">Additional comments (optional):</p>
        <Textarea
          value={feedback.comments}
          onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
          placeholder="How can we improve your experience?"
          className="bg-white/5 border-mind-accent/20 text-white placeholder:text-white/50"
          rows={3}
        />
      </div>

      {/* Submit */}
      <Button
        onClick={submitFeedback}
        disabled={feedback.rating === 0 || isSubmitting}
        className="w-full bg-gradient-to-r from-mind-yellow/30 to-mind-orange/30 border border-mind-accent/50 hover:from-mind-yellow/40 hover:to-mind-orange/40"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </div>
  );
}

function ResultContent() {
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sessionId = searchParams.get('session');
    
    if (!sessionId) {
      setError('No session found. Please start a new self-check.');
      setIsLoading(false);
      return;
    }

    // Get stored response data
    try {
      const storedResponse = sessionStorage.getItem('mindmosaic_response');
      const storedEmotions = sessionStorage.getItem('mindmosaic_emotions');
      
      const data: ResultData = {
        sessionId,
        aiResponse: storedResponse ? JSON.parse(storedResponse) : undefined,
        emotionAnalysis: storedEmotions ? JSON.parse(storedEmotions) : undefined,
      };

      setResultData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading result data:', error);
      setError('Unable to load your results. Please try again.');
      setIsLoading(false);
    }
  }, [searchParams]);

  const handleNewEntry = () => {
    // Clear session storage
    sessionStorage.removeItem('mindmosaic_response');
    sessionStorage.removeItem('mindmosaic_emotions');
    sessionStorage.removeItem('mindmosaic_session');
    
    router.push('/form');
  };

  const handleSaveSession = async () => {
    if (!resultData || isSaving || sessionSaved) return;
    
    setIsSaving(true);
    try {
      // Get user input from sessionStorage or other source
      const userInput = sessionStorage.getItem('mindmosaic_user_input') || 'Session input';
      
      const sessionToSave = {
        sessionId: resultData.sessionId,
        timestamp: new Date().toISOString(),
        userInput,
        detectedEmotion: resultData.emotionAnalysis?.dominantEmotion || 'neutral',
        aiResponse: {
          mainMessage: resultData.aiResponse?.mainMessage || '',
          suggestions: resultData.aiResponse?.suggestions || []
        }
      };

      // Get existing saved sessions
      const existingSessions = JSON.parse(localStorage.getItem('mindmosaic_saved_sessions') || '[]');
      
      // Add new session to the beginning and keep only last 3
      const updatedSessions = [sessionToSave, ...existingSessions.slice(0, 2)];
      
      // Save to localStorage
      localStorage.setItem('mindmosaic_saved_sessions', JSON.stringify(updatedSessions));
      
      setSessionSaved(true);
    } catch (error) {
      console.error('Error saving session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center space-y-6">
          <ThinkingLoader />
          <p className="text-white/80 text-lg">
            Preparing your personalized support...
          </p>
        </div>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Something Went Wrong</h1>
              <p className="text-white/70">{error}</p>
              <Button asChild className="bg-gradient-to-r from-mind-yellow/30 to-mind-orange/30 border border-mind-accent/50">
                <Link href="/form">Start New Self-Check</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { aiResponse, emotionAnalysis } = resultData;

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              asChild
              variant="outline"
              className="border-mind-accent/30 hover:bg-mind-yellow/10 text-white"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12 space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mind-yellow/30 to-mind-orange/30 border border-mind-accent/50 flex items-center justify-center">
                <Heart className="h-8 w-8 text-mind-accent animate-pulse-soft" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Your <span className="text-gradient">Personalized</span> Support
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Based on your sharing, here&apos;s what our AI companion wants you to know
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Emotion Analysis */}
            {emotionAnalysis && (
              <ResultCard>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-6 w-6 text-mind-accent" />
                    <h2 className="text-xl font-semibold text-white">Emotional Insights</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-white">Primary Emotion Detected</h3>
                      <div className="flex items-center space-x-3">
                        <EmotionIcon 
                          emotion={emotionAnalysis.primaryEmotion}
                          icon="🤔"
                          size="lg"
                          showLabel={true}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Emotional State:</span>
                          <span className="text-mind-accent capitalize">{emotionAnalysis.emotionalState}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Sentiment:</span>
                          <span className={`capitalize ${
                            emotionAnalysis.sentiment === 'positive' ? 'text-green-400' :
                            emotionAnalysis.sentiment === 'negative' ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>
                            {emotionAnalysis.sentiment}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-white">All Emotions Detected</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {emotionAnalysis.emotions.slice(0, 6).map((emotion, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                            <span className="text-sm text-white/80 capitalize">{emotion.emotion}</span>
                            <span className="text-xs text-mind-accent">{Math.round(emotion.confidence * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ResultCard>
            )}

            {/* AI Response */}
            {aiResponse && (
              <ResultCard>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-6 w-6 text-mind-accent" />
                      <h2 className="text-xl font-semibold text-white">AI Companion Response</h2>
                    </div>
                    <div className="text-sm text-white/60">
                      Confidence: {Math.round(aiResponse.confidence * 100)}%
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/90 leading-relaxed text-lg">
                      {aiResponse.response}
                    </p>
                  </div>

                  {/* Suggestions */}
                  {aiResponse.suggestions.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-white">Coping Strategies</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {aiResponse.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-mind-yellow/5 border border-mind-yellow/20">
                            <span className="text-mind-accent font-bold">•</span>
                            <span className="text-white/80 text-sm">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {aiResponse.resources.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-white">Helpful Resources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {aiResponse.resources.map((resource, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-mind-orange/5 border border-mind-orange/20">
                            <span className="text-mind-accent">🔗</span>
                            <span className="text-white/80 text-sm">{resource}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ResultCard>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Button
                onClick={handleSaveSession}
                disabled={isSaving || sessionSaved}
                variant={sessionSaved ? "success" : "secondary"}
                size="lg"
                className="text-lg px-8 py-6"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : sessionSaved ? (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Session Saved!
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Session
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleNewEntry}
                size="lg"
                className="bg-gradient-to-r from-mind-yellow/30 to-mind-orange/30 border border-mind-accent/50 hover:from-mind-yellow/40 hover:to-mind-orange/40 text-lg px-8 py-6 mind-glow transition-all duration-300"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                New Self-Check
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-mind-accent/30 hover:bg-mind-yellow/10 text-lg px-8 py-6"
              >
                <Link href="/recent">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View Saved Sessions
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-mind-accent/30 hover:bg-mind-yellow/10 text-lg px-8 py-6"
              >
                <Link href="/privacy">
                  Learn About Privacy →
                </Link>
              </Button>
            </div>

            {/* Feedback Section */}
            <div className="mt-8">
              <FeedbackSection sessionId={resultData.sessionId} />
            </div>

            {/* Crisis Support */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center mt-8">
              <h4 className="font-semibold text-red-300 mb-3">
                🚨 Still Need Immediate Help?
              </h4>
              <p className="text-red-200 text-sm mb-3">
                If you&apos;re in crisis, please don&apos;t hesitate to reach out:
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
      </main>

      <Footer />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <ThinkingLoader />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
