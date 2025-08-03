import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types for type safety
export interface Database {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          id: string;
          content: string;
          timestamp: string;
          emotions: string[];
          sentiment: 'positive' | 'negative' | 'neutral';
          sentiment_score: number;
          risk_level: 'low' | 'medium' | 'high';
          session_id: string;
          anonymous_user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          timestamp?: string;
          emotions: string[];
          sentiment: 'positive' | 'negative' | 'neutral';
          sentiment_score: number;
          risk_level: 'low' | 'medium' | 'high';
          session_id: string;
          anonymous_user_id?: string | null;
        };
        Update: {
          id?: string;
          content?: string;
          timestamp?: string;
          emotions?: string[];
          sentiment?: 'positive' | 'negative' | 'neutral';
          sentiment_score?: number;
          risk_level?: 'low' | 'medium' | 'high';
          session_id?: string;
          anonymous_user_id?: string | null;
        };
      };
      sessions: {
        Row: {
          id: string;
          session_id: string;
          start_time: string;
          end_time: string | null;
          total_entries: number;
          user_agent: string | null;
          referrer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          start_time?: string;
          end_time?: string | null;
          total_entries?: number;
          user_agent?: string | null;
          referrer?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          start_time?: string;
          end_time?: string | null;
          total_entries?: number;
          user_agent?: string | null;
          referrer?: string | null;
        };
      };
      analytics: {
        Row: {
          id: string;
          metric_name: string;
          metric_value: number;
          date: string;
          metadata: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          metric_name: string;
          metric_value: number;
          date?: string;
          metadata?: Record<string, any> | null;
        };
        Update: {
          id?: string;
          metric_name?: string;
          metric_value?: number;
          date?: string;
          metadata?: Record<string, any> | null;
        };
      };
      user_feedback: {
        Row: {
          id: string;
          session_id: string;
          entry_id: string | null;
          rating: number;
          comments: string | null;
          helpful: boolean;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          entry_id?: string | null;
          rating: number;
          comments?: string | null;
          helpful: boolean;
          timestamp?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          entry_id?: string | null;
          rating?: number;
          comments?: string | null;
          helpful?: boolean;
          timestamp?: string;
        };
      };
    };
  };
}
