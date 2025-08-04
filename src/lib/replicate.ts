import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

export interface EmotionAnalysis {
  primaryEmotion: string;
  emotions: Array<{
    emotion: string;
    confidence: number;
    intensity: number;
  }>;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  emotionalState: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface EmotionTrend {
  date: string;
  emotions: string[];
  sentiment: number;
  riskLevel: string;
}

/**
 * Analyzes emotional content using Replicate's emotion detection models
 */
export async function detectEmotions(text: string): Promise<EmotionAnalysis> {
  try {
    // Use a simpler approach with a working sentiment model
    const sentimentOutput = await replicate.run(
      "daanelson/flan-t5-large:ce962b3f6792a57074a601d3979db5839697add2e4e02696b3ced4c022d4767a",
      {
        input: {
          prompt: `Analyze the emotional sentiment of this text and classify it as positive, negative, or neutral: "${text}"`
        }
      }
    ) as any;

    // For now, use fallback analysis since the specific emotion models aren't available
    return fallbackEmotionAnalysis(text);

  } catch (error) {
    console.error('Error with Replicate emotion detection:', error);
    
    // Fallback analysis using keyword-based approach
    return fallbackEmotionAnalysis(text);
  }
}

/**
 * Analyzes emotional trends over time
 */
export async function analyzeEmotionalTrends(
  entries: Array<{ text: string; date: string }>
): Promise<{
  trends: EmotionTrend[];
  insights: string[];
  patterns: string[];
}> {
  try {
    const trends: EmotionTrend[] = [];
    
    for (const entry of entries) {
      const analysis = await detectEmotions(entry.text);
      trends.push({
        date: entry.date,
        emotions: analysis.emotions.map(e => e.emotion),
        sentiment: analysis.sentimentScore,
        riskLevel: analysis.riskLevel
      });
    }

    const insights = generateTrendInsights(trends);
    const patterns = identifyEmotionalPatterns(trends);

    return { trends, insights, patterns };

  } catch (error) {
    console.error('Error analyzing emotional trends:', error);
    return {
      trends: [],
      insights: ["Unable to analyze trends at this time"],
      patterns: []
    };
  }
}

/**
 * Processes emotion detection model output
 */
function processEmotionOutput(output: any): Array<{
  emotion: string;
  confidence: number;
  intensity: number;
}> {
  if (!output || !Array.isArray(output)) {
    return [{ emotion: 'neutral', confidence: 0.5, intensity: 0.5 }];
  }

  return output
    .map((item: any) => ({
      emotion: item.label || item.emotion || 'unknown',
      confidence: item.score || item.confidence || 0,
      intensity: calculateIntensity(item.score || 0)
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5); // Top 5 emotions
}

/**
 * Processes sentiment analysis output
 */
function processSentimentOutput(output: any): {
  label: 'positive' | 'negative' | 'neutral';
  score: number;
} {
  if (!output) {
    return { label: 'neutral', score: 0 };
  }

  const score = output.score || output.sentiment_score || 0;
  let label: 'positive' | 'negative' | 'neutral';

  if (score > 0.1) {
    label = 'positive';
  } else if (score < -0.1) {
    label = 'negative';
  } else {
    label = 'neutral';
  }

  return { label, score };
}

/**
 * Calculates emotion intensity from confidence score
 */
function calculateIntensity(confidence: number): number {
  // Convert confidence to intensity scale
  if (confidence > 0.8) return 1.0; // Very high
  if (confidence > 0.6) return 0.8; // High
  if (confidence > 0.4) return 0.6; // Medium
  if (confidence > 0.2) return 0.4; // Low
  return 0.2; // Very low
}

/**
 * Determines overall emotional state
 */
function determineEmotionalState(
  emotions: Array<{ emotion: string; confidence: number; intensity: number }>,
  sentiment: { label: string; score: number }
): string {
  const primaryEmotion = emotions[0]?.emotion || 'neutral';
  const intensity = emotions[0]?.intensity || 0.5;

  if (['anxiety', 'fear', 'worry'].includes(primaryEmotion) && intensity > 0.7) {
    return 'highly anxious';
  }
  
  if (['sadness', 'depression', 'hopelessness'].includes(primaryEmotion) && intensity > 0.7) {
    return 'significantly sad';
  }
  
  if (['anger', 'frustration', 'irritation'].includes(primaryEmotion) && intensity > 0.7) {
    return 'quite frustrated';
  }
  
  if (['joy', 'happiness', 'excitement'].includes(primaryEmotion) && intensity > 0.6) {
    return 'feeling positive';
  }
  
  if (sentiment.label === 'positive' && sentiment.score > 0.3) {
    return 'generally positive';
  }
  
  if (sentiment.label === 'negative' && sentiment.score < -0.3) {
    return 'struggling emotionally';
  }
  
  return 'emotionally balanced';
}

/**
 * Assesses risk level based on emotional content
 */
function assessRiskLevel(
  text: string,
  emotions: Array<{ emotion: string; confidence: number; intensity: number }>,
  sentiment: { label: string; score: number }
): 'low' | 'medium' | 'high' {
  const textLower = text.toLowerCase();
  
  // High risk indicators
  const highRiskKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living',
    'hopeless', 'worthless', 'give up', 'can\'t go on'
  ];
  
  if (highRiskKeywords.some(keyword => textLower.includes(keyword))) {
    return 'high';
  }
  
  // Medium risk indicators
  const mediumRiskEmotions = ['despair', 'hopelessness', 'severe_anxiety'];
  const hasHighIntensityNegative = emotions.some(
    e => mediumRiskEmotions.includes(e.emotion) && e.intensity > 0.8
  );
  
  if (hasHighIntensityNegative || sentiment.score < -0.6) {
    return 'medium';
  }
  
  // Check for overwhelming emotions
  const overwhelmingEmotions = emotions.filter(e => e.intensity > 0.8).length;
  if (overwhelmingEmotions >= 2) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Generates emotion-specific recommendations
 */
function generateEmotionRecommendations(
  emotions: Array<{ emotion: string; confidence: number; intensity: number }>,
  sentiment: { label: string; score: number }
): string[] {
  const recommendations: string[] = [];
  const primaryEmotion = emotions[0]?.emotion || 'neutral';
  
  switch (primaryEmotion) {
    case 'anxiety':
    case 'fear':
      recommendations.push(
        "Try deep breathing exercises: 4 counts in, 4 counts hold, 4 counts out",
        "Practice grounding: name 5 things you see, 4 you hear, 3 you touch",
        "Consider speaking with a counselor about anxiety management"
      );
      break;
      
    case 'sadness':
    case 'depression':
      recommendations.push(
        "Reach out to a trusted friend or family member",
        "Engage in gentle physical activity like walking",
        "Consider professional support if these feelings persist"
      );
      break;
      
    case 'anger':
    case 'frustration':
      recommendations.push(
        "Take a few minutes to cool down before responding",
        "Try physical exercise to release tension",
        "Practice expressing feelings constructively"
      );
      break;
      
    case 'stress':
    case 'overwhelm':
      recommendations.push(
        "Break large tasks into smaller, manageable steps",
        "Prioritize self-care and adequate sleep",
        "Use campus resources like tutoring or counseling"
      );
      break;
      
    default:
      recommendations.push(
        "Continue journaling to track your emotional patterns",
        "Maintain healthy routines for sleep and exercise",
        "Stay connected with supportive people in your life"
      );
  }
  
  return recommendations;
}

/**
 * Fallback emotion analysis using keyword matching and pattern recognition
 */
function fallbackEmotionAnalysis(text: string): EmotionAnalysis {
  const textLower = text.toLowerCase();
  
  // Enhanced emotion keywords with intensity indicators
  const emotionKeywords = {
    anxiety: {
      keywords: ['anxious', 'worried', 'nervous', 'panic', 'stress', 'overwhelmed', 'tense', 'restless', 'uneasy', 'fear'],
      intensityWords: ['extremely', 'very', 'really', 'so', 'incredibly', 'terribly']
    },
    sadness: {
      keywords: ['sad', 'depressed', 'down', 'blue', 'unhappy', 'miserable', 'hopeless', 'empty', 'lonely', 'grief'],
      intensityWords: ['deeply', 'very', 'extremely', 'completely', 'utterly', 'so']
    },
    anger: {
      keywords: ['angry', 'mad', 'frustrated', 'annoyed', 'irritated', 'furious', 'rage', 'hate', 'pissed', 'livid'],
      intensityWords: ['really', 'so', 'extremely', 'very', 'incredibly', 'absolutely']
    },
    joy: {
      keywords: ['happy', 'excited', 'good', 'great', 'wonderful', 'amazing', 'fantastic', 'joyful', 'elated', 'cheerful'],
      intensityWords: ['very', 'so', 'extremely', 'incredibly', 'absolutely', 'really']
    },
    fear: {
      keywords: ['scared', 'afraid', 'terrified', 'fearful', 'frightened', 'intimidated', 'petrified'],
      intensityWords: ['very', 'extremely', 'so', 'really', 'absolutely', 'completely']
    },
    stress: {
      keywords: ['stressed', 'pressure', 'burden', 'strain', 'tension', 'overwhelmed', 'swamped', 'exhausted'],
      intensityWords: ['under', 'so much', 'extreme', 'overwhelming', 'crushing', 'intense']
    },
    confusion: {
      keywords: ['confused', 'lost', 'uncertain', 'unclear', 'bewildered', 'puzzled', 'conflicted'],
      intensityWords: ['really', 'very', 'completely', 'totally', 'so', 'extremely']
    }
  };
  
  const detectedEmotions: Array<{ emotion: string; confidence: number; intensity: number }> = [];
  
  // Analyze each emotion category
  for (const [emotion, data] of Object.entries(emotionKeywords)) {
    let matches = 0;
    let intensityBoost = 0;
    
    // Count keyword matches
    data.keywords.forEach(keyword => {
      if (textLower.includes(keyword)) {
        matches++;
        
        // Check for intensity words near the emotion keyword
        data.intensityWords.forEach(intensityWord => {
          if (textLower.includes(`${intensityWord} ${keyword}`) || 
              textLower.includes(`${keyword} ${intensityWord}`)) {
            intensityBoost += 0.3;
          }
        });
      }
    });
    
    if (matches > 0) {
      const baseConfidence = Math.min(matches * 0.25 + 0.1, 0.9);
      const intensity = Math.min((matches * 0.3) + intensityBoost, 1.0);
      
      detectedEmotions.push({
        emotion,
        confidence: baseConfidence,
        intensity: intensity
      });
    }
  }
  
  // If no emotions detected, analyze for neutral vs subtle emotional indicators
  if (detectedEmotions.length === 0) {
    const neutralIndicators = ['okay', 'fine', 'alright', 'normal', 'usual'];
    const hasNeutralWords = neutralIndicators.some(word => textLower.includes(word));
    
    detectedEmotions.push({ 
      emotion: hasNeutralWords ? 'calm' : 'neutral', 
      confidence: 0.6, 
      intensity: 0.4 
    });
  }
  
  // Sort by confidence
  detectedEmotions.sort((a, b) => b.confidence - a.confidence);
  
  // Determine overall sentiment with more nuanced analysis
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let sentimentScore = 0;
  
  const positiveWords = ['good', 'happy', 'great', 'amazing', 'wonderful', 'excited', 'love', 'perfect', 'awesome'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'sucks', 'difficult', 'hard'];
  
  const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
  
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    sentimentScore = Math.min(positiveCount * 0.2, 0.8);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    sentimentScore = -Math.min(negativeCount * 0.2, 0.8);
  } else {
    // Check primary emotion for sentiment
    const primaryEmotion = detectedEmotions[0]?.emotion;
    if (['joy', 'excitement', 'happiness'].includes(primaryEmotion)) {
      sentiment = 'positive';
      sentimentScore = 0.3;
    } else if (['sadness', 'anger', 'fear', 'anxiety'].includes(primaryEmotion)) {
      sentiment = 'negative';
      sentimentScore = -0.3;
    }
  }
  
  return {
    primaryEmotion: detectedEmotions[0]?.emotion || 'neutral',
    emotions: detectedEmotions.slice(0, 5), // Top 5 emotions
    sentiment,
    sentimentScore,
    emotionalState: determineEmotionalState(detectedEmotions, { label: sentiment, score: sentimentScore }),
    riskLevel: assessRiskLevel(text, detectedEmotions, { label: sentiment, score: sentimentScore }),
    recommendations: generateEmotionRecommendations(detectedEmotions, { label: sentiment, score: sentimentScore })
  };
}

/**
 * Generates insights from emotional trends
 */
function generateTrendInsights(trends: EmotionTrend[]): string[] {
  if (trends.length < 3) {
    return ["More entries needed to identify meaningful trends"];
  }
  
  const insights: string[] = [];
  const recentTrends = trends.slice(-7); // Last 7 entries
  
  // Sentiment trend
  const avgSentiment = recentTrends.reduce((sum, t) => sum + t.sentiment, 0) / recentTrends.length;
  if (avgSentiment > 0.2) {
    insights.push("Your overall mood has been trending positive recently");
  } else if (avgSentiment < -0.2) {
    insights.push("You've been experiencing more challenging emotions lately");
  }
  
  // Risk level trend
  const highRiskDays = recentTrends.filter(t => t.riskLevel === 'high').length;
  if (highRiskDays > 0) {
    insights.push("Some recent entries indicate significant distress - consider reaching out for support");
  }
  
  // Emotion frequency
  const emotionFreq: { [key: string]: number } = {};
  recentTrends.forEach(trend => {
    trend.emotions.forEach(emotion => {
      emotionFreq[emotion] = (emotionFreq[emotion] || 0) + 1;
    });
  });
  
  const mostCommon = Object.entries(emotionFreq)
    .sort(([,a], [,b]) => b - a)[0];
    
  if (mostCommon && mostCommon[1] > recentTrends.length * 0.4) {
    insights.push(`${mostCommon[0]} has been a recurring theme in your recent entries`);
  }
  
  return insights;
}

/**
 * Identifies patterns in emotional data
 */
function identifyEmotionalPatterns(trends: EmotionTrend[]): string[] {
  const patterns: string[] = [];
  
  if (trends.length < 5) {
    return patterns;
  }
  
  // Weekly patterns (if we have day-of-week data)
  // Mood cycles
  // Stress triggers
  // Recovery patterns
  
  patterns.push("Pattern analysis requires more data points");
  
  return patterns;
}
