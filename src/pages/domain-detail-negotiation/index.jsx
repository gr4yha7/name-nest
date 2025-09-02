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

const DomainDetailNegotiation = () => {
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const location = useLocation();

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
    { label: domain?.name, path: location?.pathname, isLast: true }
  ];

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleMakeOffer = (offerData) => {
    console.log('Making offer:', offerData);
    // Handle offer submission logic here
  };

  const handleBuyNow = () => {
    console.log('Buy now clicked');
    // Handle buy now logic here
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
      <main className="container mx-auto px-4 py-6">
        <Breadcrumb customItems={breadcrumbItems} />
        
        {/* Domain Hero Section */}
        <DomainHero
          domain={domain}
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
            <DomainTabs domain={domain} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Desktop Offer Management */}
            <div className="hidden lg:block">
              <OfferManagement domain={domain} onMakeOffer={handleMakeOffer} />
            </div>

            {/* Social Proof */}
            <SocialProof domain={domain} />

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
        <div className="lg:hidden mt-6">
          <OfferManagement domain={domain} onMakeOffer={handleMakeOffer} />
        </div>
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
    </div>
  );
};

export default DomainDetailNegotiation;