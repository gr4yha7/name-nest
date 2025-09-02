import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsCard from './components/MetricsCard';
import PerformanceChart from './components/PerformanceChart';
import DomainPerformanceTable from './components/DomainPerformanceTable';
import InsightsPanel from './components/InsightsPanel';
import ComparisonTools from './components/ComparisonTools';

const AnalyticsPerformanceDashboard = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const portfolioValueData = [
    { name: 'Jan', value: 125000 },
    { name: 'Feb', value: 132000 },
    { name: 'Mar', value: 128000 },
    { name: 'Apr', value: 145000 },
    { name: 'May', value: 158000 },
    { name: 'Jun', value: 162000 },
    { name: 'Jul', value: 175000 }
  ];

  const trafficSourceData = [
    { name: 'Direct', value: 45 },
    { name: 'Search', value: 30 },
    { name: 'Social', value: 15 },
    { name: 'Referral', value: 10 }
  ];

  const conversionTrendData = [
    { name: 'Week 1', value: 12.5 },
    { name: 'Week 2', value: 14.2 },
    { name: 'Week 3', value: 11.8 },
    { name: 'Week 4', value: 15.6 }
  ];

  const geographicData = [
    { name: 'United States', value: 2847 },
    { name: 'United Kingdom', value: 1923 },
    { name: 'Canada', value: 1654 },
    { name: 'Australia', value: 1432 },
    { name: 'Germany', value: 1287 },
    { name: 'France', value: 1156 }
  ];

  const dateRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 lg:px-6 py-8">
        <Breadcrumb />
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into your domain portfolio performance and market trends
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              {dateRangeOptions?.map((option) => (
                <Button
                  key={option?.value}
                  variant={dateRange === option?.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDateRange(option?.value)}
                >
                  {option?.label}
                </Button>
              ))}
            </div>
            <Button variant="outline" iconName="Download" iconPosition="left">
              Export Report
            </Button>
            <Button variant="outline" iconName="RefreshCw" iconPosition="left">
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Portfolio Value"
            value="$175,000"
            change="+12.5%"
            changeType="positive"
            icon="DollarSign"
            description="Estimated market value of all domains"
            trend={75}
          />
          <MetricsCard
            title="Monthly Views"
            value="12,847"
            change="+8.3%"
            changeType="positive"
            icon="Eye"
            description="Total domain listing views"
            trend={68}
          />
          <MetricsCard
            title="Conversion Rate"
            value="13.2%"
            change="-2.1%"
            changeType="negative"
            icon="Target"
            description="Views to inquiry conversion"
            trend={45}
          />
          <MetricsCard
            title="Active Negotiations"
            value="23"
            change="+15.0%"
            changeType="positive"
            icon="MessageSquare"
            description="Ongoing domain negotiations"
            trend={82}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart
            title="Portfolio Value Trend"
            type="line"
            data={portfolioValueData}
            height={300}
          />
          <PerformanceChart
            title="Traffic Sources"
            type="pie"
            data={trafficSourceData}
            height={300}
            showTimeRange={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart
            title="Conversion Rate Trend"
            type="line"
            data={conversionTrendData}
            height={300}
          />
          <PerformanceChart
            title="Geographic Distribution"
            type="bar"
            data={geographicData}
            height={300}
            showTimeRange={false}
          />
        </div>

        {/* Domain Performance Table */}
        <div className="mb-8">
          <DomainPerformanceTable />
        </div>

        {/* Comparison Tools and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ComparisonTools />
          <InsightsPanel />
        </div>

        {/* Additional Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">SEO Performance</h3>
              <Icon name="Search" size={20} className="text-primary" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Organic Traffic</span>
                <span className="font-medium text-foreground">3,847 visits</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Search Rankings</span>
                <span className="font-medium text-success">↑ 12 positions</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Click-through Rate</span>
                <span className="font-medium text-foreground">4.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">A/B Testing</h3>
              <Icon name="TestTube" size={20} className="text-primary" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Tests</span>
                <span className="font-medium text-foreground">3 running</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Best Performer</span>
                <span className="font-medium text-success">+18% conversion</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Statistical Significance</span>
                <span className="font-medium text-foreground">95%</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Market Intelligence</h3>
              <Icon name="TrendingUp" size={20} className="text-primary" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Market Trend</span>
                <span className="font-medium text-success">Bullish</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Sale Price</span>
                <span className="font-medium text-foreground">$14,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Time to Sale</span>
                <span className="font-medium text-foreground">28 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Updates */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Real-time Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="Eye" size={16} className="text-primary" />
              <span className="text-sm text-foreground">
                <strong>techstartup.com</strong> received 3 new views in the last hour
              </span>
              <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="MessageSquare" size={16} className="text-success" />
              <span className="text-sm text-foreground">
                New inquiry for <strong>cryptoexchange.io</strong> from potential buyer
              </span>
              <span className="text-xs text-muted-foreground ml-auto">5 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="DollarSign" size={16} className="text-warning" />
              <span className="text-sm text-foreground">
                Offer received for <strong>aiplatform.net</strong> - $12,500
              </span>
              <span className="text-xs text-muted-foreground ml-auto">12 min ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPerformanceDashboard;