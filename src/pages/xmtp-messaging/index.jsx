import React, { /*useState, useEffect,*/ useCallback, useEffect, useState } from 'react';
// import { useAccount, useConnect, useDisconnect } from 'wagmi';
// import { useXMTP } from '../../hooks/useXMTP';
// import { toast } from 'sonner';

// UI Components
// import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
// import DmEligibilityModal from 'components/xmtp/DmEligibilityModal';
import { MessagingProvider } from 'components/xmtp/MessagingContext';
import ConversationsPanel from 'components/xmtp/ConversationsPanel';
import ThreadView from 'components/xmtp/ThreadView';

const XMTPMessaging = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // const { isConnected: walletConnected } = useAccount();
  // const { connect, connectors, isPending } = useConnect();
  // const { disconnect } = useDisconnect();
  // const {
  //   isConnected: isXMTPConnected,
  //   isLoading: isXMTPLoading,
  //   error: xmtpError,
  //   connectXMTP,
  // } = useXMTP({ autoConnect: false });

  // // Show XMTP errors
  // useEffect(() => {
  //   if (xmtpError) {
  //     console.error('XMTP Error:', xmtpError);
  //     toast.error(`XMTP Error: ${xmtpError.message}`);
  //   }
  // }, [xmtpError]);

  // // Debug wallet connection status
  // useEffect(() => {
  //   console.log('Wallet connection status:', {
  //     walletConnected,
  //     isXMTPConnected,
  //     isXMTPLoading,
  //     xmtpError: xmtpError?.message
  //   });
  // }, [walletConnected, isXMTPConnected, isXMTPLoading, xmtpError]);
  // const [isCanDmModalOpen, setIsCanDmModalOpen] = useState(false);
  // const [testUserAddress, setTestUserAddress] = useState('0x3Db2f85e7A204aB666229E637A2B9eA92e566F49');

  // Connect wallet
  // const connectWallet = useCallback(() => {
  //   if (connectors[0]) {
  //     connect({ connector: connectors[0] });
  //   }
  // }, [connect, connectors]);

  // // Handle XMTP connection
  // const handleConnectXMTP = useCallback(async () => {
  //   try {
  //     await connectXMTP();
  //     toast.success('Connected to XMTP!');
  //     setIsCanDmModalOpen(true)
  //   } catch (error) {
  //     console.error('Failed to connect to XMTP:', error);
  //     toast.error('Failed to connect to XMTP');
  //   }
  // }, [connectXMTP]);

  // Handle offer sent
  // const handleOfferSent = useCallback((offerData) => {
  //   console.log('Offer sent:', offerData);
  //   toast.success(`Offer sent: ${offerData.price} ${offerData.currency}`);
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileChat(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb customItems={[{ label: 'Home', path: '/' }, { label: 'Messages', path: '/xmtp-messaging-test', isLast: true }]} />

        {/* Header Actions to mirror messaging center */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground">
              Manage your domain negotiations and communications
            </p>
          </div>
        </div>



        {/* Main Content: styled like real-time-messaging-center */}
        <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
          <div className="flex h-full">
              <MessagingProvider>
              {isMobile ? (
                  <>
                    {!showMobileChat ? (
                      <ConversationsPanel isMobile />
                    ) : (
                      <ThreadView isMobile onBack={handleBackToList}/>
                    )}
                  </>
                ) : (
                  <>
                    <ConversationsPanel />
                    <ThreadView />
                  </>
                )}

                {/* <ThreadView /> */}
              </MessagingProvider>
            {/* {walletConnected && isXMTPConnected ? (
              <MessagingProvider>
                <ConversationsPanel />
                <ThreadView />
              </MessagingProvider>
            ) : (
              <div className="flex items-center justify-center w-full bg-gray-50">
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
                    {!walletConnected ? 'Connect your wallet to start using XMTP messaging' : 'Initialize XMTP to start messaging with domain context'}
                  </p>
                  {!walletConnected ? (
                    <Button onClick={connectWallet} disabled={isPending}>
                      {isPending ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                  ) : (
                    <Button onClick={handleConnectXMTP} disabled={isXMTPLoading}>
                      {isXMTPLoading ? 'Connecting...' : 'Connect XMTP'}
                    </Button>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XMTPMessaging;
