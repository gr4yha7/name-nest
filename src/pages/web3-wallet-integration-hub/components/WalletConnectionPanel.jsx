import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletConnectionPanel = ({
  connectedWallets,
  onConnect,
  onDisconnect,
  loading,
  detailed = false
}) => {
  const [connectingWallet, setConnectingWallet] = useState(null);

  const walletProviders = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: 'Wallet',
      description: 'Connect using MetaMask browser extension',
      color: 'bg-orange-500',
      popular: true
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: 'Smartphone',
      description: 'Connect with mobile wallets via QR code',
      color: 'bg-blue-500',
      popular: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: 'Circle',
      description: 'Connect using Coinbase Wallet',
      color: 'bg-blue-600',
      popular: false
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      icon: 'Zap',
      description: 'Connect using Rainbow wallet',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      popular: false
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: 'Ghost',
      description: 'Connect Solana wallet',
      color: 'bg-purple-600',
      popular: false
    }
  ];

  const handleConnect = async (walletId) => {
    setConnectingWallet(walletId);
    try {
      await onConnect?.(walletId);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setConnectingWallet(null);
    }
  };

  const formatAddress = (address) => {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const getNetworkIcon = (network) => {
    const icons = {
      ethereum: 'Zap',
      polygon: 'Triangle',
      solana: 'Sun'
    };
    return icons?.[network] || 'Globe';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {detailed ? 'Wallet Management' : 'Wallet Connections'}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {connectedWallets?.length || 0} connected
          </span>
          {connectedWallets?.length > 0 && (
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          )}
        </div>
      </div>
      {/* Connected Wallets */}
      {connectedWallets?.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Connected Wallets</h4>
          <div className="space-y-3">
            {connectedWallets?.map((wallet, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Icon name="Wallet" size={16} color="white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">{wallet?.type}</p>
                    <p className="text-sm text-green-600">
                      {formatAddress(wallet?.address)}
                    </p>
                    {detailed && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Icon name={getNetworkIcon(wallet?.network)} size={12} className="text-green-600" />
                        <span className="text-xs text-green-600 capitalize">{wallet?.network}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                  {detailed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDisconnect?.(wallet?.address)}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Available Wallets */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-4">
          {connectedWallets?.length > 0 ? 'Connect Additional Wallets' : 'Connect Your First Wallet'}
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {walletProviders?.map((provider) => {
            const isConnected = connectedWallets?.some(w => w?.type === provider?.name);
            const isConnecting = connectingWallet === provider?.id;
            
            return (
              <div
                key={provider?.id}
                className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                  isConnected
                    ? 'bg-muted/30 border-muted' :'hover:bg-muted/50 border-border'
                }`}
                onClick={() => !isConnected && !isConnecting && handleConnect(provider?.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${provider?.color} rounded-lg flex items-center justify-center`}>
                      <Icon name={provider?.icon} size={16} color="white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-foreground">{provider?.name}</p>
                        {provider?.popular && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {provider?.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {isConnected ? (
                      <Icon name="Check" size={16} className="text-green-600" />
                    ) : isConnecting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <Icon name="Plus" size={16} className="text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Hardware Wallet Section */}
      {detailed && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-foreground">Hardware Wallets</h4>
            <Button variant="outline" size="sm">
              <Icon name="Shield" size={14} className="mr-2" />
              Enhanced Security
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={16} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Hardware Wallet Support
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Connect Ledger, Trezor, or other hardware wallets for enhanced security on high-value transactions.
                </p>
                <Button variant="ghost" size="sm" className="mt-2 text-blue-600 hover:text-blue-700">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Connection Status */}
      {loading && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">
              Establishing secure connection...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnectionPanel;