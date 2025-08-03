// Supabase integration for data logging and analytics
import { supabase, Database } from './supabase';

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: Date;
  emotions: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  sessionId: string;
  anonymousUserId?: string;
}

export interface AnalyticsData {
  totalEntries: number;
  emotionDistribution: { [emotion: string]: number };
  sentimentTrends: Array<{ date: string; sentiment: number }>;
  riskLevelCounts: { low: number; medium: number; high: number };
  averageSessionLength: number;
  responseTime: number;
}

export interface SessionData {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  entries: JournalEntry[];
  totalEntries: number;
  userAgent?: string;
  referrer?: string;
}

/**
 * Logs a journal entry to Supabase
 */
export async function logJournalEntry(entry: Omit<JournalEntry, 'id'>): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        content: entry.content,
        timestamp: entry.timestamp.toISOString(),
        emotions: entry.emotions,
        sentiment: entry.sentiment,
        sentiment_score: entry.sentimentScore,
        risk_level: entry.riskLevel,
        session_id: entry.sessionId,
        anonymous_user_id: entry.anonymousUserId
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error logging journal entry to Supabase:', error);
      throw new Error(`Failed to log journal entry: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from journal entry insert');
    }

    // Update session entry count
    await updateSessionEntryCount(entry.sessionId);
    
    // Update analytics with the complete entry including ID
    const completeEntry: JournalEntry = {
      ...entry,
      id: data.id
    };
    await updateAnalytics(completeEntry);
    
    console.log(`Journal entry logged with ID: ${data.id}`);
    return data.id;
    
  } catch (error) {
    console.error('Error logging journal entry:', error);
    throw new Error('Failed to log journal entry');
  }
}

/**
 * Retrieves journal entries for a session
 */
export async function getSessionEntries(sessionId: string): Promise<JournalEntry[]> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error retrieving session entries from Supabase:', error);
      return [];
    }

    return (data || []).map(entry => ({
      id: entry.id,
      content: entry.content,
      timestamp: new Date(entry.timestamp),
      emotions: entry.emotions || [],
      sentiment: entry.sentiment as 'positive' | 'negative' | 'neutral',
      sentimentScore: Number(entry.sentiment_score),
      riskLevel: entry.risk_level as 'low' | 'medium' | 'high',
      sessionId: entry.session_id,
      anonymousUserId: entry.anonymous_user_id || undefined
    }));
  } catch (error) {
    console.error('Error retrieving session entries:', error);
    return [];
  }
}

/**
 * Creates a new session record
 */
export async function createSession(sessionData: Omit<SessionData, 'endTime' | 'entries'>): Promise<void> {
  try {
    const { error } = await supabase
      .from('sessions')
      .insert({
        session_id: sessionData.sessionId,
        start_time: sessionData.startTime.toISOString(),
        total_entries: sessionData.totalEntries,
        user_agent: sessionData.userAgent,
        referrer: sessionData.referrer
      });

    if (error) {
      console.error('Error creating session in Supabase:', error);
      throw new Error(`Failed to create session: ${error.message}`);
    }
    
    console.log(`Session created with ID: ${sessionData.sessionId}`);
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Failed to create session');
  }
}

/**
 * Gets analytics data for the admin dashboard
 */
export async function getAnalyticsData(
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsData> {
  try {
    // Get total entries count
    const { count: totalEntries } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true });

    // Get emotion distribution using the custom function
    const { data: emotionDist } = await supabase
      .rpc('get_emotion_distribution');

    // Get sentiment trends using the custom function
    const { data: sentimentTrends } = await supabase
      .rpc('get_sentiment_trends', { days: 30 });

    // Get risk level counts using the custom function
    const { data: riskCounts } = await supabase
      .rpc('get_risk_level_counts');

    // Calculate average session length
    const { data: sessionData } = await supabase
      .from('sessions')
      .select('start_time, end_time')
      .not('end_time', 'is', null);

    let averageSessionLength = 0;
    if (sessionData && sessionData.length > 0) {
      const totalDuration = sessionData.reduce((acc, session) => {
        const start = new Date(session.start_time);
        const end = new Date(session.end_time!);
        return acc + (end.getTime() - start.getTime());
      }, 0);
      averageSessionLength = totalDuration / sessionData.length / 1000 / 60; // in minutes
    }

    return {
      totalEntries: totalEntries || 0,
      emotionDistribution: emotionDist || {},
      sentimentTrends: sentimentTrends || [],
      riskLevelCounts: riskCounts || { low: 0, medium: 0, high: 0 },
      averageSessionLength,
      responseTime: 2.5 // This would need to be tracked separately
    };
    
  } catch (error) {
    console.error('Error retrieving analytics data:', error);
    return {
      totalEntries: 0,
      emotionDistribution: {},
      sentimentTrends: [],
      riskLevelCounts: { low: 0, medium: 0, high: 0 },
      averageSessionLength: 0,
      responseTime: 0
    };
  }
}

/**
 * Gets emotion trends over time
 */
export async function getEmotionTrends(
  sessionId?: string,
  days: number = 30
): Promise<Array<{ date: string; emotions: string[]; sentiment: number }>> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase
      .from('journal_entries')
      .select('timestamp, emotions, sentiment_score')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error retrieving emotion trends:', error);
      return [];
    }

    // Group by date and aggregate emotions
    const trendMap = new Map<string, { emotions: Set<string>; sentiments: number[] }>();
    
    (data || []).forEach(entry => {
      const date = new Date(entry.timestamp).toISOString().split('T')[0];
      
      if (!trendMap.has(date)) {
        trendMap.set(date, { emotions: new Set(), sentiments: [] });
      }
      
      const dayData = trendMap.get(date)!;
      (entry.emotions || []).forEach((emotion: string) => dayData.emotions.add(emotion));
      dayData.sentiments.push(Number(entry.sentiment_score));
    });

    return Array.from(trendMap.entries()).map(([date, data]) => ({
      date,
      emotions: Array.from(data.emotions),
      sentiment: data.sentiments.reduce((sum, s) => sum + s, 0) / data.sentiments.length
    }));
  } catch (error) {
    console.error('Error retrieving emotion trends:', error);
    return [];
  }
}

/**
 * Stores user feedback for improving the system
 */
export async function logUserFeedback(feedback: {
  sessionId: string;
  entryId?: string;
  rating: number;
  comments?: string;
  helpful: boolean;
  timestamp: Date;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_feedback')
      .insert({
        session_id: feedback.sessionId,
        entry_id: feedback.entryId || null,
        rating: feedback.rating,
        comments: feedback.comments || null,
        helpful: feedback.helpful,
        timestamp: feedback.timestamp.toISOString()
      });

    if (error) {
      console.error('Error logging user feedback:', error);
      throw new Error(`Failed to log user feedback: ${error.message}`);
    }
    
    console.log('User feedback logged successfully');
  } catch (error) {
    console.error('Error logging user feedback:', error);
    throw new Error('Failed to log user feedback');
  }
}

/**
 * Gets system performance metrics
 */
export async function getSystemMetrics(): Promise<{
  uptime: number;
  totalSessions: number;
  activeUsers: number;
  averageResponseTime: number;
  errorRate: number;
}> {
  try {
    // Get total sessions
    const { count: totalSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    // Get active sessions (sessions within last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { count: activeUsers } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .gte('start_time', yesterday.toISOString());

    return {
      uptime: 99.9, // This would need to be tracked separately
      totalSessions: totalSessions || 0,
      activeUsers: activeUsers || 0,
      averageResponseTime: 2.5, // This would need to be tracked separately
      errorRate: 0.1 // This would need to be tracked separately
    };
  } catch (error) {
    console.error('Error retrieving system metrics:', error);
    return {
      uptime: 0,
      totalSessions: 0,
      activeUsers: 0,
      averageResponseTime: 0,
      errorRate: 0
    };
  }
}

/**
 * Updates session entry count
 */
async function updateSessionEntryCount(sessionId: string): Promise<void> {
  try {
    const { error } = await supabase
      .rpc('increment_session_entries', { session_id: sessionId });

    if (error) {
      console.error('Error updating session entry count:', error);
    }
  } catch (error) {
    console.error('Error updating session entry count:', error);
  }
}

/**
 * Updates global analytics with new entry
 */
async function updateAnalytics(entry: JournalEntry): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Update daily entry count
    await supabase
      .from('analytics')
      .upsert({
        metric_name: 'daily_entries',
        metric_value: 1,
        date: today,
        metadata: { sentiment: entry.sentiment, risk_level: entry.riskLevel }
      }, {
        onConflict: 'metric_name,date',
        ignoreDuplicates: false
      });

    // Update sentiment metrics
    await supabase
      .from('analytics')
      .upsert({
        metric_name: 'daily_sentiment_avg',
        metric_value: entry.sentimentScore,
        date: today
      }, {
        onConflict: 'metric_name,date',
        ignoreDuplicates: false
      });
      
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
}

/**
 * Generates unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Cleans up old data (run periodically)
 */
export async function cleanupOldData(retentionDays: number = 90): Promise<void> {
  try {
    const { error } = await supabase
      .rpc('cleanup_old_entries');

    if (error) {
      console.error('Error cleaning up old data:', error);
    } else {
      console.log(`Cleaned up entries older than ${retentionDays} days`);
    }
  } catch (error) {
    console.error('Error cleaning up old data:', error);
  }
}

/**
 * Exports anonymized data for research (with proper consent)
 */
export async function exportAnonymizedData(
  startDate: Date,
  endDate: Date
): Promise<Array<{
  emotions: string[];
  sentiment: number;
  riskLevel: string;
  timestamp: string;
  wordCount: number;
}>> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('emotions, sentiment_score, risk_level, timestamp, content')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    if (error) {
      console.error('Error exporting anonymized data:', error);
      return [];
    }

    return (data || []).map(entry => ({
      emotions: entry.emotions || [],
      sentiment: Number(entry.sentiment_score),
      riskLevel: entry.risk_level,
      timestamp: entry.timestamp,
      wordCount: entry.content.split(' ').length
      // Note: actual content is NOT included for privacy
    }));
  } catch (error) {
    console.error('Error exporting anonymized data:', error);
    return [];
  }
}
