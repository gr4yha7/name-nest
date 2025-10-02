import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import { parseUnits } from 'viem';
import { formatUnits } from 'ethers';
import { formatDistance, parseISO } from 'date-fns';
import { formatEthereumAddress } from 'utils/cn';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

const DomainHero = ({ domain, onMakeOffer, onBuyNow, onContactSeller, onToggleFavorite }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { address} = useAccount();

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    onToggleFavorite(!isFavorited);
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
                  <span>Tokenized: {formatDistance(parseISO(domain?.tokenizedAt), new Date(), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={16} />
                  <span>Expires: {formatDistance(parseISO(domain?.expiresAt), new Date(), { addSuffix: true })}</span>
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
              <div className="text-sm text-muted-foreground">Token ID</div>
              <div className="text-lg font-semibold text-foreground">{domain?.tokens[0]?.tokenId?.slice(0, 6)}...{domain?.tokens[0]?.tokenId?.slice(-4)}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Active Offers</div>
              <div className="text-lg font-semibold text-foreground">{domain?.activeOffersCount}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Chain</div>
              <div className="text-lg font-semibold text-foreground">{domain?.tokens[0]?.chain?.name}</div>
            </div>
          </div>

        </div>

        {/* Price and Actions */}
        {domain?.tokens[0]?.listings?.length > 0 && (
        <div className="lg:w-80 bg-muted rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground mb-1">Asking Price</div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {formatUnits(domain?.tokens[0]?.listings[0]?.price, domain?.tokens[0]?.listings[0]?.currency?.decimals)} {domain?.tokens[0]?.listings[0]?.currency?.symbol}
            </div>
            <div className="text-sm text-muted-foreground">
              {domain?.tokens[0]?.listings[0]?.currency?.usdExchangeRate} USD
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="default"
              fullWidth
              onClick={() => address ? onBuyNow() : toast.error("Please connect your wallet to buy now")}
              iconName="ShoppingCart"
              iconPosition="left"
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => address ? onMakeOffer() : toast.error("Please connect your wallet to make an offer")}
              iconName="DollarSign"
              iconPosition="left"
            >
              Make Offer
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => address ? onContactSeller() : toast.error("Please connect your wallet to contact domain owner")}
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
                <div className="font-medium text-foreground">{formatEthereumAddress(domain?.tokens[0]?.ownerAddress)} - Owner</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{domain?.seller?.totalSales} domains</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default DomainHero;