# Doma Protocol Integration

This directory contains the complete integration with Doma Protocol, providing a comprehensive suite of services for decentralized domain trading, real-time updates, and secure messaging. Built following official XMTP and Doma Protocol documentation standards.

## 🌟 Overview

The Doma Protocol integration provides a complete solution for:
- **Real-time domain trading** across multiple blockchains
- **Live event streaming** for instant updates
- **Secure messaging** with domain context
- **Portfolio management** and analytics
- **Multi-chain support** for Ethereum, Polygon, and Solana

## 🏗️ Architecture

```
src/services/doma/
├── config.js           # Centralized configuration management
├── pollService.js      # Real-time event polling (NAME_CLAIMED, NAME_TOKENIZED)
├── orderbookService.js # Order management with Doma SDK integration
├── subgraphService.js  # GraphQL queries for historical data
├── xmtpService.js      # XMTP messaging with consent management
├── index.js           # Service exports and initialization
└── README.md          # This documentation
```

## 🔧 Service Components

### **Configuration (`config.js`)**
- Environment variable management
- API endpoint configuration
- Network settings for multi-chain support
- Caching and polling configuration

### **Poll Service (`pollService.js`)**
- Real-time event streaming from Doma Protocol
- Event filtering (NAME_CLAIMED, NAME_TOKENIZED)
- Automatic event acknowledgment
- Error handling and retry logic

### **Orderbook Service (`orderbookService.js`)**
- Domain listing creation and management
- Offer creation and acceptance
- Order cancellation and updates
- Integration with Doma Orderbook SDK

### **Subgraph Service (`subgraphService.js`)**
- GraphQL queries for domain data
- Historical data retrieval
- Search and filtering capabilities
- Apollo Client integration with caching

### **XMTP Service (`xmtpService.js`)**
- Decentralized messaging with domain context
- Consent management for spam protection
- Real-time message streaming
- Rich content support for offers and negotiations

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in your project root:

```env
# Doma Protocol Configuration
VITE_DOMA_POLL_API_URL=https://api-testnet.doma.xyz/v1/poll
VITE_DOMA_ORDERBOOK_API_URL=https://api-testnet.doma.xyz/orderbook
VITE_DOMA_SUBGRAPH_URL=https://api-testnet.doma.xyz/subgraph
VITE_DOMA_API_KEY=your_doma_api_key_here

# XMTP Configuration
VITE_XMTP_ENV=dev
VITE_XMTP_PRIVATE_KEY=your_xmtp_private_key_here

# Network Configuration
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_infura_key
VITE_POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/your_infura_key
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Application Configuration
VITE_ENVIRONMENT=development
VITE_DOMA_POLL_INTERVAL=5000
VITE_DOMA_CACHE_TTL=300000
```

### 2. Basic Usage

#### **Initialize Doma Services**
```jsx
import { useDoma } from '../hooks/useDoma.js';

function MyComponent() {
  const { 
    isInitialized, 
    isLoading, 
    error, 
    initialize, 
    services 
  } = useDoma();

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initialize();
    }
  }, [isInitialized, isLoading, initialize]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {isLoading ? 'Loading...' : 'Doma services ready!'}
    </div>
  );
}
```

#### **Domain Listings with Real-Time Updates**
```jsx
import { useDomainListings } from '../hooks/useDoma.js';

function DomainMarketplace() {
  const { 
    listings, 
    isLoading, 
    error, 
    loadMore, 
    refresh 
  } = useDomainListings({
    skip: 0,
    take: 20,
    tlds: ['com', 'org'],
    networkIds: ['eip155:1'],
    sortOrder: 'DESC'
  });

  return (
    <div>
      {listings?.items?.map(listing => (
        <div key={listing.id}>
          <h3>{listing.name}</h3>
          <p>{listing.price} {listing.currency.symbol}</p>
          <p>Network: {listing.chain.name}</p>
        </div>
      ))}
    </div>
  );
}
```

#### **Portfolio Management**
```jsx
import { useUserDomains } from '../hooks/useDoma.js';

function PortfolioDashboard({ userAddress }) {
  const { 
    domains, 
    isLoading, 
    error, 
    refresh 
  } = useUserDomains(userAddress, {
    take: 50,
    sortOrder: 'DESC'
  });

  return (
    <div>
      <h2>Your Domains ({domains?.totalCount})</h2>
      {domains?.items?.map(domain => (
        <div key={domain.name}>
          <h3>{domain.name}</h3>
          <p>Expires: {domain.expiresAt}</p>
          <p>Tokenized: {domain.tokenizedAt}</p>
        </div>
      ))}
    </div>
  );
}
```

#### **Secure Messaging**
```jsx
import { useXMTPMessaging } from '../hooks/useDoma.js';

function MessagingCenter({ privateKey, walletAddress }) {
  const { 
    isConnected, 
    sendMessage, 
    sendOffer,
    conversations 
  } = useXMTPMessaging(privateKey, walletAddress);

  const handleSendOffer = async (recipientAddress, domainData) => {
    await sendOffer(recipientAddress, {
      price: '1.5',
      currency: 'ETH',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }, domainData);
  };

  return (
    <div>
      {isConnected ? 'Connected to XMTP' : 'Connecting...'}
    </div>
  );
}
```

## 📡 Services

### Poll Service (Real-time Updates)

Handles real-time event polling from Doma Protocol with focus on domain events:

```javascript
import { domaPollService } from '../services/doma/index.js';

// Start polling with specific event types
await domaPollService.startPolling(null, {
  eventTypes: ['NAME_CLAIMED', 'NAME_TOKENIZED'],
  interval: 5000,
  limit: 10
});

// Listen for specific events
domaPollService.onEvent('NAME_CLAIMED', (event) => {
  console.log('Domain claimed:', event.eventData.name, 'by', event.eventData.owner);
});

domaPollService.onEvent('NAME_TOKENIZED', (event) => {
  console.log('Domain tokenized:', event.eventData.name);
});

// Listen for all events
domaPollService.onEvent('*', (event) => {
  console.log('Doma event:', event.type, event);
});

// Acknowledge events manually
await domaPollService.acknowledgeEvents(eventId);

// Reset polling cursor
await domaPollService.resetPollingCursor(0);
```

### Orderbook Service (Order Management)

Manages domain listings and offers using the official Doma Orderbook SDK:

```javascript
import { domaOrderbookService } from '../services/doma/index.js';

// Create a listing (requires signer and chainId)
const listing = await domaOrderbookService.createListing({
  contractAddress: '0x...',
  tokenId: '123456789',
  price: '1500000000000000000', // 1.5 ETH in wei
  currency: 'ETH',
}, signer, chainId, (step, progress) => {
  console.log(`Creating listing: ${step} (${progress}%)`);
});

// Create an offer
const offer = await domaOrderbookService.createOffer({
  contractAddress: '0x...',
  tokenId: '123456789',
  price: '1200000000000000000', // 1.2 ETH in wei
  currency: 'ETH',
}, signer, chainId, (step, progress) => {
  console.log(`Creating offer: ${step} (${progress}%)`);
});

// Buy a listing
await domaOrderbookService.buyListing(
  listing.id, 
  buyerAddress, 
  signer, 
  chainId,
  (step, progress) => {
    console.log(`Buying listing: ${step} (${progress}%)`);
  }
);

// Accept an offer
await domaOrderbookService.acceptOffer(
  offer.id, 
  signer, 
  chainId,
  (step, progress) => {
    console.log(`Accepting offer: ${step} (${progress}%)`);
  }
);

// Cancel a listing
await domaOrderbookService.cancelListing(listing.id, signer, chainId);

// Get marketplace fees
const fees = await domaOrderbookService.getOrderbookFee(chainId);

// Get supported currencies
const currencies = await domaOrderbookService.getSupportedCurrencies(chainId);
```

### Subgraph Service (Historical Data)

Queries domain data using the official Doma GraphQL schema:

```javascript
import { domaSubgraphService } from '../services/doma/index.js';

// Get domain listings with pagination
const listings = await domaSubgraphService.getDomainListings({
  skip: 0,
  take: 50,
  tlds: ['com', 'org'],
  networkIds: ['eip155:1'],
  sortOrder: 'DESC'
});

// Get domain offers
const offers = await domaSubgraphService.getDomainOffers({
  skip: 0,
  take: 20,
  tokenId: '123456789',
  status: 'ACTIVE'
});

// Search domains with advanced filtering
const domains = await domaSubgraphService.searchDomains({
  name: 'crypto',
  networkIds: ['eip155:1'],
  tlds: ['com'],
  fractionalized: false,
  listed: true,
  priceRangeMin: 0.1,
  priceRangeMax: 10.0,
  priceRangeCurrency: 'ETH'
});

// Get user's domains
const userDomains = await domaSubgraphService.getUserDomains('0x...', {
  take: 100,
  sortOrder: 'DESC'
});

// Get domain details
const domainDetails = await domaSubgraphService.getDomainDetails('example.com');

// Get name activities
const activities = await domaSubgraphService.getNameActivities('example.com', {
  take: 50,
  type: 'TOKENIZED'
});

// Get name statistics
const stats = await domaSubgraphService.getNameStatistics('123456789');

// Get chain statistics
const chainStats = await domaSubgraphService.getChainStatistics();
```

### XMTP Service (Enhanced Messaging)

Decentralized messaging with domain context and consent management:

```javascript
import { domaXMTPService } from '../services/doma/index.js';

// Initialize XMTP client
await domaXMTPService.initialize(privateKey, walletAddress);

// Check if recipient can receive messages
const canMessage = await domaXMTPService.canMessage('0x...');

// Send a text message with domain context
await domaXMTPService.sendMessage(
  '0x...', 
  'Hello!', 
  { 
    domain: 'example.com', 
    network: 'ethereum',
    listingId: '123456789'
  }
);

// Send an offer
await domaXMTPService.sendOffer(
  '0x...',
  { 
    price: '1200000000000000000', // 1.2 ETH in wei
    currency: 'ETH',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  { 
    name: 'example.com', 
    network: 'ethereum',
    tokenId: '123456789'
  }
);

// Send a counter-offer
await domaXMTPService.sendCounterOffer(
  '0x...',
  { 
    price: '1000000000000000000', // 1.0 ETH in wei
    currency: 'ETH',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  originalOffer
);

// Manage consent
await domaXMTPService.setConsentState('0x...', 'Allowed');
const consentState = await domaXMTPService.getConsentState('0x...');

// Get conversations with consent filtering
const conversations = await domaXMTPService.getAllConversations(['Allowed']);

// Stream conversations in real-time
const conversationStream = await domaXMTPService.streamConversations();

// Get conversation history
const history = await domaXMTPService.getConversationHistory('0x...', {
  limit: 50
});

// Register message handlers
domaXMTPService.onMessage((message, conversation) => {
  console.log('New message:', message);
  // Handle domain-specific messages
});

// Cleanup
await domaXMTPService.cleanup();
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

## 📊 Data Structures

### **Domain Listing Response**
```javascript
{
  items: [{
    id: "listing_123",
    externalId: "ext_456",
    price: "1000000000000000000", // BigInt as string
    offererAddress: "eip155:1:0x...",
    orderbook: "DOMA",
    currency: {
      address: "0x...",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18
    },
    expiresAt: "2024-12-31T23:59:59Z",
    createdAt: "2024-01-01T00:00:00Z",
    name: "example.com",
    nameExpiresAt: "2025-01-01T00:00:00Z",
    registrar: {
      ianaId: 1,
      name: "Example Registrar",
      url: "https://example.com"
    },
    tokenId: "123456789",
    tokenAddress: "0x...",
    chain: {
      chainId: 1,
      name: "Ethereum",
      rpcUrl: "https://..."
    }
  }],
  totalCount: 100,
  pageSize: 50,
  currentPage: 1,
  totalPages: 2,
  hasPreviousPage: false,
  hasNextPage: true
}
```

### **Domain Details Response**
```javascript
{
  name: "example.com",
  expiresAt: "2025-01-01T00:00:00Z",
  tokenizedAt: "2024-01-01T00:00:00Z",
  eoi: false,
  registrar: {
    ianaId: 1,
    name: "Example Registrar",
    url: "https://example.com"
  },
  nameservers: [{
    name: "ns1.example.com",
    ipv4: "192.168.1.1",
    ipv6: "2001:db8::1"
  }],
  dsKeys: [{
    keyTag: 12345,
    algorithm: 8,
    digestType: 2,
    digest: "ABCD1234..."
  }],
  transferLock: false,
  claimedBy: "eip155:1:0x...",
  tokens: [{
    id: "token_123",
    tokenId: "123456789",
    tokenAddress: "0x...",
    owner: "eip155:1:0x...",
    chain: {
      chainId: 1,
      name: "Ethereum",
      rpcUrl: "https://..."
    }
  }],
  activities: [/* activity history */],
  isFractionalized: false,
  fractionalTokenInfo: [/* fractionalization data */]
}
```

### **Event Data Structure**
```javascript
{
  id: 101,
  name: "example.com",
  tokenId: "109782310436602119473309635585647935844683647842954156419454133097053284015402",
  type: "NAME_CLAIMED", // or "NAME_TOKENIZED"
  uniqueId: "text",
  relayId: "text",
  eventData: {
    networkId: "eip155:1",
    finalized: true,
    txHash: "0x...",
    blockNumber: "11111",
    logIndex: 1,
    tokenAddress: "0x...",
    tokenId: "1",
    type: "NAME_CLAIMED",
    owner: "eip155:1:0x...",
    name: "example.com",
    expiresAt: "2026-01-17T13:55:54.099Z",
    correlationId: "text"
  }
}
```

## 📝 Examples

See `src/examples/DomaIntegrationExample.jsx` for a complete working example that demonstrates:
- Service initialization
- Real-time event handling
- Domain listing creation and management
- Offer creation and acceptance
- XMTP messaging integration
- Error handling and progress tracking

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
