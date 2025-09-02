import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const DomainHero = ({ domain, onMakeOffer, onBuyNow, onContactSeller, onToggleFavorite }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    onToggleFavorite(!isFavorited);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Domain Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {domain?.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={16} />
                  <span>Registered: {domain?.registrationDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={16} />
                  <span>Expires: {domain?.expirationDate}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className="flex-shrink-0"
            >
              <Icon 
                name={isFavorited ? "Heart" : "Heart"} 
                size={20} 
                color={isFavorited ? "#DC2626" : "currentColor"}
                className={isFavorited ? "fill-current" : ""}
              />
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Domain Age</div>
              <div className="text-lg font-semibold text-foreground">{domain?.age} years</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Traffic</div>
              <div className="text-lg font-semibold text-foreground">{domain?.monthlyTraffic}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">DA Score</div>
              <div className="text-lg font-semibold text-foreground">{domain?.domainAuthority}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Backlinks</div>
              <div className="text-lg font-semibold text-foreground">{domain?.backlinks}</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {domain?.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="lg:w-80 bg-muted rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground mb-1">Current Price</div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {formatPrice(domain?.currentPrice)}
            </div>
            {domain?.originalPrice && domain?.originalPrice > domain?.currentPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(domain?.originalPrice)}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="default"
              fullWidth
              onClick={onBuyNow}
              iconName="ShoppingCart"
              iconPosition="left"
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={onMakeOffer}
              iconName="DollarSign"
              iconPosition="left"
            >
              Make Offer
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={onContactSeller}
              iconName="MessageCircle"
              iconPosition="left"
            >
              Contact Seller
            </Button>
          </div>

          {/* Seller Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={20} color="white" />
              </div>
              <div>
                <div className="font-medium text-foreground">{domain?.seller?.name}</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} color="#F59E0B" className="fill-current" />
                    <span>{domain?.seller?.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{domain?.seller?.totalSales} sales</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-1 text-xs text-success">
              <Icon name="Shield" size={14} />
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-primary">
              <Icon name="Lock" size={14} />
              <span>Escrow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainHero;