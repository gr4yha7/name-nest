import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { formatUnits } from 'ethers';
import { formatDistance, parseISO } from 'date-fns';
import { formatEthereumAddress, shortenAddress } from 'utils/cn';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

const OfferManagement = ({ domain, offers, onMakeOffer }) => {
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('full');
  const { address} = useAccount();


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  const handleSubmitOffer = (e) => {
    e?.preventDefault();
    if (!offerAmount || parseFloat(offerAmount) <= 0) return;

    const newOffer = {
      amount: parseFloat(offerAmount),
      message: offerMessage,
      paymentTerms: paymentTerms
    };

    onMakeOffer(newOffer);
    setShowOfferForm(false);
    setOfferAmount('');
    setOfferMessage('');
    setPaymentTerms('full');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-success bg-success/10';
      case 'declined':
        return 'text-error bg-error/10';
      case 'countered':
        return 'text-warning bg-warning/10';
      case 'pending':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return 'CheckCircle';
      case 'declined':
        return 'XCircle';
      case 'countered':
        return 'ArrowRightLeft';
      case 'pending':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Offer Management</h3>
        <Button
          variant="default"
          onClick={() => address ? setShowOfferForm(true) : toast.error("Please connect your wallet to make an offer")}
          iconName="Plus"
          iconPosition="left"
        >
          Make Offer
        </Button>
      </div>
      {/* Offer Form Modal */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h4 className="text-lg font-semibold text-foreground">Make an Offer</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOfferForm(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <form onSubmit={handleSubmitOffer} className="p-6 space-y-4">
              <Input
                label="Offer Amount"
                type="number"
                placeholder="Enter your offer amount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e?.target?.value)}
                required
                min="1"
                step="1"
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message to Seller
                </label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e?.target?.value)}
                  placeholder="Add a personal message to strengthen your offer..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Current asking price: {formatUnits(domain?.tokens[0]?.listings[0]?.price, domain?.tokens[0]?.listings[0]?.currency?.decimals)} {domain?.tokens[0]?.listings[0]?.currency?.symbol}
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowOfferForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Offer
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Offer History */}
      <div className="p-6">
        {offers?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No offers yet</h4>
            <p className="text-muted-foreground mb-4">Be the first to make an offer on this domain</p>
            <Button
              variant="default"
              onClick={() => address ? setShowOfferForm(true) : toast.error("Please connect your wallet to make an offer")}
              iconName="Plus"
              iconPosition="left"
            >
              Make First Offer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {offers?.map((offer) => (
              <div
                key={offer?.id}
                className={`border border-border rounded-lg p-4 ${
                  offer?.[offers?.length - 1]?.id === offer?.id ? 'ring-2 ring-primary/20 bg-primary/5' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{address ? (formatEthereumAddress(offer?.offererAddress).toLowerCase() === address.toLowerCase() && "Your Offer") : shortenAddress(formatEthereumAddress(offer?.offererAddress)) + " Offer"}</div>
                      <div className="text-sm text-muted-foreground">{formatDistance(parseISO(offer?.createdAt), new Date(), { addSuffix: true })}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {formatUnits(offer?.price, offer?.currency?.decimals)} {offer?.currency?.symbol}
                  </div>
                  {offer?.message && (
                    <p className="text-sm text-muted-foreground">{offer?.message}</p>
                  )}
                </div>

                {address && (
                <div className="flex space-x-2 mt-3">
                  {domain?.tokens[0]?.ownerAddress.toLowerCase() === address.toLowerCase() && (
                    <Button variant="default" size="sm">
                      Accept Offer
                    </Button>
                  )}
                  {formatEthereumAddress(offer?.offererAddress).toLowerCase() === address.toLowerCase() && (
                  <Button variant="outline" size="sm">
                    Cancel Offer
                  </Button>
                  )}
                </div>
                )}
                
                {/* Counter Offer */}
                {offer?.status === 'countered' && (
                  <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="ArrowRightLeft" size={16} color="var(--color-warning)" />
                      <span className="font-medium text-warning">Counter Offer</span>
                    </div>
                    <div className="text-xl font-bold text-foreground mb-1">
                      {formatPrice(offer?.counterAmount)}
                    </div>
                    <p className="text-sm text-muted-foreground">{offer?.counterMessage}</p>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="default" size="sm">
                        Accept Counter
                      </Button>
                      <Button variant="outline" size="sm">
                        Make New Offer
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Declined Reason */}
                {offer?.status === 'declined' && (
                  <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="XCircle" size={16} color="var(--color-error)" />
                      <span className="font-medium text-error">Declined</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{offer?.declineMessage}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferManagement;