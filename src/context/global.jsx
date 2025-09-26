// src/context/global.jsx
import useDoma, { useDomainListings, useDomainOffers } from "hooks/useDoma";
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [fetchedDomains, setFetchedDomains] = useState([]);
  
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
            //console.log('New listing created:', event);
            setFetchedDomains([...fetchedDomains, event]);
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
            // console.log('Doma event received:', event.type, event);
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
            interval: 50000, // Poll every 50 seconds
            eventTypes: ['NAME_TOKEN_LISTED'], // Only fetch these events
          },
        });
      }
  
      // Cleanup on unmount
      return () => {
        stopUpdates();
      };
    }, [isInitialized, startUpdates, stopUpdates]);

  // Value to be provided to the context
  const value = {
    listings,
    isLoading,
    offers,
    listingsLoading,
    offersLoading,
    listingsError,
    offersError,
    loadMore,
    refresh,
    selectedDomain,
    setSelectedDomain,
    fetchedDomains,
    setFetchedDomains,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
