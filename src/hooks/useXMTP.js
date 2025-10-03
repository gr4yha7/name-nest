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
      
      if (canMessage.get(address)) {
        // Build existing client
        // console.log('Building existing XMTP client...');
        const client = await Client.build(
          { identifier: address, identifierKind: 'Ethereum' },
          { env: 'dev', appVersion: 'namenest/1.0.0' }
        );
        // await client.revokeAllOtherInstallations()
        setXmtpClient(client);
        // console.log('Built existing XMTP client');
      } else {
        // Create new client
        console.log('Creating new XMTP client...');
        const client = await Client.create(signer, { env: 'dev', appVersion: 'namenest/1.0.0' });
        // await client.revokeAllOtherInstallations()
        console.log('Created new XMTP client');
        setXmtpClient(client);
      }
      
      setIsXMTPConnected(true);
    } catch (err) {
      console.error('Failed to connect to XMTP:', err);
      toast.error('Failed to connect to XMTP:', err);
      setError(err);
      setIsLoading(false);
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
