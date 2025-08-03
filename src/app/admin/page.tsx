'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Eye, Filter, Search, Calendar, User, MessageSquare, FileText, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { exportAnalyticsCSV, exportFeedbackCSV, generateAdminReport } from '@/lib/adminExport';

interface AdminEntry {
  id: number;
  timestamp: string;
  userInput: string;
  detectedEmotion: string;
  aiResponse: string;
  sessionId: string;
}

export default function AdminPage() {
  const [entries, setEntries] = useState<AdminEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AdminEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [emotionFilter, setEmotionFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Generate mock data for demo purposes
    // In a real app, this would fetch from an API
    const mockEntries: AdminEntry[] = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        userInput: "I've been feeling really overwhelmed with my coursework lately. Between midterms and my part-time job, I feel like I can't keep up.",
        detectedEmotion: "anxious",
        aiResponse: "I can understand how overwhelming it must feel to balance coursework and work responsibilities...",
        sessionId: "session_abc123"
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        userInput: "My friends all seem to be doing better than me academically. I feel like I'm falling behind and it's making me sad.",
        detectedEmotion: "sad",
        aiResponse: "Comparing ourselves to others is a natural human tendency, but it can be harmful to our wellbeing...",
        sessionId: "session_def456"
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        userInput: "I just got accepted into the program I wanted! I'm so excited but also nervous about the challenges ahead.",
        detectedEmotion: "excited",
        aiResponse: "Congratulations on this amazing achievement! It's completely normal to feel both excited and nervous...",
        sessionId: "session_ghi789"
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        userInput: "I've been having trouble sleeping and concentrating. Everything feels difficult right now.",
        detectedEmotion: "tired",
        aiResponse: "Sleep difficulties and concentration problems can significantly impact our daily functioning...",
        sessionId: "session_jkl012"
      }
    ];

    setEntries(mockEntries);
    setFilteredEntries(mockEntries);
  }, []);

  useEffect(() => {
    let filtered = entries;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.userInput.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.aiResponse.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply emotion filter
    if (emotionFilter !== 'all') {
      filtered = filtered.filter(entry => entry.detectedEmotion === emotionFilter);
    }

    // Apply date filter
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(entry => new Date(entry.timestamp) >= filterDate);
    }

    setFilteredEntries(filtered);
  }, [entries, searchTerm, emotionFilter, dateRange]);

  const exportToCSV = () => {
    const headers = ['Timestamp', 'User Input', 'Detected Emotion', 'AI Response', 'Session ID'];
    const csvContent = [
      headers.join(','),
      ...filteredEntries.map(entry => [
        entry.timestamp,
        `"${entry.userInput.replace(/"/g, '""')}"`,
        entry.detectedEmotion,
        `"${entry.aiResponse.replace(/"/g, '""')}"`,
        entry.sessionId
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmosaic-entries-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportAnalytics = async () => {
    setIsExporting(true);
    try {
      const result = await exportAnalyticsCSV();
      const blob = new Blob([result.data], { type: result.mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportFeedback = async () => {
    setIsExporting(true);
    try {
      const result = await exportFeedbackCSV();
      const blob = new Blob([result.data], { type: result.mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsExporting(true);
    try {
      const result = await generateAdminReport();
      const blob = new Blob([result.data], { type: result.mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report generation failed:', error);
      alert('Report generation failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: { [key: string]: string } = {
      anxious: '😰',
      sad: '😢',
      happy: '😊',
      excited: '🤗',
      tired: '😴',
      calm: '😌',
      angry: '😠',
      neutral: '😐'
    };
    return emojis[emotion] || '😐';
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      anxious: 'text-orange-400',
      sad: 'text-blue-400',
      happy: 'text-yellow-400',
      excited: 'text-pink-400',
      tired: 'text-purple-400',
      calm: 'text-green-400',
      angry: 'text-red-400',
      neutral: 'text-gray-400'
    };
    return colors[emotion] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            <Button
              asChild
              variant="ghost"
              className="text-white/70 hover:text-white"
            >
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm border border-yellow-400/30">
                ⚠️ Demo Mode
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleExportAnalytics}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-mind-peach/20 to-mind-blue/20 border border-mind-peach/30 hover:from-mind-peach/30 hover:to-mind-blue/30"
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Analytics CSV'}
                </Button>
                
                <Button
                  onClick={handleExportFeedback}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-mind-yellow/20 to-mind-orange/20 border border-mind-yellow/30 hover:from-mind-yellow/30 hover:to-mind-orange/30"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Feedback CSV'}
                </Button>
                
                <Button
                  onClick={handleGenerateReport}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-mind-lavender/20 to-mind-peach/20 border border-mind-lavender/30 hover:from-mind-lavender/30 hover:to-mind-peach/30"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isExporting ? 'Generating...' : 'Full Report'}
                </Button>
                
                <Button
                  onClick={exportToCSV}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 hover:from-green-500/30 hover:to-blue-500/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Raw Data CSV'}
                </Button>
              </div>
            </div>
          </div>

          <div>
            {/* Header */}
            <div className="text-center space-y-6 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <Eye className="h-10 w-10 text-mind-lavender animate-pulse-soft" />
                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  Admin Dashboard
                </h1>
              </div>
              
              <p className="text-lg text-white/70">
                Monitor anonymized usage patterns and system analytics
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-effect p-6 rounded-xl text-center">
                <div className="text-2xl font-bold text-mind-peach">{entries.length}</div>
                <div className="text-white/70 text-sm">Total Sessions</div>
              </div>
              
              <div className="glass-effect p-6 rounded-xl text-center">
                <div className="text-2xl font-bold text-mind-blue">
                  {entries.filter(e => new Date(e.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-white/70 text-sm">Last 24 Hours</div>
              </div>
              
              <div className="glass-effect p-6 rounded-xl text-center">
                <div className="text-2xl font-bold text-mind-lavender">
                  {[...new Set(entries.map(e => e.detectedEmotion))].length}
                </div>
                <div className="text-white/70 text-sm">Emotion Types</div>
              </div>
              
              <div className="glass-effect p-6 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(entries.reduce((acc, e) => acc + e.userInput.length, 0) / entries.length)}
                </div>
                <div className="text-white/70 text-sm">Avg Input Length</div>
              </div>
            </div>

            {/* Filters */}
            <div className="glass-effect p-6 rounded-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:border-mind-peach/50 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Emotion Filter</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <select
                      value={emotionFilter}
                      onChange={(e) => setEmotionFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-mind-peach/50 focus:outline-none appearance-none"
                    >
                      <option value="all">All Emotions</option>
                      <option value="anxious">Anxious</option>
                      <option value="sad">Sad</option>
                      <option value="happy">Happy</option>
                      <option value="excited">Excited</option>
                      <option value="tired">Tired</option>
                      <option value="calm">Calm</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Date Range</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-mind-peach/50 focus:outline-none appearance-none"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="glass-effect rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-white/80 font-medium">Timestamp</th>
                      <th className="px-6 py-4 text-left text-white/80 font-medium">User Input</th>
                      <th className="px-6 py-4 text-left text-white/80 font-medium">Emotion</th>
                      <th className="px-6 py-4 text-left text-white/80 font-medium">AI Response</th>
                      <th className="px-6 py-4 text-left text-white/80 font-medium">Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry, index) => (
                      <tr key={entry.id} className={`border-b border-white/5 ${index % 2 === 0 ? 'bg-white/2' : ''}`}>
                        <td className="px-6 py-4 text-white/70 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(entry.timestamp).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white/80 max-w-xs">
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0" />
                            <span className="truncate" title={entry.userInput}>
                              {entry.userInput.length > 100 
                                ? `${entry.userInput.substring(0, 100)}...` 
                                : entry.userInput}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getEmotionEmoji(entry.detectedEmotion)}</span>
                            <span className={`capitalize font-medium ${getEmotionColor(entry.detectedEmotion)}`}>
                              {entry.detectedEmotion}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white/70 max-w-sm">
                          <span className="truncate block" title={entry.aiResponse}>
                            {entry.aiResponse.length > 80 
                              ? `${entry.aiResponse.substring(0, 80)}...` 
                              : entry.aiResponse}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/60 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span className="font-mono">{entry.sessionId.split('_')[1]}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredEntries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white/50">No entries found matching your filters.</p>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center text-white/50 text-sm">
              <p>
                Showing {filteredEntries.length} of {entries.length} total entries • 
                All data is anonymized and aggregated for analytics purposes only
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
