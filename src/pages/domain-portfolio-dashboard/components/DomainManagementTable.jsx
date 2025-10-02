import React, { useCallback, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import { formatUnits } from 'viem';
import Input from 'components/ui/Input';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { domaOrderbookService } from 'services/doma';
import { useEthersSigner } from 'hooks/UseEthersSigner';
import { useSwitchChain, useWalletClient } from 'wagmi';
import { OrderbookType, viemToEthersSigner } from '@doma-protocol/orderbook-sdk';
import { calculateExpiryDate, currencies, SUPPORTED_CHAINS } from 'utils/cn';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DomainManagementTable = ({
  domains,
  selectedDomains,
  onSelectionChange,
  filters,
  onFilterChange
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showListingModal, setShowListingModal] = useState(false);
  const [showCancelListingModal, setShowCancelListingModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [listingPrice, setListingPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [progress, setProgress] = useState(0);

  const [expiryValue, setExpiryValue] = useState(1);
  const [expiryUnit, setExpiryUnit] = useState('day');
  const [listPrice, setListPrice] = useState('100');
  const [currency, setCurrency] = useState('WETH');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showExpiryDropdown, setShowExpiryDropdown] = useState(false);
  
  const incrementExpiry = () => setExpiryValue(prev => prev + 1);
  const decrementExpiry = () => setExpiryValue(prev => Math.max(1, prev - 1));
  const navigate = useNavigate();


  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();


  const networkOptions = [
    { value: 'all', label: 'All Networks' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'sepolia', label: 'Sepolia' },
    { value: 'baseSepolia', label: 'Base Sepolia' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'listed', label: 'Listed' },
    { value: 'holding', label: 'Holding' },
    { value: 'sold', label: 'Sold' },
    { value: 'transfer', label: 'In Transfer' }
  ];

  const getNetworkIcon = (network) => {
    const icons = {
      ethereum: 'Zap',
      polygon: 'Triangle',
      solana: 'Sun'
    };
    return icons?.[network] || 'Globe';
  };

  const getStatusColor = (status) => {
    const colors = {
      listed: 'bg-blue-100 text-blue-800',
      holding: 'bg-gray-100 text-gray-800',
      sold: 'bg-green-100 text-green-800',
      transfer: 'bg-yellow-100 text-yellow-800'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      // Select all domains
      const allDomainNames = domains.map(domain => domain?.name);
      onSelectionChange?.(allDomainNames);
    } else {
      // Deselect all domains
      onSelectionChange?.([]);
    }
  };

  const handleListing = (domain) => {
    if (domain?.tokens[0]?.listings?.length > 0) {
      return;
    }
    setSelectedDomain(domain);
    setShowListingModal(true);
  };

  const handleCancelListingProcess = (domain) => {
    setSelectedDomain(domain);
    setShowCancelListingModal(true);
  };

  const handleListingOrder = async () => {

    if (listingPrice <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }

    if (!walletClient) return;

    // Convert Viem wallet client to Ethers signer
    const signer = viemToEthersSigner(walletClient, selectedDomain?.tokens[0]?.chain?.networkId);
    const currencyAddress = currencies.find(
      (c) => c.symbol === currency
    )?.contractAddress;

    try {
      setIsLoading(true);
      const chainId = selectedDomain?.tokens[0]?.chain?.networkId;
      await domaOrderbookService.createListing({
        contractAddress: selectedDomain["tokens"]?.[0]?.tokenAddress,
        tokenId: selectedDomain["tokens"]?.[0]?.tokenId,
        price: listingPrice,
      },
      signer, 
      chainId,
      currencyAddress,
      currency,
      (currentStep, currentProgress) => {
        // This is the progress callback
        setProgress(currentProgress);
        console.log("Progress update:", currentStep, currentProgress);
      }
    ); 
      setIsLoading(false);
      setShowListingModal(false);
      toast.success("Domain Listed on MarketPlace")
    } catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  };

  const handleCancelListing = async () => {
    if (!walletClient) return;
    const listingId = selectedDomain?.tokens[0]?.listings[selectedDomain?.tokens[0]?.listings?.length - 1]?.externalId;
    // Convert Viem wallet client to Ethers signer
    const signer = viemToEthersSigner(walletClient, selectedDomain?.tokens[0]?.chain?.networkId);

    try {
      setIsLoading(true);
      const chainId = selectedDomain?.tokens[0]?.chain?.networkId;
      const result = await domaOrderbookService.cancelListing(
        listingId,
      signer, 
      chainId,
      (currentStep, currentProgress) => {
        // This is the progress callback
        setProgress(currentProgress);
        console.log("Progress update:", currentStep, currentProgress);
      }
    ); 
      setIsLoading(false);
      if (result) {
        toast.success("Domain Listing Cancelled on MarketPlace")
        setShowCancelListingModal(false);
      }
    } catch (error) {
      toast.error("error", error)
      console.log(error)
      setIsLoading(false);
    }
  };


  const handleSelectDomain = (domainName) => {
    onSelectionChange((prevSelectedDomains) => {
      if (prevSelectedDomains.includes(domainName)) {
        // If the domain is already selected, remove it
        return prevSelectedDomains.filter((name) => name !== domainName);
      } else {
        // If the domain is not selected, add it
        return [...prevSelectedDomains, domainName];
      }
    });
  };

  const sortedDomains = [...(domains || [])]?.sort((a, b) => {
    const aVal = a?.[sortField];
    const bVal = b?.[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aVal === 'string') {
      return aVal?.localeCompare(bVal) * modifier;
    }
    return (aVal - bVal) * modifier;
  });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">
            Domain Management
          </h3>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select
              value={filters?.network}
              onValueChange={(value) => onFilterChange?.({ network: value })}
              options={networkOptions}
              placeholder="Filter by network"
              className="w-40"
            />
            <Select
              value={filters?.status}
              onValueChange={(value) => onFilterChange?.({ status: value })}
              options={statusOptions}
              placeholder="Filter by status"
              className="w-40"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p- text-left hidden">
                <input
                  type='checkbox'
                  checked={selectedDomains?.length === domains?.length && domains?.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th
                className="p-4 text-left cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">Domain</span>
                  {sortField === 'name' && (
                    <Icon
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                      size={14}
                    />
                  )}
                </div>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Network</span>
              </th>
              <th
                className="p-4 hidden text-left cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">Value</span>
                  {sortField === 'value' && (
                    <Icon
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                      size={14}
                    />
                  )}
                </div>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Active Offers</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Expires In</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDomains?.map((domain, index) => (
              <tr
                key={index}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="p-4 hidden">
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type='checkbox'
                      checked={selectedDomains?.includes(domain?.name)}
                      onChange={(e) => handleSelectDomain(domain?.name, e.target.value)}
                    />
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Globe" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{domain?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Tokenized {formatDistanceToNow(new Date(domain.tokenizedAt))} ago
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getNetworkIcon(domain?.network)} size={16} />
                    <span className="text-sm capitalize text-foreground">
                      {domain?.tokens[0]?.chain?.name}
                    </span>
                  </div>
                </td>
                <td className="p-4 hidden">
                  <span className="text-sm font-medium text-foreground">
                    {domain?.value} ETH
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize`}
                  >
                    {domain?.activeOffersCount}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(domain.expiresAt))}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div onClick={() => navigate(`/domain-detail-negotiation?token_id=${domain?.tokens[0]?.tokenId}&domain=${domain?.name}`)} className="bg-blue-400 cursor-pointer text-white text-xs py-1 rounded-md px-2">
                      <span>More details</span>
                    </div>
                    <div onClick={() => handleListing(domain)} className={`${domain?.tokens[0]?.listings?.length > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-400 cursor-pointer"} text-white text-xs py-1 rounded-md px-2`}>
                      <span>{domain?.tokens[0]?.listings?.length > 0 ? "Listed" : "List"}</span>
                    </div>
                    {domain?.tokens[0]?.listings?.length > 0 &&
                    <div onClick={() => handleCancelListingProcess(domain)} className='bg-red-400 cursor-pointer text-white text-xs py-1 rounded-md px-2'>
                      <span>Cancel Listing</span>
                    </div>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(!domains || domains?.length === 0) && (
        <div className="p-8 text-center">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No domains found</p>
        </div>
      )}

      {showCancelListingModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              
              <div className='grid'>
                <span className="text-lg font-semibold text-foreground">Remove "{selectedDomain?.name}" from marketplace.</span>
                <span className="text-xs font-semibold mt-2 text-foreground text-red-500">Are you sure you want to remove this domain from marketplace?</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex space-x-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white"
                    onClick={() => setShowCancelListingModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button disabled={isLoading} className="w-full disabled:cursor-not-allowed h-10 hover:bg-blue-900" onClick={() => handleCancelListing()} type="submit">
                  {isLoading ? "Processing" : "Proceed"}
                  </Button>
                </div>
              
            </div>
          </div>
        </div>
      )}
      {showListingModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card mt-8 border border-border rounded-xl shadow-modal w-full max-w-lg">
         
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-00 p-6 flex items-start justify-between">
                <div>
                  <h2 className="text-black text-sm mb-2">List directly on Doma Marketplace for sale</h2>
                  <h1 className="text-gray-500 text-3xl font-semibold">{selectedDomain?.name}</h1>
                  <p className="text-black mt-3 leading-relaxed">
                    Allow buyers to instantly purchase and transfer this domain within a timeframe for a quicker sale.
                  </p>
                </div>
                <button 
                  onClick={() => setShowListingModal(false)}
                  className="text-gray-400 hover:text-black transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8 overflow-scrollable">
                {/* Expiry Section */}
                <div>
                  <h3 className="text-black text-xl mb-4">Expiry of sale</h3>
                  
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
                        <p className="text-gray-500 text-sm mt-6">
                          Listing will expire if not filled by this date.
                        </p>
                  </div>
                </div>

                {/* Pricing Section */}
                <div>
                  <h3 className="text-black text-xl mb-6">Pricing</h3>

                  {/* List Price */}
                  <div className="bg-white border border-gray-800 rounded-xl p-6 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-black text-lg mb-1">List price</h4>
                        <p className="text-gray-500 text-sm">The cost of the domain, before fees are deducted</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <input
                          type="number"
                          value={listingPrice}
                          onChange={(e) => setListingPrice(e.target.value)}
                          className="bg-transparent text-black px-4 py-[6px] rounded-xl text-2xl text-right w-32 outline-none"
                          placeholder="0"
                        />
                        <div className="relative">
                          <button
                            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                            className="flex items-center space-x-2 bg-[#1a1a1a] px-4 py-3 rounded-xl hover:bg-[#252525] transition-colors"
                          >
                            <span className="text-white font-medium">{currency}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </button>

                          {/* Currency Dropdown */}
                          {showCurrencyDropdown && (
                            <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden min-w-[120px] z-10">
                              {currencies.map((curr) => (
                                <button
                                  key={curr}
                                  onClick={() => {
                                    setCurrency(curr.symbol);
                                    setShowCurrencyDropdown(false);
                                  }}
                                  className={`w-full px-4 py-3 text-left transition-colors ${
                                    currency === curr.symbol
                                      ? 'bg-blue-600 text-white'
                                      : 'text-gray-300 hover:bg-[#252525]'
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
                    </div>
                  </div>

                  {/* Fees */}
                  <div className="bg-white border border-gray-800 rounded-xl p-6">
                    <h4 className="text-black text-lg mb-3">Fees</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between text-gray-400">
                        <span>domain</span>
                        <span>0.5%</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span>royalty</span>
                        <span>2.5%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {isLoading && (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Creating listing...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded">
                    <div
                      className="h-2 bg-primary rounded transition-all"
                      style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                    />
                  </div>
                </>
              )}

                {/* List Button */}
                <div className="flex space-x-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 bg-gray-500 hover:bg-gray-600 text-white"
                    onClick={() => setShowListingModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button disabled={isLoading} className="w-full disabled:cursor-not-allowed h-12 hover:bg-blue-900" onClick={() => handleListingOrder()} type="submit">
                  {isLoading ? "Listing" : "List Domain"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
      )}
      
    </div>
    
  );
};

export default DomainManagementTable;