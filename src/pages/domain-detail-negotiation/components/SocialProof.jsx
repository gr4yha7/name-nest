import React from 'react';
import Icon from '../../../components/AppIcon';

const SocialProof = ({ domain }) => {
  const trustBadges = [
    {
      icon: 'Shield',
      label: 'Verified Seller',
      description: 'Identity verified by NameNest',
      color: 'text-success'
    },
    {
      icon: 'Lock',
      label: 'Escrow Protected',
      description: 'Secure transaction guarantee',
      color: 'text-primary'
    },
    {
      icon: 'Award',
      label: 'Premium Domain',
      description: 'High-value domain classification',
      color: 'text-warning'
    },
    {
      icon: 'Zap',
      label: 'Fast Transfer',
      description: 'Quick domain transfer process',
      color: 'text-accent'
    }
  ];

  const recentActivity = [
    {
      type: 'view',
      count: 47,
      timeframe: 'last 24 hours',
      icon: 'Eye'
    },
    {
      type: 'inquiry',
      count: 12,
      timeframe: 'this week',
      icon: 'MessageCircle'
    },
    {
      type: 'favorite',
      count: 23,
      timeframe: 'this month',
      icon: 'Heart'
    }
  ];

  const testimonials = [
    {
      id: 1,
      author: 'Sarah Johnson',
      role: 'Startup Founder',
      content: 'Excellent domain with great SEO potential. The seller was very professional and the transfer was smooth.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      author: 'Michael Chen',
      role: 'Digital Marketer',
      content: 'Perfect domain for our new campaign. Great traffic stats and the analytics provided were very detailed.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <div className="bg-card border border-border rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Trust & Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trustBadges?.map((badge, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className={`w-10 h-10 rounded-full bg-background flex items-center justify-center ${badge?.color}`}>
                <Icon name={badge?.icon} size={20} />
              </div>
              <div>
                <div className="font-medium text-foreground">{badge?.label}</div>
                <div className="text-sm text-muted-foreground">{badge?.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Seller Reputation */}
      <div className="bg-card border border-border rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Seller Reputation</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={24} color="white" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{domain?.seller?.name}</div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={14}
                    color={i < Math.floor(domain?.seller?.rating) ? "#F59E0B" : "#E5E7EB"}
                    className={i < Math.floor(domain?.seller?.rating) ? "fill-current" : ""}
                  />
                ))}
                <span className="ml-1 font-medium">{domain?.seller?.rating}</span>
              </div>
              <span>•</span>
              <span>{formatNumber(domain?.seller?.totalSales)} successful sales</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">{domain?.seller?.yearsActive}</div>
            <div className="text-sm text-muted-foreground">Years Active</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">{domain?.seller?.responseTime}</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">{domain?.seller?.completionRate}%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name={activity?.icon} size={16} color="var(--color-primary)" />
                <div>
                  <div className="font-medium text-foreground">
                    {formatNumber(activity?.count)} {activity?.type}s
                  </div>
                  <div className="text-sm text-muted-foreground">{activity?.timeframe}</div>
                </div>
              </div>
              <div className="text-sm text-success font-medium">
                {activity?.type === 'view' ? '+15%' : activity?.type === 'inquiry' ? '+8%' : '+12%'}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Testimonials */}
      <div className="bg-card border border-border rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">What Buyers Say</h3>
        <div className="space-y-4">
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="p-4 bg-muted rounded-lg">
              <div className="flex items-start space-x-3 mb-3">
                <img
                  src={testimonial?.avatar}
                  alt={testimonial?.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-foreground">{testimonial?.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial?.role}</div>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(testimonial?.rating)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={12}
                        color="#F59E0B"
                        className="fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground">{testimonial?.content}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Market Comparison */}
      <div className="bg-card border border-border rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Market Position</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price vs Similar Domains</span>
            <span className="text-sm font-medium text-success">15% below average</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-success h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>Market Average</span>
            <span>High</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingDown" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-success">Great Value</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            This domain is priced competitively compared to similar domains in the market.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;