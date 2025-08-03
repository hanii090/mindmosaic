// localStorage sync for sessions and user data
'use client';

import { ZephyrResponse } from '@/lib/together';
import { EmotionAnalysis } from '@/lib/replicate';

export interface SessionRecord {
  sessionId: string;
  timestamp: Date;
  content: string;
  aiResponse?: string;
  emotions?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  riskLevel?: 'low' | 'medium' | 'high';
}

interface StoredSession {
  sessionId: string;
  timestamp: string;
  content: string;
  aiResponse?: string;
  emotions?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  riskLevel?: 'low' | 'medium' | 'high';
}

const SESSION_STORAGE_KEY = 'mindmosaic_sessions';
const MAX_SESSIONS = 3;

/**
 * Get all stored sessions from localStorage
 */
export function getStoredSessions(): SessionRecord[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return [];
    
    const sessions: StoredSession[] = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return sessions.map((session) => ({
      ...session,
      timestamp: new Date(session.timestamp)
    }));
  } catch (error) {
    console.error('Error reading sessions from localStorage:', error);
    return [];
  }
}

/**
 * Save a new session to localStorage (keeping only last 3)
 */
export function saveSession(session: SessionRecord): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existingSessions = getStoredSessions();
    
    // Add new session to the beginning of the array
    const updatedSessions = [session, ...existingSessions];
    
    // Keep only the most recent 3 sessions
    const trimmedSessions = updatedSessions.slice(0, MAX_SESSIONS);
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(trimmedSessions));
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
  }
}

/**
 * Get a specific session by ID
 */
export function getSessionById(sessionId: string): SessionRecord | null {
  const sessions = getStoredSessions();
  return sessions.find(session => session.sessionId === sessionId) || null;
}

/**
 * Clear all stored sessions
 */
export function clearAllSessions(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing sessions from localStorage:', error);
  }
}

/**
 * Get the most recent session
 */
export function getLastSession(): SessionRecord | null {
  const sessions = getStoredSessions();
  return sessions[0] || null;
}

/**
 * Export sessions data for user backup
 */
export function exportSessionsData(): string {
  const sessions = getStoredSessions();
  const exportData = {
    exported: new Date().toISOString(),
    sessions: sessions.map(session => ({
      ...session,
      content: session.content ? '[Content Protected]' : '',
      timestamp: session.timestamp.toISOString()
    }))
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Sync current session data to localStorage
 */
export function syncCurrentSession(
  sessionId: string,
  content: string,
  aiResponse?: ZephyrResponse,
  emotions?: EmotionAnalysis
): void {
  const session: SessionRecord = {
    sessionId,
    timestamp: new Date(),
    content,
    aiResponse: aiResponse?.response || undefined,
    emotions: emotions?.emotions?.map((e) => e.emotion) || undefined,
    sentiment: emotions?.sentiment || undefined,
    riskLevel: emotions?.riskLevel || undefined
  };
  
  saveSession(session);
}

/**
 * Get last 3 sessions for quick access
 */
export function getLastThreeSessions(): SessionRecord[] {
  return getStoredSessions().slice(0, 3);
}
