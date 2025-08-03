# 🚀 Supabase Setup Guide for MindMosaic

This guide will help you set up Supabase as the backend database for MindMosaic, replacing the previous Replit DB integration.

## 📋 Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Your Supabase project URL and anon key
3. SQL access to your Supabase database

## 🛠️ Setup Steps

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Choose a name like "mindmosaic-db"
4. Set a strong database password
5. Wait for the project to be created

### 2. Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy the entire contents of `supabase_schema.sql` from the project root
5. Run the SQL script
6. Verify that all tables were created successfully

### 3. Configure Environment Variables

Your `.env.local` file should contain:

```env
# Together.ai API Key for Zephyr-7B AI responses
TOGETHER_API_KEY=your_together_api_key_here

# Replicate API Token for emotion detection
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get Supabase Credentials

1. In your Supabase project dashboard
2. Go to **Settings** > **API**
3. Copy the **Project URL** and **anon public** key
4. Update your `.env.local` file with these values

## 📊 Database Schema Overview

The schema includes these main tables:

### `journal_entries`
- Stores anonymous journal entries with emotion analysis
- Fields: content, emotions, sentiment, risk_level, session_id
- Indexed for performance

### `sessions` 
- Tracks anonymous user sessions
- Fields: session_id, start_time, total_entries
- No personal data stored

### `analytics`
- Aggregated metrics for admin dashboard
- Fields: metric_name, metric_value, date, metadata
- Used for platform insights

### `user_feedback`
- Anonymous feedback for system improvement
- Fields: rating, comments, helpful boolean
- Linked to sessions, not users

## 🔒 Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Public policies allow anonymous access
- No personal data exposure

### Data Privacy
- All data is anonymous
- No user identification possible
- Automatic cleanup of old entries

### HIPAA Compliance
- No PHI (Personal Health Information) stored
- Session-based anonymous tracking only
- Secure data transmission

## 🔧 Custom Functions

The schema includes several custom PostgreSQL functions:

- `get_emotion_distribution()` - Returns emotion analysis aggregates
- `get_sentiment_trends(days)` - Returns sentiment trends over time
- `get_risk_level_counts()` - Returns risk level distribution
- `increment_session_entries()` - Updates session entry counts
- `cleanup_old_entries()` - Removes data older than 90 days

## 📈 Analytics Capabilities

### Real-time Metrics
- Total entries count
- Emotion distribution
- Sentiment trends
- Risk level patterns

### Performance Tracking
- Session duration analysis
- Response time monitoring
- Error rate tracking

### Research Data Export
- Anonymized data export
- No personal content included
- Ethical research compliance

## 🧪 Testing the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the form page and submit a test entry

3. Check your Supabase dashboard:
   - Go to **Table Editor**
   - Verify data appears in `journal_entries` and `sessions` tables

4. Test the admin dashboard for analytics

## 🚨 Troubleshooting

### Common Issues

**Environment Variables Not Found**
- Ensure `.env.local` file exists in project root
- Restart development server after changes
- Check variable names match exactly

**Database Connection Errors**
- Verify Supabase URL and key are correct
- Ensure project is active (not paused)
- Check network connectivity

**SQL Function Errors**
- Run the complete schema script
- Check for any SQL syntax errors
- Verify all functions were created

**RLS Policy Issues**
- Ensure policies allow anonymous access
- Check that RLS is enabled on tables
- Verify policy conditions are correct

### Debug Mode

Add this to your environment variables for detailed logging:
```env
NEXT_PUBLIC_DEBUG=true
```

## 🔄 Migration from Replit DB

If you previously used Replit DB:

1. The old `src/lib/db_old.ts` contains the Replit implementation
2. New `src/lib/db.ts` uses Supabase
3. API interfaces remain the same
4. No application code changes needed

## 📞 Support

For issues with:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **MindMosaic**: Review application logs and error messages
- **General Setup**: Ensure all prerequisites are met

## 🎯 Next Steps

After successful setup:

1. ✅ Test form submission and AI responses
2. ✅ Verify analytics dashboard functionality  
3. ✅ Check data privacy compliance
4. ✅ Set up automated backups (optional)
5. ✅ Configure monitoring and alerts (optional)

Your MindMosaic application is now powered by Supabase! 🚀
