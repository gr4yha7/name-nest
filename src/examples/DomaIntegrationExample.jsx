/**
 * Example: Doma Integration in Domain Marketplace
 * Shows how to integrate Doma services into existing components
 */

import React, { useState, useEffect } from 'react';
import { useDoma, useDomainListings, useDomainOffers } from '../hooks/useDoma.js';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/AppIcon.jsx';

const DomaIntegrationExample = () => {
  const [userAddress, setUserAddress] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  
  // Initialize Doma services
  const { 
    isInitialized, 
    isLoading, 
    error, 
    initialize, 
    startUpdates, 
    stopUpdates,
    setupEvents,
    services 
  } = useDoma();

  // Get domain listings with real-time updates
  const { 
    listings, 
    isLoading: listingsLoading, 
    error: listingsError, 
    loadMore, 
    refresh 
  } = useDomainListings({
    status: 'active',
    limit: 20,
  });

  // Get offers for selected domain
  const { 
    offers, 
    isLoading: offersLoading, 
    error: offersError 
  } = useDomainOffers({
    listingId: selectedDomain?.id,
  });

  // Setup real-time event handlers
  useEffect(() => {
    if (isInitialized) {
      setupEvents({
        onListingCreated: (event) => {
          console.log('New listing created:', event);
          refresh(); // Refresh listings
        },
        onOfferCreated: (event) => {
          console.log('New offer created:', event);
          // Refresh offers if it's for the selected domain
          if (event.listingId === selectedDomain?.id) {
            // Offers will auto-refresh due to dependency
          }
        },
        onAnyEvent: (event) => {
          console.log('Doma event received:', event.type, event);
        },
        onError: (error) => {
          console.error('Doma service error:', error);
        },
      });
    }
  }, [isInitialized, selectedDomain, refresh, setupEvents]);

  // Initialize services on component mount
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initialize({
        autoInitialize: true,
        initializeSubgraph: true,
        initializeOrderbook: true,
        // XMTP will be initialized when user connects wallet
      });
    }
  }, [isInitialized, isLoading, initialize]);

  // Start real-time updates when initialized
  useEffect(() => {
    if (isInitialized) {
      startUpdates({
        polling: {
          interval: 5000, // Poll every 5 seconds
          eventTypes: ['NAME_CLAIMED', 'NAME_TOKENIZED'], // Only fetch these events
        },
      });
    }

    // Cleanup on unmount
    return () => {
      stopUpdates();
    };
  }, [isInitialized, startUpdates, stopUpdates]);

  // Handle creating a new listing
  const handleCreateListing = async (domainData, signer, chainId) => {
    try {
      const listing = await services.orderbook.createListing({
        contractAddress: domainData.contractAddress,
        tokenId: domainData.tokenId,
        price: domainData.price,
        currency: 'ETH',
        marketplaceFees: domainData.marketplaceFees, // Optional, will be fetched automatically
      }, signer, chainId, (step, progress) => {
        console.log(`Creating listing: ${step} (${progress}%)`);
      });
      
      console.log('Listing created:', listing);
      refresh(); // Refresh listings
    } catch (error) {
      console.error('Failed to create listing:', error);
    }
  };

  // Handle creating an offer
  const handleCreateOffer = async (offerData, signer, chainId) => {
    try {
      const offer = await services.orderbook.createOffer({
        contractAddress: offerData.contractAddress,
        tokenId: offerData.tokenId,
        price: offerData.price,
        currency: offerData.currency,
        currencyContractAddress: offerData.currencyContractAddress || '0x0000000000000000000000000000000000000000', // ETH
        expirationTime: offerData.expirationTime || Math.floor(Date.now() / 1000) + 86400, // 24 hours
      }, signer, chainId, (step, progress) => {
        console.log(`Creating offer: ${step} (${progress}%)`);
      });
      
      console.log('Offer created:', offer);
    } catch (error) {
      console.error('Failed to create offer:', error);
    }
  };

  // Handle buying a listing
  const handleBuyListing = async (orderId, fulfillerAddress, signer, chainId) => {
    try {
      const result = await services.orderbook.buyListing(orderId, fulfillerAddress, signer, chainId, (step, progress) => {
        console.log(`Buying listing: ${step} (${progress}%)`);
      });
      console.log('Listing bought:', result);
    } catch (error) {
      console.error('Failed to buy listing:', error);
    }
  };

  // Handle accepting an offer
  const handleAcceptOffer = async (offerId, signer, chainId) => {
    try {
      const result = await services.orderbook.acceptOffer(offerId, signer, chainId, (step, progress) => {
        console.log(`Accepting offer: ${step} (${progress}%)`);
      });
      console.log('Offer accepted:', result);
    } catch (error) {
      console.error('Failed to accept offer:', error);
    }
  };

  // Handle canceling a listing
  const handleCancelListing = async (orderId, signer, chainId) => {
    try {
      const result = await services.orderbook.cancelListing(orderId, signer, chainId, (step, progress) => {
        console.log(`Cancelling listing: ${step} (${progress}%)`);
      });
      console.log('Listing cancelled:', result);
    } catch (error) {
      console.error('Failed to cancel listing:', error);
    }
  };

  // Handle canceling an offer
  const handleCancelOffer = async (orderId, signer, chainId) => {
    try {
      const result = await services.orderbook.cancelOffer(orderId, signer, chainId, (step, progress) => {
        console.log(`Cancelling offer: ${step} (${progress}%)`);
      });
      console.log('Offer cancelled:', result);
    } catch (error) {
      console.error('Failed to cancel offer:', error);
    }
  };

  // Get marketplace fees
  const getMarketplaceFees = async (contractAddress, chainId) => {
    try {
      const fees = await services.orderbook.getOrderbookFee(contractAddress, chainId);
      console.log('Marketplace fees:', fees);
      return fees;
    } catch (error) {
      console.error('Failed to get marketplace fees:', error);
    }
  };

  // Get supported currencies
  const getSupportedCurrencies = async (contractAddress, chainId) => {
    try {
      const currencies = await services.orderbook.getSupportedCurrencies(contractAddress, chainId);
      console.log('Supported currencies:', currencies);
      return currencies;
    } catch (error) {
      console.error('Failed to get supported currencies:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Icon name="Loader" size={32} className="animate-spin mx-auto mb-4" />
          <p>Initializing Doma services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <Icon name="AlertCircle" size={20} className="text-red-500 mr-2" />
          <div>
            <h3 className="text-red-800 font-medium">Failed to initialize Doma services</h3>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
            <Button 
              onClick={() => initialize()} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Service Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <Icon name="CheckCircle" size={20} className="text-green-500 mr-2" />
          <div>
            <h3 className="text-green-800 font-medium">Doma services connected</h3>
            <p className="text-green-600 text-sm">
              Real-time updates: {isInitialized ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>

      {/* Domain Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Domain Listings</h2>
          <Button onClick={refresh} variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
        </div>

        {listingsLoading ? (
          <div className="text-center py-8">
            <Icon name="Loader" size={24} className="animate-spin mx-auto mb-2" />
            <p>Loading listings...</p>
          </div>
        ) : listingsError ? (
          <div className="text-red-600 text-center py-8">
            <Icon name="AlertCircle" size={24} className="mx-auto mb-2" />
            <p>Failed to load listings: {listingsError.message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(listings || []).map((listing) => (
              <div 
                key={listing.id} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-lg">{listing.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {listing.chain?.name} • {listing.currency?.symbol}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {listing.price} {listing.currency?.symbol}
                </p>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    onClick={() => setSelectedDomain(listing)}
                    variant="outline" 
                    size="sm"
                  >
                    View Details
                  </Button>
                  <Button 
                    onClick={() => handleCreateOffer(listing.id, {
                      price: listing.price * 0.9, // 10% below asking
                      currency: listing.currency,
                      network: listing.domain.network,
                      message: 'Interested in this domain',
                    })}
                    size="sm"
                  >
                    Make Offer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {listings.length > 0 && (
          <div className="text-center mt-6">
            <Button onClick={loadMore} variant="outline">
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* Domain Offers */}
      {selectedDomain && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Offers for {selectedDomain.name}
          </h2>
          
          {offersLoading ? (
            <div className="text-center py-4">
              <Icon name="Loader" size={20} className="animate-spin mx-auto mb-2" />
              <p>Loading offers...</p>
            </div>
          ) : offersError ? (
            <div className="text-red-600 text-center py-4">
              <Icon name="AlertCircle" size={20} className="mx-auto mb-2" />
              <p>Failed to load offers: {offersError.message}</p>
            </div>
          ) : (offers || []).length > 0 ? (
            <div className="space-y-3">
              {(offers || []).map((offer) => (
                <div 
                  key={offer.id} 
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {offer.price} {offer.currency?.symbol}
                      </p>
                      <p className="text-sm text-gray-600">
                        From: {offer.offererAddress?.slice(0, 6)}...{offer.offererAddress?.slice(-4)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleAcceptOffer(offer.id)}
                        variant="success"
                        size="sm"
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                      >
                        Counter
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No offers yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DomaIntegrationExample;

// {
//   "id": 155880,
//   "name": "pi5ojixk9l.shib",
//   "type": "NAME_TOKENIZED",
//   "uniqueId": "DOMA_RECORD-eip155:97476-finalized-0x8b2cdf423fee45238ee6361478e4d93b3bdd2b22e03a18d550611b3e4d1d32f3-2",
//   "relayId": "9e3f0c00-fe4e-4db4-ba0f-c705e6db6159",
//   "eventData": {
//       "type": "NAME_TOKENIZED",
//       "dsKeys": [],
//       "txHash": "0x8b2cdf423fee45238ee6361478e4d93b3bdd2b22e03a18d550611b3e4d1d32f3",
//       "removed": false,
//       "logIndex": 2,
//       "claimedBy": "eip155:157:0x2E7cC63800e77BB8c662c45Ef33D1cCc23861532",
//       "finalized": true,
//       "networkId": "eip155:97476",
//       "blockNumber": "6142024",
//       "nameservers": [],
//       "correlationId": "5203cfc69c7ece59f89ea9bb402cd31f1011683f489e9d629d632be070aa9daf",
//       "registrarIanaId": 3784,
//       "domaRecordAddress": "0xF6A92E0f8bEa4174297B0219d9d47fEe335f84f8",
//       "name": "pi5ojixk9l.shib",
//       "expiresAt": "2026-06-01T00:00:00.000Z"
//   }
// }