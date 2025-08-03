'use client';

import { useEffect, useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getLastThreeSessions, SessionRecord } from '@/lib/localStorage';

export default function RecentSessions() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const recentSessions = getLastThreeSessions();
    setSessions(recentSessions);
  }, []);

  if (!mounted || sessions.length === 0) {
    return null;
  }

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  return (
    <div className="bg-white/5 border border-mind-accent/20 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-mind-accent" />
        <h3 className="text-lg font-semibold text-white">Recent Sessions</h3>
      </div>
      
      <div className="space-y-3">
        {sessions.map((session) => (
          <Link
            key={session.sessionId}
            href={`/result?session=${session.sessionId}`}
            className="block group"
          >
            <div className="bg-white/5 hover:bg-white/10 border border-mind-accent/10 hover:border-mind-accent/30 rounded-lg p-4 transition-all duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getSentimentEmoji(session.sentiment)}</span>
                    <span className="text-xs text-white/60">
                      {formatTimeAgo(session.timestamp)}
                    </span>
                    {session.riskLevel && (
                      <span className={`text-xs font-medium ${getRiskColor(session.riskLevel)}`}>
                        {session.riskLevel} risk
                      </span>
                    )}
                  </div>
                  
                  <p className="text-white/80 text-sm leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                    {session.content.substring(0, 120)}
                    {session.content.length > 120 ? '...' : ''}
                  </p>
                  
                  {session.emotions && session.emotions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {session.emotions.slice(0, 3).map((emotion, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-mind-accent/20 text-mind-accent text-xs rounded-full"
                        >
                          {emotion}
                        </span>
                      ))}
                      {session.emotions.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                          +{session.emotions.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center text-mind-accent/60 group-hover:text-mind-accent transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-mind-accent/10">
        <p className="text-xs text-white/50 text-center">
          💾 Sessions automatically saved locally for quick access
        </p>
      </div>
    </div>
  );
}
