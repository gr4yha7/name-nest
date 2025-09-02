import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { format } from 'date-fns';

const DomainCollection = ({ domains, onDomainAction, isWalletConnected, currentNetwork }) => {
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'pending_renewal':
        return 'text-warning bg-warning/10';
      case 'expired':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ENS':
        return 'Globe';
      case 'Unstoppable':
        return 'Shield';
      default:
        return 'Link';
    }
  };

  const getNetworkColor = (network) => {
    switch (network) {
      case 'ethereum':
        return 'text-blue-600 bg-blue-50';
      case 'polygon':
        return 'text-purple-600 bg-purple-50';
      case 'arbitrum':
        return 'text-blue-400 bg-blue-50';
      case 'optimism':
        return 'text-red-500 bg-red-50';
      case 'base':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const handleSelectDomain = (domainId) => {
    setSelectedDomains(prev => 
      prev?.includes(domainId) 
        ? prev?.filter(id => id !== domainId)
        : [...prev, domainId]
    );
  };

  const handleBulkAction = (action) => {
    selectedDomains?.forEach(domainId => {
      const domain = domains?.find(d => d?.id === domainId);
      if (domain) {
        onDomainAction?.(action, domain);
      }
    });
    setSelectedDomains([]);
  };

  const DomainCard = ({ domain }) => (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-standard">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectedDomains?.includes(domain?.id)}
            onChange={() => handleSelectDomain(domain?.id)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
          />
          <div className="flex items-center space-x-2">
            <Icon name={getTypeIcon(domain?.type)} size={16} className="text-primary" />
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getNetworkColor(domain?.network)}`}>
              {domain?.network}
            </span>
          </div>
        </div>
        
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(domain?.status)}`}>
          {domain?.status?.replace('_', ' ')}
        </span>
      </div>

      {/* Domain Name */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground mb-1">{domain?.name}</h3>
        <p className="text-sm text-muted-foreground">
          Type: {domain?.type} • Expires: {' '}
          {domain?.expirationDate === 'Lifetime' ? 'Never' : format(new Date(domain?.expirationDate), 'MMM dd, yyyy')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-foreground">{domain?.analytics?.resolutions}</div>
          <div className="text-xs text-muted-foreground">Resolutions</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-foreground">{domain?.analytics?.uniqueVisitors}</div>
          <div className="text-xs text-muted-foreground">Visitors</div>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-4">
        {domain?.isResolved && (
          <span className="inline-flex items-center text-xs px-2 py-1 bg-success/10 text-success rounded-full">
            <Icon name="CheckCircle" size={12} />
            <span className="ml-1">Resolved</span>
          </span>
        )}
        {domain?.hasSubdomains && (
          <span className="inline-flex items-center text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            <Icon name="GitBranch" size={12} />
            <span className="ml-1">Subdomains</span>
          </span>
        )}
        {domain?.hasWebsite && (
          <span className="inline-flex items-center text-xs px-2 py-1 bg-info/10 text-info rounded-full">
            <Icon name="Globe" size={12} />
            <span className="ml-1">Website</span>
          </span>
        )}
        {domain?.contentHash && (
          <span className="inline-flex items-center text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
            <Icon name="FileText" size={12} />
            <span className="ml-1">IPFS</span>
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDomainAction?.('configure', domain)}
        >
          <Icon name="Settings" size={14} />
          <span className="ml-2">Configure</span>
        </Button>

        <div className="flex items-center space-x-2">
          {domain?.status === 'pending_renewal' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onDomainAction?.('renew', domain)}
              disabled={!isWalletConnected}
            >
              <Icon name="RefreshCw" size={14} />
              <span className="ml-2">Renew</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDomainAction?.('transfer', domain)}
            disabled={!isWalletConnected}
          >
            <Icon name="Send" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );

  const DomainListItem = ({ domain }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-standard">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={selectedDomains?.includes(domain?.id)}
            onChange={() => handleSelectDomain(domain?.id)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
          />
          
          <div className="flex items-center space-x-3">
            <Icon name={getTypeIcon(domain?.type)} size={20} className="text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">{domain?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {domain?.type} • {domain?.network} • {' '}
                {domain?.expirationDate === 'Lifetime' ? 'Lifetime' : format(new Date(domain?.expirationDate), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{domain?.analytics?.resolutions} resolutions</div>
            <div className="text-xs text-muted-foreground">{domain?.analytics?.uniqueVisitors} visitors</div>
          </div>
          
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(domain?.status)}`}>
            {domain?.status?.replace('_', ' ')}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDomainAction?.('configure', domain)}
          >
            <Icon name="MoreHorizontal" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

  if (!domains || domains?.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Globe" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No domains found
        </h3>
        <p className="text-muted-foreground mb-4">
          {isWalletConnected 
            ? 'You haven\'t registered any blockchain domains yet.'
            : 'Connect your wallet to view your domains.'
          }
        </p>
        <Button onClick={() => window.open('https://app.ens.domains/', '_blank')}>
          <Icon name="Plus" size={16} />
          <span className="ml-2">Register Domain</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">
            My Domains ({domains?.length})
          </h2>
          
          {selectedDomains?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedDomains?.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('renew')}
                disabled={!isWalletConnected}
              >
                <Icon name="RefreshCw" size={14} />
                <span className="ml-2">Bulk Renew</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('transfer')}
                disabled={!isWalletConnected}
              >
                <Icon name="Send" size={14} />
                <span className="ml-2">Bulk Transfer</span>
              </Button>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Icon name="Grid3x3" size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <Icon name="List" size={16} />
          </Button>
        </div>
      </div>

      {/* Domains Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains?.map((domain) => (
            <DomainCard key={domain?.id} domain={domain} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {domains?.map((domain) => (
            <DomainListItem key={domain?.id} domain={domain} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DomainCollection;