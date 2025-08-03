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
      model: 'meta-llama/Llama-2-7b-chat-hf',
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
    
    // Fallback response for errors
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
