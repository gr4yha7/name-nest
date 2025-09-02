import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TransactionFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onExport 
}) => {
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'sale', label: 'Sales' },
    { value: 'purchase', label: 'Purchases' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'disputed', label: 'Disputed' },
    { value: 'in_escrow', label: 'In Escrow' },
    { value: 'awaiting_signature', label: 'Awaiting Signature' }
  ];

  const currencyOptions = [
    { value: 'all', label: 'All Currencies' },
    { value: 'USD', label: 'USD' },
    { value: 'ETH', label: 'ETH' },
    { value: 'BTC', label: 'BTC' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value !== 'all' && value !== '' && value !== null
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
            >
              <Icon name="X" size={14} />
              <span className="ml-2">Clear All</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
          >
            <Icon name="Download" size={14} />
            <span className="ml-2">Export</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Transaction Type"
          options={typeOptions}
          value={filters?.type}
          onChange={(value) => handleFilterChange('type', value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          label="Currency"
          options={currencyOptions}
          value={filters?.currency}
          onChange={(value) => handleFilterChange('currency', value)}
        />

        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />
      </div>
      {/* Custom Date Range */}
      {filters?.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Start Date"
            type="date"
            value={filters?.startDate}
            onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={filters?.endDate}
            onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Search Domain"
          type="search"
          placeholder="Enter domain name..."
          value={filters?.domain}
          onChange={(e) => handleFilterChange('domain', e?.target?.value)}
        />

        <Input
          label="Min Amount"
          type="number"
          placeholder="0.00"
          value={filters?.minAmount}
          onChange={(e) => handleFilterChange('minAmount', e?.target?.value)}
        />

        <Input
          label="Max Amount"
          type="number"
          placeholder="1000000.00"
          value={filters?.maxAmount}
          onChange={(e) => handleFilterChange('maxAmount', e?.target?.value)}
        />
      </div>
      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground mr-2">Quick filters:</span>
        <Button
          variant={filters?.status === 'pending' ? 'default' : 'outline'}
          size="xs"
          onClick={() => handleFilterChange('status', filters?.status === 'pending' ? 'all' : 'pending')}
        >
          Pending Only
        </Button>
        <Button
          variant={filters?.type === 'sale' ? 'default' : 'outline'}
          size="xs"
          onClick={() => handleFilterChange('type', filters?.type === 'sale' ? 'all' : 'sale')}
        >
          Sales Only
        </Button>
        <Button
          variant={filters?.dateRange === 'month' ? 'default' : 'outline'}
          size="xs"
          onClick={() => handleFilterChange('dateRange', filters?.dateRange === 'month' ? 'all' : 'month')}
        >
          This Month
        </Button>
        <Button
          variant={filters?.currency === 'ETH' ? 'default' : 'outline'}
          size="xs"
          onClick={() => handleFilterChange('currency', filters?.currency === 'ETH' ? 'all' : 'ETH')}
        >
          ETH Only
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;