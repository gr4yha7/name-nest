import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SmartContractIntegration = () => {
  const [activeContracts, setActiveContracts] = useState([
    {
      id: 1,
      address: '0x1234...5678',
      type: 'Domain Registry',
      network: 'ethereum',
      status: 'active',
      gasUsed: '245,000',
      lastActivity: '2024-08-20T10:30:00Z'
    },
    {
      id: 2,
      address: '0x9abc...def0',
      type: 'Royalty Distribution',
      network: 'polygon',
      status: 'active',
      gasUsed: '89,000',
      lastActivity: '2024-08-19T15:20:00Z'
    },
    {
      id: 3,
      address: '0x4567...8901',
      type: 'Escrow Manager',
      network: 'ethereum',
      status: 'pending',
      gasUsed: '156,000',
      lastActivity: '2024-08-18T09:45:00Z'
    }
  ]);

  const [recentTransfers, setRecentTransfers] = useState([
    {
      id: 1,
      domain: 'crypto-future.eth',
      from: '0x1234...5678',
      to: '0x9abc...def0',
      txHash: '0xabcd...1234',
      timestamp: '2024-08-20T14:30:00Z',
      status: 'confirmed',
      network: 'ethereum'
    },
    {
      id: 2,
      domain: 'defi-token.sol',
      from: '0x5678...9012',
      to: '0x3456...7890',
      txHash: '0xefgh...5678',
      timestamp: '2024-08-19T11:15:00Z',
      status: 'confirmed',
      network: 'solana'
    }
  ]);

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
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-800';
  };

  const formatAddress = (address) => {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleString();
  };

  return (
    <div className="grid hidden grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Smart Contract Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Smart Contract Status
          </h3>
          <Button variant="outline" size="sm">
            <Icon name="Settings" size={14} className="mr-2" />
            Manage Contracts
          </Button>
        </div>

        <div className="space-y-4">
          {activeContracts?.map((contract) => (
            <div
              key={contract?.id}
              className="p-4 bg-muted/30 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={getNetworkIcon(contract?.network)} size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {contract?.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatAddress(contract?.address)}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    contract?.status
                  )}`}
                >
                  {contract?.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Gas: {contract?.gasUsed}</span>
                  <span>Network: {contract?.network}</span>
                </div>
                <span>{formatTime(contract?.lastActivity)}</span>
              </div>

              <div className="mt-3 flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Icon name="ExternalLink" size={12} className="mr-1" />
                  View on Explorer
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Icon name="Copy" size={12} className="mr-1" />
                  Copy Address
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Automated Royalty Distribution
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Next payout scheduled for Aug 25, 2024 • Estimated: 0.25 ETH
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Transfer History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Transfer History
          </h3>
          <Button variant="outline" size="sm">
            <Icon name="History" size={14} className="mr-2" />
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {recentTransfers?.map((transfer) => (
            <div
              key={transfer?.id}
              className="p-4 bg-muted/30 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {transfer?.domain}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Icon name={getNetworkIcon(transfer?.network)} size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground capitalize">
                      {transfer?.network}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    transfer?.status
                  )}`}
                >
                  {transfer?.status}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                <span>{formatAddress(transfer?.from)}</span>
                <Icon name="ArrowRight" size={12} />
                <span>{formatAddress(transfer?.to)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span>Tx: {formatAddress(transfer?.txHash)}</span>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    <Icon name="ExternalLink" size={10} />
                  </Button>
                </div>
                <span>{formatTime(transfer?.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={14} className="text-green-600" />
              <span className="text-foreground">Ownership Verification</span>
            </div>
            <span className="text-green-600 font-medium">✓ All Verified</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All domain ownership records are verified on-chain with digital signatures
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartContractIntegration;