import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors'
import { shortenAddress } from 'utils/cn';
import { ConnectKitButton } from "connectkit";
import { domaSubgraphService } from 'services/doma';
import { toast } from 'sonner';
import WalletConnection from 'components/WalletConnection';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isConnected: isWalletConnected } = useAccount();
  const location = useLocation();
  
  const { address, isDisconnected} = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (address) {
      
      domaSubgraphService.getDomainDeals({
        offeredBy: address
      }).then((offers) => {
        setNotificationCount(offers?.length || 0);
      }).catch((error) => {
        console.error('Failed to fetch domain deals:', error);
        setNotificationCount(0);
      });
    } else {
      setNotificationCount(0);
    }
  }, [address]);

  const navigationItems = [
    {
      label: 'Marketplace',
      path: '/domain-marketplace-browse',
      icon: 'Search',
      tooltip: 'Browse and discover domains'
    },
    {
      label: 'Portfolio',
      path: '/domain-portfolio-dashboard',
      icon: 'Briefcase',
      tooltip: 'Manage your domain portfolio',
      authRequired: isDisconnected ? true : false
    },
    // {
    //   label: 'Sell Domain',
    //   path: '/domain-listing-creation',
    //   icon: 'Plus',
    //   tooltip: 'Create new domain listing'
    // },
    {
      label: 'My Deals',
      path: '/domain-offers',
      icon: 'MessageSquare',
      tooltip: 'Manage active negotiations',
      hasNotification: notificationCount > 0,
      notificationCount: notificationCount
    },
    {
      label: 'Analytics',
      path: '/analytics-performance-dashboard',
      icon: 'BarChart3',
      tooltip: 'View performance insights',
      authRequired: true
    }
  ];

  const secondaryItems = [
    {
      label: 'Messages',
      path: '/real-time-messaging-center',
      icon: 'Mail'
    },
    {
      label: 'XMTP Test',
      path: '/xmtp-messaging-test',
      icon: 'MessageCircle'
    },
    {
      label: 'Orders',
      path: '/transaction-order-management',
      icon: 'ShoppingCart'
    },
    {
      label: 'Wallet Hub',
      path: '/web3-wallet-integration-hub',
      icon: 'Wallet'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.profile-dropdown') && !event?.target?.closest('.profile-button')) {
        setIsProfileDropdownOpen(false);
      }
      if (!event?.target?.closest('.search-container') && !event?.target?.closest('.search-button')) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleWalletConnect = () => {
    if (!address) {
      connect({ connector: injected() })
    } else {
      disconnect();
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      // Navigate to marketplace with search query
      window.location.href = `/domain-marketplace-browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  return (
    <header className="sticky top-0 z-1000 bg-card border-b border-border shadow-card">
      <div className="w-full mt-4 py-2">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Globe" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">NameNest</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              (!item?.authRequired || isWalletConnected) && (
                <div key={item?.path} className="relative group">
                  <span
                    onClick={()=>navigate(item?.path)}
                    className={`flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-standard relative ${
                      isActiveRoute(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                    {item?.hasNotification && (
                      <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item?.notificationCount}
                      </span>
                    )}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-elevated opacity-0 group-hover:opacity-100 transition-standard pointer-events-none whitespace-nowrap">
                    {item?.tooltip}
                  </div>
                </div>
              )
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="search-container relative">
              {isSearchExpanded ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      placeholder="Search domains..."
                      className="w-64 pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      autoFocus
                    />
                    <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchExpanded(false)}
                    className="ml-2"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchExpanded(true)}
                  className="search-button hidden lg:flex"
                >
                  <Icon name="Search" size={16} />
                </Button>
              )}
            </div>

            {/* Wallet Connection */}
            
            <ConnectKitButton />

            {/* Profile/Auth */}
            {isWalletConnected && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="profile-button hidden lg:flex"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={14} color="white" />
                  </div>
                </Button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-elevated z-1200">
                    <div className="py-1">
                      <a href="/profile" className="block px-4 py-2 text-sm text-popover-foreground hover:bg-muted">
                        Profile
                      </a>
                      <a href="/settings" className="block px-4 py-2 text-sm text-popover-foreground hover:bg-muted">
                        Settings
                      </a>
                      <hr className="my-1 border-border" />
                      <button
                        onClick={handleWalletConnect}
                        className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-muted"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-background z-1100">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    placeholder="Search domains..."
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigationItems?.map((item) => (
                  (!item?.authRequired || isWalletConnected) && (
                    <a
                      key={item?.path}
                      href={item?.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-standard ${
                        isActiveRoute(item?.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon name={item?.icon} size={20} />
                      <span>{item?.label}</span>
                      {item?.hasNotification && (
                        <span className="ml-auto bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item?.notificationCount}
                        </span>
                      )}
                    </a>
                  )
                ))}
              </nav>

              {/* Secondary Navigation */}
              <div className="pt-4 border-t border-border">
                <h3 className="px-4 text-sm font-medium text-muted-foreground mb-2">More</h3>
                <nav className="space-y-2">
                  {secondaryItems?.map((item) => (
                    <a
                      key={item?.path}
                      href={item?.path}
                      className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted transition-standard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon name={item?.icon} size={20} />
                      <span>{item?.label}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-border">
                <WalletConnection className="w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;