/**
 * React Hook for Doma Protocol Integration
 * Provides easy access to Doma services in React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initializeDomaServices,
  getServicesStatus,
  startRealTimeUpdates,
  stopRealTimeUpdates,
  setupEventHandlers,
  setupXMTPHandlers,
  domaPollService,
  domaOrderbookService,
  domaSubgraphService,
  // domaXMTPService,
} from '../services/doma/index.js';

/**
 * Main Doma hook
 * @param {Object} options - Hook options
 */
export function useDoma(options = {}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const initializedRef = useRef(false);

  // Initialize services
  const initialize = useCallback(async (initOptions = {}) => {
    if (initializedRef.current) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await initializeDomaServices({
        ...options,
        ...initOptions,
      });
      
      setIsInitialized(true);
      initializedRef.current = true;
      setStatus(getServicesStatus());
    } catch (err) {
      setError(err);
      console.error('Failed to initialize Doma services:', err);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Start real-time updates
  const startUpdates = useCallback(async (updateOptions = {}) => {
    if (!isInitialized) {
      throw new Error('Services not initialized');
    }

    try {
      await startRealTimeUpdates(updateOptions);
      setIsPolling(true);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [isInitialized]);

  // Stop real-time updates
  const stopUpdates = useCallback(() => {
    stopRealTimeUpdates();
    setIsPolling(false);
  }, []);

  // Setup event handlers
  const setupEvents = useCallback((handlers) => {
    setupEventHandlers(handlers);
  }, []);

  // Setup XMTP handlers
  const setupXMTP = useCallback((handlers) => {
    setupXMTPHandlers(handlers);
  }, []);

  // Auto-initialize on mount if options provided
  useEffect(() => {
    if (options.autoInitialize && !initializedRef.current) {
      initialize();
    }
  }, [initialize, options.autoInitialize]);

  return {
    // State
    isInitialized,
    isLoading,
    error,
    status,
    isPolling,
    
    // Actions
    initialize,
    startUpdates,
    stopUpdates,
    setupEvents,
    setupXMTP,
    
    // Services
    services: {
      poll: domaPollService,
      orderbook: domaOrderbookService,
      subgraph: domaSubgraphService,
      // xmtp: domaXMTPService,
    },
  };
}

/**
 * Hook for domain listings
 * @param {Object} filters - Listing filters
 */
export function useDomainListings(filters = {}) {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const { services } = useDoma({ autoInitialize: true });

  // Fetch listings
  const fetchListings = useCallback(async (reset = false) => {
    if (!services.subgraph.isInitialized) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentOffset = reset ? 0 : offset;
      const response = await services.subgraph.getDomainListings({
        ...filters,
        skip: currentOffset,
        take: filters.limit || 50,
      });

      const newListings = response?.items || [];
      const totalCount = response?.totalCount || 0;

      if (reset) {
        setListings(newListings);
        setOffset(newListings.length);
      } else {
        setListings(prev => [...prev, ...newListings]);
        setOffset(prev => prev + newListings.length);
      }

      setHasMore(newListings.length === (filters.limit || 50) && (currentOffset + newListings.length) < totalCount);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [services.subgraph, filters, offset]);

  // Load more listings
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchListings(false);
    }
  }, [isLoading, hasMore, fetchListings]);

  // Refresh listings
  const refresh = useCallback(() => {
    setOffset(0);
    fetchListings(true);
  }, [fetchListings]);

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    if (services.subgraph.isInitialized) {
      refresh();
    }
  }, [services.subgraph.isInitialized, filters.domain, filters.network, filters.status]);

  return {
    listings,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

/**
 * Hook for domain offers
 * @param {Object} filters - Offer filters
 */
export function useDomainOffers(filters = {}) {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { services } = useDoma({ autoInitialize: true });

  // Fetch offers
  const fetchOffers = useCallback(async () => {
    if (!services.subgraph.isInitialized) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await services.subgraph.getDomainOffers(filters);
      const newOffers = response?.items || [];
      setOffers(newOffers);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [services.subgraph, filters]);

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    if (services.subgraph.isInitialized) {
      fetchOffers();
    }
  }, [services.subgraph.isInitialized, filters.listingId, filters.buyer, filters.status]);

  return {
    offers,
    isLoading,
    error,
    refresh: fetchOffers,
  };
}

/**
 * Hook for user's domains
 * @param {string} userAddress - User's wallet address
 */
export function useUserDomains(userAddress) {
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { services } = useDoma({ autoInitialize: true });

  // Fetch user domains
  const fetchDomains = useCallback(async () => {
    if (!services.subgraph.isInitialized || !userAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await services.subgraph.getUserDomains(userAddress);
      const userDomains = response?.items || [];
      setDomains(userDomains);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [services.subgraph, userAddress]);

  // Auto-fetch when user address changes
  useEffect(() => {
    if (userAddress) {
      fetchDomains();
    }
  }, [userAddress, fetchDomains]);

  return {
    domains,
    isLoading,
    error,
    refresh: fetchDomains,
  };
}

/**
 * Hook for XMTP messaging
 * @param {string} userPrivateKey - User's private key for XMTP
 */
export function useXMTPMessaging(userPrivateKey) {
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const { services, initialize } = useDoma();

  // Initialize XMTP
  const connectXMTP = useCallback(async () => {
    if (!userPrivateKey) return;

    try {
      await initialize({ 
        initializeXMTP: true, 
        xmtpPrivateKey: userPrivateKey 
      });
      setIsConnected(true);
    } catch (err) {
      setError(err);
    }
  }, [userPrivateKey, initialize]);

  // Send message
  const sendMessage = useCallback(async (recipientAddress, content, domainContext) => {
    if (!services.xmtp.isInitialized) return;

    try {
      return await services.xmtp.sendMessage(recipientAddress, content, domainContext);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [services.xmtp]);

  // Send offer
  const sendOffer = useCallback(async (recipientAddress, offerData, domainData) => {
    if (!services.xmtp.isInitialized) return;

    try {
      return await services.xmtp.sendOffer(recipientAddress, offerData, domainData);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [services.xmtp]);

  // Auto-connect when private key is available
  useEffect(() => {
    if (userPrivateKey && !isConnected) {
      connectXMTP();
    }
  }, [userPrivateKey, isConnected, connectXMTP]);

  return {
    isConnected,
    conversations,
    messages,
    error,
    connectXMTP,
    sendMessage,
    sendOffer,
  };
}

export default useDoma;
