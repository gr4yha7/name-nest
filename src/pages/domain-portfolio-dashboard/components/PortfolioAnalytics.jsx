import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PortfolioAnalytics = ({ data }) => {
  const [timeframe, setTimeframe] = useState('30d');
  const [chartType, setChartType] = useState('value');

  // Mock performance data
  const performanceData = [
    { date: '2024-07-01', value: 42.3, roi: 8.2, transactions: 3 },
    { date: '2024-07-08', value: 44.1, roi: 10.5, transactions: 5 },
    { date: '2024-07-15', value: 41.8, roi: 7.1, transactions: 2 },
    { date: '2024-07-22', value: 45.7, roi: 12.5, transactions: 4 },
    { date: '2024-07-29', value: 43.9, roi: 9.8, transactions: 1 },
    { date: '2024-08-05', value: 47.2, roi: 15.2, transactions: 6 },
    { date: '2024-08-12', value: 46.1, roi: 13.8, transactions: 3 },
    { date: '2024-08-19', value: 48.5, roi: 17.1, transactions: 2 }
  ];

  const timeframes = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const chartTypes = [
    { value: 'value', label: 'Portfolio Value', color: '#627EEA' },
    { value: 'roi', label: 'ROI %', color: '#00C851' },
    { value: 'transactions', label: 'Transactions', color: '#FF6B35' }
  ];

  const insights = [
    {
      title: 'Best Performing Domain',
      value: 'crypto-future.eth',
      change: '+25.5% ROI',
      icon: 'TrendingUp',
      color: 'text-green-600'
    },
    {
      title: 'Average Holding Period',
      value: '156 days',
      change: '+12 days vs avg',
      icon: 'Clock',
      color: 'text-blue-600'
    },
    {
      title: 'Network Diversity',
      value: '3 networks',
      change: 'Well balanced',
      icon: 'Network',
      color: 'text-purple-600'
    },
    {
      title: 'Liquidity Score',
      value: '8.2/10',
      change: 'Above average',
      icon: 'Droplets',
      color: 'text-teal-600'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-popover-foreground">
            {new Date(label)?.toLocaleDateString()}
          </p>
          {chartType === 'value' && (
            <p className="text-sm text-muted-foreground">
              Portfolio: {data?.value} ETH
            </p>
          )}
          {chartType === 'roi' && (
            <p className="text-sm text-muted-foreground">
              ROI: {data?.roi}%
            </p>
          )}
          {chartType === 'transactions' && (
            <p className="text-sm text-muted-foreground">
              Transactions: {data?.transactions}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const currentChart = chartTypes?.find(c => c?.value === chartType);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Portfolio Analytics
        </h3>
        <div className="flex items-center space-x-2">
          {timeframes?.map((tf) => (
            <Button
              key={tf?.value}
              variant={timeframe === tf?.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(tf?.value)}
            >
              {tf?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Chart Type Selector */}
      <div className="flex items-center space-x-2 mb-4">
        {chartTypes?.map((type) => (
          <Button
            key={type?.value}
            variant={chartType === type?.value ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType(type?.value)}
          >
            {type?.label}
          </Button>
        ))}
      </div>
      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentChart?.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={currentChart?.color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={chartType}
              stroke={currentChart?.color}
              fillOpacity={1}
              fill="url(#colorGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Insights Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights?.map((insight, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center">
                <Icon name={insight?.icon} size={16} className="text-muted-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{insight?.title}</p>
            <p className="text-sm font-semibold text-foreground">{insight?.value}</p>
            <p className={`text-xs ${insight?.color}`}>{insight?.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioAnalytics;