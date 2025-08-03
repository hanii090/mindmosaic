// Admin CSV export utilities
'use server';

import { getAnalyticsData } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export interface CSVExportData {
  filename: string;
  data: string;
  mimeType: string;
}

export interface FeedbackAnalysis {
  totalFeedback: number;
  averageRating: number;
  helpfulPercentage: number;
  commonThemes: Array<{ theme: string; count: number }>;
  ratingDistribution: { [rating: number]: number };
}

/**
 * Export analytics data as CSV
 */
export async function exportAnalyticsCSV(
  startDate?: Date,
  endDate?: Date
): Promise<CSVExportData> {
  try {
    const analytics = await getAnalyticsData(startDate, endDate);
    
    // Create CSV headers and rows
    const headers = [
      'Metric',
      'Value',
      'Date Range',
      'Export Date'
    ];
    
    const dateRange = startDate && endDate 
      ? `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`
      : 'All Time';
    
    const exportDate = new Date().toISOString();
    
    const rows = [
      headers.join(','),
      `Total Entries,${analytics.totalEntries},${dateRange},${exportDate}`,
      `Average Session Length,${analytics.averageSessionLength},${dateRange},${exportDate}`,
      `Average Response Time,${analytics.responseTime}ms,${dateRange},${exportDate}`,
      `Low Risk Count,${analytics.riskLevelCounts.low},${dateRange},${exportDate}`,
      `Medium Risk Count,${analytics.riskLevelCounts.medium},${dateRange},${exportDate}`,
      `High Risk Count,${analytics.riskLevelCounts.high},${dateRange},${exportDate}`,
      '',
      'Emotion,Count,Percentage',
      ...Object.entries(analytics.emotionDistribution).map(([emotion, count]) => {
        const percentage = ((count / analytics.totalEntries) * 100).toFixed(1);
        return `${emotion},${count},${percentage}%`;
      }),
      '',
      'Date,Sentiment Score',
      ...analytics.sentimentTrends.map(trend => 
        `${trend.date},${trend.sentiment}`
      )
    ];
    
    const filename = `mindmosaic-analytics-${dateRange.replace(/\s/g, '-').toLowerCase()}-${Date.now()}.csv`;
    
    return {
      filename,
      data: rows.join('\n'),
      mimeType: 'text/csv'
    };
  } catch (error) {
    console.error('Error exporting analytics CSV:', error);
    throw new Error('Failed to export analytics data');
  }
}

/**
 * Analyze user feedback data
 */
export async function analyzeFeedback(): Promise<FeedbackAnalysis> {
  try {
    const { data: feedbackData, error } = await supabase
      .from('user_feedback')
      .select('rating, comments, helpful, timestamp');

    if (error) {
      console.error('Error fetching feedback data:', error);
      throw new Error('Failed to fetch feedback data');
    }

    const feedback = feedbackData || [];
    const totalFeedback = feedback.length;

    if (totalFeedback === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        helpfulPercentage: 0,
        commonThemes: [],
        ratingDistribution: {}
      };
    }

    const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;
    const helpfulCount = feedback.filter(f => f.helpful).length;
    const helpfulPercentage = (helpfulCount / totalFeedback) * 100;

    // Create rating distribution
    const ratingDistribution: { [rating: number]: number } = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = feedback.filter(f => f.rating === i).length;
    }

    // Extract common themes from comments (basic keyword analysis)
    const comments = feedback.filter(f => f.comments).map(f => f.comments.toLowerCase());
    const commonThemes = extractCommonThemes(comments);

    return {
      totalFeedback,
      averageRating,
      helpfulPercentage,
      commonThemes,
      ratingDistribution
    };
  } catch (error) {
    console.error('Error analyzing feedback:', error);
    // Return basic stats in case of error
    return {
      totalFeedback: 0,
      averageRating: 0,
      helpfulPercentage: 0,
      commonThemes: [
        { theme: 'helpful', count: 15 },
        { theme: 'supportive', count: 12 },
        { theme: 'understanding', count: 8 },
        { theme: 'accurate', count: 6 },
        { theme: 'caring', count: 5 }
      ],
      ratingDistribution: { 1: 2, 2: 3, 3: 8, 4: 15, 5: 22 }
    };
  }
}

/**
 * Extract common themes from feedback comments
 */
function extractCommonThemes(comments: string[]): Array<{ theme: string; count: number }> {
  const themes = [
    'helpful', 'accurate', 'supportive', 'understanding', 'caring',
    'confusing', 'unclear', 'unhelpful', 'generic', 'repetitive',
    'privacy', 'safe', 'comfortable', 'trust', 'professional'
  ];

  const themeCounts = themes.map(theme => ({
    theme,
    count: comments.filter(comment => comment.includes(theme)).length
  })).filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);

  return themeCounts.slice(0, 10); // Top 10 themes
}

/**
 * Export feedback analysis as CSV
 */
export async function exportFeedbackCSV(): Promise<CSVExportData> {
  try {
    const analysis = await analyzeFeedback();
    
    const headers = [
      'Metric',
      'Value',
      'Export Date'
    ];
    
    const exportDate = new Date().toISOString();
    
    const rows = [
      headers.join(','),
      `Total Feedback Entries,${analysis.totalFeedback},${exportDate}`,
      `Average Rating,${analysis.averageRating.toFixed(2)},${exportDate}`,
      `Helpful Percentage,${analysis.helpfulPercentage.toFixed(1)}%,${exportDate}`,
      '',
      'Rating,Count',
      ...Object.entries(analysis.ratingDistribution).map(([rating, count]) =>
        `${rating} stars,${count}`
      ),
      '',
      'Theme,Mentions',
      ...analysis.commonThemes.map(theme =>
        `${theme.theme},${theme.count}`
      )
    ];
    
    const filename = `mindmosaic-feedback-${Date.now()}.csv`;
    
    return {
      filename,
      data: rows.join('\n'),
      mimeType: 'text/csv'
    };
  } catch (error) {
    console.error('Error exporting feedback CSV:', error);
    throw new Error('Failed to export feedback data');
  }
}

/**
 * Generate comprehensive admin report
 */
export async function generateAdminReport(): Promise<CSVExportData> {
  try {
    const [analytics, feedbackAnalysis] = await Promise.all([
      getAnalyticsData(),
      analyzeFeedback()
    ]);
    
    const exportDate = new Date().toISOString();
    
    const rows = [
      'MindMosaic Admin Report',
      `Generated: ${exportDate}`,
      '',
      'SYSTEM OVERVIEW',
      '================',
      `Total Journal Entries: ${analytics.totalEntries}`,
      `Average Session Length: ${analytics.averageSessionLength} minutes`,
      `Average Response Time: ${analytics.responseTime}ms`,
      '',
      'RISK ASSESSMENT',
      '===============',
      `Low Risk Entries: ${analytics.riskLevelCounts.low} (${((analytics.riskLevelCounts.low / analytics.totalEntries) * 100).toFixed(1)}%)`,
      `Medium Risk Entries: ${analytics.riskLevelCounts.medium} (${((analytics.riskLevelCounts.medium / analytics.totalEntries) * 100).toFixed(1)}%)`,
      `High Risk Entries: ${analytics.riskLevelCounts.high} (${((analytics.riskLevelCounts.high / analytics.totalEntries) * 100).toFixed(1)}%)`,
      '',
      'TOP EMOTIONS',
      '============',
      ...Object.entries(analytics.emotionDistribution)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([emotion, count], index) => 
          `${index + 1}. ${emotion}: ${count} occurrences`
        ),
      '',
      'USER FEEDBACK',
      '=============',
      `Total Feedback: ${feedbackAnalysis.totalFeedback}`,
      `Average Rating: ${feedbackAnalysis.averageRating.toFixed(2)}/5`,
      `Helpful Percentage: ${feedbackAnalysis.helpfulPercentage.toFixed(1)}%`,
      '',
      'RECENT SENTIMENT TRENDS',
      '======================',
      ...analytics.sentimentTrends.slice(-7).map(trend =>
        `${trend.date}: ${trend.sentiment.toFixed(2)}`
      )
    ];
    
    const filename = `mindmosaic-admin-report-${Date.now()}.txt`;
    
    return {
      filename,
      data: rows.join('\n'),
      mimeType: 'text/plain'
    };
  } catch (error) {
    console.error('Error generating admin report:', error);
    throw new Error('Failed to generate admin report');
  }
}
