import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortDropdown = ({ value, onChange, resultCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant', icon: 'Target' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUp' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDown' },
    { value: 'newest', label: 'Newest First', icon: 'Clock' },
    { value: 'oldest', label: 'Oldest First', icon: 'History' },
    { value: 'popular', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'rating', label: 'Highest Rated', icon: 'Star' },
    { value: 'length-short', label: 'Shortest Domain', icon: 'Minus' },
    { value: 'length-long', label: 'Longest Domain', icon: 'Plus' }
  ];

  const currentOption = sortOptions?.find(option => option?.value === value) || sortOptions?.[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {resultCount?.toLocaleString()} domains found
      </div>
      {/* Sort Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 min-w-[180px] justify-between"
        >
          <div className="flex items-center space-x-2">
            <Icon name={currentOption?.icon} size={16} />
            <span className="hidden sm:inline">{currentOption?.label}</span>
            <span className="sm:hidden">Sort</span>
          </div>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </Button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-1 w-64 bg-popover border border-border rounded-md shadow-elevated z-50">
            <div className="py-1">
              {sortOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleOptionClick(option?.value)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-muted transition-standard ${
                    option?.value === value ? 'bg-muted text-foreground' : 'text-popover-foreground'
                  }`}
                >
                  <Icon name={option?.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm">{option?.label}</span>
                  {option?.value === value && (
                    <Icon name="Check" size={16} className="text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortDropdown;