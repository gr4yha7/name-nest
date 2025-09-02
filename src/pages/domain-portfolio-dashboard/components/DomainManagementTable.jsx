import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const DomainManagementTable = ({
  domains,
  selectedDomains,
  onSelectionChange,
  filters,
  onFilterChange
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const networkOptions = [
    { value: 'all', label: 'All Networks' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'solana', label: 'Solana' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'listed', label: 'Listed' },
    { value: 'holding', label: 'Holding' },
    { value: 'sold', label: 'Sold' },
    { value: 'transfer', label: 'In Transfer' }
  ];

  const performanceOptions = [
    { value: 'all', label: 'All Performance' },
    { value: 'positive', label: 'Positive ROI' },
    { value: 'negative', label: 'Negative ROI' },
    { value: 'break_even', label: 'Break Even' }
  ];

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
      listed: 'bg-blue-100 text-blue-800',
      holding: 'bg-gray-100 text-gray-800',
      sold: 'bg-green-100 text-green-800',
      transfer: 'bg-yellow-100 text-yellow-800'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange?.(domains?.map(domain => domain?.id));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectDomain = (domainId, checked) => {
    if (checked) {
      onSelectionChange?.([...selectedDomains, domainId]);
    } else {
      onSelectionChange?.(selectedDomains?.filter(id => id !== domainId));
    }
  };

  const sortedDomains = [...(domains || [])]?.sort((a, b) => {
    const aVal = a?.[sortField];
    const bVal = b?.[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aVal === 'string') {
      return aVal?.localeCompare(bVal) * modifier;
    }
    return (aVal - bVal) * modifier;
  });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">
            Domain Management
          </h3>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select
              value={filters?.network}
              onValueChange={(value) => onFilterChange?.({ network: value })}
              options={networkOptions}
              placeholder="Filter by network"
              className="w-40"
            />
            <Select
              value={filters?.status}
              onValueChange={(value) => onFilterChange?.({ status: value })}
              options={statusOptions}
              placeholder="Filter by status"
              className="w-40"
            />
            <Select
              value={filters?.performance}
              onValueChange={(value) => onFilterChange?.({ performance: value })}
              options={performanceOptions}
              placeholder="Filter by performance"
              className="w-48"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedDomains?.length === domains?.length && domains?.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th
                className="p-4 text-left cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">Domain</span>
                  {sortField === 'name' && (
                    <Icon
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                      size={14}
                    />
                  )}
                </div>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Network</span>
              </th>
              <th
                className="p-4 text-left cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">Value</span>
                  {sortField === 'value' && (
                    <Icon
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                      size={14}
                    />
                  )}
                </div>
              </th>
              <th
                className="p-4 text-left cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('roi')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">ROI</span>
                  {sortField === 'roi' && (
                    <Icon
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                      size={14}
                    />
                  )}
                </div>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Last Activity</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDomains?.map((domain) => (
              <tr
                key={domain?.id}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedDomains?.includes(domain?.id)}
                    onCheckedChange={(checked) => handleSelectDomain(domain?.id, checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Globe" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{domain?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Acquired {formatDistanceToNow(new Date(domain.acquired))} ago
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getNetworkIcon(domain?.network)} size={16} />
                    <span className="text-sm capitalize text-foreground">
                      {domain?.network}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium text-foreground">
                    {domain?.value} ETH
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`text-sm font-medium ${
                      domain?.roi >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {domain?.roi >= 0 ? '+' : ''}{domain?.roi}%
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      domain?.status
                    )}`}
                  >
                    {domain?.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(domain.lastActivity))} ago
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="MoreVertical" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(!domains || domains?.length === 0) && (
        <div className="p-8 text-center">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No domains found</p>
        </div>
      )}
    </div>
  );
};

export default DomainManagementTable;