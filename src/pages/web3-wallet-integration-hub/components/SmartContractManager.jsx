import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SmartContractManager = () => {
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      contract: 'Domain Registry',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      permissions: ['Transfer', 'List', 'Update Metadata'],
      spendingLimit: 'Unlimited',
      network: 'ethereum',
      lastUsed: '2024-08-20T10:30:00Z',
      status: 'active',
      risk: 'low'
    },
    {
      id: 2,
      contract: 'Uniswap V3 Router',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      permissions: ['Swap Tokens', 'Add Liquidity'],
      spendingLimit: '1,000 USDC',
      network: 'ethereum',
      lastUsed: '2024-08-19T15:20:00Z',
      status: 'active',
      risk: 'medium'
    },
    {
      id: 3,
      contract: 'OpenSea Registry',
      address: '0x567890abcdef1234567890abcdef1234567890ab',
      permissions: ['List NFTs', 'Transfer'],
      spendingLimit: 'Unlimited',
      network: 'polygon',
      lastUsed: '2024-08-15T09:45:00Z',
      status: 'inactive',
      risk: 'high'
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

  const getRiskColor = (risk) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-red-600 bg-red-100'
    };
    return colors?.[risk] || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 bg-green-100',
      inactive: 'text-gray-600 bg-gray-100',
      revoked: 'text-red-600 bg-red-100'
    };
    return colors?.[status] || 'text-gray-600 bg-gray-100';
  };

  const formatAddress = (address) => {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const handleRevokePermission = (id) => {
    setApprovals(prev =>
      prev?.map(approval =>
        approval?.id === id
          ? { ...approval, status: 'revoked' }
          : approval
      )
    );
  };

  const handleUpdateLimit = (id, newLimit) => {
    setApprovals(prev =>
      prev?.map(approval =>
        approval?.id === id
          ? { ...approval, spendingLimit: newLimit }
          : approval
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Smart Contract Management
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage approved contracts and spending permissions
            </p>
          </div>
          <Button>
            <Icon name="Shield" size={16} className="mr-2" />
            Security Scan
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground">{approvals?.length}</p>
            <p className="text-sm text-muted-foreground">Total Approvals</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">
              {approvals?.filter(a => a?.status === 'active')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">
              {approvals?.filter(a => a?.risk === 'high')?.length}
            </p>
            <p className="text-sm text-muted-foreground">High Risk</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {approvals?.filter(a => a?.spendingLimit === 'Unlimited')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Unlimited</p>
          </div>
        </div>
      </div>
      {/* Approvals List */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4">
          Contract Approvals
        </h4>
        
        <div className="space-y-4">
          {approvals?.map((approval) => (
            <div
              key={approval?.id}
              className="p-4 bg-background border border-border rounded-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{approval?.contract}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Icon name={getNetworkIcon(approval?.network)} size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground capitalize">
                        {approval?.network}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatAddress(approval?.address)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(approval?.risk)}`}>
                    {approval?.risk} risk
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval?.status)}`}>
                    {approval?.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Permissions</p>
                  <div className="flex flex-wrap gap-1">
                    {approval?.permissions?.map((permission, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-xs text-foreground rounded"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Spending Limit</p>
                  <p className="text-sm font-medium text-foreground">
                    {approval?.spendingLimit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Last Used</p>
                  <p className="text-sm text-foreground">
                    {new Date(approval.lastUsed)?.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Icon name="ExternalLink" size={14} className="mr-2" />
                    View Contract
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Copy" size={14} className="mr-2" />
                    Copy Address
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newLimit = prompt('Enter new spending limit:');
                      if (newLimit) handleUpdateLimit(approval?.id, newLimit);
                    }}
                  >
                    <Icon name="Edit" size={14} className="mr-2" />
                    Edit Limit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRevokePermission(approval?.id)}
                    disabled={approval?.status === 'revoked'}
                  >
                    <Icon name="Trash2" size={14} className="mr-2" />
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Recommendations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4">
          Security Recommendations
        </h4>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={16} className="text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  High Risk Contract Detected
                </p>
                <p className="text-xs text-red-600 mt-1">
                  OpenSea Registry has unlimited spending permission. Consider setting a spending limit.
                </p>
                <Button variant="ghost" size="sm" className="mt-2 text-red-600 hover:text-red-700">
                  Review Permission
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Clock" size={16} className="text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Unused Approvals
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  You have contracts that haven't been used in over 30 days. Consider revoking unused permissions.
                </p>
                <Button variant="ghost" size="sm" className="mt-2 text-yellow-600 hover:text-yellow-700">
                  Review Inactive
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={16} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Security Best Practices
                </p>
                <ul className="text-xs text-blue-600 mt-1 space-y-1">
                  <li>• Set spending limits for all contract approvals</li>
                  <li>• Regularly review and revoke unused permissions</li>
                  <li>• Use multi-signature wallets for high-value transactions</li>
                  <li>• Enable transaction notifications for all approvals</li>
                </ul>
                <Button variant="ghost" size="sm" className="mt-2 text-blue-600 hover:text-blue-700">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartContractManager;