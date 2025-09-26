import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatUnits } from 'ethers';
import { formatDistance, parseISO } from 'date-fns';
import { formatEthereumAddress } from 'utils/cn';

const DomainCard = ({ domain, onFavorite, onPreview, onContact }) => {
  const [isFavorited, setIsFavorited] = useState(domain?.isFavorited || false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    onFavorite(domain?.id, !isFavorited);
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'negotiating':
        return 'bg-warning text-warning-foreground';
      case 'sold':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={i < Math.floor(rating) ? "Star" : "Star"}
        size={12}
        className={i < Math.floor(rating) ? "text-warning fill-current" : "text-muted-foreground"}
      />
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-elevated transition-smooth group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-standard">
            {domain?.name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(domain?.chain?.name)}`}>
              {domain?.chain?.name?.charAt(0)?.toUpperCase() + domain?.chain?.name?.slice(1)}
            </span>
            {domain?.isVerified && (
              <Icon name="BadgeCheck" size={16} className="text-success" />
            )}
            {/* {domain?.hasEscrow && (
              <Icon name="Shield" size={16} className="text-primary" />
            )} */}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavoriteClick}
          className="shrink-0"
        >
          <Icon
            name="Heart"
            size={16}
            className={isFavorited ? "text-error fill-current" : "text-muted-foreground"}
          />
        </Button>
      </div>
      {/* Price */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-foreground">
          {formatUnits(domain?.price, domain?.currency?.decimals)} {domain?.currency?.symbol}
        </div>

        <div className="flex gap-2 items-center">
          <div className="text-sm text-muted-foreground">
            USD - 
          </div>
          {domain?.currency?.usdExchangeRate && (
          <div className="text-sm text-muted-foreground">
            ${Number(domain?.currency?.usdExchangeRate * formatUnits(domain?.price, domain?.currency?.decimals)).toFixed(2)}
          </div>
        )}
        </div>
        
      </div>
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">Sale Expires:</span>
          <span className="text-foreground font-medium">{formatDistance(parseISO(domain?.nameExpiresAt), new Date(), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">Token ID:</span>
          <span className="text-foreground font-medium">{domain?.tokenId.toString().slice(0, 3)}...{domain?.tokenId.toString().slice(-3)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Hash" size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">Length:</span>
          <span className="text-foreground font-medium">{domain?.name?.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Tag" size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">TLD:</span>
          <span className="text-foreground font-medium">{domain?.name?.split('.').pop()}</span>
        </div>
      </div>
      {/* Categories */}
      {/* {domain?.categories && domain?.categories?.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {domain?.categories?.slice(0, 3)?.map((category, index) => (
              <span
                key={index}
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
            {domain?.categories?.length > 3 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{domain?.categories?.length - 3} more
              </span>
            )}
          </div>
        </div>
      )} */}
      {/* Seller Info */}
      <div className="flex items-center space-x-3 mb-4 p-3 bg-muted rounded-lg">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
          <Icon name="User" size={14} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">
            {formatEthereumAddress(domain?.offererAddress)}
          </div>
          {/* <div className="flex items-center space-x-1">
            {renderStars(domain?.seller?.rating)}
            <span className="text-xs text-muted-foreground ml-1">
              ({domain?.seller?.reviews})
            </span>
          </div> */}
        </div>
        {domain?.seller?.isVerified && (
          <Icon name="BadgeCheck" size={16} className="text-success shrink-0" />
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview(domain)}
          className="flex-1"
        >
          <Icon name="Eye" size={14} />
          <span className="ml-1">Preview</span>
        </Button>
        <Button
          size="sm"
          onClick={() => onContact(domain)}
          className="flex-1"
          disabled={domain?.status === 'sold'}
        >
          <Icon name="MessageSquare" size={14} />
          <span className="ml-1">Contact</span>
        </Button>
      </div>
      {/* Quick Stats */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Eye" size={12} />
          <span>{domain?.views} views</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={12} />
          <span>Listed {formatDistance(parseISO(domain?.createdAt), new Date(), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
};

export default DomainCard;