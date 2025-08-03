// Form validation utilities for MindMosaic
'use client';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FormState {
  content: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  charCount: number;
  wordCount: number;
}

const MIN_CHARS = 10;
const MAX_CHARS = 5000;
const MIN_WORDS = 3;
const IDEAL_MIN_CHARS = 50;

/**
 * Validate journal entry content
 */
export function validateJournalContent(content: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic length validation
  if (!content || content.trim().length === 0) {
    errors.push('Please share what\'s on your mind');
    return { isValid: false, errors, warnings };
  }
  
  const trimmedContent = content.trim();
  const charCount = trimmedContent.length;
  const wordCount = trimmedContent.split(/\s+/).filter(word => word.length > 0).length;
  
  // Minimum character validation
  if (charCount < MIN_CHARS) {
    errors.push(`Please write at least ${MIN_CHARS} characters (currently ${charCount})`);
  }
  
  // Maximum character validation
  if (charCount > MAX_CHARS) {
    errors.push(`Please keep your entry under ${MAX_CHARS} characters (currently ${charCount})`);
  }
  
  // Minimum word validation
  if (wordCount < MIN_WORDS) {
    errors.push(`Please write at least ${MIN_WORDS} words (currently ${wordCount})`);
  }
  
  // Warnings for better AI analysis
  if (charCount >= MIN_CHARS && charCount < IDEAL_MIN_CHARS) {
    warnings.push('Consider writing a bit more for better AI analysis');
  }
  
  // Check for potentially concerning content patterns
  const concerningPatterns = [
    /\b(suicide|kill myself|end it all|want to die)\b/i,
    /\b(hurt myself|self harm|cutting)\b/i,
    /\b(hopeless|worthless|useless)\b/i
  ];
  
  const hasConcerningContent = concerningPatterns.some(pattern => pattern.test(content));
  if (hasConcerningContent) {
    warnings.push('Please consider reaching out to a counselor or crisis helpline');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get form state for real-time validation
 */
export function getFormState(content: string): FormState {
  const validation = validateJournalContent(content);
  const charCount = content.length;
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  return {
    content,
    isValid: validation.isValid,
    errors: validation.errors,
    warnings: validation.warnings,
    charCount,
    wordCount
  };
}

/**
 * Format validation message for display
 */
export function formatValidationMessage(
  type: 'error' | 'warning',
  message: string
): string {
  const prefix = type === 'error' ? '⚠️' : '💡';
  return `${prefix} ${message}`;
}

/**
 * Check if content seems like spam or test input
 */
export function isLikelySpam(content: string): boolean {
  const trimmed = content.trim().toLowerCase();
  
  // Check for repeated characters
  const repeatedChar = /(.)\1{10,}/.test(trimmed);
  if (repeatedChar) return true;
  
  // Check for simple test inputs
  const testPatterns = [
    /^(test|testing|hello|hi|hey)$/,
    /^(a+|b+|c+|1+|2+|3+)$/,
    /^(qwerty|asdf|zxcv)$/,
    /^(lorem ipsum)/
  ];
  
  return testPatterns.some(pattern => pattern.test(trimmed));
}

/**
 * Sanitize content for storage (remove excessive whitespace, etc.)
 */
export function sanitizeContent(content: string): string {
  return content
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with max 2
}

/**
 * Get character count display string
 */
export function getCharCountDisplay(content: string): {
  count: number;
  display: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
} {
  const count = content.length;
  
  let color: 'green' | 'yellow' | 'red' | 'gray' = 'gray';
  if (count >= MIN_CHARS && count <= MAX_CHARS) {
    color = 'green';
  } else if (count < MIN_CHARS) {
    color = 'yellow';
  } else {
    color = 'red';
  }
  
  return {
    count,
    display: `${count}/${MAX_CHARS}`,
    color
  };
}
