import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MultiChainBalances = ({ data, networkStats }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [priceView, setPriceView] = useState('usd'); // 'usd' or 'native'

  // Mock price data (in real app, this would come from an API)
  const prices = {
    ETH: 4125.50,
    MATIC: 0.85,
    SOL: 165.20,
    USDC: 1.00,
    USDT: 1.00
  };

  const networks = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      icon: 'Zap',
      color: 'bg-blue-500',
      nativeToken: 'ETH'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      icon: 'Triangle',
      color: 'bg-purple-500',
      nativeToken: 'MATIC'
    },
    {
      id: 'solana',
      name: 'Solana',
      icon: 'Sun',
      color: 'bg-green-500',
      nativeToken: 'SOL'
    }
  ];

  const getNetworkIcon = (networkId) => {
    return networks?.find(n => n?.id === networkId)?.icon || 'Globe';
  };

  const getNetworkColor = (networkId) => {
    return networks?.find(n => n?.id === networkId)?.color || 'bg-gray-500';
  };

  const calculateTokenValue = (amount, token) => {
    return (amount * (prices?.[token] || 0))?.toFixed(2);
  };

  const calculateNetworkTotal = (networkData) => {
    return Object.entries(networkData || {})?.reduce((total, [token, amount]) => {
      return total + parseFloat(calculateTokenValue(amount, token));
    }, 0);
  };

  const getTotalPortfolioValue = () => {
    if (!data) return 0;
    return Object.values(data)?.reduce((total, networkData) => {
      return total + calculateNetworkTotal(networkData);
    }, 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      healthy: 'text-green-600',
      congested: 'text-yellow-600',
      warning: 'text-orange-600',
      error: 'text-red-600'
    };
    return colors?.[status] || 'text-gray-600';
  };

  const filteredData = selectedNetwork === 'all' ? data : { [selectedNetwork]: data?.[selectedNetwork] };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Multi-Chain Balances</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time balances across all connected networks
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
            <p className="text-2xl font-bold text-foreground">
              ${getTotalPortfolioValue()?.toLocaleString()}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Icon name="RefreshCw" size={14} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      {/* Network Selector */}
      <div className="flex items-center space-x-2 mb-6">
        <Button
          variant={selectedNetwork === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedNetwork('all')}
        >
          All Networks
        </Button>
        {networks?.map((network) => (
          <Button
            key={network?.id}
            variant={selectedNetwork === network?.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedNetwork(network?.id)}
            className="flex items-center space-x-2"
          >
            <Icon name={network?.icon} size={14} />
            <span>{network?.name}</span>
          </Button>
        ))}
      </div>
      {/* Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(filteredData || {})?.map(([networkId, tokens]) => (
          <div key={networkId} className="space-y-4">
            {/* Network Header */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${getNetworkColor(networkId)} rounded-lg flex items-center justify-center`}>
                  <Icon name={getNetworkIcon(networkId)} size={16} color="white" />
                </div>
                <div>
                  <p className="font-medium text-foreground capitalize">{networkId}</p>
                  <p className="text-sm text-muted-foreground">
                    ${calculateNetworkTotal(tokens)?.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Network Status */}
              <div className="text-right">
                <p className={`text-xs font-medium ${getStatusColor(networkStats?.[networkId]?.status)}`}>
                  {networkStats?.[networkId]?.status || 'unknown'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Gas: {networkStats?.[networkId]?.gasPrice || 'N/A'}
                </p>
              </div>
            </div>

            {/* Token Balances */}
            <div className="space-y-3">
              {Object.entries(tokens || {})?.map(([token, amount]) => (
                <div
                  key={token}
                  className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-foreground">
                        {token?.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{token}</p>
                      <p className="text-sm text-muted-foreground">
                        {amount} {token}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      ${calculateTokenValue(amount, token)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @${prices?.[token]?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Icon name="ArrowUpRight" size={14} className="mr-2" />
                Send
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Icon name="ArrowDownLeft" size={14} className="mr-2" />
                Receive
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Icon name="Repeat" size={14} className="mr-2" />
                Swap
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Price Feed Status */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Real-time Price Feeds Active
              </p>
              <p className="text-xs text-muted-foreground">
                Powered by decentralized oracle networks
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Icon name="ExternalLink" size={14} className="mr-2" />
            View Source
          </Button>
        </div>
      </div>
      {/* Gas Fee Tracker */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {networks?.map((network) => (
          <div key={network?.id} className="p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name={network?.icon} size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{network?.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {networkStats?.[network?.id]?.gasPrice || 'N/A'}
                </p>
                <p className={`text-xs ${getStatusColor(networkStats?.[network?.id]?.status)}`}>
                  {networkStats?.[network?.id]?.status || 'unknown'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiChainBalances;