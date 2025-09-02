import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import DomainCollection from './components/DomainCollection';
import ENSManager from './components/ENSManager';
import UnstoppableDomainsManager from './components/UnstoppableDomainsManager';
import SmartContractPanel from './components/SmartContractPanel';
import CrossChainBridge from './components/CrossChainBridge';
import DecentralizedDNSConfig from './components/DecentralizedDNSConfig';
import RegistryAnalytics from './components/RegistryAnalytics';
import NetworkSelector from './components/NetworkSelector';
import GasTracker from './components/GasTracker';
import DomainTokenization from './components/DomainTokenization';

const DecentralizedDomainRegistry = () => {
  const navigate = useNavigate();
  
  // Web3 State
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState('ethereum');
  const [gasPrice, setGasPrice] = useState(0);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  
  // App State
  const [activeTab, setActiveTab] = useState('collection');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterNetwork, setFilterNetwork] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock domain data with blockchain integration
  const [userDomains, setUserDomains] = useState([
    {
      id: 1,
      name: 'myawesome.eth',
      type: 'ENS',
      network: 'ethereum',
      expirationDate: '2025-12-15',
      status: 'active',
      isResolved: true,
      hasSubdomains: true,
      resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
      contentHash: 'ipfs://QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N',
      addresses: {
        ETH: '0x742d35Cc6634C0532925a3b8D097bBAF88e5D8AC',
        BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        USDC: '0x742d35Cc6634C0532925a3b8D097bBAF88e5D8AC'
      },
      subdomains: ['blog.myawesome.eth', 'api.myawesome.eth'],
      ownership: {
        tokenId: '12345',
        contractAddress: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
        isOwner: true
      },
      analytics: {
        resolutions: 1250,
        uniqueVisitors: 890,
        lastResolved: '2024-08-20'
      }
    },
    {
      id: 2,
      name: 'blockchain.crypto',
      type: 'Unstoppable',
      network: 'polygon',
      expirationDate: 'Lifetime',
      status: 'active',
      isResolved: true,
      hasWebsite: true,
      ipfsContent: 'QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N',
      addresses: {
        ETH: '0x8ba1f109551bD432803012645Hac136c29C8d',
        BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        MATIC: '0x8ba1f109551bD432803012645Hac136c29C8d',
        USDC: '0x8ba1f109551bD432803012645Hac136c29C8d'
      },
      ownership: {
        tokenId: '67890',
        contractAddress: '0x049aba7510f45BA5b64ea9E658E342F904DB358D',
        isOwner: true
      },
      analytics: {
        resolutions: 2100,
        uniqueVisitors: 1456,
        lastResolved: '2024-08-22'
      }
    },
    {
      id: 3,
      name: 'defi.wallet',
      type: 'Unstoppable',
      network: 'ethereum',
      expirationDate: 'Lifetime',
      status: 'pending_renewal',
      isResolved: false,
      hasWebsite: false,
      addresses: {
        ETH: '0x9ba1f109551bD432803012645Hac136c29C8d'
      },
      ownership: {
        tokenId: '54321',
        contractAddress: '0x049aba7510f45BA5b64ea9E658E342F904DB358D',
        isOwner: true
      },
      analytics: {
        resolutions: 45,
        uniqueVisitors: 23,
        lastResolved: '2024-07-15'
      }
    }
  ]);

  const networkOptions = [
    { value: 'all', label: 'All Networks' },
    { value: 'ethereum', label: 'Ethereum', icon: 'Coins' },
    { value: 'polygon', label: 'Polygon', icon: 'Triangle' },
    { value: 'arbitrum', label: 'Arbitrum', icon: 'Zap' },
    { value: 'optimism', label: 'Optimism', icon: 'Circle' },
    { value: 'base', label: 'Base', icon: 'Square' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'expiration', label: 'Expiration Date' },
    { value: 'network', label: 'Network' },
    { value: 'status', label: 'Status' },
    { value: 'resolutions', label: 'Resolutions' }
  ];

  const tabOptions = [
    { id: 'collection', label: 'My Domains', icon: 'Grid3x3', count: userDomains?.length },
    { id: 'ens', label: 'ENS Manager', icon: 'Globe', disabled: !isWalletConnected },
    { id: 'unstoppable', label: 'Unstoppable', icon: 'Shield', disabled: !isWalletConnected },
    { id: 'contracts', label: 'Smart Contracts', icon: 'FileCode', disabled: !isWalletConnected },
    { id: 'bridge', label: 'Cross-Chain', icon: 'ArrowLeftRight', disabled: !isWalletConnected },
    { id: 'dns', label: 'DNS Config', icon: 'Settings', disabled: !isWalletConnected },
    { id: 'tokenization', label: 'Tokenization', icon: 'Coins', disabled: !isWalletConnected },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  // Web3 Connection
  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider?.send('eth_requestAccounts', []);
        
        const signer = await provider?.getSigner();
        const address = await signer?.getAddress();
        
        setProvider(provider);
        setSigner(signer);
        setWalletAddress(address);
        setIsWalletConnected(true);
        
        // Get network info
        const network = await provider?.getNetwork();
        setCurrentNetwork(network?.name);
        
        // Get gas price
        const gasPrice = await provider?.getFeeData();
        setGasPrice(ethers?.formatUnits(gasPrice?.gasPrice || '0', 'gwei'));
        
      } else {
        alert('Please install MetaMask or another Web3 wallet');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setWalletAddress('');
    setIsWalletConnected(false);
    setCurrentNetwork('ethereum');
    setGasPrice(0);
  }, []);

  // Initialize wallet connection on page load if previously connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider?.listAccounts();
          
          if (accounts?.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Auto-connection failed:', error);
        }
      }
    };

    checkWalletConnection();
  }, [connectWallet]);

  // Filter and sort domains
  const filteredDomains = userDomains
    ?.filter(domain => {
      const matchesSearch = domain?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const matchesNetwork = filterNetwork === 'all' || domain?.network === filterNetwork;
      return matchesSearch && matchesNetwork;
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'expiration':
          if (a?.expirationDate === 'Lifetime') return 1;
          if (b?.expirationDate === 'Lifetime') return -1;
          return new Date(a?.expirationDate) - new Date(b?.expirationDate);
        case 'network':
          return a?.network?.localeCompare(b?.network);
        case 'status':
          return a?.status?.localeCompare(b?.status);
        case 'resolutions':
          return (b?.analytics?.resolutions || 0) - (a?.analytics?.resolutions || 0);
        default:
          return 0;
      }
    });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTabChange = (tabId) => {
    if (tabOptions?.find(tab => tab?.id === tabId)?.disabled) {
      return;
    }
    setActiveTab(tabId);
  };

  const handleDomainAction = (action, domain) => {
    switch (action) {
      case 'renew':
        // Implement domain renewal logic
        console.log('Renewing domain:', domain?.name);
        break;
      case 'transfer':
        // Implement domain transfer logic
        console.log('Transferring domain:', domain?.name);
        break;
      case 'configure':
        // Navigate to detailed configuration
        navigate(`/domain-detail-negotiation`, { 
          state: { selectedDomain: domain, mode: 'configure' }
        });
        break;
      default:
        break;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'collection':
        return (
          <DomainCollection
            domains={filteredDomains}
            onDomainAction={handleDomainAction}
            isWalletConnected={isWalletConnected}
            currentNetwork={currentNetwork}
          />
        );
      case 'ens':
        return (
          <ENSManager
            provider={provider}
            signer={signer}
            currentNetwork={currentNetwork}
            onDomainUpdate={(updatedDomain) => {
              setUserDomains(prev => 
                prev?.map(d => d?.id === updatedDomain?.id ? updatedDomain : d)
              );
            }}
          />
        );
      case 'unstoppable':
        return (
          <UnstoppableDomainsManager
            provider={provider}
            signer={signer}
            currentNetwork={currentNetwork}
            onDomainUpdate={(updatedDomain) => {
              setUserDomains(prev => 
                prev?.map(d => d?.id === updatedDomain?.id ? updatedDomain : d)
              );
            }}
          />
        );
      case 'contracts':
        return (
          <SmartContractPanel
            provider={provider}
            signer={signer}
            domains={userDomains}
            currentNetwork={currentNetwork}
          />
        );
      case 'bridge':
        return (
          <CrossChainBridge
            provider={provider}
            signer={signer}
            domains={userDomains?.filter(d => d?.type === 'ENS')}
            currentNetwork={currentNetwork}
          />
        );
      case 'dns':
        return (
          <DecentralizedDNSConfig
            domains={userDomains}
            provider={provider}
            currentNetwork={currentNetwork}
          />
        );
      case 'tokenization':
        return (
          <DomainTokenization
            domains={userDomains}
            provider={provider}
            signer={signer}
            currentNetwork={currentNetwork}
          />
        );
      case 'analytics':
        return (
          <RegistryAnalytics
            domains={userDomains}
            currentNetwork={currentNetwork}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Breadcrumb />
        
        {/* Page Header with Web3 Integration */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Decentralized Domain Registry
            </h1>
            <p className="text-muted-foreground">
              Comprehensive blockchain-based domain management with ENS and Unstoppable Domains
            </p>
          </div>
          
          {/* Network & Gas Tracker */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <NetworkSelector
              currentNetwork={currentNetwork}
              onNetworkChange={setCurrentNetwork}
              options={networkOptions}
            />
            <GasTracker
              gasPrice={gasPrice}
              network={currentNetwork}
            />
          </div>
        </div>

        {/* Wallet Connection Status */}
        {!isWalletConnected && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
                <div>
                  <h3 className="text-sm font-medium text-warning">Wallet Not Connected</h3>
                  <p className="text-xs text-warning/80">
                    Connect your Web3 wallet to access domain management features
                  </p>
                </div>
              </div>
              <Button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-warning text-warning-foreground hover:bg-warning/90"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span className="ml-2">Connecting...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Wallet" size={16} />
                    <span className="ml-2">Connect Wallet</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Connected Wallet Info */}
        {isWalletConnected && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <div>
                  <h3 className="text-sm font-medium text-success">Wallet Connected</h3>
                  <p className="text-xs text-success/80">
                    {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress?.length - 4)} 
                    {' '} on {currentNetwork}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
              >
                <Icon name="LogOut" size={16} />
                <span className="ml-2">Disconnect</span>
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search your domains..."
                value={searchQuery}
                onChange={(e) => handleSearch(e?.target?.value)}
                className="pl-10"
              />
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select
              value={filterNetwork}
              onValueChange={setFilterNetwork}
              options={networkOptions}
              placeholder="Filter by network"
              className="w-48"
            />
            
            <Select
              value={sortBy}
              onValueChange={setSortBy}
              options={sortOptions}
              placeholder="Sort by"
              className="w-48"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabOptions?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => handleTabChange(tab?.id)}
                  disabled={tab?.disabled}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-standard ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary'
                      : tab?.disabled
                      ? 'border-transparent text-muted-foreground opacity-50 cursor-not-allowed'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                  {tab?.count !== undefined && (
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                      {tab?.count}
                    </span>
                  )}
                  {tab?.disabled && (
                    <Icon name="Lock" size={12} className="text-muted-foreground" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default DecentralizedDomainRegistry;