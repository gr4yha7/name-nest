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
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { getNamesOwnedByAddress } from 'graphs/getAccountNames';
import { domaSubgraphService } from 'services/doma';
import { ConnectKitButton } from 'connectkit';

const DomainPortfolioDashboard = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [portfolioData, setPortfolioData] = useState(null);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [myDomains, setMyDomains] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    network: 'all',
    dateRange: '30d',
    performance: 'all',
    status: 'all'
  });
  const [loading, setLoading] = useState(true);
  const { address, isConnected} = useAccount();


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

  const loadPortfolioData = async () => {
    domaSubgraphService.getUserDomains(address).then(async (names) => {
      setMyDomains(names)
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("loading poe")
      setPortfolioData(mockPortfolioData);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (isConnected) {
      loadPortfolioData();
    }
  }, [address]);


  const handleBulkAction = (action, domainIds) => {
    console.log(`Performing ${action} on domains:`, domainIds);
    // Implement bulk actions
  };

  const handleFilterChange = (newFilters) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
  };

  if (!isConnected) {
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
            {/* <Button
              variant="outline"
              >
              <Icon name="Settings" size={16} className="mr-2" />
              Wallet Settings
              </Button> */}
            <Button
              onClick={() => window.open('https://testnet.d3.app/')}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Add Domain
            </Button>
          </div>
        </div>

        {(loading && myDomains?.length === 0) && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading portfolio...</span>
          </div>
        )}
        
        {(!loading && myDomains?.length === 0) && (
          <div className="flex items-center justify-center py-20">
            <span className="ml-3 text-muted-foreground text-xl">No Domains Yet</span>
          </div>
        )}
        
        {(!loading && myDomains?.length > 0) && (
          <div className="space-y-6">
            {/* Portfolio Overview Cards */}
            <PortfolioOverviewCards data={portfolioData} domains={myDomains} />

            {/* Network Distribution and Analytics Row */}
            <div className="gap-6">
              <NetworkDistributionMap 
                data={portfolioData?.networkDistribution} 
                domains={myDomains} 
                selectedNetwork={selectedNetwork}
                onNetworkSelect={setSelectedNetwork}
              />
              {/* <PortfolioAnalytics data={portfolioData} domains={myDomains} /> */}
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
              domains={myDomains || []}
              selectedDomains={selectedDomains}
              onSelectionChange={setSelectedDomains}
              filters={filterOptions}
              onFilterChange={handleFilterChange}
              loadPortfolioData={loadPortfolioData}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default DomainPortfolioDashboard;