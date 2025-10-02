import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DomainHero from './components/DomainHero';
import LandingPagePreview from './components/LandingPagePreview';
import DomainTabs from './components/DomainTabs';
import MessagingPanel from './components/MessagingPanel';
import OfferManagement from './components/OfferManagement';
import SocialProof from './components/SocialProof';
import { domaOrderbookService, domaSubgraphService } from 'services/doma';
import { useAccount, useWalletClient } from 'wagmi';
import { viemToEthersSigner } from '@doma-protocol/orderbook-sdk';
import toast from 'react-hot-toast';
import Input from 'components/ui/Input';
import { formatUnits } from 'ethers';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { calculateExpiryDate, currencies, inFromNowSeconds } from 'utils/cn';

const DomainDetailNegotiation = () => {
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [activities, setActivities] = useState(null);
  const [domainDetails, setDomainDetails] = useState(null);
  const [domainOffers, setDomainOffers] = useState(null);
  const [buyDomainModal, setBuyDomainModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const location = useLocation();
  const [showOfferForm, setShowOfferForm] = useState(false);

  const [expiryValue, setExpiryValue] = useState(1);
  const [expiryUnit, setExpiryUnit] = useState('day');
  const [showExpiryDropdown, setShowExpiryDropdown] = useState(false);
  const [currency, setCurrency] = useState('WETH');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const incrementExpiry = () => setExpiryValue(prev => prev + 1);
  const decrementExpiry = () => setExpiryValue(prev => Math.max(1, prev - 1));
  const { data: walletClient } = useWalletClient();

  // Mock domain data
  const domain = {
    name: "techstartup.com",
    currentPrice: 9500,
    originalPrice: 12000,
    registrationDate: "2018-03-15",
    expirationDate: "2025-03-15",
    age: 6,
    monthlyTraffic: "15.2K",
    domainAuthority: 45,
    backlinks: 2847,
    tags: ["Technology", "Startup", "Business", "Premium"],
    seller: {
      name: "David Martinez",
      rating: 4.8,
      totalSales: 127,
      yearsActive: 8,
      responseTime: "2 hours",
      completionRate: 98
    },
    landingPage: {
      lastUpdated: "2 days ago",
      seoScore: 87,
      views: 1247,
      pageSpeed: 92,
      mobileScore: 89,
      accessibility: 95,
      bestPractices: 88
    },
    trafficSources: [
      { name: "Organic Search", percentage: 65, visitors: 9880, icon: "Search" },
      { name: "Direct", percentage: 25, visitors: 3800, icon: "Globe" },
      { name: "Social Media", percentage: 7, visitors: 1064, icon: "Share2" },
      { name: "Referrals", percentage: 3, visitors: 456, icon: "ExternalLink" }
    ],
    valuationEstimates: [
      { source: "GoDaddy Appraisal", value: 8500, confidence: "High", lastUpdated: "1 week ago" },
      { source: "Estibot", value: 9200, confidence: "Medium", lastUpdated: "3 days ago" },
      { source: "DomainIndex", value: 8800, confidence: "High", lastUpdated: "5 days ago" }
    ],
    ownershipHistory: [
      {
        event: "Domain Registered",
        description: "Initial registration by current owner",
        date: "Mar 15, 2018",
        type: "registration"
      },
      {
        event: "Website Launched",
        description: "Tech startup blog launched with regular content updates",
        date: "Jun 20, 2018",
        type: "launch"
      },
      {
        event: "SEO Optimization",
        description: "Professional SEO campaign increased domain authority",
        date: "Jan 10, 2020",
        type: "optimization"
      },
      {
        event: "Listed for Sale",
        description: "Domain listed on marketplace after business pivot",
        date: "Nov 15, 2024",
        type: "listing"
      }
    ],
    priceHistory: [
      { amount: 12000, date: "Nov 15, 2024", change: 0, reason: "Initial listing" },
      { amount: 10500, date: "Dec 1, 2024", change: -12.5, reason: "Market adjustment" },
      { amount: 9500, date: "Dec 15, 2024", change: -9.5, reason: "Holiday promotion" }
    ],
    searchVolume: {
      monthly: 8900,
      difficulty: 68,
      cpc: 2.45,
      competition: "Medium",
      trend: "steady growth"
    },
    comparableDomains: [
      { name: "startuptech.com", domainAuthority: 42, traffic: "12K", soldPrice: 8200, soldDate: "Oct 2024" },
      { name: "techventure.com", domainAuthority: 48, traffic: "18K", soldPrice: 11500, soldDate: "Sep 2024" },
      { name: "innovatetech.com", domainAuthority: 44, traffic: "14K", soldPrice: 9800, soldDate: "Nov 2024" }
    ],
    marketInsights: {
      trend: "Bullish",
      trendDescription: "Tech domain values are increasing due to startup boom",
      investmentScore: 8.5,
      scoreDescription: "Strong investment potential with good ROI prospects"
    }
  };


  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Marketplace', path: '/domain-marketplace-browse' },
    { label: domainDetails?.name, path: location?.pathname, isLast: true }
  ];

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleDirectDomainPurchase = async () => {
    if (!walletClient) return;

    // Convert Viem wallet client to Ethers signer
    const signer = viemToEthersSigner(walletClient, domainDetails?.tokens[0]?.chain?.networkId);

    try {
      setIsLoading(true);
      const chainId = domainDetails?.tokens[0]?.chain?.networkId;
      const result = domaOrderbookService.buyListing(
      domainDetails["tokens"][0]?.listings[domainDetails["tokens"][0]?.listings?.length - 1]?.externalId,
      signer, 
      chainId,
      (currentStep, currentProgress) => {
        // This is the progress callback
        // setProgress(currentProgress);
        console.log("Progress update:", currentStep, currentProgress);
      }
    ).then((result) => {
        if (result) {
          setIsLoading(false);
          setBuyDomainModal(false);
          toast.success("Listing Purchased suucesfully")
        } else {
          setIsLoading(false);
        }
      })
    } catch (error) {
      console.log(error)
      toast.error(error)
      setIsLoading(false);
    }
  };

  const fetchDomainDetails = (searchTokenIdParam, searchDomainParam) => {
    domaSubgraphService.getTokenActivities(searchTokenIdParam).then((activities) => {
      console.log("activities",activities)
      setActivities(activities)
      domaSubgraphService.getDomainOffers({"tokenId":searchTokenIdParam}).then((offers) => {
        console.log("offers",offers)
        setDomainOffers(offers)
        domaSubgraphService.getDomainDetails(searchDomainParam).then((details) => {
          console.log("details",details)
          setDomainDetails(details)
        })
      })
    });
  };
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTokenIdParam = urlParams?.get('token_id');
    const searchDomainParam = urlParams?.get('domain');

    fetchDomainDetails(searchTokenIdParam,searchDomainParam)

  }, [location?.search]);

  const handleMakeOffer = () => {
    setShowOfferForm(true);
  };

  const handleSubmitOffer = (e) => {
    e?.preventDefault();
    if (!offerAmount || Number(offerAmount) <= 0)
      {
        toast.error("Please Enter Offer Amount")
        return;
      }

      if (!walletClient) return;

      const signer = viemToEthersSigner(walletClient, domainDetails?.tokens[0]?.chain?.networkId);
      const currencyAddress = currencies.find(
        (c) => c.symbol === currency
      )?.contractAddress;
      
      try {
        setIsLoading(true);
        const chainId = domainDetails?.tokens[0]?.chain?.networkId;
        domaOrderbookService.createOffer({
          contractAddress: domainDetails["tokens"]?.[0]?.tokenAddress,
          tokenId: domainDetails["tokens"]?.[0]?.tokenId,
          currencyContractAddress: currencyAddress,
          price: offerAmount,
          expirationDate: inFromNowSeconds(expiryValue, expiryUnit)
        },
        signer, 
        chainId,
        currency
      ).then((result) => {
          if (result?.orderId) {
            setIsLoading(false);
            setShowOfferForm(false);
            setOfferAmount('');
            setOfferMessage('');
            const urlParams = new URLSearchParams(location.search);
            const searchTokenIdParam = urlParams?.get('token_id');
            const searchDomainParam = urlParams?.get('domain');
        
            fetchDomainDetails(searchTokenIdParam,searchDomainParam)
          } else {
            setIsLoading(false);
          }
        })
      } catch (error) {
        console.log(error)
        toast.error(error)
        setIsLoading(false);
        setOfferAmount('');
        setOfferMessage('');
      }
  };

  const handleBuyNow = () => {
    setBuyDomainModal(true);
  };

  const handleContactSeller = () => {
    setIsMessagingOpen(true);
  };

  const handleToggleFavorite = (isFavorited) => {
    console.log('Favorite toggled:', isFavorited);
    // Handle favorite toggle logic here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${domain?.name} - Premium Domain for Sale`,
        text: `Check out this premium domain: ${domain?.name}`,
        url: window.location?.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard?.writeText(window.location?.href);
      // Show toast notification (implement as needed)
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {domainDetails ? (
        <>
      <main className="container mx-auto px-4 py-6">
        <Breadcrumb customItems={breadcrumbItems} />
        
        {/* Domain Hero Section */}
        <DomainHero
          domain={domainDetails}
          onMakeOffer={() => handleMakeOffer()}
          onBuyNow={handleBuyNow}
          onContactSeller={handleContactSeller}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* Landing Page Preview */}
        <div className="mb-6">
          <LandingPagePreview domain={domain} />
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Domain Information */}
          <div className="lg:col-span-2 space-y-6">
            <DomainTabs domain={domain} domainD={domainDetails} activities={activities} offers={domainOffers} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Desktop Offer Management */}
            {domainDetails["tokens"][0]?.listings?.length > 0 &&
            <div className="hidden lg:block">
              <OfferManagement domain={domainDetails} offers={domainOffers} onMakeOffer={handleMakeOffer} walletClient={walletClient} />
            </div>
            }

            {/* Social Proof */}
            <SocialProof />

            {/* Share Actions */}
            <div className="bg-card border border-border rounded-lg shadow-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Share This Domain</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Icon name="Share2" size={16} />
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Twitter" size={16} />
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Linkedin" size={16} />
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Mail" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Offer Management */}
        {domainDetails["tokens"][0]?.listings?.length > 0 &&
        <div className="lg:hidden mt-6">
          <OfferManagement domain={domainDetails} offers={domainOffers} setOffer={setShowOfferForm} />
        </div>
        }
      </main>
      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            fullWidth
            onClick={handleContactSeller}
            iconName="MessageCircle"
            iconPosition="left"
          >
            Message
          </Button>
          <Button
            variant="default"
            fullWidth
            onClick={() => setShowMobileActions(true)}
            iconName="DollarSign"
            iconPosition="left"
          >
            Make Offer
          </Button>
        </div>
      </div>
      {/* Mobile Actions Modal */}
      {showMobileActions && (
        <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-card border-t border-border rounded-t-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileActions(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            <Button
              variant="default"
              fullWidth
              onClick={handleBuyNow}
              iconName="ShoppingCart"
              iconPosition="left"
            >
              Buy Now - ${domain?.currentPrice?.toLocaleString()}
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setShowMobileActions(false);
                handleMakeOffer();
              }}
              iconName="DollarSign"
              iconPosition="left"
            >
              Make Offer
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setShowMobileActions(false);
                handleContactSeller();
              }}
              iconName="MessageCircle"
              iconPosition="left"
            >
              Contact Seller
            </Button>
          </div>
        </div>
      )}
      {/* Messaging Panel */}
      <MessagingPanel
        domain={domain}
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
      />
      {/* Add bottom padding for mobile sticky bar */}
      <div className="lg:hidden h-20"></div>
      </>
      ) : (
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-screen">
            <div className="text-lg font-semibold text-foreground">Loading Domain Details, Activities and Offers...</div>
          </div>
        </div>
      )}

      {buyDomainModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              
              <div className='grid'>
                <span className="text-lg font-semibold text-foreground">Buy "{domainDetails?.name}" from marketplace.</span>
                <span className="text-xs font-semibold mt-2 text-foreground text-red-500">Are you sure you want to purchase this domain by paying the asking price?</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex space-x-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white"
                    onClick={() => setBuyDomainModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button disabled={isLoading} className="w-full disabled:cursor-not-allowed cursor-pointer h-10 hover:bg-blue-900" onClick={() => handleDirectDomainPurchase()} type="submit">
                  {isLoading ? "Processing" : "Confirm and Pay"}
                  </Button>
                </div>
              
            </div>
          </div>
        </div>
      )}
      {showOfferForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-md pb-6">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h4 className="text-lg font-semibold text-foreground">Make an Offer</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOfferForm(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="flex items-center w-full space-x-2 p-6 space-y-4">
              <Input
                label="Offer Amount"
                type="number"
                placeholder="Enter your offer amount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e?.target?.value)}
                required
                className="w-full"
                min="1"
                step="1"
              />
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="flex items-center mt-2 space-x-2 bg-gray-500 px-4 py-2 rounded-xl hover:bg-[#252525] transition-colors"
                >
                  <span className="text-white font-medium">{currency}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {/* Currency Dropdown */}
                {showCurrencyDropdown && (
                  <div className="absolute right-0 top-full mt- bg-white border border-gray-800 rounded-xl overflow-hidden min-w-[120px] z-10">
                    {currencies?.filter((item) => item?.contractAddress !== null).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => {
                          setCurrency(curr.symbol);
                          setShowCurrencyDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          currency === curr.symbol
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-blue-600'
                        }`}
                      >
                        {curr?.symbol}
                        {currency === curr.symbol && (
                          <span className="float-right">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

              {/* Expiry Section */}
            <div className='px-6'>
                  <h3 className="text-black text-sm mb-4">Expiration date</h3>
                  
                  {/* Expiry Dropdown Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowExpiryDropdown(!showExpiryDropdown)}
                      className="w-full text-black bg-white border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span className="text-black">In {expiryValue} {expiryUnit}{expiryValue !== 1 ? 's' : ''} ({calculateExpiryDate(expiryUnit, expiryValue)})</span>
                      </div>
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Expiry Dropdown Content */}
                    {showExpiryDropdown && (
                      <div className="mt-4 bg-gray-500 rounded-xl p-8">
                        <p className="text-center text-white mb-6">Expires in</p>
                        
                        {/* Number Selector */}
                        <div className="flex items-center justify-center mb-8">
                          <div className="bg-white rounded-2xl p-2 flex items-center space-x-8">
                            <button
                              onClick={decrementExpiry}
                              className="text-gray-800 hover:text-white transition-colors p-2"
                            >
                              <ChevronDown className="w-6 h-6" />
                            </button>
                            <span className="text-black text-5xl font-light min-w-[80px] text-center">{expiryValue}</span>
                            <button
                              onClick={incrementExpiry}
                              className="text-gray-800 hover:text-white transition-colors p-2"
                            >
                              <ChevronUp className="w-6 h-6" />
                            </button>
                          </div>
                        </div>

                        {/* Time Unit Selector */}
                        <div className="flex gap-3 justify-center">
                          {['day', 'week', 'month'].map((unit) => (
                            <button
                              key={unit}
                              onClick={() => setExpiryUnit(unit)}
                              className={`px-8 py-3 rounded-xl font-medium transition-colors ${
                                expiryUnit === unit
                                  ? 'bg-gray-600 text-white'
                                  : 'bg-white text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>

                      </div>
                    )}
                        <p className="text-gray-500 text-sm mt-3">
                          Offer will expire if not accepted by this date.
                        </p>
                  </div>
            </div>

              
            <div className='px-6 pt-6'>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message to Seller
                </label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e?.target?.value)}
                  placeholder="Add a personal message to strengthen your offer..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
            </div>
              
            <div className="flex items-center justify-between pt-4 px-6">
                <div className="text-sm text-muted-foreground">
                  Current asking price: {formatUnits(domainDetails?.tokens[0]?.listings[0]?.price, domainDetails?.tokens[0]?.listings[0]?.currency?.decimals)} {domainDetails?.tokens[0]?.listings[0]?.currency?.symbol}
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowOfferForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                  className="disabled:cursor-not-allowed"
                  disabled={isLoading}
                  onClick={handleSubmitOffer} type="submit">
                  {isLoading ? "Processing" : "Submit Offer"}
                  </Button>
                </div>
            </div>
            
            </div>
          </div>
      )}
    </div>
  );
};

export default DomainDetailNegotiation;