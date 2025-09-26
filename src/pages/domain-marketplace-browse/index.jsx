import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FilterPanel from './components/FilterPanel';
import DomainCard from './components/DomainCard';
import FeaturedCarousel from './components/FeaturedCarousel';
import CategoryChips from './components/CategoryChips';
import SearchAutocomplete from './components/SearchAutocomplete';
import DomainPreviewModal from './components/DomainPreviewModal';
import SortDropdown from './components/SortDropdown';
import { useGlobal } from 'context/global';

const DomainMarketplaceBrowse = () => {
  const { listings, isLoading: isLoadingGlobal } = useGlobal();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(isLoadingGlobal);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');

  console.log("listings", listings);
  console.log("isLoadingGlobal", isLoadingGlobal);
  
  // Filter state
  const [filters, setFilters] = useState({
    priceRange: 'all',
    tlds: [],
    categories: [],
    length: 'all',
    keyword: '',
    minRating: 0,
    hasEscrow: false,
    isVerified: false
  });
  
  const [activeCategories, setActiveCategories] = useState([]);

  // Mock data
  const mockDomains = [
    {
      id: 1,
      name: 'techstartup.com',
      price: 25000,
      originalPrice: 30000,
      age: 8,
      length: 11,
      tld: '.com',
      traffic: '2.5K/mo',
      status: 'available',
      isVerified: true,
      hasEscrow: true,
      isFavorited: false,
      categories: ['Technology', 'Business'],
      seller: {
        name: 'John Smith',
        rating: 4.8,
        reviews: 127,
        isVerified: true
      },
      views: 1250,
      listedDays: 15
    },
    {
      id: 2,
      name: 'financeapp.io',
      price: 45000,
      age: 5,
      length: 10,
      tld: '.io',
      traffic: '5.2K/mo',
      status: 'available',
      isVerified: true,
      hasEscrow: true,
      isFavorited: true,
      categories: ['Finance', 'Technology'],
      seller: {
        name: 'Sarah Johnson',
        rating: 4.9,
        reviews: 89,
        isVerified: true
      },
      views: 2100,
      listedDays: 8
    },
    {
      id: 3,
      name: 'healthtech.ai',
      price: 75000,
      age: 3,
      length: 10,
      tld: '.ai',
      traffic: '8.1K/mo',
      status: 'negotiating',
      isVerified: true,
      hasEscrow: true,
      isFavorited: false,
      categories: ['Health', 'Technology', 'AI'],
      seller: {
        name: 'Michael Chen',
        rating: 4.7,
        reviews: 156,
        isVerified: true
      },
      views: 3200,
      listedDays: 3
    },
    {
      id: 4,
      name: 'cryptoexchange.co',
      price: 120000,
      age: 6,
      length: 14,
      tld: '.co',
      traffic: '12.5K/mo',
      status: 'available',
      isVerified: true,
      hasEscrow: true,
      isFavorited: false,
      categories: ['Finance', 'Cryptocurrency'],
      seller: {
        name: 'Alex Rodriguez',
        rating: 4.6,
        reviews: 203,
        isVerified: true
      },
      views: 4500,
      listedDays: 22
    },
    {
      id: 5,
      name: 'ecommerce.net',
      price: 35000,
      age: 12,
      length: 9,
      tld: '.net',
      traffic: '3.8K/mo',
      status: 'available',
      isVerified: false,
      hasEscrow: false,
      isFavorited: false,
      categories: ['Business', 'E-commerce'],
      seller: {
        name: 'Emma Wilson',
        rating: 4.4,
        reviews: 67,
        isVerified: false
      },
      views: 890,
      listedDays: 45
    },
    {
      id: 6,
      name: 'blockchain.org',
      price: 95000,
      age: 7,
      length: 10,
      tld: '.org',
      traffic: '15.2K/mo',
      status: 'available',
      isVerified: true,
      hasEscrow: true,
      isFavorited: true,
      categories: ['Technology', 'Cryptocurrency'],
      seller: {
        name: 'David Kim',
        rating: 4.9,
        reviews: 178,
        isVerified: true
      },
      views: 5600,
      listedDays: 12
    }
  ];

  const featuredDomains = listings?.slice(0, 4);
  const [displayedDomains, setDisplayedDomains] = useState(listings);

  const categoryOptions = [
    { value: 'technology', label: 'Technology', icon: 'Laptop', count: 1250 },
    { value: 'business', label: 'Business', icon: 'Briefcase', count: 890 },
    { value: 'finance', label: 'Finance', icon: 'DollarSign', count: 567 },
    { value: 'health', label: 'Health', icon: 'Heart', count: 234 },
    { value: 'education', label: 'Education', icon: 'GraduationCap', count: 345 },
    { value: 'entertainment', label: 'Entertainment', icon: 'Film', count: 456 },
    { value: 'cryptocurrency', label: 'Crypto', icon: 'Bitcoin', count: 123 },
    { value: 'ai', label: 'AI', icon: 'Brain', count: 89 }
  ];

  // Initialize search from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams?.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location?.search]);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    // Update URL without navigation
    const newUrl = query ? `${location?.pathname}?search=${encodeURIComponent(query)}` : location?.pathname;
    window.history?.replaceState({}, '', newUrl);
  }, [location?.pathname]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle category toggle
  const handleCategoryToggle = (category) => {
    const updatedCategories = activeCategories?.includes(category)
      ? activeCategories?.filter(c => c !== category)
      : [...activeCategories, category];
    
    setActiveCategories(updatedCategories);
    setFilters(prev => ({ ...prev, categories: updatedCategories }));
    setCurrentPage(1);
  };

  // Handle domain actions
  const handleFavorite = (domainId, isFavorited) => {
    setDisplayedDomains(prev => 
      prev?.map(domain => 
        domain?.id === domainId 
          ? { ...domain, isFavorited } 
          : domain
      )
    );
  };

  const handlePreview = (domain) => {
    setSelectedDomain(domain);
    setIsPreviewModalOpen(true);
  };

  const handleContact = (domain) => {
    navigate('/real-time-messaging-center', { 
      state: { 
        selectedDomain: domain,
        action: 'contact-seller'
      }
    });
  };

  // Infinite scroll handler
  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    
    //setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      //setIsLoading(false);
      // Simulate end of results after page 3
      if (currentPage >= 2) {
        setHasMore(false);
      }
    }, 1000);
  };

  // Scroll event listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement?.scrollTop
        >= document.documentElement?.offsetHeight - 1000
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, currentPage]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Domain Marketplace
          </h1>
          <p className="text-muted-foreground">
            Discover premium domains from verified sellers worldwide
          </p>
        </div>

        {/* Search Bar - Mobile */}
        <div className="lg:hidden mb-6">
          <SearchAutocomplete
            onPreview={handlePreview}
            domains={displayedDomains}
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Search domains..."
          />
        </div>

        {/* Featured Domains */}
        <FeaturedCarousel
          domains={featuredDomains}
          onFavorite={handleFavorite}
          onPreview={handlePreview}
          onContact={handleContact}
        />

        {/* Category Chips */}
        <CategoryChips
          categories={categoryOptions}
          activeCategories={activeCategories}
          onCategoryToggle={handleCategoryToggle}
        />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Panel */}
          <div className="hidden lg:block">
            <FilterPanel
              isOpen={true}
              onClose={() => {}}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isMobile={false}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex items-center justify-between mb-6">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                onClick={() => setIsFilterPanelOpen(true)}
                className="lg:hidden"
              >
                <Icon name="Filter" size={16} />
                <span className="ml-2">Filters</span>
                {(filters?.categories?.length > 0 || filters?.priceRange !== 'all') && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {filters?.categories?.length + (filters?.priceRange !== 'all' ? 1 : 0)}
                  </span>
                )}
              </Button>

              {/* Desktop Search */}
              <div className="hidden lg:block flex-1 max-w-md">
                <SearchAutocomplete
                  onPreview={handlePreview}
                  domains={displayedDomains}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  placeholder="Search domains..."
                />
              </div>

              {/* Sort Dropdown */}
              <SortDropdown
                value={sortBy}
                onChange={setSortBy}
                resultCount={displayedDomains?.length}
              />
            </div>

            {/* Domain Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedDomains?.length > 0 && displayedDomains?.map((domain) => (
                <DomainCard
                  key={domain?.id}
                  domain={domain}
                  onFavorite={handleFavorite}
                  onPreview={handlePreview}
                  onContact={handleContact}
                />
              ))}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-muted rounded mb-3"></div>
                    <div className="h-8 bg-muted rounded mb-4"></div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                    </div>
                    <div className="h-12 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {!isLoading && hasMore && (
              <div className="text-center mt-8">
                <Button onClick={handleLoadMore} variant="outline">
                  <Icon name="ChevronDown" size={16} />
                  <span className="ml-2">Load More Domains</span>
                </Button>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && displayedDomains?.length > 0 && (
              <div className="text-center mt-8 py-8 border-t border-border">
                <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
                <p className="text-muted-foreground">
                  You've seen all available domains matching your criteria
                </p>
              </div>
            )}

            {/* No Results */}
            {displayedDomains?.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No domains found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      priceRange: 'all',
                      tlds: [],
                      categories: [],
                      length: 'all',
                      keyword: '',
                      minRating: 0,
                      hasEscrow: false,
                      isVerified: false
                    });
                    setActiveCategories([]);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Panel */}
        <FilterPanel
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isMobile={true}
        />

        {/* Domain Preview Modal */}
        <DomainPreviewModal
          domain={selectedDomain}
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          onContact={handleContact}
        />
      </main>
    </div>
  );
};

export default DomainMarketplaceBrowse;