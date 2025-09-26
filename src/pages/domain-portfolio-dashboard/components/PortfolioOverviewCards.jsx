import React from 'react';
import Icon from '../../../components/AppIcon';
import { getDomainsWithActiveOffers, getTotalActiveOffersCount } from 'utils/cn';

const PortfolioOverviewCards = ({ data, domains }) => {
  const cards = [
    {
      title: 'Total Domains',
      value: domains?.length || 0,
      icon: 'Globe',
      trend: '+12',
      trendLabel: 'This month',
      color: 'bg-blue-500'
    },
    // {
    //   title: 'Portfolio Value (ETH)',
    //   value: `${data?.portfolioValueETH || 0} ETH`,
    //   icon: 'TrendingUp',
    //   trend: '+8.2%',
    //   trendLabel: 'vs last month',
    //   color: 'bg-green-500'
    // },
    {
      title: 'Active Offers Count',
      value: `${(getTotalActiveOffersCount(domains) || 0)?.toLocaleString()}`,
      icon: 'DollarSign',
      trend: '+15.3%',
      trendLabel: 'vs last month',
      color: 'bg-purple-500'
    },
    {
      title: 'Active Listings',
      value: getDomainsWithActiveOffers(domains) || 0,
      icon: 'ShoppingCart',
      trend: '+5',
      trendLabel: 'This week',
      color: 'bg-orange-500'
    },
    // {
    //   title: 'Recent Activity',
    //   value: `${data?.recentSales || 0} sales`,
    //   icon: 'Activity',
    //   trend: '+3',
    //   trendLabel: 'This week',
    //   color: 'bg-red-500'
    // },
    // {
    //   title: 'Monthly ROI',
    //   value: `${data?.monthlyROI || 0}%`,
    //   icon: 'Percent',
    //   trend: '+2.1%',
    //   trendLabel: 'vs last month',
    //   color: 'bg-teal-500'
    // }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards?.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${card?.color} flex items-center justify-center`}>
              <Icon name={card?.icon} size={20} color="white" />
            </div>
            <div className="text-right">
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {card?.trend}
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            {card?.title}
          </h3>
          <p className="text-2xl font-bold text-foreground mb-2">
            {card?.value}
          </p>
          <p className="text-xs text-muted-foreground">
            {card?.trendLabel}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PortfolioOverviewCards;