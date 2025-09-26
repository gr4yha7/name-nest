import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { domaSubgraphService } from 'services/doma';

const SearchAutocomplete = ({ value, onChange, onSearch, placeholder = "Search more domains...", domains, onPreview }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value && value?.length > 1) {
      const result = domaSubgraphService.searchDomains({"name":value.toString()}).then((names) => {
        setSuggestions(names?.slice(0, 10));
      });
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions?.[highlightedIndex]);
        } else {
          onSearch(value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion?.name);
    onSearch(suggestion?.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onPreview(suggestion);
  };

  const getSuggestionIcon = (suggestion) => {
    switch (suggestion?.type) {
      case 'domain':
        return 'Globe';
      case 'category':
        return suggestion?.icon || 'Tag';
      case 'popular':
        return 'TrendingUp';
      default:
        return 'Search';
    }
  };

  const getSuggestionLabel = (suggestion) => {
    switch (suggestion?.type) {
      case 'domain':
        return 'Domain';
      case 'category':
        return 'Category';
      case 'popular':
        return 'Popular';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e?.target?.value)}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />
        <button
          onClick={() => onSearch(value)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-standard"
        >
          <Icon name="Search" size={16} />
        </button>
      </div>
      {/* Suggestions Dropdown */}
      {isOpen && suggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-elevated z-50 max-h-80 overflow-y-auto">
          {suggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-standard ${
                index === highlightedIndex ? 'bg-muted' : ''
              }`}
            >
              <Icon 
                name={getSuggestionIcon(suggestion)} 
                size={16} 
                className="text-muted-foreground shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {suggestion?.name}
                </div>
                {suggestion?.category && (
                  <div className="text-xs text-muted-foreground">
                    in {suggestion?.category}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                {suggestion?.searches && (
                  <span className="text-xs text-muted-foreground">
                    {suggestion?.searches} searches
                  </span>
                )}
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                  {getSuggestionLabel(suggestion)}
                </span>
              </div>
            </button>
          ))}
          
          {/* Search All Results */}
          <div className="border-t border-border">
            <button
              onClick={() => {
                onSearch(value);
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-standard"
            >
              <Icon name="Search" size={16} className="text-primary shrink-0" />
              <span className="text-sm text-primary font-medium">
                Search for "{value}"
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;