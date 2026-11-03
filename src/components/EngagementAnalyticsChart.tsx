import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Download,
  MessageSquare,
  Eye,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
} from 'lucide-react';

// Daily engagement time-series for 30 days
const DAILY_DATA_30D = [
  { date: 'Oct 01', articleReads: 4200, researchDownloads: 680, discussionParticipants: 180, inquiriesResolved: 42 },
  { date: 'Oct 04', articleReads: 4850, researchDownloads: 740, discussionParticipants: 210, inquiriesResolved: 55 },
  { date: 'Oct 07', articleReads: 5120, researchDownloads: 890, discussionParticipants: 245, inquiriesResolved: 63 },
  { date: 'Oct 10', articleReads: 6340, researchDownloads: 1120, discussionParticipants: 310, inquiriesResolved: 82 },
  { date: 'Oct 13', articleReads: 5900, researchDownloads: 980, discussionParticipants: 290, inquiriesResolved: 74 },
  { date: 'Oct 16', articleReads: 7200, researchDownloads: 1350, discussionParticipants: 380, inquiriesResolved: 95 },
  { date: 'Oct 19', articleReads: 8450, researchDownloads: 1540, discussionParticipants: 420, inquiriesResolved: 110 },
  { date: 'Oct 22', articleReads: 7890, researchDownloads: 1420, discussionParticipants: 390, inquiriesResolved: 104 },
  { date: 'Oct 25', articleReads: 9100, researchDownloads: 1680, discussionParticipants: 480, inquiriesResolved: 128 },
  { date: 'Oct 28', articleReads: 10400, researchDownloads: 1950, discussionParticipants: 560, inquiriesResolved: 145 },
  { date: 'Oct 30', articleReads: 11250, researchDownloads: 2120, discussionParticipants: 610, inquiriesResolved: 160 },
];

const DAILY_DATA_7D = DAILY_DATA_30D.slice(-5);

const DISCIPLINE_DOWNLOADS_DATA = [
  { discipline: 'Geopolitics & Strategy', downloads: 14200, citations: 340, fill: '#d97706' },
  { discipline: 'Monetary Economics', downloads: 11800, citations: 290, fill: '#059669' },
  { discipline: 'Quantum & Tech Sovereignty', downloads: 9600, citations: 410, fill: '#6366f1' },
  { discipline: 'Defense & Maritime Chokepoints', downloads: 8400, citations: 215, fill: '#dc2626' },
  { discipline: 'Jurisprudence & Governance', downloads: 6300, citations: 180, fill: '#8b5cf6' },
];

const ENGAGEMENT_DISTRIBUTION = [
  { name: 'Editorial Readers', value: 58, color: '#d97706' },
  { name: 'Verified Scholars', value: 24, color: '#6366f1' },
  { name: 'Peer Reviewers', value: 12, color: '#059669' },
  { name: 'Diplomatic Fellows', value: 6, color: '#dc2626' },
];

export const EngagementAnalyticsChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D'>('30D');
  const [activeMetricTab, setActiveMetricTab] = useState<'reads' | 'downloads' | 'discussions'>('reads');

  const chartData = timeframe === '7D' ? DAILY_DATA_7D : DAILY_DATA_30D;

  return (
    <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
      {/* Header with Title and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Live Recharts Engine
            </span>
            <span className="text-xs text-stone-400 font-mono">Real-Time Reader Analytics</span>
          </div>
          <h3 className="font-serif font-black text-xl text-slate-900 dark:text-stone-100 mt-1">
            Platform Readership & Engagement Intelligence
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitors article readership spikes, peer-reviewed manuscript downloads, and scholarly Agora discourse.
          </p>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="inline-flex p-1 bg-stone-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setTimeframe('7D')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                timeframe === '7D'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-slate-900 dark:hover:text-stone-100'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeframe('30D')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                timeframe === '30D'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-slate-900 dark:hover:text-stone-100'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveMetricTab('reads')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeMetricTab === 'reads'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-xs'
              : 'border-stone-200 dark:border-slate-800 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold uppercase tracking-wider">Article Reads</span>
            <Eye className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-serif font-black text-slate-900 dark:text-stone-100 mt-1 tabular-nums">
            78,420
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">+22.4% vs previous period</span>
        </button>

        <button
          onClick={() => setActiveMetricTab('downloads')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeMetricTab === 'downloads'
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-xs'
              : 'border-stone-200 dark:border-slate-800 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold uppercase tracking-wider">Research Downloads</span>
            <Download className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-serif font-black text-slate-900 dark:text-stone-100 mt-1 tabular-nums">
            14,890
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">+18.7% verified scholar accesses</span>
        </button>

        <button
          onClick={() => setActiveMetricTab('discussions')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeMetricTab === 'discussions'
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
              : 'border-stone-200 dark:border-slate-800 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold uppercase tracking-wider">Discussion Agora</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-serif font-black text-slate-900 dark:text-stone-100 mt-1 tabular-nums">
            3,410
          </p>
          <span className="text-[11px] text-amber-600 font-semibold">94.8% technical inquiry resolution</span>
        </button>
      </div>

      {/* Main Primary Recharts Visualizations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            {activeMetricTab === 'reads' && 'Daily Article Readership Velocity'}
            {activeMetricTab === 'downloads' && 'Daily Monograph & Manuscript Downloads'}
            {activeMetricTab === 'discussions' && 'Active Discussion Participants & Inquiry Resolutions'}
          </span>
          <span className="text-[11px] text-stone-400 font-mono">X: Date · Y: Volume</span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetricTab === 'reads' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="articleReadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} reads`, 'Article Readership']}
                />
                <Area
                  type="monotone"
                  dataKey="articleReads"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#articleReadGrad)"
                  name="Article Reads"
                />
              </AreaChart>
            ) : activeMetricTab === 'downloads' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} downloads`, 'Manuscript Downloads']}
                />
                <Bar dataKey="researchDownloads" fill="#6366f1" radius={[4, 4, 0, 0]} name="Research Downloads" />
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="discGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="discussionParticipants"
                  stroke="#059669"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#discGrad)"
                  name="Active Participants"
                />
                <Area
                  type="monotone"
                  dataKey="inquiriesResolved"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="none"
                  name="Inquiries Resolved"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Visualizations: Downloads by Discipline & Reader Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-stone-100 dark:border-slate-800">
        {/* Discipline Download Velocity */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-stone-100">
              Download Volume by Academic Discipline
            </h4>
            <span className="text-[11px] text-stone-400 font-mono">Peer-Reviewed Repositories</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={DISCIPLINE_DOWNLOADS_DATA}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="discipline" tick={{ fontSize: 10 }} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [
                    `${Number(value).toLocaleString()}`,
                    name === 'downloads' ? 'Downloads' : 'Citations',
                  ]}
                />
                <Bar dataKey="downloads" fill="#d97706" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reader Cohort Distribution */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-stone-100">
              Agora Reader Cohort Share
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Verified credentials of active readers & discussion participants.
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ENGAGEMENT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={64}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ENGAGEMENT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}% of readership`, 'Cohort Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {ENGAGEMENT_DISTRIBUTION.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-stone-600 dark:text-stone-400 truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
