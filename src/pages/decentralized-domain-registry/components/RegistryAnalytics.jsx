import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { format } from 'date-fns';

const RegistryAnalytics = ({ domains, currentNetwork }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeChart, setActiveChart] = useState('performance');

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const chartOptions = [
    { id: 'performance', label: 'Performance', icon: 'BarChart3' },
    { id: 'network', label: 'Network Usage', icon: 'PieChart' },
    { id: 'trends', label: 'Trends', icon: 'TrendingUp' }
  ];

  // Mock analytics data
  const performanceData = [
    { name: 'myawesome.eth', resolutions: 1250, visitors: 890, revenue: 0.045 },
    { name: 'blockchain.crypto', resolutions: 2100, visitors: 1456, revenue: 0.089 },
    { name: 'defi.wallet', resolutions: 45, visitors: 23, revenue: 0.001 }
  ];

  const networkData = [
    { name: 'Ethereum', value: 67, color: '#627EEA' },
    { name: 'Polygon', value: 22, color: '#8247E5' },
    { name: 'Arbitrum', value: 8, color: '#28A0F0' },
    { name: 'Optimism', value: 3, color: '#FF0420' }
  ];

  const trendsData = [
    { date: '2024-08-01', resolutions: 180, visitors: 120 },
    { date: '2024-08-02', resolutions: 210, visitors: 145 },
    { date: '2024-08-03', resolutions: 190, visitors: 135 },
    { date: '2024-08-04', resolutions: 250, visitors: 180 },
    { date: '2024-08-05', resolutions: 275, visitors: 195 },
    { date: '2024-08-06', resolutions: 320, visitors: 225 },
    { date: '2024-08-07', resolutions: 295, visitors: 210 }
  ];

  const totalStats = {
    totalDomains: domains?.length || 0,
    totalResolutions: domains?.reduce((sum, domain) => sum + (domain?.analytics?.resolutions || 0), 0),
    totalVisitors: domains?.reduce((sum, domain) => sum + (domain?.analytics?.uniqueVisitors || 0), 0),
    avgPerformance: domains?.length ? Math.round(
      domains?.reduce((sum, domain) => sum + (domain?.analytics?.resolutions || 0), 0) / domains?.length
    ) : 0
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'pending_renewal':
        return 'text-warning bg-warning/10';
      case 'expired':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const renderPerformanceChart = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Domain Performance Metrics</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="resolutions" fill="#8884d8" name="Resolutions" />
            <Bar dataKey="visitors" fill="#82ca9d" name="Visitors" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderNetworkChart = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Network Distribution</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={networkData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {networkData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {networkData?.map((network) => (
          <div key={network?.name} className="flex items-center space-x-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: network?.color }}
            />
            <span className="text-foreground">{network?.name}</span>
            <span className="text-muted-foreground">({network?.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrendsChart = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Resolution Trends ({timeRange})</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              className="text-xs" 
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => format(new Date(date), 'MMM dd')}
            />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
            />
            <Line 
              type="monotone" 
              dataKey="resolutions" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Resolutions"
            />
            <Line 
              type="monotone" 
              dataKey="visitors" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Visitors"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderChart = () => {
    switch (activeChart) {
      case 'performance':
        return renderPerformanceChart();
      case 'network':
        return renderNetworkChart();
      case 'trends':
        return renderTrendsChart();
      default:
        return renderPerformanceChart();
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Domains</p>
              <p className="text-2xl font-bold text-foreground">{totalStats?.totalDomains}</p>
            </div>
            <Icon name="Globe" size={24} className="text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-success">+0 this month</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Resolutions</p>
              <p className="text-2xl font-bold text-foreground">{totalStats?.totalResolutions?.toLocaleString()}</p>
            </div>
            <Icon name="Activity" size={24} className="text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-success">+12.5% this month</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unique Visitors</p>
              <p className="text-2xl font-bold text-foreground">{totalStats?.totalVisitors?.toLocaleString()}</p>
            </div>
            <Icon name="Users" size={24} className="text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-success">+8.3% this month</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Performance</p>
              <p className="text-2xl font-bold text-foreground">{totalStats?.avgPerformance}</p>
            </div>
            <Icon name="BarChart3" size={24} className="text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-warning">-2.1% this month</span>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
          {chartOptions?.map((chart) => (
            <Button
              key={chart?.id}
              variant={activeChart === chart?.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveChart(chart?.id)}
              className="flex items-center space-x-2"
            >
              <Icon name={chart?.icon} size={16} />
              <span>{chart?.label}</span>
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Time Range:</span>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {timeRangeOptions?.map((range) => (
              <Button
                key={range?.value}
                variant={timeRange === range?.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range?.value)}
              >
                {range?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        {renderChart()}
      </div>

      {/* Domain Performance Table */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Domain Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Domain</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Resolutions</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Visitors</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Resolved</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Performance</th>
              </tr>
            </thead>
            <tbody>
              {domains?.map((domain) => {
                const performanceScore = domain?.analytics?.resolutions > 1000 ? 'High' : 
                                       domain?.analytics?.resolutions > 100 ? 'Medium' : 'Low';
                const performanceColor = performanceScore === 'High' ? 'text-success' : 
                                       performanceScore === 'Medium' ? 'text-warning' : 'text-error';
                
                return (
                  <tr key={domain?.id} className="border-b border-border hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="Globe" size={16} className="text-primary" />
                        <span className="font-medium text-foreground">{domain?.name}</span>
                        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                          {domain?.type}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(domain?.status)}`}>
                        {domain?.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right text-foreground">
                      {domain?.analytics?.resolutions?.toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-foreground">
                      {domain?.analytics?.uniqueVisitors?.toLocaleString()}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {domain?.analytics?.lastResolved ? 
                        format(new Date(domain?.analytics?.lastResolved), 'MMM dd, yyyy') : 
                        'Never'
                      }
                    </td>
                    <td className="p-4 text-right">
                      <span className={`font-medium ${performanceColor}`}>
                        {performanceScore}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Optimization Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-info/10 border border-info/20 rounded-lg">
            <Icon name="Lightbulb" size={20} className="text-info mt-0.5" />
            <div>
              <h4 className="font-medium text-info mb-1">Improve IPFS Performance</h4>
              <p className="text-sm text-info/80">
                Consider pinning your content to multiple IPFS gateways for better availability and faster resolution times.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div>
              <h4 className="font-medium text-warning mb-1">Renewal Alert</h4>
              <p className="text-sm text-warning/80">
                One domain expires within 30 days. Consider setting up auto-renewal to avoid losing your domain.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-success/10 border border-success/20 rounded-lg">
            <Icon name="TrendingUp" size={20} className="text-success mt-0.5" />
            <div>
              <h4 className="font-medium text-success mb-1">Growth Opportunity</h4>
              <p className="text-sm text-success/80">
                Your blockchain.crypto domain is performing well. Consider creating subdomains or adding more content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistryAnalytics;