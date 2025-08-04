import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsData, getEmotionTrends, getAllJournalEntries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Simple authentication check (you might want to implement proper JWT/session auth)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const days = parseInt(searchParams.get('days') || '30');
    const type = searchParams.get('type') || 'analytics';

    switch (action) {
      case 'analytics':
        const analytics = await getAnalyticsData();
        return NextResponse.json(analytics);
        
      case 'trends':
        const trends = await getEmotionTrends(undefined, days);
        return NextResponse.json(trends);
        
      case 'entries':
        const entries = await getAllJournalEntries();
        return NextResponse.json(entries);
        
      case 'export':
        const exportData = await getAllJournalEntries();
        const csvData = convertToCSV(exportData, type);
        return new NextResponse(csvData, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename=mindmosaic-${type}.csv`
          }
        });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function convertToCSV(data: unknown[], type?: string): string {
  if (data.length === 0) return '';
  
  // Type assertion for the data structure we expect
  const typedData = data as Array<{
    id: string;
    content: string;
    timestamp: string;
    emotions: string[];
    sentiment: string;
    sentimentScore: number;
    riskLevel: string;
    sessionId: string;
  }>;
  
  if (type === 'dataset') {
    // Export anonymized data for training
    const headers = ['emotions', 'sentiment', 'sentiment_score', 'risk_level', 'word_count', 'timestamp'];
    const csvContent = [
      headers.join(','),
      ...typedData.map(row => [
        `"${row.emotions.join(';')}"`,
        row.sentiment,
        row.sentimentScore,
        row.riskLevel,
        row.content.split(' ').length,
        row.timestamp
      ].join(','))
    ].join('\n');
    return csvContent;
  } else {
    // Regular analytics export
    const headers = ['id', 'timestamp', 'emotions', 'sentiment', 'risk_level', 'session_id'];
    const csvContent = [
      headers.join(','),
      ...typedData.map(row => [
        row.id,
        row.timestamp,
        `"${row.emotions.join(';')}"`,
        row.sentiment,
        row.riskLevel,
        row.sessionId
      ].join(','))
    ].join('\n');
    return csvContent;
  }
}
