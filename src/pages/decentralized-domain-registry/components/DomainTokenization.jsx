import React, { useState, useCallback } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DomainTokenization = ({ domains, provider, signer, currentNetwork }) => {
  const [activeSection, setActiveSection] = useState('fractional');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fractional ownership
  const [totalShares, setTotalShares] = useState(1000);
  const [sharePrice, setSharePrice] = useState('0.01');
  const [sharesForSale, setSharesForSale] = useState(100);
  
  // Automated trading
  const [enableTrading, setEnableTrading] = useState(false);
  const [minPrice, setMinPrice] = useState('0.005');
  const [maxPrice, setMaxPrice] = useState('0.1');
  const [tradingFee, setTradingFee] = useState(2.5);
  
  // Marketplace integration
  const [listedMarketplaces, setListedMarketplaces] = useState([]);
  
  const sectionOptions = [
    { id: 'fractional', label: 'Fractional Ownership', icon: 'PieChart' },
    { id: 'trading', label: 'Automated Trading', icon: 'TrendingUp' },
    { id: 'marketplace', label: 'Marketplace Integration', icon: 'Store' }
  ];

  const marketplaceOptions = [
    {
      id: 'opensea',
      name: 'OpenSea',
      icon: 'Waves',
      description: 'Leading NFT marketplace',
      fee: '2.5%',
      supported: true
    },
    {
      id: 'rarible',
      name: 'Rarible',
      icon: 'Palette',
      description: 'Community-owned marketplace',
      fee: '2.5%',
      supported: true
    },
    {
      id: 'foundation',
      name: 'Foundation',
      icon: 'Triangle',
      description: 'Curated digital art marketplace',
      fee: '15%',
      supported: true
    },
    {
      id: 'superrare',
      name: 'SuperRare',
      icon: 'Star',
      description: 'Digital art marketplace',
      fee: '15%',
      supported: false
    }
  ];

  const createFractionalShares = useCallback(async () => {
    if (!signer || !selectedDomain) return;

    setIsLoading(true);
    try {
      console.log(`Creating fractional shares for ${selectedDomain?.name}`, {
        totalShares,
        sharePrice,
        sharesForSale
      });

      // Simulate fractional token creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully created ${totalShares} shares for ${selectedDomain?.name}!`);
      
    } catch (error) {
      console.error('Fractional shares creation failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [signer, selectedDomain, totalShares, sharePrice, sharesForSale]);

  const setupAutomatedTrading = useCallback(async () => {
    if (!signer || !selectedDomain) return;

    setIsLoading(true);
    try {
      console.log(`Setting up automated trading for ${selectedDomain?.name}`, {
        enabled: enableTrading,
        minPrice,
        maxPrice,
        fee: tradingFee
      });

      // Simulate automated trading setup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Automated trading configured successfully!');
      
    } catch (error) {
      console.error('Automated trading setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [signer, selectedDomain, enableTrading, minPrice, maxPrice, tradingFee]);

  const toggleMarketplaceListing = useCallback(async (marketplaceId, isListing) => {
    if (!signer || !selectedDomain) return;

    setIsLoading(true);
    try {
      console.log(`${isListing ? 'Listing' : 'Unlisting'} ${selectedDomain?.name} on ${marketplaceId}`);

      // Simulate marketplace listing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setListedMarketplaces(prev => 
        isListing 
          ? [...prev, marketplaceId]
          : prev?.filter(id => id !== marketplaceId)
      );
      
    } catch (error) {
      console.error('Marketplace listing failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [signer, selectedDomain]);

  const renderFractionalSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Domain Tokenization</h3>
        <p className="text-muted-foreground mb-6">
          Create fractional ownership tokens for your domain, allowing multiple investors to own shares.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => {
                const domain = domains?.find(d => d?.id === parseInt(e?.target?.value));
                setSelectedDomain(domain);
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              {domains?.map((domain) => (
                <option key={domain?.id} value={domain?.id}>
                  {domain?.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDomain && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Total Shares
                  </label>
                  <Input
                    type="number"
                    min="100"
                    max="1000000"
                    step="100"
                    value={totalShares}
                    onChange={(e) => setTotalShares(Number(e?.target?.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Total number of shares to create
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price per Share (ETH)
                  </label>
                  <Input
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={sharePrice}
                    onChange={(e) => setSharePrice(e?.target?.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Initial price for each share
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Shares for Sale
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={totalShares}
                    value={sharesForSale}
                    onChange={(e) => setSharesForSale(Number(e?.target?.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Number of shares to list initially
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-3">Tokenization Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Domain:</span>
                    <p className="font-medium text-foreground">{selectedDomain?.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Shares:</span>
                    <p className="font-medium text-foreground">{totalShares?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Market Cap:</span>
                    <p className="font-medium text-foreground">
                      {(totalShares * parseFloat(sharePrice))?.toFixed(3)} ETH
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Initial Sale:</span>
                    <p className="font-medium text-foreground">
                      {(sharesForSale * parseFloat(sharePrice))?.toFixed(3)} ETH
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Your Ownership:</span>
                    <p className="font-medium text-foreground">
                      {(((totalShares - sharesForSale) / totalShares) * 100)?.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Token Symbol:</span>
                    <p className="font-medium text-foreground">
                      {selectedDomain?.name?.split('.')?.[0]?.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium text-warning mb-1">Important Considerations</h4>
                    <ul className="text-sm text-warning/80 space-y-1">
                      <li>• Fractional ownership creates legal and governance complexities</li>
                      <li>• Token holders may have voting rights on domain decisions</li>
                      <li>• Consider regulatory implications in your jurisdiction</li>
                      <li>• Smart contract security is critical for investor protection</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={createFractionalShares}
                disabled={isLoading || !totalShares || !sharePrice}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span className="ml-2">Creating Shares...</span>
                  </>
                ) : (
                  <>
                    <Icon name="PieChart" size={16} />
                    <span className="ml-2">Create Fractional Shares</span>
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderTradingSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Automated Trading Bot</h3>
        <p className="text-muted-foreground mb-6">
          Set up automated trading rules for your domain tokens with smart contract execution.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => {
                const domain = domains?.find(d => d?.id === parseInt(e?.target?.value));
                setSelectedDomain(domain);
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              {domains?.map((domain) => (
                <option key={domain?.id} value={domain?.id}>
                  {domain?.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDomain && (
            <>
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                <input
                  type="checkbox"
                  id="enable-trading"
                  checked={enableTrading}
                  onChange={(e) => setEnableTrading(e?.target?.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                />
                <label htmlFor="enable-trading" className="text-sm text-foreground">
                  Enable automated trading for {selectedDomain?.name}
                </label>
              </div>

              {enableTrading && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Minimum Price (ETH)
                      </label>
                      <Input
                        type="number"
                        min="0.001"
                        step="0.001"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e?.target?.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum price to accept for sell orders
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Maximum Price (ETH)
                      </label>
                      <Input
                        type="number"
                        min="0.001"
                        step="0.001"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e?.target?.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Maximum price to pay for buy orders
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Trading Fee (%)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={tradingFee}
                      onChange={(e) => setTradingFee(parseFloat(e?.target?.value))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Fee charged on each trade (goes to domain owner)
                    </p>
                  </div>

                  <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="Info" size={20} className="text-info mt-0.5" />
                      <div>
                        <h4 className="font-medium text-info mb-1">Trading Bot Features</h4>
                        <ul className="text-sm text-info/80 space-y-1">
                          <li>• Automatic bid/ask matching within price range</li>
                          <li>• Dynamic pricing based on demand</li>
                          <li>• Protection against market manipulation</li>
                          <li>• 24/7 operation via smart contracts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={setupAutomatedTrading}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span className="ml-2">Configuring...</span>
                  </>
                ) : (
                  <>
                    <Icon name="TrendingUp" size={16} />
                    <span className="ml-2">
                      {enableTrading ? 'Enable Trading Bot' : 'Disable Trading Bot'}
                    </span>
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderMarketplaceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Marketplace Integration</h3>
        <p className="text-muted-foreground mb-6">
          List your domain tokens on popular NFT marketplaces for wider exposure and liquidity.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => {
                const domain = domains?.find(d => d?.id === parseInt(e?.target?.value));
                setSelectedDomain(domain);
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              {domains?.map((domain) => (
                <option key={domain?.id} value={domain?.id}>
                  {domain?.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDomain && (
            <>
              <div>
                <h4 className="font-medium text-foreground mb-3">Available Marketplaces</h4>
                <div className="space-y-3">
                  {marketplaceOptions?.map((marketplace) => (
                    <div
                      key={marketplace?.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name={marketplace?.icon} size={20} className="text-primary" />
                        <div>
                          <h5 className="font-medium text-foreground">{marketplace?.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            {marketplace?.description} • Fee: {marketplace?.fee}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!marketplace?.supported && (
                          <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                            Coming Soon
                          </span>
                        )}
                        {listedMarketplaces?.includes(marketplace?.id) && (
                          <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                            Listed
                          </span>
                        )}
                        <Button
                          variant={listedMarketplaces?.includes(marketplace?.id) ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleMarketplaceListing(
                            marketplace?.id, 
                            !listedMarketplaces?.includes(marketplace?.id)
                          )}
                          disabled={!marketplace?.supported || isLoading}
                        >
                          {listedMarketplaces?.includes(marketplace?.id) ? 'Unlist' : 'List'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {listedMarketplaces?.length > 0 && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
                    <div>
                      <h4 className="font-medium text-success mb-1">
                        Listed on {listedMarketplaces?.length} marketplace{listedMarketplaces?.length > 1 ? 's' : ''}
                      </h4>
                      <p className="text-sm text-success/80">
                        Your domain tokens are now discoverable and tradeable on major platforms.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-3">Listing Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Increased visibility and discoverability</li>
                  <li>• Access to established user bases</li>
                  <li>• Built-in payment and escrow systems</li>
                  <li>• Professional marketplace interfaces</li>
                  <li>• Cross-platform token standards (ERC-721/1155)</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'fractional':
        return renderFractionalSection();
      case 'trading':
        return renderTradingSection();
      case 'marketplace':
        return renderMarketplaceSection();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
        {sectionOptions?.map((section) => (
          <Button
            key={section?.id}
            variant={activeSection === section?.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection(section?.id)}
            className="flex items-center space-x-2"
          >
            <Icon name={section?.icon} size={16} />
            <span>{section?.label}</span>
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default DomainTokenization;