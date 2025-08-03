'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
  AlertTriangle
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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
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
    const mockData: AnalyticsData = {
      totalEntries: 1247,
      averageSessionLength: 8.5,
      responseTime: 245,
      riskLevelCounts: {
        low: 856,
        medium: 312,
        high: 79
      },
      emotionDistribution: {
        positive: 45,
        neutral: 35,
        negative: 20
      },
      weeklyGrowth: 12.3
    };
    
    setAnalytics(mockData);
  };

  const handleLogout = () => {
    document.cookie = 'admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  const exportData = async (type: 'analytics' | 'feedback') => {
    const filename = `mindmosaic-${type}-${Date.now()}.csv`;
    const csvContent = `data:text/csv;charset=utf-8,Type,Value\nTotal Entries,${analytics?.totalEntries || 0}\nAverage Session,${analytics?.averageSessionLength || 0} min`;
    
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <Button
              onClick={() => exportData('analytics')}
              className="bg-white/10 border border-white/20 hover:bg-white/20 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
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
