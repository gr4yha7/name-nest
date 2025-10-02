/**
 * Doma Orderbook API Service
 * Handles order management through Doma Protocol
 */

import { 
  createDomaOrderbookClient, 
  OrderbookType, 
  DomaOrderbookError, 
  DomaOrderbookErrorCode, 
  getDomaOrderbookClient
} from '@doma-protocol/orderbook-sdk';
import { viemToEthersSigner } from '@doma-protocol/orderbook-sdk';
import config from './config.js';
import { currencies, domaTestnet } from 'utils/cn.js';
import { baseSepolia, sepolia, shibariumTestnet } from 'viem/chains';
import { formatUnits, parseUnits } from 'viem';
import toast from 'react-hot-toast';

class DomaOrderbookService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.orderCache = new Map();
    this.cacheExpiry = new Map();
  }

  /**
   * Initialize the Orderbook SDK
   * @param {Object} options - Initialization options
   */
  async initialize(options = {}) {
    try {
      const clientConfig = {
        apiClientOptions: {
          baseUrl: config.endpoints.orderbook,
          defaultHeaders: {
            "Api-Key": config.api.key,
          },
        },
        source: "domainLine",
        chains: [
          domaTestnet,
          baseSepolia,
          sepolia,
          shibariumTestnet
        ]
      };

      this.client = createDomaOrderbookClient(clientConfig);
      this.isInitialized = true;
      
      console.log('Doma Orderbook SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Doma Orderbook SDK:', error);
      throw error;
    }
  }

  /**
   * Create a new domain listing
   * @param {Object} listingData - Listing data
   * @param {Object} signer - Wallet signer
   * @param {string} chainId - Chain ID (e.g., 'eip155:1')
   * @param {Function} onProgress - Progress callback
   */
  async createListing(listingData, signer, chainId, currencyAddress, currency, onProgress = null) {
    this.ensureInitialized();

    try {
      // Convert price to wei if needed
      const currencyDetails = currencies.find((c) => c.symbol === currency);
      const client = getDomaOrderbookClient();

      const result = await client.createListing({
        signer,
        chainId,
        params: {
          orderbook: OrderbookType.DOMA,
          source: "domainLine",
          items: [{
            contract: listingData.contractAddress,
            tokenId: listingData.tokenId,
            price: parseUnits(listingData?.price, currencyDetails?.decimals),
            duration: listingData?.expiryDate || Math.floor(Date.now() / 1000) + 86400, // 24 hours default,
            currencyContractAddress: currencyAddress
          }],
        },
        onProgress: onProgress || ((step, progress) => {
          console.log(`Creating listing: ${step} (${progress}%)`);
        }),
      });

      // Cache the listing
      this.cacheOrder(result.orderId, result);
      
      console.log('Created listing:', result.orderId);
      return result;
    } catch (error) {
      this.handleOrderbookError(error);
      throw error;
    }
  }

  /**
   * Create a new offer for a domain
   * @param {Object} offerData - Offer data
   * @param {Object} signer - Wallet signer
   * @param {string} chainId - Chain ID (e.g., 'eip155:1')
   * @param {Function} onProgress - Progress callback
   */
  async createOffer(offerData, signer, chainId, currency, onProgress = null) {
    this.ensureInitialized();
    console.log(offerData)
    console.log(chainId)
    console.log(currency)
    
    try {
      const currencyDetails = currencies.find((c) => c.symbol === currency);
      console.log(parseUnits(offerData?.price, currencyDetails?.decimals))

      const result = await this.client.createOffer({
        signer,
        chainId,
        params: {
          orderbook: OrderbookType.DOMA,
          source: "domainLine",
          items: [{
            contract: offerData.contractAddress,
            tokenId: offerData.tokenId,
            currencyContractAddress: offerData.currencyContractAddress,
            price: parseUnits(offerData?.price, currencyDetails?.decimals).toString(),
          }],
          expirationTime: offerData.expirationTime || Math.floor(Date.now() / 1000) + 86400, // 24 hours default
        },
        onProgress:((progress) => {
          console.log("progress", progress)
          const isAllComplete = progress.every((p) => p.status === "complete");
          if (isAllComplete) {
            toast.success("Offer created successfully!");
          }
        }),
      });

      // Cache the offer
      this.cacheOrder(result.orders[0]?.orderId, result);
      
      console.log('Created offer:', result);
      return result.orders[0];
    } catch (error) {
      this.handleOrderbookError(error);
      return 0;
    }
  }

  /**
   * Accept an offer
   * @param {string} offerId - Offer ID
   * @param {Object} signer - Wallet signer
   * @param {string} chainId - Chain ID (e.g., 'eip155:1')
   * @param {Function} onProgress - Progress callback
   */
  async acceptOffer(offerId, signer, chainId, onProgress = null) {
    this.ensureInitialized();

    try {
      const result = await this.client.acceptOffer({
        params: {
          orderId: offerId,
        },
        signer,
        chainId,
        onProgress: onProgress || ((step, progress) => {
          console.log(`Accepting offer: ${step} (${progress}%)`);
        }),
      });

      // Update cache
      this.invalidateOrder(offerId);
      
      console.log('Accepted offer:', offerId);
      return result;
    } catch (error) {
      this.handleOrderbookError(error);
      throw error;
    }
  }

  /**
   * Buy a listing
   * @param {string} orderId - Listing ID
   * @param {string} fulfillerAddress - Address of the buyer
   * @param {Object} signer - Wallet signer
   * @param {string} chainId - Chain ID (e.g., 'eip155:1')
   * @param {Function} onProgress - Progress callback
   */
  async buyListing(orderId, signer, chainId, onProgress = null) {
    this.ensureInitialized();
    try {
      const result = await this.client.buyListing({
        params: {
          orderId
        },
        signer,
        chainId,
        onProgress: onProgress || ((step, progress) => {
          console.log(`Buying listing: ${step} (${progress}%)`);
        }),
      });

      // Update cache
      this.invalidateOrder(orderId);
      
      console.log('Bought listing:', orderId);
      return orderId;
    } catch (error) {
      this.handleOrderbookError(error);
      return error;
    }
  }

  /**
   * Cancel a listing
   * @param {string} orderId - Listing ID
   * @param {Object} signer - Wallet signer
   * @param {string} chainId - Chain ID (e.g., 'eip155:1')
   * @param {Function} onProgress - Progress callback
   */
  async cancelListing(orderId, signer, chainId, onProgress = null) {
    this.ensureInitialized();

    try {
      const result = await this.client.cancelListing({
        params: {
          orderId,
        },
        signer,
        chainId,
        onProgress: onProgress || ((step, progress) => {
          console.log(`Cancelling listing: ${step} (${progress}%)`);
        }),
      });

      // Update cache
      this.invalidateOrder(orderId);
      
      console.log('Cancelled listing:', orderId);
      return result;
    } catch (error) {
      this.handleOrderbookError(error);
      throw error;
    }
  }

  /**
   * Cancel an offer
   * @param {string} orderId - Offer ID
   * @param {Object} signer - Wallet signer
   * @param {string} chainId - Chain ID (e.g., 'eip155:1')
   * @param {Function} onProgress - Progress callback
   */
  async cancelOffer(orderId, signer, chainId, onProgress = null) {
    this.ensureInitialized();

    try {
      const result = await this.client.cancelOffer({
        params: {
          orderId,
        },
        signer,
        chainId,
        onProgress: onProgress || ((step, progress) => {
          console.log(`Cancelling offer: ${step} (${progress}%)`);
        }),
      });

      // Update cache
      this.invalidateOrder(orderId);
      
      console.log('Cancelled offer:', orderId);
      return result;
    } catch (error) {
      this.handleOrderbookError(error);
      throw error;
    }
  }

  /**
   * Get marketplace fees for a contract
   * @param {string} contractAddress - Contract address
   * @param {string} chainId - Chain ID (e.g., 'eip155:1')
   */
  async getOrderbookFee(contractAddress, chainId) {
    this.ensureInitialized();

    try {
      const feeResponse = await this.client.getOrderbookFee({
        contractAddress,
        orderbook: OrderbookType.DOMA,
        chainId,
      });

      return feeResponse;
    } catch (error) {
      this.handleOrderbookError(error);
      throw error;
    }
  }

  /**
   * Get supported currencies
   * @param {string} contractAddress - Contract address (not used currently)
   * @param {string} chainId - Chain ID (e.g., 'eip155:1')
   */
  async getSupportedCurrencies(contractAddress, chainId) {
    this.ensureInitialized();

    try {
      const currenciesResponse = await this.client.getSupportedCurrencies({
        contractAddress, // not used at the moment
        orderbook: OrderbookType.DOMA, // not used at the moment / will only return DOMA Orderbook for now
        chainId,
      });

      return currenciesResponse;
    } catch (error) {
      this.handleOrderbookError(error);
      throw error;
    }
  }

  /**
   * Convert price to wei
   * @param {string|number} price - Price in human readable format
   * @param {string} currency - Currency symbol
   */
  convertToWei(price, currency = 'ETH') {
    const priceStr = price.toString();
    
    // For ETH, convert to wei (18 decimals)
    if (currency === 'ETH' || currency === 'WETH') {
      return (parseFloat(priceStr) * Math.pow(10, 18)).toString();
    }
    
    // For other currencies, assume 18 decimals for now
    // In production, you'd want to fetch the actual decimals from the token contract
    return (parseFloat(priceStr) * Math.pow(10, 18)).toString();
  }

  /**
   * Convert wei to human readable format
   * @param {string} weiAmount - Amount in wei
   * @param {string} currency - Currency symbol
   */
  convertFromWei(weiAmount, currency = 'ETH') {
    const wei = BigInt(weiAmount);
    const decimals = 18; // Most tokens use 18 decimals
    
    const divisor = BigInt(Math.pow(10, decimals));
    const wholePart = wei / divisor;
    const fractionalPart = wei % divisor;
    
    if (fractionalPart === 0n) {
      return wholePart.toString();
    }
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.replace(/0+$/, '');
    
    if (trimmedFractional === '') {
      return wholePart.toString();
    }
    
    return `${wholePart}.${trimmedFractional}`;
  }

  /**
   * Handle Doma Orderbook errors
   * @param {Error} error - Error object
   */
  handleOrderbookError(error) {
    if (error instanceof DomaOrderbookError) {
      switch (error.code) {
        case DomaOrderbookErrorCode.SIGNER_NOT_PROVIDED:
          console.error('Please connect your wallet');
          toast.error(error?.message)
          break;
        case DomaOrderbookErrorCode.FETCH_FEES_FAILED:
          console.error('Failed to fetch marketplace fees');
          toast.error(error?.message)
          break;
        case DomaOrderbookErrorCode.CLIENT_NOT_INITIALIZED:
          console.error('SDK not initialized');
          toast.error(error?.message)
          break;
        case DomaOrderbookErrorCode.INSUFFICIENT_FUNDS:
          console.error('Insufficient funds for transaction');
          toast.error(error?.message)
          break;
        case DomaOrderbookErrorCode.ORDER_NOT_FOUND:
          console.error('Order not found');
          toast.error(error?.message)
          break;
        case DomaOrderbookErrorCode.ORDER_EXPIRED:
          console.error('Order has expired');
          toast.error(error?.message)
          break;
        case DomaOrderbookErrorCode.ORDER_ALREADY_FULFILLED:
          console.error('Order already fulfilled');
          toast.error(error?.message)
          break;
        case DomaOrderbookErrorCode.ORDER_CANCELLED:
          console.error('Order has been cancelled');
          toast.error(error?.message)
          break;
        case DomaOrderbookErrorCode.INVALID_SIGNATURE:
          console.error('Invalid signature');
          toast.error(error?.message)
          break;
        case DomaOrderbookErrorCode.NETWORK_ERROR:
          console.error('Network error occurred');
          toast.error(error?.message)
          break;
        default:
          console.error('Unknown Doma Orderbook error:', error.message);
          toast.error(error?.message)
      }
    } else {
      console.error('Non-Doma Orderbook error:', error.message);
    }
  }

  /**
   * Convert Viem wallet client to Ethers signer
   * @param {Object} walletClient - Viem wallet client
   * @param {string} chainId - Chain ID
   */
  convertViemToEthersSigner(walletClient, chainId) {
    return viemToEthersSigner(walletClient, chainId);
  }

  /**
   * Cache an order
   * @param {string} orderId - Order ID
   * @param {Object} order - Order data
   */
  cacheOrder(orderId, order) {
    this.orderCache.set(orderId, order);
    this.cacheExpiry.set(orderId, Date.now() + config.cache.ttl);
  }

  /**
   * Check if cache is expired
   * @param {string} orderId - Order ID
   */
  isCacheExpired(orderId) {
    const expiry = this.cacheExpiry.get(orderId);
    return !expiry || Date.now() > expiry;
  }

  /**
   * Invalidate cached order
   * @param {string} orderId - Order ID
   */
  invalidateOrder(orderId) {
    this.orderCache.delete(orderId);
    this.cacheExpiry.delete(orderId);
  }

  /**
   * Clear all cached orders
   */
  clearCache() {
    this.orderCache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Ensure SDK is initialized
   */
  ensureInitialized() {
    if (!this.isInitialized || !this.client) {
      throw new Error('Doma Orderbook SDK not initialized. Call initialize() first.');
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      cacheSize: this.orderCache.size,
      clientVersion: this.client?.version || 'unknown',
    };
  }
}

// Create singleton instance
const domaOrderbookService = new DomaOrderbookService();

export default domaOrderbookService;
