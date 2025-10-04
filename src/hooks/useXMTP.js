/**
 * React Hook for XMTP with Wallet Integration
 * Provides XMTP messaging functionality using wagmi wallet client
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { Client } from '@xmtp/browser-sdk';
import { toBytes } from 'viem';
import { useGlobal } from 'context/global';
import { toast } from 'sonner';

/**
 * Hook for XMTP messaging with wallet integration
 */
export function useXMTP() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isXMTPConnected, setIsXMTPConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
      
      // console.log('Can message:', canMessage);
      // console.log('Can message result:', canMessage.get(address));
      let client;
      if (canMessage.get(address)) {
        // Build existing client
        // console.log('Building existing XMTP client...');
        client = await Client.build(
          { identifier: address, identifierKind: 'Ethereum' },
          { env: 'production', appVersion: 'namenest/1.0.0' }
        );
        await client.revokeAllOtherInstallations()
        // console.log('Built existing XMTP client');
      } else {
        // Create new client
        console.log('Creating new XMTP client...');
        client = await Client.create(signer, { env: 'production', appVersion: 'namenest/1.0.0' });
        await client.revokeAllOtherInstallations()
        console.log('Created new XMTP client');
      }
      setXmtpClient(client);
      setIsXMTPConnected(true);

      return client;
    } catch (err) {
      console.error('Failed to connect to XMTP:', err);
      
      // Handle specific database connection errors
      if (err.message.includes('Database(NotFound)') || err.message.includes('Metadata(Connection')) {
        console.error('XMTP database not found. This may be due to environment mismatch or corrupted client data.');
        toast.error('XMTP database connection failed. Please try reconnecting your wallet.');
        setError(new Error('XMTP database connection failed. Please try reconnecting your wallet.'));
      } else if (err.message.includes('NoModificationAllowedError')) {
        console.error('File system access conflict. Please try reinitializing the client.');
        toast.error('File system access conflict. Please refresh the page and try again.');
        setError(new Error('File system access conflict. Please refresh the page and try again.'));
      } else if (err.message.includes('InvalidSignature')) {
        toast.error('Invalid signature. Please ensure your wallet is properly connected.');
        setError(new Error('Invalid signature. Please ensure your wallet is properly connected.'));
      } else if (err.message.includes('NetworkError') || err.message.includes('Connection')) {
        toast.error('Network connection failed. Please check your internet connection and try again.');
        setError(new Error('Network connection failed. Please check your internet connection and try again.'));
      } else {
        toast.error('Failed to connect to XMTP: ' + err.message);
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [address, signer, setXmtpClient]);

  // Disconnect XMTP
  const disconnectXMTP = useCallback(async () => {
    try {
      setXmtpClient(null);
      setIsXMTPConnected(false);
    } catch (err) {
      setError(err);
    }
  }, []);

  // Auto-connect when wallet is connected (can be disabled with options.autoConnect === false)
  // useEffect(() => {
  //   if (options.autoConnect === false) {
  //     return;
  //   }
  //   console.log('Auto-connect check:', {
  //     isConnected,
  //     address,
  //     signer: !!signer,
  //     isXMTPConnected,
  //     isLoading
  //   });
    
  //   if (isConnected && address && signer && !isXMTPConnected && !isLoading) {
  //     console.log('Attempting to auto-connect XMTP...');
  //     connectXMTP().catch((error) => {
  //       console.error('Auto-connect XMTP failed:', error);
  //       setError(error);
  //     });
  //   }
  // }, [options.autoConnect, isConnected, address, signer, isXMTPConnected, isLoading, connectXMTP]);

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
    xmtpClient,
    
    // Actions
    connectXMTP,
    disconnectXMTP,
    
    // Wallet state
    walletConnected: isConnected,
    walletAddress: address,
  };
}

export default useXMTP;
