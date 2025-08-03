import { NextRequest, NextResponse } from 'next/server';
import { analyzeJournalWithZephyr, createFollowUpPrompt } from '@/lib/together';
import { detectEmotions, analyzeEmotionalTrends } from '@/lib/replicate';
import { logJournalEntry, getSessionEntries, generateSessionId } from '@/lib/db';

export interface MindMosaicResponse {
  id: string;
  aiResponse: string;
  emotions: Array<{
    emotion: string;
    confidence: number;
    intensity: number;
  }>;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  suggestions: string[];
  resources: string[];
  confidence: number;
  emotionalState: string;
  trends?: Array<{
    date: string;
    emotions: string[];
    sentiment: number;
  }>;
}

/**
 * Main API endpoint for processing journal entries
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, sessionId: providedSessionId } = body;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Journal content is required' },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Journal content too long. Please limit to 5000 characters.' },
        { status: 400 }
      );
    }

    // Generate or use provided session ID
    const sessionId = providedSessionId || generateSessionId();
    
    // Get previous entries for context
    const previousEntries = await getSessionEntries(sessionId);
    const isFollowUp = previousEntries.length > 0;

    // Step 1: Analyze emotions with Replicate
    const emotionAnalysis = await detectEmotions(content);

    // Step 2: Get AI response from Zephyr via Together.ai
    let aiResponse;
    
    if (isFollowUp && previousEntries.length > 0) {
      // Create follow-up prompt with context
      const lastEntry = previousEntries[previousEntries.length - 1];
      const lastResponse = {
        response: '', // We don't store the full response, but we have suggestions
        suggestions: [], // Could retrieve from previous session if stored
        resources: [],
        confidence: 0.8
      };
      
      const followUpPrompt = createFollowUpPrompt(
        {
          content: lastEntry.content,
          timestamp: new Date(lastEntry.timestamp),
          emotions: lastEntry.emotions
        },
        lastResponse,
        {
          content,
          timestamp: new Date(),
          emotions: emotionAnalysis.emotions.map(e => e.emotion)
        }
      );
      
      aiResponse = await analyzeJournalWithZephyr({
        content: followUpPrompt,
        timestamp: new Date(),
        emotions: emotionAnalysis.emotions.map(e => e.emotion),
        sentiment: emotionAnalysis.sentiment
      });
    } else {
      // First entry in session
      aiResponse = await analyzeJournalWithZephyr({
        content,
        timestamp: new Date(),
        emotions: emotionAnalysis.emotions.map(e => e.emotion),
        sentiment: emotionAnalysis.sentiment
      });
    }

    // Step 3: Log the entry to database
    const entryId = await logJournalEntry({
      content,
      timestamp: new Date(),
      emotions: emotionAnalysis.emotions.map(e => e.emotion),
      sentiment: emotionAnalysis.sentiment,
      sentimentScore: emotionAnalysis.sentimentScore,
      riskLevel: emotionAnalysis.riskLevel,
      sessionId
    });

    // Step 4: Get emotional trends if this is a follow-up
    let trends;
    if (isFollowUp) {
      const allEntries = await getSessionEntries(sessionId);
      const entriesForTrends = allEntries.map(entry => ({
        text: entry.content,
        date: entry.timestamp.toISOString().split('T')[0]
      }));
      
      const trendAnalysis = await analyzeEmotionalTrends(entriesForTrends);
      trends = trendAnalysis.trends;
    }

    // Step 5: Build comprehensive response
    const response: MindMosaicResponse = {
      id: entryId,
      aiResponse: aiResponse.response,
      emotions: emotionAnalysis.emotions,
      sentiment: emotionAnalysis.sentiment,
      sentimentScore: emotionAnalysis.sentimentScore,
      riskLevel: emotionAnalysis.riskLevel,
      suggestions: [
        ...aiResponse.suggestions,
        ...emotionAnalysis.recommendations
      ].slice(0, 5), // Limit to 5 suggestions
      resources: aiResponse.resources,
      confidence: aiResponse.confidence,
      emotionalState: emotionAnalysis.emotionalState,
      trends
    };

    // Add session ID to response headers for client
    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set('X-Session-ID', sessionId);
    
    return nextResponse;

  } catch (error) {
    console.error('Error processing journal entry:', error);
    
    // Return error response with fallback support
    return NextResponse.json(
      {
        error: 'Unable to process your entry right now. Please try again.',
        fallback: {
          id: 'fallback',
          aiResponse: "I'm experiencing some technical difficulties, but I want you to know that I'm here to listen. Your feelings are valid, and it's brave of you to reach out. If you're in crisis, please contact your campus counseling center or call 988 for immediate support.",
          emotions: [{ emotion: 'neutral', confidence: 0.5, intensity: 0.5 }],
          sentiment: 'neutral' as const,
          sentimentScore: 0,
          riskLevel: 'low' as const,
          suggestions: [
            "Take a few deep breaths",
            "Reach out to someone you trust",
            "Practice self-compassion"
          ],
          resources: [
            "Campus Counseling Center",
            "Crisis Text Line: Text HOME to 741741",
            "National Suicide Prevention Lifeline: 988"
          ],
          confidence: 0.5,
          emotionalState: "seeking support"
        }
      },
      { status: 200 } // Return 200 with fallback rather than error
    );
  }
}

/**
 * GET endpoint for retrieving session data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const action = searchParams.get('action');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'entries':
        const entries = await getSessionEntries(sessionId);
        return NextResponse.json({ entries });

      case 'trends':
        const sessionEntries = await getSessionEntries(sessionId);
        if (sessionEntries.length < 2) {
          return NextResponse.json({ 
            trends: [],
            message: 'More entries needed for trend analysis'
          });
        }

        const entriesForTrends = sessionEntries.map(entry => ({
          text: entry.content,
          date: entry.timestamp.toISOString().split('T')[0]
        }));

        const trendAnalysis = await analyzeEmotionalTrends(entriesForTrends);
        return NextResponse.json({
          trends: trendAnalysis.trends,
          insights: trendAnalysis.insights,
          patterns: trendAnalysis.patterns
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error retrieving session data:', error);
    return NextResponse.json(
      { error: 'Unable to retrieve session data' },
      { status: 500 }
    );
  }
}
