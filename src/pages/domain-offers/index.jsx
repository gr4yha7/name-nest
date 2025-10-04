import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { domaOrderbookService, domaSubgraphService } from 'services/doma';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { formatUnits } from 'ethers';
import { formatDistance, parseISO } from 'date-fns';
import { viemToEthersSigner } from '@doma-protocol/orderbook-sdk';

const DomainOffers = () => {
  const [domainOffers, setDomainOffers] = useState([]);
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showCancelOfferModal, setShowCancelOfferModal] = useState(false);

  const fetchDomainDetails = async () => {
    domaSubgraphService.getDomainDeals({
        offeredBy:address
      }).then((offers) => {
      console.log("offers",offers)
      setDomainOffers(offers);
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  useEffect(() => {
    if (address) {
    fetchDomainDetails();
    }
  }, [address]);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Marketplace', path: '/domain-marketplace-browse' },
  ];

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleCancelOffer = () => {
      if (!walletClient) return;

      const signer = viemToEthersSigner(walletClient, selectedOffer?.chain?.networkId);
      
      try {
        setIsLoading(true);
        const chainId = selectedOffer?.chain?.networkId;
        domaOrderbookService.cancelOffer(  
          selectedOffer?.externalId,
        signer, 
        chainId
      ).then((result) => {
          if (result?.status === "success") {
            domainOffers.filter(item => item.externalId !== selectedOffer?.externalId)
            setIsLoading(false);
            setShowCancelOfferModal(false);
          } else {
            setIsLoading(false);
          }
        })
        setIsLoading(false);

      } catch (error) {
        console.log(error)
        toast.error(error)
        setIsLoading(false);
      }
  };


  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card border border-border rounded-lg p-8 w-full">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Wallet" size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-muted-foreground mb-8">
                Connect your Web3 wallet to access your domain deals.
              </p>
              <div className='flex justify-center w-full'>
                <ConnectKitButton />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {(loading) && (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading All Deals...</span>
        </div>
        )}

        {(!loading && domainOffers?.length === 0) && (
          <div className="flex items-center justify-center py-20">
            <span className="ml-3 text-muted-foreground">No Deals Yet</span>
          </div>
        )}

      {!loading && domainOffers?.length > 0 && (
        <>
        <main className="container mx-auto px-4 py-6">
            <Breadcrumb customItems={breadcrumbItems} />

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground">
                      Domain Offers ({domainOffers.length})
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-4 text-left">
                            <span className="text-sm font-medium text-foreground">Domain</span>
                          </th>
                          <th className="p-4 text-left">
                            <span className="text-sm font-medium text-foreground">Offer Amount</span>
                          </th>
                          <th className="p-4 text-left">
                            <span className="text-sm font-medium text-foreground">USD Value</span>
                          </th>
                          <th className="p-4 text-left">
                            <span className="text-sm font-medium text-foreground">Expires</span>
                          </th>
                          <th className="p-4 text-left">
                            <span className="text-sm font-medium text-foreground">Network</span>
                          </th>
                          <th className="p-4 text-left">
                            <span className="text-sm font-medium text-foreground">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {domainOffers.map((offer, index) => {
                          const priceInETH = formatUnits(offer.price, offer.currency.decimals);
                          const usdValue = priceInETH * offer.currency.usdExchangeRate;
                          
                          return (
                            <tr
                              key={index}
                              className="border-b border-border hover:bg-muted/30 transition-colors"
                            >
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Icon name="Globe" size={16} className="text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">{offer.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {offer.registrar.name}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <div className="font-medium text-foreground">
                                    {priceInETH} {offer.currency.symbol}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm text-muted-foreground">
                                  ${usdValue.toFixed(2)}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm text-muted-foreground">
                                  {formatDistance(parseISO(offer.expiresAt), new Date(), { addSuffix: true })}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <Icon name="Zap" size={16} className="text-primary" />
                                  <span className="text-sm text-foreground">
                                    {offer.chain.name}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => {
                                      // Handle cancel offer
                                      setShowCancelOfferModal(true);
                                      setSelectedOffer(offer)
                                    }}
                                  >
                                    <Icon name="X" size={14} />
                                    <span className="ml-1">Cancel</span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {domainOffers.length === 0 && (
                    <div className="p-8 text-center">
                      <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No offers found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

        </main>
        </>
      )}

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
    </div>
  );
};

export default DomainOffers;