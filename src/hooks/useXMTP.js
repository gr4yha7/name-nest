/**
 * React Hook for XMTP with Wallet Integration
 * Provides XMTP messaging functionality using wagmi wallet client
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { Client, ConsentState } from '@xmtp/browser-sdk';
import { toBytes } from 'viem';
import { useGlobal } from 'context/global';

/**
 * Hook for XMTP messaging with wallet integration
 * @param {Object} options - Hook options
 */
export function useXMTP(options = {}) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isXMTPConnected, setIsXMTPConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const { xmtpClient, setXmtpClient } = useGlobal();

  const signer = useMemo(() => {
    if (!address || !signMessageAsync) return null;
    
    return {
      type: 'EOA',
      getIdentifier: () => ({
        identifier: address,
        identifierKind: 'Ethereum'
      }),
      signMessage: async (message) => {
        console.log('Signing message with useSignMessage:', message);
        const signature = await signMessageAsync({
          account: address,
          message,
        });
        console.log('Signature received:', signature);
        return toBytes(signature);
      }
    };
  }, [address, signMessageAsync]);

  // Initialize XMTP with wallet
  const connectXMTP = useCallback(async () => {
    if (!address || !signer) {
      throw new Error('Wallet not connected or signer not ready');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Checking if address can message on XMTP...');
      
      // Check if address can message
      const canMessage = await Client.canMessage([
        { identifier: address, identifierKind: 'Ethereum' }
      ]);
      
      console.log('Can message:', canMessage);
      console.log('Can message result:', canMessage.get(address));
      
      let client;
      if (canMessage.get(address)) {
        // Build existing client
        console.log('Building existing XMTP client...');
        client = await Client.build(
          { identifier: address, identifierKind: 'Ethereum' },
          { env: 'dev', appVersion: 'namenest/1.0.0' }
        );
        console.log('Built existing XMTP client');
      } else {
        // Create new client
        console.log('Creating new XMTP client...');
        client = await Client.create(signer, { env: 'dev', appVersion: 'namenest/1.0.0' });
        console.log('Created new XMTP client');
      }
      
      setXmtpClient(client);
      // Hand off client to shared service so downstream calls work
      // if (domaXMTPService && typeof domaXMTPService.setClient === 'function') {
      //   await domaXMTPService.setClient(client);
      // }
      setIsXMTPConnected(true);
      
      // Load conversations
      const convos = await client.conversations.list({ consentStates: [ConsentState.Allowed] });
      setConversations(convos || []);
      
    } catch (err) {
      console.error('Failed to connect to XMTP:', err);
      setError(err);
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, signer, setXmtpClient]);

  // Disconnect XMTP
  const disconnectXMTP = useCallback(async () => {
    try {
      // await domaXMTPService.cleanup();
      setXmtpClient(null);
      setIsXMTPConnected(false);
      setConversations([]);
      setMessages([]);
    } catch (err) {
      setError(err);
    }
  }, []);

  // Send message directly via client
  const sendMessage = useCallback(async (recipientAddress, content, domainContext = null) => {
    if (!isXMTPConnected) {
      throw new Error('XMTP not connected');
    }

    try {
      const conversation = await xmtpClient.conversations.newConversation(recipientAddress);
      let messageContent = content;
      if (domainContext) {
        messageContent = JSON.stringify({
          type: 'text',
          message: content,
          domainData: domainContext,
          timestamp: new Date().toISOString(),
        });
      }
      await conversation.send(messageContent);

      // Refresh conversations
      const convos = [];
      for await (const c of xmtpClient.conversations.list({ consentStates: [ConsentState.Allowed] })) {
        convos.push({ topic: c.topic, peerAddress: c.peerAddress, createdAt: c.createdAt, id: c.topic });
      }
      setConversations(convos);

      return { success: true, conversationTopic: conversation.topic };
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [isXMTPConnected, xmtpClient]);

  // Send offer
  const sendOffer = useCallback(async (recipientAddress, offerData, domainData) => {
    if (!isXMTPConnected) {
      throw new Error('XMTP not connected');
    }

    try {
      const conversation = await xmtpClient.conversations.newConversation(recipientAddress);
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

      // Refresh conversations
      const convos = [];
      for await (const c of xmtpClient.conversations.list({ consentStates: [ConsentState.Allowed] })) {
        convos.push({ topic: c.topic, peerAddress: c.peerAddress, createdAt: c.createdAt, id: c.topic });
      }
      setConversations(convos);

      return { success: true, conversationTopic: conversation.topic, offerData: offerMessage.offerData };
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [isXMTPConnected, xmtpClient]);

  // Load conversation history
  const loadConversationHistory = useCallback(async (peerAddress) => {
    if (!isXMTPConnected) {
      throw new Error('XMTP not connected');
    }

    try {
      const conversation = await xmtpClient.conversations.newConversation(peerAddress);
      const out = [];
      const limit = 50;
      let count = 0;
      for await (const m of conversation.messages()) {
        if (count >= limit) break;
        let parsed;
        try { parsed = JSON.parse(m.content); } catch { parsed = null; }
        const normalized = parsed && parsed.type ? {
          ...parsed,
          senderAddress: m.senderAddress,
          sentAt: m.sentAt,
          id: m.id,
        } : {
          type: 'text',
          content: m.content,
          senderAddress: m.senderAddress,
          sentAt: m.sentAt,
          id: m.id,
        };
        out.push(normalized);
        count++;
      }
      out.reverse();
      setMessages(out);
      return out;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [isXMTPConnected, xmtpClient]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!isXMTPConnected) return;

    try {
      const convos = [];
      for await (const c of xmtpClient.conversations.list({ consentStates: [ConsentState.Allowed] })) {
        convos.push({ topic: c.topic, peerAddress: c.peerAddress, createdAt: c.createdAt, id: c.topic });
      }
      setConversations(convos);
    } catch (err) {
      setError(err);
    }
  }, [isXMTPConnected, xmtpClient]);

  // Auto-connect when wallet is connected (can be disabled with options.autoConnect === false)
  useEffect(() => {
    if (options.autoConnect === false) {
      return;
    }
    console.log('Auto-connect check:', {
      isConnected,
      address,
      signer: !!signer,
      isXMTPConnected,
      isLoading
    });
    
    if (isConnected && address && signer && !isXMTPConnected && !isLoading) {
      console.log('Attempting to auto-connect XMTP...');
      connectXMTP().catch((error) => {
        console.error('Auto-connect XMTP failed:', error);
        setError(error);
      });
    }
  }, [options.autoConnect, isConnected, address, signer, isXMTPConnected, isLoading, connectXMTP]);

  // Auto-disconnect when wallet is disconnected
  useEffect(() => {
    if (!isConnected && isXMTPConnected) {
      disconnectXMTP();
    }
  }, [isConnected, isXMTPConnected, disconnectXMTP]);

  return {
    // State
    isConnected: isXMTPConnected,
    isLoading,
    error,
    conversations,
    messages,
    xmtpClient,
    
    // Actions
    connectXMTP,
    disconnectXMTP,
    sendMessage,
    sendOffer,
    loadConversationHistory,
    loadConversations,
    
    // Wallet state
    walletConnected: isConnected,
    walletAddress: address,
  };
}

export default useXMTP;
