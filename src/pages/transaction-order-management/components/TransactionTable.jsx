import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionTable = ({ transactions, onRowExpand, expandedRows, onStatusUpdate }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = [...transactions]?.sort((a, b) => {
    if (sortConfig?.key === 'amount') {
      return sortConfig?.direction === 'asc' 
        ? parseFloat(a?.amount) - parseFloat(b?.amount)
        : parseFloat(b?.amount) - parseFloat(a?.amount);
    }
    
    if (sortConfig?.key === 'date') {
      return sortConfig?.direction === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    
    const aValue = a?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    const bValue = b?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    
    if (sortConfig?.direction === 'asc') {
      return aValue?.localeCompare(bValue);
    }
    return bValue?.localeCompare(aValue);
  });

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-warning text-warning-foreground',
      'completed': 'bg-success text-success-foreground',
      'disputed': 'bg-error text-error-foreground',
      'in_escrow': 'bg-secondary text-secondary-foreground',
      'awaiting_signature': 'bg-accent text-accent-foreground'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': 'Clock',
      'completed': 'CheckCircle',
      'disputed': 'AlertTriangle',
      'in_escrow': 'Shield',
      'awaiting_signature': 'FileSignature'
    };
    return icons?.[status] || 'Circle';
  };

  const formatAmount = (amount, currency) => {
    if (currency === 'ETH') {
      return `${parseFloat(amount)?.toFixed(4)} ETH`;
    }
    return `$${parseFloat(amount)?.toLocaleString()}`;
  };

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center space-x-1 text-left font-medium text-foreground hover:text-primary transition-standard"
    >
      <span>{children}</span>
      <Icon 
        name={sortConfig?.key === column 
          ? (sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown')
          : 'ChevronsUpDown'
        } 
        size={14} 
      />
    </button>
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 text-left">
                <SortButton column="id">Transaction ID</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton column="domain">Domain</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton column="type">Type</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton column="participant">Participant</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton column="amount">Amount</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton column="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton column="date">Date</SortButton>
              </th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTransactions?.map((transaction) => (
              <React.Fragment key={transaction?.id}>
                <tr className="hover:bg-muted/50 transition-standard">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm text-primary">
                        #{transaction?.id}
                      </span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onRowExpand(transaction?.id)}
                      >
                        <Icon 
                          name={expandedRows?.includes(transaction?.id) ? 'ChevronUp' : 'ChevronDown'} 
                          size={14} 
                        />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="Globe" size={16} className="text-muted-foreground" />
                      <span className="font-medium">{transaction?.domain}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction?.type === 'sale' ?'bg-success/10 text-success' :'bg-primary/10 text-primary'
                    }`}>
                      <Icon 
                        name={transaction?.type === 'sale' ? 'TrendingUp' : 'TrendingDown'} 
                        size={12} 
                        className="mr-1" 
                      />
                      {transaction?.type === 'sale' ? 'Sale' : 'Purchase'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <Icon name="User" size={12} />
                      </div>
                      <span className="text-sm">{transaction?.participant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">
                      {formatAmount(transaction?.amount, transaction?.currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                      <Icon name={getStatusIcon(transaction?.status)} size={12} className="mr-1" />
                      {transaction?.status?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(transaction.date)?.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="xs">
                        <Icon name="Eye" size={14} />
                      </Button>
                      <Button variant="ghost" size="xs">
                        <Icon name="ExternalLink" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedRows?.includes(transaction?.id) && (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 bg-muted/30">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-sm text-foreground mb-2">Blockchain Details</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">Hash:</span>
                                <span className="font-mono text-xs bg-background px-2 py-1 rounded">
                                  {transaction?.txHash}
                                </span>
                                <Button variant="ghost" size="xs">
                                  <Icon name="Copy" size={12} />
                                </Button>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">Confirmations:</span>
                                <span className="text-success font-medium">{transaction?.confirmations}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm text-foreground mb-2">Escrow Status</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">Service:</span>
                                <span>{transaction?.escrowService}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">Fee:</span>
                                <span>{transaction?.escrowFee}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm text-foreground mb-2">Timeline</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{new Date(transaction.createdAt)?.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">Updated:</span>
                                <span>{new Date(transaction.updatedAt)?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2 border-t border-border">
                          <Button variant="outline" size="sm">
                            <Icon name="MessageSquare" size={14} />
                            <span className="ml-2">Contact Participant</span>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Icon name="Download" size={14} />
                            <span className="ml-2">Download Receipt</span>
                          </Button>
                          {transaction?.status === 'disputed' && (
                            <Button variant="destructive" size="sm">
                              <Icon name="AlertTriangle" size={14} />
                              <span className="ml-2">View Dispute</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedTransactions?.map((transaction) => (
          <div key={transaction?.id} className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm text-primary">#{transaction?.id}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  transaction?.type === 'sale' ?'bg-success/10 text-success' :'bg-primary/10 text-primary'
                }`}>
                  {transaction?.type === 'sale' ? 'Sale' : 'Purchase'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onRowExpand(transaction?.id)}
              >
                <Icon 
                  name={expandedRows?.includes(transaction?.id) ? 'ChevronUp' : 'ChevronDown'} 
                  size={16} 
                />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="Globe" size={16} className="text-muted-foreground" />
                <span className="font-medium">{transaction?.domain}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-semibold">
                  {formatAmount(transaction?.amount, transaction?.currency)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                  <Icon name={getStatusIcon(transaction?.status)} size={12} className="mr-1" />
                  {transaction?.status?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="text-sm">{new Date(transaction.date)?.toLocaleDateString()}</span>
              </div>
            </div>
            
            {expandedRows?.includes(transaction?.id) && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Participant:</span>
                    <p className="font-medium">{transaction?.participant}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Confirmations:</span>
                    <p className="text-success font-medium">{transaction?.confirmations}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" fullWidth>
                    <Icon name="Eye" size={14} />
                    <span className="ml-2">View Details</span>
                  </Button>
                  <Button variant="outline" size="sm" fullWidth>
                    <Icon name="ExternalLink" size={14} />
                    <span className="ml-2">Blockchain</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTable;