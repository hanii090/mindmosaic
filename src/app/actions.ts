'use server';

import { analyzeJournalWithZephyr, ZephyrResponse } from '@/lib/together';
import { detectEmotions, EmotionAnalysis } from '@/lib/replicate';
import { logJournalEntry, createSession } from '@/lib/db';
import { redirect } from 'next/navigation';

export interface FormSubmissionResult {
  success: boolean;
  sessionId: string;
  aiResponse?: ZephyrResponse;
  emotionAnalysis?: EmotionAnalysis;
  error?: string;
}

export async function submitJournalEntry(
  formData: FormData
): Promise<FormSubmissionResult> {
  try {
    const content = formData.get('content') as string;
    
    if (!content || content.trim().length < 10) {
      return {
        success: false,
        sessionId: '',
        error: 'Please share more about what\'s on your mind (at least 10 characters).'
      };
    }

    // Create session ID for this interaction
    const sessionId = generateSessionId();
    
    // Run emotion analysis and AI response in parallel
    const [emotionAnalysis, aiResponse] = await Promise.all([
      detectEmotions(content).catch(error => {
        console.error('Emotion analysis failed:', error);
        // Return a basic emotion analysis if the service fails
        return {
          primaryEmotion: 'neutral',
          emotionalState: 'mixed',
          sentiment: 'neutral' as const,
          sentimentScore: 0.5,
          riskLevel: 'low' as const,
          emotions: [
            { emotion: 'neutral', confidence: 0.5 }
          ]
        };
      }),
      analyzeJournalWithZephyr({
        content,
        timestamp: new Date(),
        emotions: [], // Will be populated after emotion analysis
        sentiment: 'neutral'
      }).catch(error => {
        console.error('AI response failed:', error);
        // Return a supportive default response
        return {
          response: "Thank you for sharing your thoughts with me. What you're experiencing is valid, and it takes courage to express your feelings. Remember that seeking support is a sign of strength, and you're not alone in this journey. While I'm experiencing some technical difficulties right now, please know that your wellbeing matters and there are always people who care about you.",
          confidence: 0.7,
          suggestions: [
            "Take a few minutes for deep breathing exercises",
            "Write down three things you're grateful for today", 
            "Reach out to a trusted friend or family member",
            "Consider speaking with a counselor or therapist",
            "Practice a self-care activity that brings you comfort"
          ],
          resources: [
            "Campus Counseling Center - Available for students",
            "Crisis Text Line - Text HOME to 741741",
            "National Suicide Prevention Lifeline - Call 988",
            "Mental Health America - mhanational.org",
            "Anxiety and Depression Association - adaa.org"
          ]
        };
      })
    ]);

    // Log the entry to database (non-blocking)
    logJournalEntry({
      content,
      timestamp: new Date(),
      emotions: emotionAnalysis?.emotions.map(e => e.emotion) || [],
      sentiment: emotionAnalysis?.sentiment || 'neutral',
      sentimentScore: emotionAnalysis?.sentimentScore || 0,
      riskLevel: emotionAnalysis?.riskLevel || 'low',
      sessionId
    }).catch(error => {
      console.error('Failed to log entry to database:', error);
      // Don't fail the request if logging fails
    });

    // Store session data temporarily for result page
    await createSession({
      sessionId,
      startTime: new Date(),
      totalEntries: 1
    }).catch(error => {
      console.error('Failed to create session:', error);
    });

    return {
      success: true,
      sessionId,
      aiResponse,
      emotionAnalysis: emotionAnalysis || undefined
    };

  } catch (error) {
    console.error('Form submission error:', error);
    
    return {
      success: false,
      sessionId: '',
      error: 'Something went wrong. Please try again, or contact support if the problem persists.'
    };
  }
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function redirectToResult(sessionId: string) {
  redirect(`/result?session=${sessionId}`);
}
