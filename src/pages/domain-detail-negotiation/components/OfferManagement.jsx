import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { formatUnits } from 'ethers';
import { formatDistance, parseISO } from 'date-fns';
import { currencies, formatEthereumAddress, formatJustEthereumAddress, shortenAddress } from 'utils/cn';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { viemToEthersSigner } from '@doma-protocol/orderbook-sdk';
import { domaOrderbookService } from 'services/doma';

const OfferManagement = ({ domain, offers, onMakeOffer, walletClient, fetchDomainDetails }) => {
  const { address} = useAccount();
  const [showCancelOfferModal, setShowCancelOfferModal] = useState(false);
  const [showAcceptOfferModal, setShowAcceptOfferModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const handleCancelOffer = (e) => {
    e?.preventDefault();

      if (!walletClient) return;

      const signer = viemToEthersSigner(walletClient, domain?.tokens[0]?.chain?.networkId);
      
      try {
        setIsLoading(true);
        const chainId = domain?.tokens[0]?.chain?.networkId;
        domaOrderbookService.cancelOffer(  
        selectedOffer?.externalId,
        signer, 
        chainId
      ).then((result) => {
          if (result?.status === "success") {
            const urlParams = new URLSearchParams(location.search);
            const searchTokenIdParam = urlParams?.get('token_id');
            const searchDomainParam = urlParams?.get('domain');
            fetchDomainDetails(searchTokenIdParam,searchDomainParam)
            domainOffers.filter(item => item.externalId !== selectedOffer?.externalId)
            setIsLoading(false);
            setShowCancelOfferModal(false);
          } else {
            setIsLoading(false);
          }
        })
      } catch (error) {
        console.log(error)
        toast.error(error)
        setIsLoading(false);
      }
  };

  const handleAcceptOffer = (e) => {
    e?.preventDefault();

      if (!walletClient) return;

      const signer = viemToEthersSigner(walletClient, domain?.tokens[0]?.chain?.networkId);
      
      try {
        setIsLoading(true);
        const chainId = domain?.tokens[0]?.chain?.networkId;
        domaOrderbookService.acceptOffer(  
        selectedOffer?.externalId,
        signer, 
        chainId
      ).then((result) => {
          if (result?.status === "success") {
            const urlParams = new URLSearchParams(location.search);
            const searchTokenIdParam = urlParams?.get('token_id');
            const searchDomainParam = urlParams?.get('domain');
            fetchDomainDetails(searchTokenIdParam,searchDomainParam)
            setIsLoading(false);
            setShowCancelOfferModal(false);
          } else {
            setIsLoading(false);
          }
        })
      } catch (error) {
        console.log(error)
        toast.error(error)
        setIsLoading(false);
      }
  };


  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Header */}

      {address?.toLowerCase !== formatEthereumAddress(domain["tokens"][0]?.ownerAddress).toLowerCase() &&
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Offer Management</h3>
        <Button
          variant="default"
          onClick={() => address ? onMakeOffer(true) : toast.error("Please connect your wallet to make an offer")}
          iconName="Plus"
          iconPosition="left"
          >
          Make Offer
        </Button>
      </div>
        }
      
      {/* Offer History */}
      <div className="p-6">
        {offers?.length === 0 ? (
          <div className="text-center py-8">
          {address?.toLowerCase !== formatEthereumAddress(domain["tokens"][0]?.ownerAddress).toLowerCase() &&
            <div>
              <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No offers yet</h4>
              <p className="text-muted-foreground mb-4">Be the first to make an offer on this domain</p>
              <Button
                variant="default"
                onClick={() => address ? onMakeOffer(true) : toast.error("Please connect your wallet to make an offer")}
                iconName="Plus"
                iconPosition="left"
              >
                Make First Offer
              </Button>
            </div>
            }
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
                      <div className="font-medium text-foreground">{address ? (formatJustEthereumAddress(offer?.offererAddress).toLowerCase() === address.toLowerCase() && "Your Offer") : shortenAddress(formatJustEthereumAddress(offer?.offererAddress)) + " Offer"}</div>
                      <div className="text-sm text-muted-foreground">Created {formatDistance(parseISO(offer?.createdAt), new Date(), { addSuffix: true })}</div>
                  <div className="text-sm text-muted-foreground">Expires {formatDistance(parseISO(offer?.expiresAt), new Date(), { addSuffix: true })}</div>
                    </div>
                  </div>


                </div>
                
                <div className="mb-3">
                  <div className="text-md font-bold text-foreground mb-1">
                    {formatUnits(offer?.price, offer?.currency?.decimals)} {offer?.currency?.symbol}
                  </div>
                  {offer?.message && (
                    <p className="text-sm text-muted-foreground">{offer?.message}</p>
                  )}
                </div>

                {address && (
                <div className="flex space-x-2 mt-3">
                  {address.toLowerCase() === formatJustEthereumAddress(domain?.tokens[0]?.ownerAddress).toLowerCase() && (
                    <Button onClick={() => {setSelectedOffer(offer);setShowAcceptOfferModal(true)}} variant="default" size="sm">
                      Accept Offer
                    </Button>
                  )}
                  {formatJustEthereumAddress(offer?.offererAddress).toLowerCase() === address.toLowerCase() && (
                  <Button onClick={() => {setSelectedOffer(offer);setShowCancelOfferModal(true)}} variant="outline" className="bg-red-500 hover:bg-red-600 cursor-pointer text-white" size="sm">
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

      {showCancelOfferModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              
              <div className='grid'>
                <span className="text-lg font-semibold text-foreground">Cancel Domain offer</span>
                <span className="text-xs font-semibold mt-2 text-foreground text-red-500">Are you sure you want to cancel this offer?</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex space-x-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white"
                    onClick={() => setShowCancelOfferModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button disabled={isLoading} className="w-full disabled:cursor-not-allowed h-10 hover:bg-blue-900" onClick={() => handleCancelOffer()} type="submit">
                  {isLoading ? "Processing" : "Proceed"}
                  </Button>
                </div>
              
            </div>
          </div>
        </div>
      )}
      {showAcceptOfferModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              
              <div className='grid'>
                <span className="text-lg font-semibold text-foreground">Accept Domain offer</span>
                <span className="text-xs font-semibold mt-2 text-foreground text-red-500">Are you sure you want to accept this offer?</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex space-x-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white"
                    onClick={() => setShowAcceptOfferModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button disabled={isLoading} className="w-full disabled:cursor-not-allowed h-10 hover:bg-blue-900" onClick={() => handleAcceptOffer()} type="submit">
                  {isLoading ? "Processing" : "Proceed"}
                  </Button>
                </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferManagement;