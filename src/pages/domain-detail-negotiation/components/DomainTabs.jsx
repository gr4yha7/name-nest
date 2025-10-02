import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { formatDistance, parseISO } from 'date-fns';
import { formatUnits } from 'ethers';
import { shortenAddress } from 'utils/cn';

const DomainTabs = ({ domain, domainD, activities }) => {
  const [activeTab, setActiveTab] = useState('history');

  const tabs = [
    { id: 'history', label: 'Activities', icon: 'Clock' },
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

  const returnActivityName = (activity) => {
    switch (activity?.type) {
      case 'MINTED':
        return 'Token Minted';
      case 'TRANSFERRED':
        return 'Token Transferred';
      case 'LISTED':
        return 'Token Listed';
      case 'OFFER_RECEIVED':
        return 'Offer Received';
      case 'LISTING_CANCELLED':
        return 'Token Delisted';
      case 'BOUGHT_OUT':
        return 'Token Bought Out';
      case 'PURCHASED':
        return 'Token Purcased';
      case 'OFFER_CANCELLED':
        return 'Offer Cancelled';
      case 'OWNER_CHANGED':
        return 'Owner Changed';
      case 'FRACTIONALIZED':
        return 'Token Fractionalized';
  }
  }

  // const renderOverview = () => (
  //   <div className="space-y-6">
  //     {/* Domain Statistics */}
  //     <div>
  //       <h4 className="text-lg font-semibold text-foreground mb-4">Domain Statistics</h4>
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //         <div className="bg-muted rounded-lg p-4">
  //           <div className="flex items-center space-x-2 mb-2">
  //             <Icon name="Globe" size={16} color="var(--color-primary)" />
  //             <span className="text-sm font-medium text-foreground">Domain Authority</span>
  //           </div>
  //           <div className="text-2xl font-bold text-foreground">{domain?.domainAuthority}</div>
  //           <div className="text-sm text-success">+5 this month</div>
  //         </div>
  //         <div className="bg-muted rounded-lg p-4">
  //           <div className="flex items-center space-x-2 mb-2">
  //             <Icon name="Users" size={16} color="var(--color-secondary)" />
  //             <span className="text-sm font-medium text-foreground">Monthly Visitors</span>
  //           </div>
  //           <div className="text-2xl font-bold text-foreground">{domain?.monthlyTraffic}</div>
  //           <div className="text-sm text-success">+12% this month</div>
  //         </div>
  //         <div className="bg-muted rounded-lg p-4">
  //           <div className="flex items-center space-x-2 mb-2">
  //             <Icon name="Link" size={16} color="var(--color-accent)" />
  //             <span className="text-sm font-medium text-foreground">Backlinks</span>
  //           </div>
  //           <div className="text-2xl font-bold text-foreground">{formatNumber(domain?.backlinks)}</div>
  //           <div className="text-sm text-success">+234 this month</div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Traffic Sources */}
  //     <div>
  //       <h4 className="text-lg font-semibold text-foreground mb-4">Traffic Sources</h4>
  //       <div className="space-y-3">
  //         {domain?.trafficSources?.map((source, index) => (
  //           <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
  //             <div className="flex items-center space-x-3">
  //               <Icon name={source?.icon} size={16} />
  //               <span className="font-medium text-foreground">{source?.name}</span>
  //             </div>
  //             <div className="text-right">
  //               <div className="font-semibold text-foreground">{source?.percentage}%</div>
  //               <div className="text-sm text-muted-foreground">{formatNumber(source?.visitors)} visitors</div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {/* Valuation Estimates */}
  //     <div>
  //       <h4 className="text-lg font-semibold text-foreground mb-4">Valuation Estimates</h4>
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //         {domain?.valuationEstimates?.map((estimate, index) => (
  //           <div key={index} className="bg-muted rounded-lg p-4">
  //             <div className="flex items-center justify-between mb-2">
  //               <span className="font-medium text-foreground">{estimate?.source}</span>
  //               <span className="text-sm text-muted-foreground">{estimate?.confidence} confidence</span>
  //             </div>
  //             <div className="text-xl font-bold text-foreground">{formatPrice(estimate?.value)}</div>
  //             <div className="text-sm text-muted-foreground">Updated {estimate?.lastUpdated}</div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );

  const renderHistory = () => (
    <div className="space-y-6">
      {/* Ownership Timeline */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <span className="text-lg font-semibold text-foreground">
              Activity Timeline ({activities?.items?.length || 0})
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left">
                    <span className="text-sm font-medium text-foreground">Type</span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-sm font-medium text-foreground">Domain</span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-sm font-medium text-foreground">Details</span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-sm font-medium text-foreground">Amount</span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-sm font-medium text-foreground">Transaction</span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-sm font-medium text-foreground">Time</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities?.items?.map((event, index) => {
                  const getActivityIcon = (type) => {
                    switch (type) {
                      case 'PURCHASED': return 'DollarSign';
                      case 'TRANSFERRED': return 'ArrowRightLeft';
                      case 'OFFER_CANCELLED': return 'X';
                      case 'LISTING_CANCELLED': return 'X';
                      case 'MINTED': return 'Plus';
                      default: return 'Activity';
                    }
                  };

                  const getActivityColor = (type) => {
                    switch (type) {
                      case 'PURCHASED': return 'text-success';
                      case 'TRANSFERRED': return 'text-primary';
                      case 'OFFER_CANCELLED': return 'text-warning';
                      case 'LISTING_CANCELLED': return 'text-warning';
                      case 'MINTED': return 'text-info';
                      default: return 'text-muted-foreground';
                    }
                  };

                  return (
                    <tr
                      key={index}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon name={getActivityIcon(event.type)} size={16} className={getActivityColor(event.type)} />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{returnActivityName(event)}</div>
                            <div className="text-xs text-muted-foreground">{event.chain.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-foreground">{event.name}</div>
                          <div className="text-xs text-muted-foreground">Token ID: {event.tokenId.slice(0, 8)}...</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {event.reason && (
                            <div>Reason: {event.reason.replace('_', ' ').toLowerCase()}</div>
                          )}
                          {event.buyer && (
                            <div>Buyer: {shortenAddress(event.buyer)}</div>
                          )}
                          {event.seller && (
                            <div>Seller: {shortenAddress(event.seller)}</div>
                          )}
                          {event.transferredTo && (
                            <div>To: {shortenAddress(event.transferredTo)}</div>
                          )}
                          {event.transferredFrom && (
                            <div>From: {shortenAddress(event.transferredFrom)}</div>
                          )}
                          {event.owner && (
                            <div>Owner: {shortenAddress(event.owner)}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {event.payment ? (
                          <div>
                            <div className="font-medium text-foreground">
                              {formatUnits(event.payment.price, (event.payment.currencySymbol === "USDC" ? 6 : 18))} {event.payment.currencySymbol}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${event.payment.usdValue?.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">-</div>
                        )}
                      </td>
                      <td className="p-4">
                        {event.txHash ? (
                          <div className="flex items-center space-x-2">
                            <Icon name="ExternalLink" size={14} className="text-muted-foreground" />
                            <a
                              href={`${event.chain.addressUrlTemplate?.replace(':address', event.txHash)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {shortenAddress(event.txHash)}
                            </a>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">-</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {formatDistance(parseISO(event.createdAt), new Date(), { addSuffix: true })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {(!activities?.items || activities.items.length === 0) && (
            <div className="p-8 text-center">
              <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activity found</p>
            </div>
          )}
        </div>

      {/* Price History */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Price History</h4>
        <div className="space-y-3">
          {domainD?.tokens[0]?.listings.map((listing, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium text-foreground">{formatUnits(listing?.price, listing?.currency?.decimals)} {listing?.currency?.symbol}</div>
                <div className="text-sm text-muted-foreground">{formatDistance(parseISO(listing?.createdAt), new Date(), { addSuffix: true })}</div>
              </div>
              <div className="text-right">
                {/* <div className={`text-sm font-medium ${price?.change > 0 ? 'text-success' : price?.change < 0 ? 'text-error' : 'text-muted-foreground'}`}>
                  {price?.change > 0 ? '+' : ''}{price?.change}%
                </div> */}
                <div className="text-sm text-muted-foreground">USD Exchange Rate: {listing?.currency?.usdExchangeRate.toFixed(2)}USD</div>
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
      <div className='hidden'>
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
        {/* {activeTab === 'overview' && renderOverview()} */}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default DomainTabs;