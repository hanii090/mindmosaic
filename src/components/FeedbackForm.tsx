'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, Heart, Meh, Sparkles } from 'lucide-react';
import { useGSAPAnimation, staggerAnimation } from '@/lib/animations';
import { useEffect, useRef } from 'react';

interface FeedbackFormProps {
  sessionId: string;
  entryId?: string;
  onSubmitted?: () => void;
}

interface FeedbackData {
  rating: number;
  helpful: boolean;
  supportive: boolean;
  accurate: boolean;
  comments: string;
  emotionalSupport: 'excellent' | 'good' | 'neutral' | 'poor';
}

export default function FeedbackForm({ sessionId, entryId, onSubmitted }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    helpful: false,
    supportive: false,
    accurate: false,
    comments: '',
    emotionalSupport: 'neutral'
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // GSAP animations
  const formRef = useGSAPAnimation('fadeInUp');
  const starsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animate stars with stagger effect
    if (starsRef.current) {
      const stars = starsRef.current.querySelectorAll('button');
      staggerAnimation(stars);
    }
  }, []);

  const submitFeedback = async () => {
    if (feedback.rating === 0) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          entryId,
          rating: feedback.rating,
          helpful: feedback.helpful,
          supportive: feedback.supportive,
          accurate: feedback.accurate,
          emotionalSupport: feedback.emotionalSupport,
          comments: feedback.comments
        })
      });

      if (response.ok) {
        setSubmitted(true);
        onSubmitted?.();
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center space-y-3">
        <div className="flex justify-center">
          <Heart className="h-8 w-8 text-green-400" />
        </div>
        <h4 className="font-semibold text-green-400">Thank You!</h4>
        <p className="text-white/70 text-sm">
          Your feedback helps us improve MindMosaic and provide better emotional support for students.
        </p>
      </div>
    );
  }

  const StarRating = () => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
          className={`transition-colors ${
            star <= feedback.rating 
              ? 'text-yellow-400 hover:text-yellow-300' 
              : 'text-white/30 hover:text-white/50'
          }`}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      ))}
    </div>
  );

  const EmotionalSupportButtons = () => (
    <div className="grid grid-cols-2 gap-3">
      {[
        { key: 'excellent', label: 'Very Supportive', icon: '😊', color: 'green' },
        { key: 'good', label: 'Somewhat Helpful', icon: '🙂', color: 'blue' },
        { key: 'neutral', label: 'Neutral', icon: '😐', color: 'gray' },
        { key: 'poor', label: 'Not Helpful', icon: '😔', color: 'red' }
      ].map(({ key, label, icon, color }) => (
        <button
          key={key}
          type="button"
          onClick={() => setFeedback(prev => ({ ...prev, emotionalSupport: key as 'excellent' | 'good' | 'neutral' | 'poor' }))}
          className={`p-3 rounded-lg border text-sm font-medium transition-all ${
            feedback.emotionalSupport === key
              ? `bg-${color}-500/20 border-${color}-500/50 text-${color}-400`
              : 'bg-white/5 border-mind-accent/20 text-white/70 hover:bg-white/10'
          }`}
        >
          <div className="text-lg mb-1">{icon}</div>
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div ref={formRef} className="bg-white/5 border border-mind-accent/20 rounded-xl p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <Sparkles className="h-8 w-8 text-mind-accent animate-pulse-soft" />
        </div>
        <h4 className="font-semibold text-white text-lg">How was this session?</h4>
        <p className="text-white/60 text-sm">
          Your feedback helps us improve emotional support for students
        </p>
      </div>

      {/* Overall Rating */}
      <div className="space-y-3">
        <label className="block text-white/80 font-medium">Overall Experience</label>
        <div ref={starsRef} className="flex items-center justify-center">
          <StarRating />
        </div>
        {feedback.rating > 0 && (
          <p className="text-center text-sm text-white/60">
            {feedback.rating === 1 && "We'll work to improve"}
            {feedback.rating === 2 && "Thanks for the feedback"}
            {feedback.rating === 3 && "We appreciate your input"}
            {feedback.rating === 4 && "Great to hear!"}
            {feedback.rating === 5 && "Wonderful! So glad we could help"}
          </p>
        )}
      </div>

      {/* Emotional Support Rating */}
      <div className="space-y-3">
        <label className="block text-white/80 font-medium">How emotionally supportive was the response?</label>
        <EmotionalSupportButtons />
      </div>

      {/* Quick Checkboxes */}
      <div className="space-y-3">
        <label className="block text-white/80 font-medium">The response was... (select all that apply)</label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { key: 'helpful', label: 'Helpful and relevant', icon: ThumbsUp },
            { key: 'supportive', label: 'Emotionally supportive', icon: Heart },
            { key: 'accurate', label: 'Accurate to my emotions', icon: Star }
          ].map(({ key, label, icon: Icon }) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={feedback[key as keyof FeedbackData] as boolean}
                onChange={(e) => setFeedback(prev => ({ ...prev, [key]: e.target.checked }))}
                className="w-4 h-4 bg-white/10 border border-mind-accent/30 rounded text-mind-accent focus:ring-mind-accent/50"
              />
              <div className="flex items-center space-x-2 text-white/70 group-hover:text-white transition-colors">
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        <label className="block text-white/80 font-medium">
          Additional Comments (Optional)
        </label>
        <Textarea
          value={feedback.comments}
          onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
          placeholder="How can we improve your experience? Any specific feedback about the emotional support provided?"
          className="bg-white/5 border-mind-accent/20 text-white placeholder:text-white/50 resize-none"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={submitFeedback}
        disabled={feedback.rating === 0 || isSubmitting}
        className="w-full bg-gradient-to-r from-mind-yellow/30 to-mind-orange/30 border border-mind-accent/50 hover:from-mind-yellow/40 hover:to-mind-orange/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Submitting...</span>
          </div>
        ) : (
          'Submit Feedback'
        )}
      </Button>

      {/* Privacy Note */}
      <p className="text-xs text-white/50 text-center">
        🔒 Your feedback is anonymous and helps improve our AI emotional support system
      </p>
    </div>
  );
}
