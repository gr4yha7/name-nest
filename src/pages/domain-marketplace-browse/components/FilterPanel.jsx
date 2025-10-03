import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange, isMobile = false }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const priceRanges = [
    { value: "0-500", label: "Under $500" },
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-2000", label: "$1,000 - $2,000" },
  { value: "2000-5000", label: "$2,000 - $5,000" },
  { value: "5000-1000000", label: "$5,000+" }
  ];

  const tldOptions = [
    { value: 'com', label: '.com' },
    { value: 'net', label: '.net' },
    { value: 'org', label: '.org' },
    { value: 'io', label: '.io' },
    { value: 'ai', label: '.ai' },
    { value: 'co', label: '.co' }
  ];

  const statuses = [
    { value: 'UNLISTED', label: 'Unlisted' },
    { value: 'OFFERS_RECEIVED', label: 'Offers Received' },
  ];

  const networkOptions = [
    { value: "eip155:97476", label: 'Doma Testnet' },
    { value: "eip155:84532", label: 'Base Testnet' },
    { value: "eip155:11155111", label: 'Sepolia Testnet' },
    { value: "eip155:1427", label: 'Ape Testnet' },
    { value: "eip155:43113", label: 'Avalanche' },
  ];

  const handleFilterChange = (key, value, secondValue) => {
    if (key !== "priceChange") {
      const updatedFilters = { ...localFilters, [key]: value };
      setLocalFilters(updatedFilters);
    } else {
      let updatedFilters = { ...localFilters, ["priceRangeMin"]: value, ["priceRangeMax"]: secondValue };
      setLocalFilters(updatedFilters);
    }
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    if (isMobile) {
      onClose();
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priceRange: 'all',
      tlds: [],
      categories: [],
      networks: [],
      keyword: '',
      listed: true,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters?.priceRange !== 'all') count++;
    if (localFilters?.networks?.length > 0) count++;
    if (localFilters?.keyword) count++;
    return count;
  };

  const panelContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Keyword Search */}
      <div>
        <Input
          label="Keyword Search"
          type="text"
          placeholder="Search in domain names..."
          value={localFilters?.keyword}
          onChange={(e) => handleFilterChange('keyword', e?.target?.value)}
        />
      </div>

      <div>
        <Input
          label="Min Offer (USD)"
          type="number"
          placeholder="Search in domain min usd offer..."
          value={localFilters?.offerMinUsd}
          onChange={(e) => handleFilterChange('offerMinUsd', e?.target?.value)}
        />
      </div>

      {/* Price Range */}
      <div>
        <Select
          label="Price Range"
          options={priceRanges}
          value={`${localFilters?.priceRangeMin}-${localFilters?.priceRangeMax}`}
          onChange={(value) => {
            // value will be like "2000-5000"
            const [min, max] = value.split("-").map(Number);
            handleFilterChange('priceChange', min, max)
          }}
        />
      </div>


      {/* TLD Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Top Level Domains
        </label>
        <div className="space-y-2">
          {tldOptions?.map((tld) => (
            <Checkbox
              key={tld?.value}
              label={tld?.label}
              checked={localFilters?.tlds?.includes(tld?.value)}
              onChange={(e) => {
                const updatedTlds = e?.target?.checked
                  ? [...localFilters?.tlds, tld?.value]
                  : localFilters?.tlds?.filter(t => t !== tld?.value);
                handleFilterChange('tlds', updatedTlds);
              }}
            />
          ))}
        </div>
      </div>

      {/* Networks */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Networks
        </label>
        <div className="space-y-2">
          {networkOptions?.map((network) => (
            <Checkbox
              key={network?.value}
              label={network?.label}
              checked={localFilters?.networks?.includes(network?.value)}
              onChange={(e) => {
                const updatedNetworks = e?.target?.checked
                  ? [...localFilters?.networks, network?.value]
                  : localFilters?.networks?.filter(c => c !== network?.value);
                handleFilterChange('networks', updatedNetworks);
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Statuses
        </label>
        <div className="space-y-2">
          {statuses?.map((status) => (
            <Checkbox
              key={status?.value}
              label={status?.label}
              checked={localFilters?.statuses?.includes(status?.value)}
              onChange={(e) => {
                const updatedStatuses = e?.target?.checked
                  ? [...localFilters?.statuses, status?.value]
                  : localFilters?.statuses?.filter(c => c !== status?.value);
                handleFilterChange('statuses', updatedStatuses);
              }}
            />
          ))}
        </div>
      </div>

      {/* Seller Rating */}
      <div className="hidden">
        <label className="block text-sm font-medium text-foreground mb-3">
          Minimum Seller Rating
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={localFilters?.minRating}
            onChange={(e) => handleFilterChange('minRating', parseFloat(e?.target?.value))}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-muted-foreground w-8">
            {localFilters?.minRating}+
          </span>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3 ">
        <Checkbox
          label="Listed"
          checked={localFilters?.listed}
          onChange={(e) => handleFilterChange('isListed', e?.target?.checked)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="flex-1"
        >
          Clear All
        </Button>
        <Button
          onClick={handleApplyFilters}
          className="flex-1"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-background">
            <div className="h-full overflow-y-auto p-4">
              {panelContent}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="w-80 bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
      {panelContent}
    </div>
  );
};

export default FilterPanel;