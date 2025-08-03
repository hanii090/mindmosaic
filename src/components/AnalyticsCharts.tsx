'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface EmotionDistributionProps {
  data: { [emotion: string]: number };
}

interface SentimentTrendsProps {
  data: Array<{ date: string; sentiment: number }>;
}

interface RiskLevelChartProps {
  data: { low: number; medium: number; high: number };
}

// Color palette matching MindMosaic theme
const colors = {
  primary: '#fbe9e7', // peach
  secondary: '#e3f2fd', // blue
  accent: '#ede7f6', // lavender
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#ef4444',
  chart: [
    'rgba(251, 233, 231, 0.8)', // peach
    'rgba(227, 242, 253, 0.8)', // blue
    'rgba(237, 231, 246, 0.8)', // lavender
    'rgba(74, 222, 128, 0.8)', // green
    'rgba(251, 191, 36, 0.8)', // yellow
    'rgba(239, 68, 68, 0.8)', // red
    'rgba(168, 85, 247, 0.8)', // purple
    'rgba(34, 197, 94, 0.8)', // emerald
  ]
};

const chartOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'rgba(255, 255, 255, 0.8)',
        font: {
          family: 'Inter, sans-serif'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(12, 12, 15, 0.9)',
      titleColor: 'rgba(255, 255, 255, 0.9)',
      bodyColor: 'rgba(255, 255, 255, 0.8)',
      borderColor: 'rgba(251, 233, 231, 0.3)',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    y: {
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
};

export function EmotionDistributionChart({ data }: EmotionDistributionProps) {
  const emotions = Object.keys(data);
  const counts = Object.values(data);

  const chartData = {
    labels: emotions.map(emotion => emotion.charAt(0).toUpperCase() + emotion.slice(1)),
    datasets: [
      {
        label: 'Emotion Frequency',
        data: counts,
        backgroundColor: colors.chart.slice(0, emotions.length),
        borderColor: colors.chart.slice(0, emotions.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  return (
    <div className="glass-effect p-6 rounded-xl border border-mind-accent/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        📊 Emotion Distribution
      </h3>
      <div className="h-64">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <p className="text-xs text-white/50 mt-3 text-center">
        Most common emotions detected in student entries
      </p>
    </div>
  );
}

export function SentimentTrendsChart({ data }: SentimentTrendsProps) {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Sentiment Score',
        data: data.map(item => item.sentiment),
        borderColor: colors.primary,
        backgroundColor: colors.primary.replace(')', ', 0.1)').replace('rgb', 'rgba'),
        tension: 0.4,
        fill: true,
        pointBackgroundColor: colors.primary,
        pointBorderColor: '#0C0C0F',
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales?.y,
        min: -1,
        max: 1,
        ticks: {
          ...chartOptions.scales?.y?.ticks,
          callback: function(value: any) {
            if (value === -1) return 'Negative';
            if (value === 0) return 'Neutral';
            if (value === 1) return 'Positive';
            return value;
          }
        }
      }
    }
  };

  return (
    <div className="glass-effect p-6 rounded-xl border border-mind-accent/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        📈 Sentiment Trends
      </h3>
      <div className="h-64">
        <Line data={chartData} options={lineOptions} />
      </div>
      <p className="text-xs text-white/50 mt-3 text-center">
        Overall emotional sentiment over time
      </p>
    </div>
  );
}

export function RiskLevelChart({ data }: RiskLevelChartProps) {
  const chartData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [data.low, data.medium, data.high],
        backgroundColor: [
          colors.success,
          colors.warning,
          colors.danger
        ],
        borderColor: [
          colors.success.replace('0.8', '1'),
          colors.warning.replace('0.8', '1'),
          colors.danger.replace('0.8', '1')
        ],
        borderWidth: 2,
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'Inter, sans-serif'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(12, 12, 15, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(251, 233, 231, 0.3)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="glass-effect p-6 rounded-xl border border-mind-accent/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        ⚠️ Risk Assessment Distribution
      </h3>
      <div className="h-64">
        <Pie data={chartData} options={pieOptions} />
      </div>
      <p className="text-xs text-white/50 mt-3 text-center">
        Distribution of mental health risk levels detected
      </p>
    </div>
  );
}

export function FeedbackQualityChart({ data }: { data: { rating: number; count: number }[] }) {
  const chartData = {
    labels: data.map(item => `${item.rating} Stars`),
    datasets: [
      {
        label: 'Feedback Count',
        data: data.map(item => item.count),
        backgroundColor: colors.chart.slice(0, data.length),
        borderColor: colors.chart.slice(0, data.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  return (
    <div className="glass-effect p-6 rounded-xl border border-mind-accent/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        ⭐ User Satisfaction Ratings
      </h3>
      <div className="h-64">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <p className="text-xs text-white/50 mt-3 text-center">
        Distribution of user ratings for AI responses
      </p>
    </div>
  );
}

// Export all charts as a collection
export const AnalyticsCharts = {
  EmotionDistribution: EmotionDistributionChart,
  SentimentTrends: SentimentTrendsChart,
  RiskLevel: RiskLevelChart,
  FeedbackQuality: FeedbackQualityChart
};
