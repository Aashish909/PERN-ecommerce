import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', uv: 4000 },
    { name: 'Tue', uv: 3000 },
    { name: 'Wed', uv: 2000 },
    { name: 'Thu', uv: 2780 },
    { name: 'Fri', uv: 1890 },
    { name: 'Sat', uv: 2390 },
    { name: 'Sun', uv: 3490 },
];

const InsightCard = ({ icon: Icon, title, description, type = "info" }) => {
    const colors = {
        info: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
        warning: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
        success: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
        purple: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    };

    return (
        <div className={`p-4 rounded-xl border ${colors[type]} flex gap-3`}>
            <div className="mt-0.5">
                <Icon size={18} />
            </div>
            <div>
                <h4 className="font-semibold text-sm mb-1">{title}</h4>
                <p className="text-xs opacity-90 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const AIInsights = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Insights & Predictions</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Smart analysis based on your store data</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Prediction Chart */}
                <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <TrendingUp size={16} className="text-emerald-500" />
                            Sales Prediction (Next 7 Days)
                        </h3>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded">+12% expected</span>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Insight Cards */}
                <div className="space-y-3">
                    <InsightCard
                        icon={AlertTriangle}
                        title="Low Stock Alert"
                        description="3 popular items are running low. Restock 'Wireless Buds' soon to avoid lost sales."
                        type="warning"
                    />
                    <InsightCard
                        icon={Lightbulb}
                        title="Marketing Tip"
                        description="Customers who bought 'Smart Watch' also viewed 'Leather Straps'. Consider a bundle deal."
                        type="info"
                    />
                    <InsightCard
                        icon={TrendingUp}
                        title="Trending Category"
                        description="Electronics sales are up 45% this week. Feature this category on homepage."
                        type="success"
                    />
                </div>
            </div>
        </div>
    );
};

export default AIInsights;
