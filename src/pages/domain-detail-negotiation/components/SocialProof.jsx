import React from 'react';
import Icon from '../../../components/AppIcon';

const SocialProof = () => {
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

    </div>
  );
};

export default SocialProof;