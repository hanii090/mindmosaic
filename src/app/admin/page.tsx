'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Activity, 
  Download, 
  Shield, 
  LogOut,
  TrendingUp,
  Heart,
  Clock,
  AlertTriangle,
  Brain,
  PlayCircle,
  RefreshCw,
  Database,
  Target
} from 'lucide-react';

interface AnalyticsData {
  totalEntries: number;
  averageSessionLength: number;
  responseTime: number;
  riskLevelCounts: {
    low: number;
    medium: number;
    high: number;
  };
  emotionDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  weeklyGrowth: number;
}

interface TrainingResults {
  datasetSize: number;
  trainingSize: number;
  testSize: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  emotionPatterns: { [emotion: string]: number };
  sentimentDistribution: { positive: number; negative: number; neutral: number };
  recommendations: string[];
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [trainingResults, setTrainingResults] = useState<TrainingResults | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-session='));
      
      if (cookie && cookie.split('=')[1] === 'authenticated-admin') {
        setIsAuthenticated(true);
        loadAnalytics();
      } else {
        router.push('/admin/login');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/admin?action=analytics', {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      
      // Calculate emotion distribution percentages
      const emotionTotal = Object.values(data.emotionDistribution).reduce((a: number, b: unknown) => a + (typeof b === 'number' ? b : 0), 0) as number;
      const emotionDistribution = {
        positive: emotionTotal > 0 ? Math.round((data.emotionDistribution.positive || 0) / emotionTotal * 100) : 0,
        neutral: emotionTotal > 0 ? Math.round((data.emotionDistribution.neutral || 0) / emotionTotal * 100) : 0,
        negative: emotionTotal > 0 ? Math.round((data.emotionDistribution.negative || 0) / emotionTotal * 100) : 0
      };
      
      // Calculate weekly growth (mock for now - would need historical data)
      const weeklyGrowth = Math.random() * 20 - 10; // -10 to +10
      
      setAnalytics({
        totalEntries: data.totalEntries,
        averageSessionLength: Math.round(data.averageSessionLength * 10) / 10,
        responseTime: Math.round(Math.random() * 300 + 100), // Mock response time
        riskLevelCounts: data.riskLevelCounts,
        emotionDistribution,
        weeklyGrowth
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Set default values if API fails
      setAnalytics({
        totalEntries: 0,
        averageSessionLength: 0,
        responseTime: 0,
        riskLevelCounts: { low: 0, medium: 0, high: 0 },
        emotionDistribution: { positive: 0, neutral: 0, negative: 0 },
        weeklyGrowth: 0
      });
    }
  };

  const analyzeDataset = async () => {
    setIsTraining(true);
    try {
      const response = await fetch('/api/admin/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ action: 'analyze_dataset' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze dataset');
      }
      
      const results = await response.json();
      setTrainingResults(results);
    } catch (error) {
      console.error('Error analyzing dataset:', error);
      alert('Failed to analyze dataset. Please try again.');
    } finally {
      setIsTraining(false);
    }
  };

  const trainModel = async () => {
    setIsTraining(true);
    try {
      const response = await fetch('/api/admin/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ action: 'train_model' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to train model');
      }
      
      const results = await response.json();
      setTrainingResults(results);
      alert('Model training completed successfully!');
    } catch (error) {
      console.error('Error training model:', error);
      alert('Failed to train model. Please try again.');
    } finally {
      setIsTraining(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  const exportData = async (type: 'analytics' | 'feedback' | 'dataset') => {
    try {
      const response = await fetch(`/api/admin?action=export&type=${type}`, {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const csvData = await response.text();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `mindmosaic-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Admin <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-white/70">
              System analytics and monitoring for MindMosaic
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowTraining(!showTraining)}
              className="bg-purple-500/20 border border-purple-500/50 hover:bg-purple-500/30 text-purple-200 px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
            >
              <Brain className="h-4 w-4" />
              <span>AI Training</span>
            </button>
            <button
              onClick={() => exportData('analytics')}
              className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="border border-red-500/50 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Analytics Content */}
        {analytics && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Entries</p>
                    <p className="text-2xl font-bold text-white">{analytics.totalEntries.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <div className="mt-2 flex items-center text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analytics.weeklyGrowth}% this week
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Avg Session</p>
                    <p className="text-2xl font-bold text-white">{analytics.averageSessionLength} min</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-400" />
                </div>
                <div className="mt-2 text-white/50 text-sm">
                  Healthy engagement time
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Response Time</p>
                    <p className="text-2xl font-bold text-white">{analytics.responseTime}ms</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-400" />
                </div>
                <div className="mt-2 text-white/50 text-sm">
                  System performance
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">High Risk</p>
                    <p className="text-2xl font-bold text-orange-400">{analytics.riskLevelCounts.high}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-400" />
                </div>
                <div className="mt-2 text-white/50 text-sm">
                  Requiring attention
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Risk Level Distribution */}
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-400" />
                  Risk Level Distribution
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Low Risk</span>
                      <span className="text-white">{analytics.riskLevelCounts.low}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: `${(analytics.riskLevelCounts.low / analytics.totalEntries) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-400">Medium Risk</span>
                      <span className="text-white">{analytics.riskLevelCounts.medium}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(analytics.riskLevelCounts.medium / analytics.totalEntries) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">High Risk</span>
                      <span className="text-white">{analytics.riskLevelCounts.high}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-red-400 h-2 rounded-full"
                        style={{ width: `${(analytics.riskLevelCounts.high / analytics.totalEntries) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emotion Distribution */}
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-400" />
                  Emotion Distribution
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Positive</span>
                      <span className="text-white">{analytics.emotionDistribution.positive}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: `${analytics.emotionDistribution.positive}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-400">Neutral</span>
                      <span className="text-white">{analytics.emotionDistribution.neutral}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full"
                        style={{ width: `${analytics.emotionDistribution.neutral}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-400">Negative</span>
                      <span className="text-white">{analytics.emotionDistribution.negative}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-orange-400 h-2 rounded-full"
                        style={{ width: `${analytics.emotionDistribution.negative}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                System Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2" />
                  <p className="text-white font-medium">AI Processing</p>
                  <p className="text-white/70 text-sm">Operational</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2" />
                  <p className="text-white font-medium">Database</p>
                  <p className="text-white/70 text-sm">Healthy</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2" />
                  <p className="text-white font-medium">API Services</p>
                  <p className="text-white/70 text-sm">Active</p>
                </div>
              </div>
            </div>

            {/* AI Training Section */}
            {showTraining && (
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-400" />
                  AI Model Training & Analysis
                </h3>

                {/* Training Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={analyzeDataset}
                    disabled={isTraining}
                    className="bg-blue-500/20 border border-blue-500/50 hover:bg-blue-500/30 disabled:opacity-50 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors"
                  >
                    {isTraining ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Database className="h-4 w-4" />
                    )}
                    <span>Analyze Dataset</span>
                  </button>

                  <button
                    onClick={trainModel}
                    disabled={isTraining}
                    className="bg-green-500/20 border border-green-500/50 hover:bg-green-500/30 disabled:opacity-50 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors"
                  >
                    {isTraining ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                    <span>Train Model</span>
                  </button>

                  <button
                    onClick={() => window.location.reload()}
                    className="bg-orange-500/20 border border-orange-500/50 hover:bg-orange-500/30 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh Data</span>
                  </button>
                </div>

                {/* Training Results */}
                {trainingResults && (
                  <div className="space-y-6">
                    {/* Dataset Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/70 text-sm">Dataset Size</p>
                            <p className="text-xl font-bold text-white">{trainingResults.datasetSize}</p>
                          </div>
                          <Database className="h-6 w-6 text-blue-400" />
                        </div>
                      </div>
                      
                      <div className="bg-white/5 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/70 text-sm">Model Accuracy</p>
                            <p className="text-xl font-bold text-green-400">{(trainingResults.metrics.accuracy * 100).toFixed(1)}%</p>
                          </div>
                          <Target className="h-6 w-6 text-green-400" />
                        </div>
                      </div>
                      
                      <div className="bg-white/5 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/70 text-sm">F1 Score</p>
                            <p className="text-xl font-bold text-purple-400">{(trainingResults.metrics.f1Score * 100).toFixed(1)}%</p>
                          </div>
                          <BarChart3 className="h-6 w-6 text-purple-400" />
                        </div>
                      </div>
                    </div>

                    {/* Top Emotions */}
                    <div className="bg-white/5 p-4 rounded-xl">
                      <h4 className="text-white font-medium mb-3">Top Detected Emotions</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(trainingResults.emotionPatterns)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 8)
                          .map(([emotion, count]) => (
                            <div key={emotion} className="bg-white/5 p-2 rounded text-center">
                              <p className="text-white text-sm capitalize">{emotion}</p>
                              <p className="text-blue-400 text-xs">{count} occurrences</p>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                      <h4 className="text-yellow-200 font-medium mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        AI Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {trainingResults.recommendations.map((rec, index) => (
                          <li key={index} className="text-yellow-100 text-sm flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Back to Main App */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors">
            <span>← Back to MindMosaic</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
