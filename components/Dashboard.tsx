import React, { useEffect, useState } from 'react';
import { ActionLog, MetricImpact } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Droplets, Wind, Trash2, Leaf } from 'lucide-react';
import { generateNudges } from '../services/geminiService';

interface DashboardProps {
  logs: ActionLog[];
}

const MetricCard: React.FC<{
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}> = ({ title, value, unit, icon, trend, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
        {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${color.replace('bg-', 'text-')}` })}
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
        {trend} vs last month
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline mt-1">
      <span className="text-2xl font-bold text-slate-800">{value}</span>
      <span className="ml-1 text-sm text-slate-400">{unit}</span>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  const [nudges, setNudges] = useState<string[]>([]);

  // Calculate Aggregates
  const totalMetrics = logs.reduce((acc, log) => ({
    co2_kg: acc.co2_kg + log.metrics.co2_kg,
    water_liters: acc.water_liters + log.metrics.water_liters,
    waste_kg: acc.waste_kg + log.metrics.waste_kg,
  }), { co2_kg: 0, water_liters: 0, waste_kg: 0 });

  // Prepare chart data (cumulative over time)
  const chartData = logs.slice().reverse().map((log, index) => ({
    name: new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    co2: log.metrics.co2_kg,
    water: log.metrics.water_liters,
    waste: log.metrics.waste_kg
  })).slice(-7); // Last 7 entries for cleaner chart

  useEffect(() => {
    if (logs.length > 0) {
      generateNudges(logs).then(setNudges);
    }
  }, [logs]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Impact Overview</h2>
          <p className="text-slate-500">Real-time sustainability performance across the organization.</p>
        </div>
        <div className="flex space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                Live Data
            </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="CO₂ Emissions Reduced"
          value={totalMetrics.co2_kg.toFixed(1)}
          unit="kg"
          icon={<Wind />}
          trend="-12%"
          color="bg-emerald-500"
        />
        <MetricCard
          title="Water Conserved"
          value={totalMetrics.water_liters.toFixed(1)}
          unit="L"
          icon={<Droplets />}
          trend="-8%"
          color="bg-blue-500"
        />
        <MetricCard
          title="Waste Diverted"
          value={totalMetrics.waste_kg.toFixed(1)}
          unit="kg"
          icon={<Trash2 />}
          trend="-5%"
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Impact Trends (Last 7 Actions)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="co2" fill="#10b981" radius={[4, 4, 0, 0]} name="CO2 (kg)" barSize={32} />
                <Bar dataKey="water" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Water (L)" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nudges & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
               <Leaf className="w-5 h-5 text-emerald-200" />
               <h3 className="font-semibold text-lg">AI Behavior Nudges</h3>
            </div>
            <ul className="space-y-3">
              {nudges.length > 0 ? nudges.map((nudge, i) => (
                <li key={i} className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-sm font-medium border border-white/10">
                  {nudge}
                </li>
              )) : (
                 <li className="text-emerald-100 text-sm">Log more actions to receive personalized nudges!</li>
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {logs.slice(0, 4).map(log => (
                    <div key={log.id} className="flex items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="min-w-2 h-2 mt-2 rounded-full bg-emerald-500 mr-3"></div>
                        <div>
                            <p className="text-sm font-medium text-slate-800 line-clamp-1">{log.description}</p>
                            <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleDateString()} • {log.user}</p>
                        </div>
                    </div>
                ))}
                {logs.length === 0 && <p className="text-slate-400 text-sm">No activity recorded yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
