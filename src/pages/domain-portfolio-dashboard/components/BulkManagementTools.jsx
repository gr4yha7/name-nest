import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkManagementTools = ({ selectedDomains, onBulkAction }) => {
  const [bulkAction, setBulkAction] = useState('');
  const [showPriceUpdate, setShowPriceUpdate] = useState(false);
  const [priceData, setPriceData] = useState({ value: '', currency: 'ETH' });

  const bulkActions = [
    { value: 'update_price', label: 'Update Prices' },
    { value: 'list_domains', label: 'List for Sale' },
    { value: 'unlist_domains', label: 'Remove from Sale' },
    { value: 'transfer', label: 'Initiate Transfer' },
    { value: 'refresh_metadata', label: 'Refresh Metadata' },
    { value: 'update_ipfs', label: 'Update IPFS Hosting' }
  ];

  const currencyOptions = [
    { value: 'ETH', label: 'ETH' },
    { value: 'MATIC', label: 'MATIC' },
    { value: 'SOL', label: 'SOL' },
    { value: 'USD', label: 'USD' }
  ];

  const handleBulkActionExecute = () => {
    if (bulkAction === 'update_price' && priceData?.value) {
      onBulkAction?.(bulkAction, selectedDomains, { 
        price: priceData?.value,
        currency: priceData?.currency 
      });
      setShowPriceUpdate(false);
      setPriceData({ value: '', currency: 'ETH' });
    } else {
      onBulkAction?.(bulkAction, selectedDomains);
    }
    setBulkAction('');
  };

  const handleActionChange = (action) => {
    setBulkAction(action);
    if (action === 'update_price') {
      setShowPriceUpdate(true);
    } else {
      setShowPriceUpdate(false);
      if (action) {
        // Auto-execute non-price actions after confirmation
        setTimeout(() => handleBulkActionExecute(), 100);
      }
    }
  };

  if (!selectedDomains || selectedDomains?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="CheckSquare" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Bulk Management
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedDomains?.length} domain{selectedDomains?.length > 1 ? 's' : ''} selected
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          {showPriceUpdate && (
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={priceData?.value}
                onChange={(e) => setPriceData(prev => ({ ...prev, value: e?.target?.value }))}
                className="w-24 px-2 py-1 border border-border rounded text-sm"
              />
              <Select
                value={priceData?.currency}
                onValueChange={(value) => setPriceData(prev => ({ ...prev, currency: value }))}
                options={currencyOptions}
                className="w-20"
              />
              <Button
                size="sm"
                onClick={handleBulkActionExecute}
                disabled={!priceData?.value}
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowPriceUpdate(false);
                  setBulkAction('');
                  setPriceData({ value: '', currency: 'ETH' });
                }}
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          )}

          {!showPriceUpdate && (
            <>
              <Select
                value={bulkAction}
                onValueChange={handleActionChange}
                options={bulkActions}
                placeholder="Select bulk action"
                className="w-48"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/domain-listing-creation?bulk=true'}
              >
                <Icon name="Plus" size={14} className="mr-2" />
                Create Listings
              </Button>
            </>
          )}
        </div>
      </div>
      {/* Quick Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleActionChange('refresh_metadata')}
        >
          <Icon name="RefreshCw" size={14} className="mr-2" />
          Refresh Metadata
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleActionChange('update_ipfs')}
        >
          <Icon name="Database" size={14} className="mr-2" />
          Update IPFS
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => console.log('Export selected domains')}
        >
          <Icon name="Download" size={14} className="mr-2" />
          Export Data
        </Button>
      </div>
      {/* Gas Fee Estimation */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">Estimated Gas Fees:</span>
          </div>
          <div className="text-right">
            <span className="font-medium text-foreground">~0.025 ETH</span>
            <span className="text-xs text-muted-foreground ml-2">(~$65)</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <span>Batch optimization: -40% gas savings</span>
          <span>Current gas price: 25 Gwei</span>
        </div>
      </div>
    </div>
  );
};

export default BulkManagementTools;