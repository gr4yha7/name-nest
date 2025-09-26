import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useXMTP } from '../../hooks/useXMTP';
import { toast } from 'sonner';

// UI Components
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import ChatInterface from '../../components/xmtp/ChatInterface';

const XMTPMessagingTest = () => {
  const { isConnected: walletConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    isConnected: isXMTPConnected,
    isLoading: isXMTPLoading,
    error: xmtpError,
    connectXMTP,
    sendMessage,
    sendOffer,
    loadConversationHistory,
    loadConversations,
    conversations,
    messages,
  } = useXMTP({ autoConnect: false });

  // Show XMTP errors
  useEffect(() => {
    if (xmtpError) {
      console.error('XMTP Error:', xmtpError);
      toast.error(`XMTP Error: ${xmtpError.message}`);
    }
  }, [xmtpError]);

  // Debug wallet connection status
  useEffect(() => {
    console.log('Wallet connection status:', {
      walletConnected,
      isXMTPConnected,
      isXMTPLoading,
      xmtpError: xmtpError?.message
    });
  }, [walletConnected, isXMTPConnected, isXMTPLoading, xmtpError]);
  const [domainContext, setDomainContext] = useState(null);

  // Connect wallet
  const connectWallet = useCallback(() => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  }, [connect, connectors]);

  // Handle XMTP connection
  const handleConnectXMTP = useCallback(async () => {
    try {
      await connectXMTP();
      toast.success('Connected to XMTP!');
    } catch (error) {
      console.error('Failed to connect to XMTP:', error);
      toast.error('Failed to connect to XMTP');
    }
  }, [connectXMTP]);

  // Test wallet client signing
  const testWalletSigning = useCallback(async () => {
    try {
      const { useSignMessage } = await import('wagmi');
      const { signMessageAsync } = useSignMessage();
      const { address } = useAccount();
      
      if (!signMessageAsync || !address) {
        toast.error('No wallet client available');
        return;
      }

      const testMessage = 'Test message for XMTP';
      const signature = await signMessageAsync({
        account: address,
        message: testMessage,
      });
      console.log('Test signature:', signature);
      toast.success('Wallet signing test successful!');
    } catch (error) {
      console.error('Wallet signing test failed:', error);
      toast.error(`Wallet signing test failed: ${error.message}`);
    }
  }, []);

  // Handle offer sent
  const handleOfferSent = useCallback((offerData) => {
    console.log('Offer sent:', offerData);
    toast.success(`Offer sent: ${offerData.price} ${offerData.currency}`);
  }, []);

  // Set sample domain context
  useEffect(() => {
    setDomainContext({
      name: 'example.com',
      network: 'Ethereum',
      tokenId: '123456789',
      listingId: 'listing_123'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">XMTP Messaging Test</h1>
                  <p className="text-gray-600 mt-2">
                    Test XMTP messaging functionality with domain context
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Wallet: {walletConnected ? (
                      <span className="text-green-600 font-medium">Connected</span>
                    ) : (
                      <span className="text-red-600 font-medium">Disconnected</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    XMTP: {isXMTPConnected ? (
                      <span className="text-green-600 font-medium">Connected</span>
                    ) : (
                      <span className="text-red-600 font-medium">Disconnected</span>
                    )}
                    {xmtpError && (
                      <div className="text-xs text-red-500 mt-1">
                        Error: {xmtpError.message}
                      </div>
                    )}
                  </div>
                  {!walletConnected ? (
                    <Button
                      onClick={connectWallet}
                      disabled={isPending}
                      className="px-4"
                    >
                      {isPending ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                  ) : !isXMTPConnected ? (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleConnectXMTP}
                        disabled={isXMTPLoading}
                        className="px-4"
                      >
                        {isXMTPLoading ? 'Connecting...' : 'Connect XMTP'}
                      </Button>
                      {xmtpError && (
                        <Button
                          onClick={handleConnectXMTP}
                          variant="outline"
                          size="sm"
                          className="px-2"
                        >
                          Retry
                        </Button>
                      )}
                      <Button
                        onClick={testWalletSigning}
                        variant="outline"
                        size="sm"
                        className="px-2"
                      >
                        Test Signing
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => disconnect()}
                      variant="outline"
                      className="px-4"
                    >
                      Disconnect
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="h-[600px]">
              {walletConnected && isXMTPConnected ? (
                <ChatInterface 
                  domainContext={domainContext}
                  onOfferSent={handleOfferSent}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {!walletConnected ? 'Connect Your Wallet' : 'Connect to XMTP'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {!walletConnected 
                        ? 'Connect your wallet to start using XMTP messaging'
                        : 'Initialize XMTP to start messaging with domain context'
                      }
                    </p>
                    {!walletConnected ? (
                      <Button
                        onClick={connectWallet}
                        disabled={isPending}
                      >
                        {isPending ? 'Connecting...' : 'Connect Wallet'}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleConnectXMTP}
                        disabled={isXMTPLoading}
                      >
                        {isXMTPLoading ? 'Connecting...' : 'Connect XMTP'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XMTPMessagingTest;
