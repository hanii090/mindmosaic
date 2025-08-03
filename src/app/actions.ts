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
        return null; // Continue without emotion analysis if it fails
      }),
      analyzeJournalWithZephyr({
        content,
        timestamp: new Date(),
        emotions: [], // Will be populated after emotion analysis
        sentiment: 'neutral'
      }).catch(error => {
        console.error('AI response failed:', error);
        return {
          response: "I'm here to listen and support you. While I'm experiencing some technical difficulties right now, please know that what you're feeling is valid and you're not alone. If you're in crisis, please reach out to your campus counseling center or call 988 for immediate support.",
          confidence: 0.5,
          suggestions: [
            "Take slow, deep breaths",
            "Reach out to a trusted friend or family member",
            "Consider speaking with a counselor"
          ],
          resources: [
            "Campus Counseling Center",
            "Crisis Text Line: Text HOME to 741741",
            "National Suicide Prevention Lifeline: 988"
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
