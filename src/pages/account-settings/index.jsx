import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { checkXMTPStatus, createXMTPClient, revokeXMTPInstallations } from 'utils/xmtpUtils';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import { Loader2, MessageSquare, Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from 'components/ui/Header';
import { ConnectKitButton } from 'connectkit';
import { useGlobal } from 'context/global';

const AccountSettings = () => {
  const { address, isConnected } = useAccount();
  const { xmtpStatus, setXmtpStatus } = useGlobal();
  
  const [activeTab, setActiveTab] = useState('xmtp');


  const [xmtpLoading, setXmtpLoading] = useState(false); // Add this loading state

  // Check XMTP status when component mounts or wallet changes
  const checkXMTPSetup = async () => {
    if (!address || !isConnected) {
      setXmtpStatus({ isSetup: false, isLoading: false, error: null });
      return;
    }

    setXmtpStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const isSetup = await checkXMTPStatus(address);
      setXmtpStatus({
        isSetup,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to check XMTP status:', error);
      setXmtpStatus({
        isSetup: false,
        isLoading: false,
        error: error.message
      });
    }
  };

  useEffect(() => {
    checkXMTPSetup();
  }, [address, isConnected]);

  const handleXMTPConnect = async () => {
    setXmtpLoading(true); // Set loading state
    try {
      await createXMTPClient(address); // Pass address parameter
      toast.success('XMTP connected successfully!');
      // Refresh status after connection
      await checkXMTPSetup();
    } catch (error) {
      console.error('Failed to connect XMTP:', error);
      toast.error('Failed to connect to XMTP');
    } finally {
      setXmtpLoading(false); // Clear loading state
    }
  };

  const handleXMTPDisconnect = async () => {
    setXmtpLoading(true); // Set loading state
    try {
      await revokeXMTPInstallations(address);
      toast.success('XMTP disconnected successfully!');
      // Refresh status after disconnection
      await checkXMTPSetup();
    } catch (error) {
      console.error('Failed to disconnect XMTP:', error);
      toast.error('Failed to disconnect from XMTP');
    } finally {
      setXmtpLoading(false); // Clear loading state
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const tabs = [
    {
      id: 'xmtp',
      label: 'XMTP Messaging',
      icon: MessageSquare,
    },
    {
      id: 'general',
      label: 'General Settings',
      icon: Settings,
    },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card border border-border rounded-lg p-8 w-full">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Wallet" size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-muted-foreground mb-8">
                Connect your Web3 wallet to access your domain deals.
              </p>
              <div className='flex justify-center w-full'>
                <ConnectKitButton />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header/>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and connected services
            </p>
            <div className="mt-4 p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">Connected Wallet</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {formatAddress(address)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      <IconComponent size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'xmtp' && (
              <div className="space-y-6">
                {/* XMTP Status Card */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MessageSquare size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">XMTP Messaging</h3>
                        <p className="text-sm text-muted-foreground">
                          Enable decentralized messaging for domain negotiations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {xmtpStatus.isLoading ? (
                        <Loader2 size={20} className="animate-spin text-muted-foreground" />
                      ) : xmtpStatus.isSetup ? (
                        <div className="flex items-center gap-1 text-success">
                          <CheckCircle size={20} />
                          <span className="text-sm font-medium">Setup Complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <XCircle size={20} />
                          <span className="text-sm font-medium">Not Setup</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Details */}
                  {xmtpStatus.isSetup && !xmtpStatus.isLoading && (
                    <div className="bg-success/5 border border-success/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-success mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-success mb-1">XMTP is Set Up</h4>
                          <p className="text-sm text-muted-foreground">
                            Your wallet address is registered on XMTP and can send/receive messages.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!xmtpStatus.isSetup && !xmtpStatus.isLoading && (
                    <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-warning mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-warning mb-1">XMTP Not Set Up</h4>
                          <p className="text-sm text-muted-foreground">
                            Your wallet address is not registered on XMTP. Click "Set Up XMTP" to enable messaging.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading State */}
                  {xmtpStatus.isLoading && (
                    <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <Loader2 size={20} className="animate-spin text-muted-foreground" />
                        <div className="flex-1">
                          <h4 className="font-medium text-muted-foreground mb-1">Checking XMTP Status</h4>
                          <p className="text-sm text-muted-foreground">
                            Verifying if your wallet is registered on XMTP...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {xmtpStatus.isSetup ? (
                      <Button
                        variant="destructive"
                        onClick={handleXMTPDisconnect}
                        disabled={xmtpLoading || xmtpStatus.isLoading}
                        loading={xmtpLoading}
                        iconName="X"
                        iconPosition="left"
                      >
                        {xmtpLoading ? 'Revoking...' : 'Revoke XMTP'}
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        onClick={handleXMTPConnect}
                        disabled={xmtpLoading || xmtpStatus.isLoading}
                        loading={xmtpLoading}
                        iconName="MessageSquare"
                        iconPosition="left"
                      >
                        {xmtpLoading ? 'Setting up...' : 'Set Up XMTP'}
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={checkXMTPSetup}
                      disabled={xmtpStatus.isLoading || xmtpLoading}
                      loading={xmtpStatus.isLoading}
                      iconName="RefreshCw"
                      iconPosition="left"
                    >
                      {xmtpStatus.isLoading ? 'Checking...' : 'Check Status'}
                    </Button>
                  </div>
                </div>

                {/* XMTP Information */}
                <div className="bg-muted/30 border border-border rounded-lg p-6">
                  <h4 className="font-medium mb-3">About XMTP</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      XMTP (eXtensible Message Transport Protocol) enables secure, decentralized messaging 
                      between wallet addresses. When connected, you can:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Send encrypted messages to domain owners and buyers</li>
                      <li>Receive notifications about domain offers and negotiations</li>
                      <li>Communicate securely without revealing your identity</li>
                      <li>Access your message history across devices</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  <p className="text-muted-foreground">
                    General account settings will be available here in future updates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;