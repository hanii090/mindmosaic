import { NextRequest, NextResponse } from 'next/server';
import { logUserFeedback } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sessionId, 
      entryId, 
      rating, 
      comments, 
      helpful,
      supportive,
      accurate,
      emotionalSupport
    } = body;

    // Validate input
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    if (typeof helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'Helpful field must be a boolean' },
        { status: 400 }
      );
    }

    // Log the enhanced feedback
    await logUserFeedback({
      sessionId,
      entryId,
      rating,
      comments: comments || '',
      helpful,
      supportive: supportive || false,
      accurate: accurate || false,
      emotionalSupport: emotionalSupport || 'neutral',
      timestamp: new Date()
    });

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your detailed feedback! This helps us improve MindMosaic\'s emotional support.'
    });

  } catch (error) {
    console.error('Error logging feedback:', error);
    return NextResponse.json(
      { error: 'Unable to save feedback. Please try again.' },
      { status: 500 }
    );
  }
}
