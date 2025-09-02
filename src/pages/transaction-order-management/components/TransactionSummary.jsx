import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionSummary = ({ summary, recentActivity }) => {
  const summaryCards = [
    {
      title: 'Total Volume',
      value: `$${summary?.totalVolume?.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'text-success'
    },
    {
      title: 'Active Transactions',
      value: summary?.activeTransactions,
      change: '+3',
      changeType: 'positive',
      icon: 'Activity',
      color: 'text-primary'
    },
    {
      title: 'Completed This Month',
      value: summary?.completedThisMonth,
      change: '+8',
      changeType: 'positive',
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      title: 'Pending Actions',
      value: summary?.pendingActions,
      change: '-2',
      changeType: 'negative',
      icon: 'Clock',
      color: 'text-warning'
    }
  ];

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityIcon = (type) => {
    const icons = {
      'payment_received': 'DollarSign',
      'signature_pending': 'FileSignature',
      'dispute_opened': 'AlertTriangle',
      'transfer_completed': 'CheckCircle',
      'escrow_funded': 'Shield',
      'message_received': 'MessageSquare'
    };
    return icons?.[type] || 'Circle';
  };

  const getActivityColor = (type) => {
    const colors = {
      'payment_received': 'text-success',
      'signature_pending': 'text-warning',
      'dispute_opened': 'text-error',
      'transfer_completed': 'text-success',
      'escrow_funded': 'text-primary',
      'message_received': 'text-accent'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summaryCards?.map((card, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${card?.color}`}>
                  <Icon name={card?.icon} size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card?.title}</p>
                  <p className="text-xl font-semibold text-foreground">{card?.value}</p>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                card?.changeType === 'positive' ? 'text-success' : 'text-error'
              }`}>
                {card?.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <Button variant="ghost" size="sm">
              <Icon name="MoreHorizontal" size={16} />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity?.type)}`}>
                  <Icon name={getActivityIcon(activity?.type)} size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity?.title}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity?.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity?.timestamp)}
                    </span>
                    {activity?.domain && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-primary font-medium">
                          {activity?.domain}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {activity?.amount && (
                  <div className="text-sm font-medium text-foreground">
                    {activity?.amount}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" size="sm" fullWidth>
              <Icon name="Eye" size={14} />
              <span className="ml-2">View All Activity</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="Plus" size={14} />
            <span className="ml-2">Create New Listing</span>
          </Button>
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="MessageSquare" size={14} />
            <span className="ml-2">Contact Support</span>
          </Button>
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="FileText" size={14} />
            <span className="ml-2">Generate Report</span>
          </Button>
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="Settings" size={14} />
            <span className="ml-2">Transaction Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;