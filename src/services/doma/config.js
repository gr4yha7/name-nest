/**
 * Doma Protocol Configuration
 * Centralized configuration for all Doma API endpoints and settings
 */

const config = {
  // API Endpoints
  endpoints: {
    poll: import.meta.env.VITE_DOMA_POLL_API_URL || 'https://api-testnet.doma.xyz/v1/poll',
    orderbook: import.meta.env.VITE_DOMA_ORDERBOOK_API_URL || 'https://api-testnet.doma.xyz/v1/orderbook',
    subgraph: import.meta.env.VITE_DOMA_SUBGRAPH_URL || 'https://api-testnet.doma.xyz/graphql',
  },

  // API Configuration
  api: {
    key: import.meta.env.VITE_DOMA_API_KEY,
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Polling Configuration
  polling: {
    interval: parseInt(import.meta.env.VITE_DOMA_POLL_INTERVAL) || 5000, // 5 seconds
    batchSize: 100,
    maxEvents: 1000,
  },

  // Cache Configuration
  cache: {
    ttl: parseInt(import.meta.env.VITE_DOMA_CACHE_TTL) || 300000, // 5 minutes
    maxSize: 1000,
  },

  // Network Configuration
  networks: {
    ethereum: {
      chainId: 1,
      name: 'Ethereum',
      rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL,
    },
    polygon: {
      chainId: 137,
      name: 'Polygon',
      rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL,
    },
    solana: {
      chainId: 'mainnet-beta',
      name: 'Solana',
      rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL,
    },
  },

  // XMTP Configuration
  xmtp: {
    env: import.meta.env.VITE_XMTP_ENV || 'dev',
    privateKey: import.meta.env.VITE_XMTP_PRIVATE_KEY,
  },
};

export default config;
