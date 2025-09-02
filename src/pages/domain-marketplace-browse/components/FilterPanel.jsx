import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange, isMobile = false }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-1000', label: 'Under $1,000' },
    { value: '1000-5000', label: '$1,000 - $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: '10000-50000', label: '$10,000 - $50,000' },
    { value: '50000+', label: '$50,000+' }
  ];

  const tldOptions = [
    { value: '.com', label: '.com' },
    { value: '.net', label: '.net' },
    { value: '.org', label: '.org' },
    { value: '.io', label: '.io' },
    { value: '.ai', label: '.ai' },
    { value: '.co', label: '.co' }
  ];

  const categoryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'finance', label: 'Finance' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  const lengthOptions = [
    { value: 'all', label: 'Any Length' },
    { value: '1-5', label: '1-5 characters' },
    { value: '6-10', label: '6-10 characters' },
    { value: '11-15', label: '11-15 characters' },
    { value: '16+', label: '16+ characters' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
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
      length: 'all',
      keyword: '',
      minRating: 0,
      hasEscrow: false,
      isVerified: false
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters?.priceRange !== 'all') count++;
    if (localFilters?.tlds?.length > 0) count++;
    if (localFilters?.categories?.length > 0) count++;
    if (localFilters?.length !== 'all') count++;
    if (localFilters?.keyword) count++;
    if (localFilters?.minRating > 0) count++;
    if (localFilters?.hasEscrow) count++;
    if (localFilters?.isVerified) count++;
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

      {/* Price Range */}
      <div>
        <Select
          label="Price Range"
          options={priceRanges}
          value={localFilters?.priceRange}
          onChange={(value) => handleFilterChange('priceRange', value)}
        />
      </div>

      {/* Domain Length */}
      <div>
        <Select
          label="Domain Length"
          options={lengthOptions}
          value={localFilters?.length}
          onChange={(value) => handleFilterChange('length', value)}
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

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Categories
        </label>
        <div className="space-y-2">
          {categoryOptions?.map((category) => (
            <Checkbox
              key={category?.value}
              label={category?.label}
              checked={localFilters?.categories?.includes(category?.value)}
              onChange={(e) => {
                const updatedCategories = e?.target?.checked
                  ? [...localFilters?.categories, category?.value]
                  : localFilters?.categories?.filter(c => c !== category?.value);
                handleFilterChange('categories', updatedCategories);
              }}
            />
          ))}
        </div>
      </div>

      {/* Seller Rating */}
      <div>
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
      <div className="space-y-3">
        <Checkbox
          label="Escrow Available"
          checked={localFilters?.hasEscrow}
          onChange={(e) => handleFilterChange('hasEscrow', e?.target?.checked)}
        />
        <Checkbox
          label="Verified Sellers Only"
          checked={localFilters?.isVerified}
          onChange={(e) => handleFilterChange('isVerified', e?.target?.checked)}
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