import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const MessageSearch = ({ 
  conversations, 
  onSearchResults, 
  isOpen, 
  onClose 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTypeOptions = [
    { value: 'all', label: 'All Messages' },
    { value: 'text', label: 'Text Messages' },
    { value: 'offers', label: 'Offers Only' },
    { value: 'files', label: 'File Attachments' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  useEffect(() => {
    if (searchQuery?.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchType, dateRange]);

  const performSearch = async () => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = [];
    const query = searchQuery?.toLowerCase();
    const now = new Date();
    
    conversations?.forEach(conversation => {
      // Mock messages for search
      const mockMessages = [
        {
          id: `${conversation?.id}-1`,
          conversationId: conversation?.id,
          senderId: conversation?.participant?.id,
          type: 'text',
          content: `Hi, I'm interested in purchasing ${conversation?.domainName}. What's your best price?`,
          timestamp: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: `${conversation?.id}-2`,
          conversationId: conversation?.id,
          senderId: 'current-user',
          type: 'text',
          content: `Thanks for your interest! The domain is currently listed at $${conversation?.currentPrice?.toLocaleString()}. I'm open to reasonable offers.`,
          timestamp: new Date(now - Math.random() * 6 * 24 * 60 * 60 * 1000)
        },
        {
          id: `${conversation?.id}-3`,
          conversationId: conversation?.id,
          senderId: conversation?.participant?.id,
          type: 'offer',content: `I'd like to offer $${Math.floor(conversation?.currentPrice * 0.8)?.toLocaleString()} for ${conversation?.domainName}`,
          offerAmount: Math.floor(conversation?.currentPrice * 0.8),
          timestamp: new Date(now - Math.random() * 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: `${conversation?.id}-4`,
          conversationId: conversation?.id,
          senderId: 'current-user',
          type: 'file',
          content: 'domain_analytics_report.pdf',
          fileName: 'domain_analytics_report.pdf',
          timestamp: new Date(now - Math.random() * 4 * 24 * 60 * 60 * 1000)
        }
      ];

      mockMessages?.forEach(message => {
        const matchesQuery = message?.content?.toLowerCase()?.includes(query) ||
                           (message?.fileName && message?.fileName?.toLowerCase()?.includes(query));
        
        const matchesType = searchType === 'all' || 
                           (searchType === 'text' && message?.type === 'text') ||
                           (searchType === 'offers' && message?.type === 'offer') ||
                           (searchType === 'files' && message?.type === 'file');
        
        const matchesDate = dateRange === 'all' || isWithinDateRange(message?.timestamp, dateRange);
        
        if (matchesQuery && matchesType && matchesDate) {
          results?.push({
            ...message,
            conversation: conversation,
            highlightedContent: highlightSearchTerm(message?.content, query)
          });
        }
      });
    });

    // Sort by timestamp (newest first)
    results?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setSearchResults(results);
    setIsSearching(false);
    onSearchResults(results);
  };

  const isWithinDateRange = (timestamp, range) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    switch (range) {
      case 'today':
        return messageDate?.toDateString() === now?.toDateString();
      case 'week':
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        return messageDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        return messageDate >= monthAgo;
      case 'quarter':
        const quarterAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);
        return messageDate >= quarterAgo;
      default:
        return true;
    }
  };

  const highlightSearchTerm = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text?.replace(regex, '<mark class="bg-warning/30 text-warning-foreground">$1</mark>');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date?.toLocaleDateString();
    }
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'offer': return 'DollarSign';
      case 'file': return 'Paperclip';
      default: return 'MessageSquare';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Search Messages</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          </div>
          
          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Input
                type="search"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full"
              />
            </div>
            
            <Select
              options={searchTypeOptions}
              value={searchType}
              onChange={setSearchType}
              placeholder="Message type"
            />
            
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={setDateRange}
              placeholder="Date range"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSearching ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-muted-foreground">Searching...</span>
              </div>
            </div>
          ) : searchQuery && searchResults?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : searchResults?.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {searchResults?.length} result{searchResults?.length !== 1 ? 's' : ''} found
                </h3>
                <Button variant="outline" size="sm">
                  Export Results
                </Button>
              </div>
              
              <div className="space-y-3">
                {searchResults?.map((result) => (
                  <div
                    key={result?.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-standard cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon name={getMessageTypeIcon(result?.type)} size={16} className="text-primary" />
                        <span className="font-medium text-foreground">
                          {result?.conversation?.domainName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          with {result?.conversation?.participant?.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(result?.timestamp)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-foreground">
                      {result?.type === 'offer' ? (
                        <div className="flex items-center space-x-2">
                          <Icon name="DollarSign" size={14} />
                          <span>Offer: ${result?.offerAmount?.toLocaleString()}</span>
                        </div>
                      ) : result?.type === 'file' ? (
                        <div className="flex items-center space-x-2">
                          <Icon name="Paperclip" size={14} />
                          <span>{result?.fileName}</span>
                        </div>
                      ) : (
                        <div 
                          dangerouslySetInnerHTML={{ __html: result?.highlightedContent }}
                          className="line-clamp-2"
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          result?.senderId === 'current-user' ?'bg-primary/20 text-primary' :'bg-secondary/20 text-secondary'
                        }`}>
                          {result?.senderId === 'current-user' ? 'You' : result?.conversation?.participant?.name}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {result?.type} message
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Icon name="ExternalLink" size={14} />
                        <span className="ml-1">View</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-foreground mb-2">Search your messages</h3>
              <p className="text-sm text-muted-foreground">
                Find specific conversations, offers, or attachments across all your chats
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {searchResults?.length > 0 && (
          <div className="p-4 border-t border-border bg-muted/50">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Search completed in {Math.random() * 100 + 50}ms</span>
              <div className="flex items-center space-x-4">
                <span>{searchResults?.length} results</span>
                <Button variant="ghost" size="sm">
                  <Icon name="Download" size={14} />
                  <span className="ml-1">Export</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSearch;