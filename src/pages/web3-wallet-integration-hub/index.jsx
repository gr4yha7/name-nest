import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import WalletConnectionPanel from './components/WalletConnectionPanel';
import MultiChainBalances from './components/MultiChainBalances';
import TransactionHistory from './components/TransactionHistory';
import SmartContractManager from './components/SmartContractManager';
import DeFiIntegration from './components/DeFiIntegration';
import SecuritySettings from './components/SecuritySettings';

const Web3WalletIntegrationHub = () => {
  const [connectedWallets, setConnectedWallets] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock wallet data
  const mockWalletData = {
    primaryWallet: {
      address: '0x742d35Cc6065C0532C741dE7b72C5b14B5e1A34A',
      type: 'MetaMask',
      connected: true,
      network: 'ethereum'
    },
    balances: {
      ethereum: {
        ETH: 12.45,
        USDC: 2850.00,
        USDT: 1200.00
      },
      polygon: {
        MATIC: 450.30,
        USDC: 850.00
      },
      solana: {
        SOL: 25.80,
        USDC: 450.00
      }
    },
    networkStats: {
      ethereum: { gasPrice: '25 Gwei', status: 'healthy', transactions: 156 },
      polygon: { gasPrice: '30 Gwei', status: 'healthy', transactions: 89 },
      solana: { gasPrice: '0.00025 SOL', status: 'congested', transactions: 34 }
    },
    recentTransactions: [
      {
        id: 1,
        hash: '0x1234567890abcdef',
        type: 'Domain Purchase',
        amount: '2.5 ETH',
        network: 'ethereum',
        status: 'confirmed',
        timestamp: '2024-08-20T14:30:00Z'
      },
      {
        id: 2,
        hash: '0xabcdef1234567890',
        type: 'Token Swap',
        amount: '500 USDC',
        network: 'polygon',
        status: 'confirmed',
        timestamp: '2024-08-19T11:15:00Z'
      }
    ]
  };

  useEffect(() => {
    // Simulate wallet data loading
    const loadWalletData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWalletData(mockWalletData);
      setConnectedWallets([mockWalletData?.primaryWallet]);
      setLoading(false);
    };

    loadWalletData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'wallets', label: 'Wallets', icon: 'Wallet' },
    { id: 'transactions', label: 'Transactions', icon: 'History' },
    { id: 'contracts', label: 'Contracts', icon: 'FileText' },
    { id: 'defi', label: 'DeFi', icon: 'Coins' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  const handleWalletConnect = async (walletType) => {
    try {
      setLoading(true);
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newWallet = {
        address: `0x${Math.random()?.toString(16)?.substr(2, 40)}`,
        type: walletType,
        connected: true,
        network: 'ethereum'
      };
      
      setConnectedWallets(prev => [...prev, newWallet]);
      setLoading(false);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setLoading(false);
    }
  };

  const handleWalletDisconnect = (address) => {
    setConnectedWallets(prev => prev?.filter(wallet => wallet?.address !== address));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <MultiChainBalances data={walletData?.balances} networkStats={walletData?.networkStats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WalletConnectionPanel
                connectedWallets={connectedWallets}
                onConnect={handleWalletConnect}
                onDisconnect={handleWalletDisconnect}
                loading={loading}
              />
              <TransactionHistory transactions={walletData?.recentTransactions?.slice(0, 5)} />
            </div>
          </div>
        );
      case 'wallets':
        return (
          <WalletConnectionPanel
            connectedWallets={connectedWallets}
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
            loading={loading}
            detailed={true}
          />
        );
      case 'transactions':
        return <TransactionHistory transactions={walletData?.recentTransactions} detailed={true} />;
      case 'contracts':
        return <SmartContractManager />;
      case 'defi':
        return <DeFiIntegration balances={walletData?.balances} />;
      case 'security':
        return <SecuritySettings wallets={connectedWallets} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Wallet Integration Hub</h1>
            <p className="text-muted-foreground mt-2">
              Centralized blockchain connectivity and cryptocurrency management
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/domain-portfolio-dashboard'}
            >
              <Icon name="Briefcase" size={16} className="mr-2" />
              Portfolio Dashboard
            </Button>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Connect New Wallet
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        {connectedWallets?.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  {connectedWallets?.length} wallet{connectedWallets?.length > 1 ? 's' : ''} connected
                </p>
                <p className="text-xs text-green-600">
                  Primary: {walletData?.primaryWallet?.address?.slice(0, 6)}...{walletData?.primaryWallet?.address?.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-border mb-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {loading && activeTab === 'overview' ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading wallet data...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        )}

        {/* Network Status Footer */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-foreground">All Networks Operational</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Last updated: Just now</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>ETH: $4,125</span>
              <span>MATIC: $0.85</span>
              <span>SOL: $165</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Web3WalletIntegrationHub;