import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TransactionHistory = ({ transactions, detailed = false }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  const filterOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'domain', label: 'Domain Related' },
    { value: 'swap', label: 'Token Swaps' },
    { value: 'transfer', label: 'Transfers' },
    { value: 'contract', label: 'Smart Contracts' }
  ];

  const getTransactionIcon = (type) => {
    const icons = {
      'Domain Purchase': 'Globe',
      'Domain Sale': 'ShoppingCart',
      'Token Swap': 'Repeat',
      'Transfer': 'ArrowUpRight',
      'Smart Contract': 'FileText',
      'Approval': 'Check'
    };
    return icons?.[type] || 'Activity';
  };

  const getNetworkIcon = (network) => {
    const icons = {
      ethereum: 'Zap',
      polygon: 'Triangle',
      solana: 'Sun'
    };
    return icons?.[network] || 'Globe';
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-800';
  };

  const formatHash = (hash) => {
    return `${hash?.slice(0, 6)}...${hash?.slice(-4)}`;
  };

  const mockTransactions = detailed ? [
    {
      id: 1,
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      type: 'Domain Purchase',
      amount: '2.5 ETH',
      network: 'ethereum',
      status: 'confirmed',
      timestamp: '2024-08-20T14:30:00Z',
      gasUsed: '245,000',
      gasFee: '0.012 ETH',
      details: 'crypto-future.eth'
    },
    {
      id: 2,
      hash: '0xabcdef1234567890abcdef1234567890abcdef12',
      type: 'Token Swap',
      amount: '500 USDC → 0.3 ETH',
      network: 'polygon',
      status: 'confirmed',
      timestamp: '2024-08-19T11:15:00Z',
      gasUsed: '89,000',
      gasFee: '0.02 MATIC',
      details: 'Uniswap V3'
    },
    {
      id: 3,
      hash: '0x567890abcdef1234567890abcdef1234567890ab',
      type: 'Domain Sale',
      amount: '5.2 ETH',
      network: 'ethereum',
      status: 'confirmed',
      timestamp: '2024-08-18T09:45:00Z',
      gasUsed: '198,000',
      gasFee: '0.009 ETH',
      details: 'ai-domains.eth'
    },
    {
      id: 4,
      hash: '0x890abcdef1234567890abcdef1234567890abcdef',
      type: 'Transfer',
      amount: '100 SOL',
      network: 'solana',
      status: 'pending',
      timestamp: '2024-08-17T16:20:00Z',
      gasUsed: '5,000',
      gasFee: '0.00025 SOL',
      details: 'To: 8x7y9z...'
    }
  ] : transactions || [];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {detailed ? 'Complete Transaction History' : 'Recent Transactions'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Domain-related blockchain activity across all networks
          </p>
        </div>
        
        {detailed && (
          <div className="flex items-center space-x-3">
            <Select
              value={filter}
              onValueChange={setFilter}
              options={filterOptions}
              className="w-48"
            />
            <Button variant="outline" size="sm">
              <Icon name="Download" size={14} className="mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {mockTransactions?.map((tx) => (
          <div
            key={tx?.id}
            className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getTransactionIcon(tx?.type)} size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-foreground">{tx?.type}</p>
                    <div className="flex items-center space-x-1">
                      <Icon name={getNetworkIcon(tx?.network)} size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground capitalize">{tx?.network}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {tx?.details && `${tx?.details} • `}
                    {formatDistanceToNow(new Date(tx.timestamp))} ago
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Hash: {formatHash(tx?.hash)}</span>
                    {detailed && (
                      <>
                        <span>Gas: {tx?.gasUsed}</span>
                        <span>Fee: {tx?.gasFee}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-foreground mb-1">{tx?.amount}</p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    tx?.status
                  )}`}
                >
                  {tx?.status}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Icon name="ExternalLink" size={10} className="mr-1" />
                  View on Explorer
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Icon name="Copy" size={10} className="mr-1" />
                  Copy Hash
                </Button>
              </div>
              
              {tx?.status === 'pending' && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className="animate-spin rounded-full h-3 w-3 border border-yellow-500 border-t-transparent"></div>
                  <span>Confirming...</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {(!mockTransactions || mockTransactions?.length === 0) && (
        <div className="text-center py-8">
          <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No transactions found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your domain transactions will appear here
          </p>
        </div>
      )}
      {detailed && mockTransactions?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Showing 1-{mockTransactions?.length} of {mockTransactions?.length} transactions</span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" disabled>
                <Icon name="ChevronLeft" size={14} />
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <Icon name="ChevronRight" size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Transaction Summary */}
      {detailed && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-background border border-border rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <p className="text-lg font-semibold text-foreground">12.7 ETH</p>
            <p className="text-xs text-green-600">+2.3% this week</p>
          </div>
          <div className="p-3 bg-background border border-border rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Gas Fees Paid</p>
            <p className="text-lg font-semibold text-foreground">0.085 ETH</p>
            <p className="text-xs text-muted-foreground">$350 saved with batching</p>
          </div>
          <div className="p-3 bg-background border border-border rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-lg font-semibold text-foreground">98.5%</p>
            <p className="text-xs text-green-600">Above average</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;