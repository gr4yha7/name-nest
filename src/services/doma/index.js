/**
 * Doma Protocol Services
 * Main entry point for all Doma-related services
 */

import config from './config.js';
import domaPollService from './pollService.js';
import domaOrderbookService from './orderbookService.js';
import domaSubgraphService from './subgraphService.js';

/**
 * Initialize all Doma services
 * @param {Object} options - Initialization options
 */
async function initializeDomaServices(options = {}) {
  try {
    console.log('Initializing Doma Protocol services...');

    // Initialize services in parallel
    const initPromises = [];

    // Initialize Subgraph service
    if (options.initializeSubgraph !== false) {
      initPromises.push(domaSubgraphService.initialize());
    }

    // Initialize Orderbook service
    if (options.initializeOrderbook !== false) {
      initPromises.push(domaOrderbookService.initialize(options.orderbookOptions));
    }

    await Promise.all(initPromises);

    console.log('All Doma services initialized successfully');
    return {
      success: true,
      services: {
        poll: domaPollService,
        orderbook: domaOrderbookService,
        subgraph: domaSubgraphService,
      },
    };
  } catch (error) {
    console.error('Failed to initialize Doma services:', error);
    throw error;
  }
}

/**
 * Get service status for all services
 */
function getServicesStatus() {
  return {
    config: {
      endpoints: config.endpoints,
    },
    services: {
      poll: domaPollService.getStatus(),
      orderbook: domaOrderbookService.getStatus(),
      subgraph: domaSubgraphService.getStatus(),
    },
  };
}

/**
 * Start real-time polling
 * @param {Object} options - Polling options
 */
async function startRealTimeUpdates(options = {}) {
  try {
    await domaPollService.startPolling(options.cursor, options.polling);
    console.log('Real-time updates started');
    return { success: true };
  } catch (error) {
    console.error('Failed to start real-time updates:', error);
    throw error;
  }
}

/**
 * Stop real-time polling
 */
function stopRealTimeUpdates() {
  domaPollService.stopPolling();
  console.log('Real-time updates stopped');
}

/**
 * Setup event handlers for real-time updates
 * @param {Object} handlers - Event handlers
 */
function setupEventHandlers(handlers) {
  // Domain listing events
  if (handlers.onListingCreated) {
    domaPollService.onEvent('listing.created', handlers.onListingCreated);
  }
  if (handlers.onListingUpdated) {
    domaPollService.onEvent('listing.updated', handlers.onListingUpdated);
  }
  if (handlers.onListingCancelled) {
    domaPollService.onEvent('listing.cancelled', handlers.onListingCancelled);
  }

  // Domain offer events
  if (handlers.onOfferCreated) {
    domaPollService.onEvent('offer.created', handlers.onOfferCreated);
  }
  if (handlers.onOfferAccepted) {
    domaPollService.onEvent('offer.accepted', handlers.onOfferAccepted);
  }
  if (handlers.onOfferRejected) {
    domaPollService.onEvent('offer.rejected', handlers.onOfferRejected);
  }

  // General events
  if (handlers.onAnyEvent) {
    domaPollService.onEvent('*', handlers.onAnyEvent);
  }

  // Error handling
  if (handlers.onError) {
    domaPollService.onError(handlers.onError);
  }
}

// Export individual services
export {
  config,
  domaPollService,
  domaOrderbookService,
  domaSubgraphService,
};

// Export main functions
export {
  initializeDomaServices,
  getServicesStatus,
  startRealTimeUpdates,
  stopRealTimeUpdates,
  setupEventHandlers,
};

// Default export
export default {
  config,
  services: {
    poll: domaPollService,
    orderbook: domaOrderbookService,
    subgraph: domaSubgraphService,
  },
  initialize: initializeDomaServices,
  getStatus: getServicesStatus,
  startRealTimeUpdates,
  stopRealTimeUpdates,
  setupEventHandlers,
};
