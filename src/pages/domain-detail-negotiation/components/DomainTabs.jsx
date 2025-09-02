import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DomainTabs = ({ domain }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Domain Statistics */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Domain Statistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Globe" size={16} color="var(--color-primary)" />
              <span className="text-sm font-medium text-foreground">Domain Authority</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{domain?.domainAuthority}</div>
            <div className="text-sm text-success">+5 this month</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={16} color="var(--color-secondary)" />
              <span className="text-sm font-medium text-foreground">Monthly Visitors</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{domain?.monthlyTraffic}</div>
            <div className="text-sm text-success">+12% this month</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Link" size={16} color="var(--color-accent)" />
              <span className="text-sm font-medium text-foreground">Backlinks</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{formatNumber(domain?.backlinks)}</div>
            <div className="text-sm text-success">+234 this month</div>
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Traffic Sources</h4>
        <div className="space-y-3">
          {domain?.trafficSources?.map((source, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name={source?.icon} size={16} />
                <span className="font-medium text-foreground">{source?.name}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">{source?.percentage}%</div>
                <div className="text-sm text-muted-foreground">{formatNumber(source?.visitors)} visitors</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Valuation Estimates */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Valuation Estimates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domain?.valuationEstimates?.map((estimate, index) => (
            <div key={index} className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{estimate?.source}</span>
                <span className="text-sm text-muted-foreground">{estimate?.confidence} confidence</span>
              </div>
              <div className="text-xl font-bold text-foreground">{formatPrice(estimate?.value)}</div>
              <div className="text-sm text-muted-foreground">Updated {estimate?.lastUpdated}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      {/* Ownership Timeline */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Ownership Timeline</h4>
        <div className="space-y-4">
          {domain?.ownershipHistory?.map((event, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name={event?.type === 'sale' ? 'DollarSign' : 'User'} size={16} color="white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{event?.event}</span>
                  <span className="text-sm text-muted-foreground">{event?.date}</span>
                </div>
                <div className="text-sm text-muted-foreground">{event?.description}</div>
                {event?.price && (
                  <div className="text-sm font-semibold text-success mt-1">{formatPrice(event?.price)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price History */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Price History</h4>
        <div className="space-y-3">
          {domain?.priceHistory?.map((price, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium text-foreground">{formatPrice(price?.amount)}</div>
                <div className="text-sm text-muted-foreground">{price?.date}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${price?.change > 0 ? 'text-success' : price?.change < 0 ? 'text-error' : 'text-muted-foreground'}`}>
                  {price?.change > 0 ? '+' : ''}{price?.change}%
                </div>
                <div className="text-sm text-muted-foreground">{price?.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Search Volume */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Search Volume Trends</h4>
        <div className="bg-muted rounded-lg p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{formatNumber(domain?.searchVolume?.monthly)}</div>
              <div className="text-sm text-muted-foreground">Monthly Searches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{domain?.searchVolume?.difficulty}</div>
              <div className="text-sm text-muted-foreground">Keyword Difficulty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{formatPrice(domain?.searchVolume?.cpc)}</div>
              <div className="text-sm text-muted-foreground">Avg CPC</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{domain?.searchVolume?.competition}</div>
              <div className="text-sm text-muted-foreground">Competition</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Search trends show {domain?.searchVolume?.trend} over the past 12 months
          </div>
        </div>
      </div>

      {/* Comparable Domains */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Comparable Domains</h4>
        <div className="space-y-3">
          {domain?.comparableDomains?.map((comp, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="font-medium text-foreground">{comp?.name}</div>
                <div className="text-sm text-muted-foreground">
                  DA: {comp?.domainAuthority} • Traffic: {comp?.traffic}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">{formatPrice(comp?.soldPrice)}</div>
                <div className="text-sm text-muted-foreground">Sold {comp?.soldDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Insights */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Market Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} color="var(--color-success)" />
              <span className="font-medium text-foreground">Market Trend</span>
            </div>
            <div className="text-lg font-semibold text-success">{domain?.marketInsights?.trend}</div>
            <div className="text-sm text-muted-foreground">{domain?.marketInsights?.trendDescription}</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={16} color="var(--color-primary)" />
              <span className="font-medium text-foreground">Investment Score</span>
            </div>
            <div className="text-lg font-semibold text-foreground">{domain?.marketInsights?.investmentScore}/10</div>
            <div className="text-sm text-muted-foreground">{domain?.marketInsights?.scoreDescription}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-standard ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default DomainTabs;