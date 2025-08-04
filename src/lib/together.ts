import { Together } from 'together-ai';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export interface JournalEntry {
  content: string;
  timestamp: Date;
  emotions?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface ZephyrResponse {
  response: string;
  confidence: number;
  suggestions: string[];
  resources: string[];
}

/**
 * Sends a student's journal input to Zephyr-7B via Together.ai's API
 * and returns personalized mental health guidance
 */
export async function analyzeJournalWithZephyr(
  entry: JournalEntry
): Promise<ZephyrResponse> {
  try {
    const prompt = createTherapeuticPrompt(entry);
    
    const response = await together.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a compassionate AI mental health assistant specifically designed for university students. 
          Your responses should be:
          - Warm, empathetic, and non-judgmental
          - Evidence-based and therapeutically sound
          - Practical with actionable coping strategies
          - Culturally sensitive and inclusive
          - Always encourage professional help when appropriate
          - Never diagnose or replace professional therapy
          
          Focus on validating emotions, providing coping strategies, and offering hope while maintaining appropriate boundaries.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9,
      stream: false
    });

    const aiResponse = response.choices[0]?.message?.content || '';
    
    // Parse and structure the response
    const structuredResponse = parseZephyrResponse(aiResponse);
    
    return {
      response: structuredResponse.mainResponse,
      confidence: calculateConfidence(entry, aiResponse),
      suggestions: structuredResponse.suggestions,
      resources: generateResources(entry)
    };

  } catch (error) {
    console.error('Error calling Together.ai API:', error);
    
    // Enhanced fallback response based on content analysis
    const content = entry.content.toLowerCase();
    let fallbackResponse = "";
    let suggestions: string[] = [];
    
    // Analyze content for better personalized fallback
    if (content.includes('anxiety') || content.includes('anxious') || content.includes('worried')) {
      fallbackResponse = "I can sense you're experiencing some anxiety right now, and I want you to know that what you're feeling is completely valid. Anxiety can feel overwhelming, but you have the strength to work through this. Remember that you're not alone, and there are people who care about your wellbeing.";
      suggestions = [
        "Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8",
        "Practice grounding: name 5 things you can see, 4 you can hear, 3 you can touch",
        "Consider reaching out to a trusted friend or campus counselor",
        "Write down what's specifically worrying you to help organize your thoughts"
      ];
    } else if (content.includes('depress') || content.includes('sad') || content.includes('down')) {
      fallbackResponse = "Thank you for sharing something so personal with me. Feeling sad or down is a natural part of the human experience, and it takes courage to acknowledge these feelings. Your emotions are valid, and it's okay to not be okay sometimes. You deserve support and care.";
      suggestions = [
        "Reach out to someone you trust - a friend, family member, or counselor",
        "Try to engage in one small activity that usually brings you comfort",
        "Remember that feelings are temporary, even when they feel overwhelming",
        "Consider professional support if these feelings persist or worsen"
      ];
    } else if (content.includes('stress') || content.includes('overwhelm')) {
      fallbackResponse = "It sounds like you're dealing with a lot right now, and feeling stressed or overwhelmed is your mind's way of telling you that you're carrying a heavy load. You're doing the best you can, and that's enough. Let's think about some ways to help lighten that burden.";
      suggestions = [
        "Break large tasks into smaller, more manageable steps",
        "Prioritize what's most important and let go of what you can",
        "Make sure you're getting enough sleep and eating regularly",
        "Use campus resources like tutoring centers or counseling services"
      ];
    } else if (content.includes('anger') || content.includes('frustrated') || content.includes('mad')) {
      fallbackResponse = "I hear that you're feeling angry or frustrated, and those are completely valid emotions. Sometimes anger is our mind's way of protecting us or signaling that something important to us feels threatened. Let's explore some healthy ways to work through these feelings.";
      suggestions = [
        "Take a few minutes to cool down before responding to the situation",
        "Try physical exercise to help release the tension anger creates",
        "Write down what's making you angry to better understand the root cause",
        "Practice expressing your feelings in a constructive way when you're ready"
      ];
    } else {
      fallbackResponse = "Thank you for sharing your thoughts with me. Whatever you're going through right now, I want you to know that your feelings are valid and important. You took a brave step by expressing what's on your mind, and that shows real strength and self-awareness.";
      suggestions = [
        "Continue checking in with yourself regularly through journaling",
        "Maintain connections with supportive people in your life",
        "Practice self-compassion and be gentle with yourself",
        "Remember that seeking help is a sign of strength, not weakness"
      ];
    }
    
    return {
      response: fallbackResponse,
      confidence: 0.75,
      suggestions,
      resources: [
        "Campus Counseling Center - Free for students",
        "Crisis Text Line - Text HOME to 741741",
        "National Suicide Prevention Lifeline - Call 988",
        "Student Health Services",
        "Mental Health America - mhanational.org"
      ]
    };
  }
}

/**
 * Creates a therapeutic prompt optimized for Zephyr-7B
 */
function createTherapeuticPrompt(entry: JournalEntry): string {
  const emotionContext = entry.emotions?.length 
    ? `The student is experiencing: ${entry.emotions.join(', ')}.` 
    : '';
    
  return `
A university student has shared the following in their mental health journal:

"${entry.content}"

${emotionContext}

Please provide a compassionate, supportive response that:
1. Validates their feelings without minimizing them
2. Offers 2-3 practical coping strategies they can use immediately
3. Provides hope and perspective while being realistic
4. Suggests when professional support might be beneficial
5. Includes a gentle reminder of their strength and resilience

Format your response in a warm, conversational tone as if speaking directly to the student.
  `.trim();
}

/**
 * Parses the Zephyr response to extract main content and suggestions
 */
function parseZephyrResponse(response: string): {
  mainResponse: string;
  suggestions: string[];
} {
  // Split response into main content and bullet points/suggestions
  const lines = response.split('\n').filter(line => line.trim());
  const suggestions: string[] = [];
  let mainResponse = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^[•\-\*]\s/) || trimmed.match(/^\d+\.\s/)) {
      // Extract bullet points or numbered lists as suggestions
      suggestions.push(trimmed.replace(/^[•\-\*\d\.]\s*/, ''));
    } else if (trimmed.length > 10 && !mainResponse) {
      // Use the first substantial paragraph as main response
      mainResponse = trimmed;
    }
  }
  
  // If no clear structure, use full response as main
  if (!mainResponse) {
    mainResponse = response;
  }
  
  return { mainResponse, suggestions };
}

/**
 * Calculates confidence score based on entry quality and response
 */
function calculateConfidence(entry: JournalEntry, response: string): number {
  let confidence = 0.7; // Base confidence
  
  // Adjust based on entry length and detail
  if (entry.content.length > 100) confidence += 0.1;
  if (entry.content.length > 300) confidence += 0.1;
  
  // Adjust based on emotional clarity
  if (entry.emotions && entry.emotions.length > 0) confidence += 0.1;
  
  // Adjust based on response quality
  if (response.length > 200) confidence += 0.05;
  if (response.includes('coping') || response.includes('strategy')) confidence += 0.05;
  
  return Math.min(confidence, 0.95); // Cap at 95%
}

/**
 * Generates relevant mental health resources based on entry content
 */
function generateResources(entry: JournalEntry): string[] {
  const resources: string[] = [
    "Campus Counseling Center",
    "Student Health Services"
  ];
  
  const content = entry.content.toLowerCase();
  
  // Add specific resources based on content
  if (content.includes('anxiety') || content.includes('anxious')) {
    resources.push("Anxiety and Depression Association of America");
    resources.push("Headspace: Anxiety meditation");
  }
  
  if (content.includes('depress') || content.includes('sad')) {
    resources.push("National Alliance on Mental Illness (NAMI)");
    resources.push("Mental Health America");
  }
  
  if (content.includes('stress') || content.includes('overwhelm')) {
    resources.push("Stress management workshops");
    resources.push("Academic success center");
  }
  
  if (content.includes('sleep') || content.includes('insomnia')) {
    resources.push("Sleep hygiene resources");
    resources.push("Campus wellness center");
  }
  
  // Crisis resources
  if (content.includes('suicide') || content.includes('harm') || 
      content.includes('hopeless') || content.includes('worthless')) {
    resources.unshift("Crisis Text Line: Text HOME to 741741");
    resources.unshift("National Suicide Prevention Lifeline: 988");
  }
  
  return resources;
}

/**
 * Creates a follow-up prompt for continued conversation
 */
export function createFollowUpPrompt(
  previousEntry: JournalEntry, 
  previousResponse: ZephyrResponse,
  newEntry: JournalEntry
): string {
  return `
Previous context: The student previously shared "${previousEntry.content}" 
and received support about ${previousResponse.suggestions.join(', ')}.

Now they're sharing: "${newEntry.content}"

Please provide a follow-up response that acknowledges their previous sharing, 
notices any progress or changes, and continues to offer supportive guidance.
  `.trim();
}
