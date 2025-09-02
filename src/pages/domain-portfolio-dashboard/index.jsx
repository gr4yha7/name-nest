import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PortfolioOverviewCards from './components/PortfolioOverviewCards';
import NetworkDistributionMap from './components/NetworkDistributionMap';
import DomainManagementTable from './components/DomainManagementTable';
import BulkManagementTools from './components/BulkManagementTools';
import PortfolioAnalytics from './components/PortfolioAnalytics';
import SmartContractIntegration from './components/SmartContractIntegration';

const DomainPortfolioDashboard = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [portfolioData, setPortfolioData] = useState(null);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    network: 'all',
    dateRange: '30d',
    performance: 'all',
    status: 'all'
  });
  const [loading, setLoading] = useState(true);

  // Mock portfolio data
  const mockPortfolioData = {
    totalDomains: 127,
    portfolioValueETH: 45.7,
    portfolioValueUSD: 182800,
    activeListings: 23,
    recentSales: 8,
    monthlyROI: 12.5,
    networkDistribution: {
      ethereum: { count: 67, value: 32.4 },
      polygon: { count: 38, value: 8.9 },
      solana: { count: 22, value: 4.4 }
    },
    domains: [
      {
        id: 1,
        name: 'crypto-future.eth',
        network: 'ethereum',
        value: 2.5,
        roi: 25.5,
        acquired: '2024-01-15',
        status: 'listed',
        lastActivity: '2024-08-20'
      },
      {
        id: 2,
        name: 'defi-token.sol',
        network: 'solana',
        value: 1.8,
        roi: -5.2,
        acquired: '2024-02-10',
        status: 'holding',
        lastActivity: '2024-08-18'
      }
    ]
  };

  useEffect(() => {
    // Simulate data loading
    const loadPortfolioData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPortfolioData(mockPortfolioData);
      setLoading(false);
    };

    if (isWalletConnected) {
      loadPortfolioData();
    }
  }, [isWalletConnected]);

  const handleWalletConnect = async () => {
    try {
      // Simulate wallet connection
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const handleBulkAction = (action, domainIds) => {
    console.log(`Performing ${action} on domains:`, domainIds);
    // Implement bulk actions
  };

  const handleFilterChange = (newFilters) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
  };

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Wallet" size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-muted-foreground mb-8">
                Connect your Web3 wallet to access your domain portfolio dashboard and manage your decentralized assets.
              </p>
              <Button
                onClick={handleWalletConnect}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Icon name="Wallet" size={16} className="mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Domain Portfolio</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive Web3 domain management and analytics
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/web3-wallet-integration-hub'}
            >
              <Icon name="Settings" size={16} className="mr-2" />
              Wallet Settings
            </Button>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Add Domain
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading portfolio...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Portfolio Overview Cards */}
            <PortfolioOverviewCards data={portfolioData} />

            {/* Network Distribution and Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NetworkDistributionMap 
                data={portfolioData?.networkDistribution} 
                selectedNetwork={selectedNetwork}
                onNetworkSelect={setSelectedNetwork}
              />
              <PortfolioAnalytics data={portfolioData} />
            </div>

            {/* Smart Contract Integration */}
            <SmartContractIntegration />

            {/* Bulk Management Tools */}
            <BulkManagementTools 
              selectedDomains={selectedDomains}
              onBulkAction={handleBulkAction}
            />

            {/* Domain Management Table */}
            <DomainManagementTable
              domains={portfolioData?.domains || []}
              selectedDomains={selectedDomains}
              onSelectionChange={setSelectedDomains}
              filters={filterOptions}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default DomainPortfolioDashboard;