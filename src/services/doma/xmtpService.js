/**
 * Enhanced XMTP Service for Domain Context
 * Integrates XMTP messaging with Doma domain data
 * Based on official XMTP Browser SDK documentation: https://docs.xmtp.org/chat-apps/intro/get-started
 */

import { Client, ConsentEntityType, ConsentState } from '@xmtp/browser-sdk';
import config from './config.js';

class DomaXMTPService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.conversations = new Map();
    this.messageHandlers = new Set();
    this.conversationStream = null;
    this.messageStream = null;
  }

  /**
   * Create a signer from private key
   * @param {string} privateKey - User's private key
   * @param {string} address - User's wallet address
   */
  createSigner(privateKey, address) {
    return {
      type: 'EOA',
      getIdentifier: () => ({
        identifier: address,
        identifierKind: 'Ethereum'
      }),
      signMessage: async (message) => {
        // This would need to be implemented with the actual signing logic
        // For now, we'll use the privateKey directly
        const { ethers } = await import('ethers');
        const wallet = new ethers.Wallet(privateKey);
        const signature = await wallet.signMessage(message);
        return ethers.getBytes(signature);
      }
    };
  }

  /**
   * Initialize XMTP client
   * @param {string} privateKey - User's private key
   * @param {string} address - User's wallet address
   */
  async initialize(privateKey = null, address = null) {
    try {
      const key = privateKey || config.xmtp.privateKey;
      
      if (!key) {
        throw new Error('XMTP private key is required');
      }

      if (!address) {
        throw new Error('Wallet address is required');
      }

      // Create signer
      const signer = this.createSigner(key, address);

      // Create XMTP client with proper options
      this.client = await Client.create(signer, {
        env: config.xmtp.env || 'dev',
        appVersion: 'namenest/1.0.0', // Required by XMTP docs
      });

      this.isInitialized = true;
      console.log('XMTP client initialized successfully');
      
      // Start listening for messages
      await this.startMessageListener();
      
    } catch (error) {
      console.error('Failed to initialize XMTP client:', error);
      throw error;
    }
  }

  /**
   * Start listening for incoming messages
   * Uses modern XMTP streaming API as per documentation
   */
  async startMessageListener() {
    if (!this.isInitialized) {
      throw new Error('XMTP client not initialized');
    }

    try {
      // Stream all messages with consent filtering
      this.messageStream = await this.client.conversations.streamAllMessages({
        consentStates: [ConsentState.Allowed],
        onValue: (message) => {
          this.handleIncomingMessage(message);
        },
        onError: (error) => {
          console.error('Message stream error:', error);
        }
      });

      console.log('XMTP message listener started successfully');
    } catch (error) {
      console.error('Failed to start message listener:', error);
    }
  }

  /**
   * Handle incoming message
   * @param {Message} message - Incoming message
   */
  async handleIncomingMessage(message) {
    try {
      // Parse message content
      const messageData = this.parseMessageContent(message.content);
      
      // Add domain context if available
      const enrichedMessage = {
        ...messageData,
        conversationTopic: message.conversationTopic,
        senderAddress: message.senderAddress,
        timestamp: message.sentAt,
        messageId: message.id,
      };

      // Notify message handlers
      for (const handler of this.messageHandlers) {
        try {
          await handler(enrichedMessage, message);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      }

      console.log('Processed incoming message:', enrichedMessage);
    } catch (error) {
      console.error('Failed to handle incoming message:', error);
    }
  }

  /**
   * Check if an identity is reachable on XMTP
   * @param {string} address - Wallet address to check
   */
  async canMessage(address) {
    this.ensureInitialized();
    
    try {
      return await this.client.canMessage(address);
    } catch (error) {
      console.error('Failed to check if address can message:', error);
      return false;
    }
  }

  /**
   * Set consent state for a conversation
   * @param {string} peerAddress - Peer's wallet address
   * @param {string} state - Consent state (Allowed, Denied, Unknown)
   */
  async setConsentState(peerAddress, state = ConsentState.Allowed) {
    this.ensureInitialized();
    
    try {
      await this.client.setConsentStates([
        {
          entityId: peerAddress,
          entityType: ConsentEntityType.Address,
          state: state,
        },
      ]);
      console.log(`Consent state set to ${state} for ${peerAddress}`);
    } catch (error) {
      console.error('Failed to set consent state:', error);
      throw error;
    }
  }

  /**
   * Get consent state for a conversation
   * @param {string} peerAddress - Peer's wallet address
   */
  async getConsentState(peerAddress) {
    this.ensureInitialized();
    
    try {
      return await this.client.getConsentState(ConsentEntityType.Address, peerAddress);
    } catch (error) {
      console.error('Failed to get consent state:', error);
      return ConsentState.Unknown;
    }
  }

  /**
   * Parse message content for domain-specific data
   * @param {string} content - Message content
   */
  parseMessageContent(content) {
    try {
      // Try to parse as JSON for structured messages
      const parsed = JSON.parse(content);
      
      // Check if it's a domain-related message
      if (parsed.type && ['offer', 'counter-offer', 'accept', 'reject'].includes(parsed.type)) {
        return {
          type: parsed.type,
          content: parsed.message || content,
          domainData: parsed.domainData,
          offerData: parsed.offerData,
          metadata: parsed.metadata,
        };
      }
      
      return {
        type: 'text',
        content: content,
      };
    } catch {
      // Not JSON, treat as plain text
      return {
        type: 'text',
        content: content,
      };
    }
  }

  /**
   * Send a text message
   * @param {string} recipientAddress - Recipient's wallet address
   * @param {string} content - Message content
   * @param {Object} domainContext - Domain context data
   */
  async sendMessage(recipientAddress, content, domainContext = null) {
    this.ensureInitialized();

    try {
      // Check if recipient can receive messages
      const canMessage = await this.canMessage(recipientAddress);
      if (!canMessage) {
        throw new Error('Recipient is not reachable on XMTP');
      }

      const conversation = await this.client.conversations.newConversation(recipientAddress);
      
      let messageContent = content;
      
      // Add domain context if provided
      if (domainContext) {
        const structuredMessage = {
          type: 'text',
          message: content,
          domainData: domainContext,
          timestamp: new Date().toISOString(),
        };
        messageContent = JSON.stringify(structuredMessage);
      }

      await conversation.send(messageContent);
      console.log('Message sent successfully');
      
      // Set consent to allowed for future messages
      await this.setConsentState(recipientAddress, ConsentState.Allowed);
      
      return {
        success: true,
        conversationTopic: conversation.topic,
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Send a domain offer message
   * @param {string} recipientAddress - Recipient's wallet address
   * @param {Object} offerData - Offer data
   * @param {Object} domainData - Domain data
   */
  async sendOffer(recipientAddress, offerData, domainData) {
    this.ensureInitialized();

    try {
      const conversation = await this.client.conversations.newConversation(recipientAddress);
      
      const offerMessage = {
        type: 'offer',
        message: `I'd like to make an offer of ${offerData.currency} ${offerData.price} for ${domainData.name}`,
        offerData: {
          price: offerData.price,
          currency: offerData.currency,
          expiresAt: offerData.expiresAt,
          network: offerData.network,
        },
        domainData: {
          name: domainData.name,
          network: domainData.network,
          listingId: domainData.listingId,
        },
        timestamp: new Date().toISOString(),
      };

      await conversation.send(JSON.stringify(offerMessage));
      console.log('Offer sent successfully');
      
      return {
        success: true,
        conversationTopic: conversation.topic,
        offerData: offerMessage.offerData,
      };
    } catch (error) {
      console.error('Failed to send offer:', error);
      throw error;
    }
  }

  /**
   * Send a counter-offer message
   * @param {string} recipientAddress - Recipient's wallet address
   * @param {Object} counterOfferData - Counter-offer data
   * @param {Object} originalOffer - Original offer data
   */
  async sendCounterOffer(recipientAddress, counterOfferData, originalOffer) {
    this.ensureInitialized();

    try {
      const conversation = await this.client.conversations.newConversation(recipientAddress);
      
      const counterOfferMessage = {
        type: 'counter-offer',
        message: `I'd like to counter your offer with ${counterOfferData.currency} ${counterOfferData.price}`,
        counterOfferData: {
          price: counterOfferData.price,
          currency: counterOfferData.currency,
          expiresAt: counterOfferData.expiresAt,
        },
        originalOffer: originalOffer,
        timestamp: new Date().toISOString(),
      };

      await conversation.send(JSON.stringify(counterOfferMessage));
      console.log('Counter-offer sent successfully');
      
      return {
        success: true,
        conversationTopic: conversation.topic,
        counterOfferData: counterOfferMessage.counterOfferData,
      };
    } catch (error) {
      console.error('Failed to send counter-offer:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   * @param {string} recipientAddress - Recipient's wallet address
   * @param {Object} options - Query options
   */
  async getConversationHistory(recipientAddress, options = {}) {
    this.ensureInitialized();

    try {
      const conversation = await this.client.conversations.newConversation(recipientAddress);
      
      const messages = [];
      const limit = options.limit || 50;
      let count = 0;

      for await (const message of conversation.messages()) {
        if (count >= limit) break;
        
        const messageData = this.parseMessageContent(message.content);
        messages.push({
          ...messageData,
          senderAddress: message.senderAddress,
          timestamp: message.sentAt,
          messageId: message.id,
        });
        
        count++;
      }

      return messages.reverse(); // Most recent first
    } catch (error) {
      console.error('Failed to get conversation history:', error);
      throw error;
    }
  }

  /**
   * Get all conversations with consent filtering
   * @param {string[]} consentStates - Consent states to filter by
   */
  async getAllConversations(consentStates = [ConsentState.Allowed]) {
    this.ensureInitialized();

    try {
      const conversations = [];
      
      for await (const conversation of this.client.conversations.list({ consentStates })) {
        conversations.push({
          topic: conversation.topic,
          peerAddress: conversation.peerAddress,
          createdAt: conversation.createdAt,
        });
      }

      return conversations;
    } catch (error) {
      console.error('Failed to get conversations:', error);
      throw error;
    }
  }

  /**
   * Stream conversations in real-time
   * @param {string[]} consentStates - Consent states to filter by
   */
  async streamConversations(consentStates = [ConsentState.Allowed]) {
    this.ensureInitialized();

    try {
      this.conversationStream = await this.client.conversations.stream({
        consentStates,
        onValue: (conversation) => {
          console.log('New conversation:', conversation);
          // Notify handlers if needed
        },
        onError: (error) => {
          console.error('Conversation stream error:', error);
        }
      });

      return this.conversationStream;
    } catch (error) {
      console.error('Failed to stream conversations:', error);
      throw error;
    }
  }

  /**
   * Register message handler
   * @param {Function} handler - Message handler function
   */
  onMessage(handler) {
    this.messageHandlers.add(handler);
  }

  /**
   * Unregister message handler
   * @param {Function} handler - Message handler function
   */
  offMessage(handler) {
    this.messageHandlers.delete(handler);
  }

  /**
   * Ensure service is initialized
   */
  ensureInitialized() {
    if (!this.isInitialized || !this.client) {
      throw new Error('XMTP service not initialized. Call initialize() first.');
    }
  }

  /**
   * Stop all streams and cleanup
   */
  async cleanup() {
    try {
      if (this.messageStream) {
        await this.messageStream.return();
        this.messageStream = null;
      }
      
      if (this.conversationStream) {
        await this.conversationStream.return();
        this.conversationStream = null;
      }
      
      console.log('XMTP service cleaned up successfully');
    } catch (error) {
      console.error('Failed to cleanup XMTP service:', error);
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      address: this.client?.address || null,
      conversationCount: this.conversations.size,
      messageHandlerCount: this.messageHandlers.size,
      hasMessageStream: !!this.messageStream,
      hasConversationStream: !!this.conversationStream,
    };
  }
}

// Create singleton instance
const domaXMTPService = new DomaXMTPService();

export default domaXMTPService;
