# Doma Protocol Integration

This directory contains the complete integration with Doma Protocol, including real-time updates via Poll API, order management via Orderbook API, and enhanced messaging via XMTP.

## 🏗️ Architecture

```
src/services/doma/
├── config.js           # Configuration and environment setup
├── pollService.js      # Real-time event polling
├── orderbookService.js # Order management (listings, offers)
├── subgraphService.js  # GraphQL queries for historical data
├── xmtpService.js      # Enhanced XMTP messaging with domain context
└── index.js           # Main service exports and initialization
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in your project root:

```env
# Doma Protocol Configuration
VITE_DOMA_POLL_API_URL=https://api.doma.xyz/poll
VITE_DOMA_ORDERBOOK_API_URL=https://api.doma.xyz/orderbook
VITE_DOMA_SUBGRAPH_URL=https://api.doma.xyz/subgraph
VITE_DOMA_API_KEY=your_doma_api_key_here

# XMTP Configuration
VITE_XMTP_ENV=dev
VITE_XMTP_PRIVATE_KEY=your_xmtp_private_key_here

# Network Configuration
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_infura_key
VITE_POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/your_infura_key
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### 2. Basic Usage

```jsx
import { useDoma, useDomainListings } from '../hooks/useDoma.js';

function MyComponent() {
  // Initialize Doma services
  const { isInitialized, initialize, services } = useDoma();
  
  // Get domain listings with real-time updates
  const { listings, isLoading, refresh } = useDomainListings({
    status: 'active',
    limit: 20,
  });

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div>
      {isLoading ? 'Loading...' : (
        <div>
          {listings.map(listing => (
            <div key={listing.id}>
              <h3>{listing.domain.name}</h3>
              <p>{listing.price} {listing.currency}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 📡 Services

### Poll Service (Real-time Updates)

Handles real-time event polling from Doma Protocol:

```javascript
import { domaPollService } from '../services/doma/index.js';

// Start polling
await domaPollService.startPolling();

// Listen for events
domaPollService.onEvent('listing.created', (event) => {
  console.log('New listing:', event);
});

domaPollService.onEvent('offer.created', (event) => {
  console.log('New offer:', event);
});
```

### Orderbook Service (Order Management)

Manages domain listings and offers:

```javascript
import { domaOrderbookService } from '../services/doma/index.js';

// Create a listing
const listing = await domaOrderbookService.createListing({
  domain: 'example.eth',
  price: '1.5',
  currency: 'ETH',
  network: 'ethereum',
  seller: '0x...',
});

// Create an offer
const offer = await domaOrderbookService.createOffer({
  listingId: listing.id,
  price: '1.2',
  currency: 'ETH',
  buyer: '0x...',
});

// Accept an offer
await domaOrderbookService.acceptOffer(offer.id);
```

### Subgraph Service (Historical Data)

Queries domain data and history:

```javascript
import { domaSubgraphService } from '../services/doma/index.js';

// Get domain listings
const listings = await domaSubgraphService.getDomainListings({
  status: 'active',
  network: 'ethereum',
  limit: 50,
});

// Search domains
const domains = await domaSubgraphService.searchDomains('crypto', {
  network: 'ethereum',
  hasListings: true,
});

// Get user's domains
const userDomains = await domaSubgraphService.getUserDomains('0x...');
```

### XMTP Service (Enhanced Messaging)

Domain-contextual messaging:

```javascript
import { domaXMTPService } from '../services/doma/index.js';

// Send a text message
await domaXMTPService.sendMessage(
  '0x...', 
  'Hello!', 
  { domain: 'example.eth', network: 'ethereum' }
);

// Send an offer
await domaXMTPService.sendOffer(
  '0x...',
  { price: '1.2', currency: 'ETH' },
  { name: 'example.eth', network: 'ethereum' }
);
```

## 🎣 React Hooks

### useDoma

Main hook for Doma services:

```javascript
const { 
  isInitialized, 
  isLoading, 
  error, 
  initialize, 
  startUpdates, 
  stopUpdates,
  services 
} = useDoma({
  autoInitialize: true,
  initializeSubgraph: true,
  initializeOrderbook: true,
});
```

### useDomainListings

Get domain listings with real-time updates:

```javascript
const { 
  listings, 
  isLoading, 
  error, 
  loadMore, 
  refresh 
} = useDomainListings({
  status: 'active',
  network: 'ethereum',
  limit: 20,
});
```

### useDomainOffers

Get offers for a specific domain:

```javascript
const { 
  offers, 
  isLoading, 
  error, 
  refresh 
} = useDomainOffers({
  listingId: 'listing-id',
  status: 'active',
});
```

### useUserDomains

Get user's domain portfolio:

```javascript
const { 
  domains, 
  isLoading, 
  error, 
  refresh 
} = useUserDomains('0x...');
```

### useXMTPMessaging

Enhanced XMTP messaging:

```javascript
const { 
  isConnected, 
  sendMessage, 
  sendOffer 
} = useXMTPMessaging('user-private-key');
```

## 🔄 Real-time Updates

The integration provides real-time updates through the Doma Poll API:

```javascript
// Setup event handlers
setupEvents({
  onListingCreated: (event) => {
    console.log('New listing:', event);
    // Update UI
  },
  onOfferCreated: (event) => {
    console.log('New offer:', event);
    // Update UI
  },
  onOfferAccepted: (event) => {
    console.log('Offer accepted:', event);
    // Update UI
  },
});
```

## 🌐 Multi-chain Support

The integration supports multiple blockchains:

- **Ethereum**: ENS domains, ETH payments
- **Polygon**: Lower fees, faster transactions
- **Solana**: High-performance domain trading

```javascript
// Create listing on different networks
await domaOrderbookService.createListing({
  domain: 'example.eth',
  network: 'ethereum',
  price: '1.5',
  currency: 'ETH',
});

await domaOrderbookService.createListing({
  domain: 'example.sol',
  network: 'solana',
  price: '50',
  currency: 'SOL',
});
```

## 🛡️ Error Handling

All services include robust error handling:

```javascript
try {
  const listing = await domaOrderbookService.createListing(data);
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    // Handle insufficient funds
  } else if (error.code === 'NETWORK_ERROR') {
    // Handle network issues
  } else {
    // Handle other errors
  }
}
```

## 📊 Caching

The services include intelligent caching:

- **Subgraph queries**: Cached for 5 minutes by default
- **Order data**: Cached until invalidated
- **User domains**: Cached with TTL

## 🔧 Configuration

Customize the integration through the config file:

```javascript
// src/services/doma/config.js
const config = {
  polling: {
    interval: 5000, // Poll every 5 seconds
    batchSize: 100,
  },
  cache: {
    ttl: 300000, // 5 minutes
    maxSize: 1000,
  },
  api: {
    timeout: 30000,
    retryAttempts: 3,
  },
};
```

## 📝 Examples

See `src/examples/DomaIntegrationExample.jsx` for a complete working example.

## 🐛 Troubleshooting

### Common Issues

1. **Services not initializing**: Check API keys and network connectivity
2. **Real-time updates not working**: Verify Poll API endpoint and credentials
3. **XMTP connection failed**: Ensure private key is valid and XMTP environment is correct

### Debug Mode

Enable debug logging:

```javascript
// In your component
const { initialize } = useDoma({
  debug: true, // Enable debug logging
});
```

## 📚 API Reference

For detailed API documentation, see:
- [Doma Protocol Documentation](https://docs.doma.xyz)
- [XMTP Documentation](https://docs.xmtp.org)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)

## 🤝 Contributing

When adding new features:

1. Follow the existing service pattern
2. Add proper error handling
3. Include TypeScript types if applicable
4. Update this README
5. Add tests for new functionality
