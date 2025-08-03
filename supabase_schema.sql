-- MindMosaic Database Schema for Supabase
-- Execute these SQL commands in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  emotions TEXT[] DEFAULT '{}',
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')) DEFAULT 'neutral',
  sentiment_score DECIMAL(3,2) DEFAULT 0.0,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')) DEFAULT 'low',
  session_id TEXT NOT NULL,
  anonymous_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  total_entries INTEGER DEFAULT 0,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL,
  date DATE DEFAULT CURRENT_DATE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Feedback Table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  helpful BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_session_id ON journal_entries(session_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_timestamp ON journal_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_journal_entries_sentiment ON journal_entries(sentiment);
CREATE INDEX IF NOT EXISTS idx_journal_entries_risk_level ON journal_entries(risk_level);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_name ON analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
CREATE INDEX IF NOT EXISTS idx_user_feedback_session_id ON user_feedback(session_id);

-- Row Level Security (RLS) Policies
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for anonymous usage
-- Note: In production, you might want more restrictive policies

-- Journal entries: Allow all operations (anonymous usage)
CREATE POLICY "Allow journal entries operations" ON journal_entries
  FOR ALL USING (true) WITH CHECK (true);

-- Sessions: Allow all operations (anonymous usage)
CREATE POLICY "Allow sessions operations" ON sessions
  FOR ALL USING (true) WITH CHECK (true);

-- Analytics: Allow read for all, write for service role
CREATE POLICY "Allow analytics read" ON analytics
  FOR SELECT USING (true);

CREATE POLICY "Allow analytics write" ON analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow analytics update" ON analytics
  FOR UPDATE USING (true) WITH CHECK (true);

-- User feedback: Allow all operations
CREATE POLICY "Allow feedback operations" ON user_feedback
  FOR ALL USING (true) WITH CHECK (true);

-- Functions for analytics aggregation
CREATE OR REPLACE FUNCTION get_emotion_distribution()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_object_agg(emotion, count)
  INTO result
  FROM (
    SELECT 
      unnest(emotions) as emotion,
      COUNT(*) as count
    FROM journal_entries 
    WHERE timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY emotion
  ) emotion_counts;
  
  RETURN COALESCE(result, '{}');
END;
$$ LANGUAGE plpgsql;

-- Function to get sentiment trends
CREATE OR REPLACE FUNCTION get_sentiment_trends(days INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'date', date,
      'sentiment', avg_sentiment
    ) ORDER BY date
  )
  INTO result
  FROM (
    SELECT 
      DATE(timestamp) as date,
      AVG(sentiment_score) as avg_sentiment
    FROM journal_entries 
    WHERE timestamp >= NOW() - INTERVAL '%s days'
    GROUP BY DATE(timestamp)
    ORDER BY date
  ) daily_sentiment;
  
  RETURN COALESCE(result, '[]');
END;
$$ LANGUAGE plpgsql;

-- Function to get risk level counts
CREATE OR REPLACE FUNCTION get_risk_level_counts()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_object_agg(risk_level, count)
  INTO result
  FROM (
    SELECT 
      risk_level,
      COUNT(*) as count
    FROM journal_entries 
    WHERE timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY risk_level
  ) risk_counts;
  
  RETURN COALESCE(result, '{"low": 0, "medium": 0, "high": 0}');
END;
$$ LANGUAGE plpgsql;

-- Function to increment session entry count
CREATE OR REPLACE FUNCTION increment_session_entries(session_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE sessions 
  SET total_entries = total_entries + 1
  WHERE sessions.session_id = increment_session_entries.session_id;
  
  -- If session doesn't exist, this won't update anything
  -- which is fine since createSession should be called first
END;
$$ LANGUAGE plpgsql;

-- Data retention policy (optional - removes entries older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_entries()
RETURNS void AS $$
BEGIN
  DELETE FROM journal_entries 
  WHERE timestamp < NOW() - INTERVAL '90 days';
  
  DELETE FROM sessions 
  WHERE start_time < NOW() - INTERVAL '90 days';
  
  DELETE FROM analytics 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  DELETE FROM user_feedback 
  WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup to run daily (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-old-entries', '0 2 * * *', 'SELECT cleanup_old_entries();');

COMMENT ON TABLE journal_entries IS 'Stores anonymous journal entries with emotion analysis';
COMMENT ON TABLE sessions IS 'Tracks anonymous user sessions';
COMMENT ON TABLE analytics IS 'Stores aggregated analytics data';
COMMENT ON TABLE user_feedback IS 'Stores user feedback for improving the system';
