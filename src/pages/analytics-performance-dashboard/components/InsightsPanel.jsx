import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsightsPanel = () => {
  const [activeTab, setActiveTab] = useState('opportunities');

  const insights = {
    opportunities: [
      {
        id: 1,
        type: 'optimization',
        title: "Optimize techstartup.com Landing Page",
        description: "Your conversion rate is 12.5% below the industry average of 15.8% for technology domains. Consider A/B testing different call-to-action placements.",
        impact: "high",
        effort: "medium",
        estimatedIncrease: "+23% conversion rate",
        icon: "TrendingUp"
      },
      {
        id: 2,
        type: 'pricing',
        title: "Adjust Pricing for cryptoexchange.io",
        description: "Market analysis shows similar domains selling 18% higher. Your current asking price may be undervalued.",
        impact: "high",
        effort: "low",
        estimatedIncrease: "+$4,500 potential value",
        icon: "DollarSign"
      },
      {
        id: 3,
        type: 'marketing',
        title: "Increase Social Media Presence",
        description: "Domains with active social media promotion see 34% more inquiries. Consider sharing your listings on LinkedIn and Twitter.",
        impact: "medium",
        effort: "medium",
        estimatedIncrease: "+15 inquiries/month",
        icon: "Share2"
      },
      {
        id: 4,
        type: 'seo',
        title: "Improve SEO for aiplatform.net",
        description: "Adding structured data markup and meta descriptions could improve search visibility by 28%.",
        impact: "medium",
        effort: "low",
        estimatedIncrease: "+340 organic views",
        icon: "Search"
      }
    ],
    trends: [
      {
        id: 1,
        title: "AI Domain Surge",
        description: "AI-related domains have seen a 156% increase in inquiries over the past 30 days. Consider highlighting AI capabilities in your listings.",
        trend: "up",
        change: "+156%",
        category: "Market Trend"
      },
      {
        id: 2,
        title: "Crypto Market Cooling",
        description: "Cryptocurrency domain inquiries have decreased by 23% this month, but offer values remain stable.",
        trend: "down",
        change: "-23%",
        category: "Market Trend"
      },
      {
        id: 3,
        title: "Mobile Traffic Growth",
        description: "67% of domain views now come from mobile devices, up from 52% last quarter.",
        trend: "up",
        change: "+15%",
        category: "User Behavior"
      },
      {
        id: 4,
        title: "Weekend Activity Peak",
        description: "Domain inquiries are 34% higher on weekends, suggesting buyers browse during leisure time.",
        trend: "stable",
        change: "+34%",
        category: "User Behavior"
      }
    ],
    recommendations: [
      {
        id: 1,
        title: "Implement Dynamic Pricing",
        description: "Based on market analysis, implementing dynamic pricing could increase your revenue by 15-20%.",
        priority: "high",
        timeframe: "2-3 weeks",
        resources: "Development team required"
      },
      {
        id: 2,
        title: "Create Video Presentations",
        description: "Domains with video presentations receive 45% more serious inquiries than text-only listings.",
        priority: "medium",
        timeframe: "1 week",
        resources: "Video production tools"
      },
      {
        id: 3,
        title: "Set Up Email Automation",
        description: "Automated follow-up emails can increase conversion rates by 25% for interested buyers.",
        priority: "medium",
        timeframe: "3-5 days",
        resources: "Email marketing platform"
      },
      {
        id: 4,
        title: "Expand to International Markets",
        description: "Consider translating high-performing listings to target European and Asian markets.",
        priority: "low",
        timeframe: "1-2 months",
        resources: "Translation services"
      }
    ]
  };

  const tabs = [
    { id: 'opportunities', label: 'Opportunities', icon: 'Target' },
    { id: 'trends', label: 'Market Trends', icon: 'TrendingUp' },
    { id: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'ArrowUp';
      case 'down': return 'ArrowDown';
      default: return 'Minus';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Actionable Insights</h3>
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab?.id)}
              iconName={tab?.icon}
              iconPosition="left"
            >
              {tab?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            {insights?.opportunities?.map((opportunity) => (
              <div key={opportunity?.id} className="border border-border rounded-lg p-4 hover:shadow-card transition-smooth">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={opportunity?.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{opportunity?.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(opportunity?.impact)}`}>
                          {opportunity?.impact} impact
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{opportunity?.effort} effort</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-success">{opportunity?.estimatedIncrease}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{opportunity?.description}</p>
                <Button variant="outline" size="sm">
                  Take Action
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-4">
            {insights?.trends?.map((trend) => (
              <div key={trend?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{trend?.title}</h4>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full mt-1 inline-block">
                      {trend?.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name={getTrendIcon(trend?.trend)} size={16} className={getTrendColor(trend?.trend)} />
                    <span className={`text-sm font-medium ${getTrendColor(trend?.trend)}`}>
                      {trend?.change}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{trend?.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {insights?.recommendations?.map((recommendation) => (
              <div key={recommendation?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{recommendation?.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation?.priority)}`}>
                        {recommendation?.priority} priority
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{recommendation?.timeframe}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{recommendation?.description}</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Resources needed:</strong> {recommendation?.resources}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;