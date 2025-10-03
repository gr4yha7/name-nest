import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Dm } from '@xmtp/browser-sdk';
import { useGlobal } from 'context/global';

const ConversationList = ({ 
  conversations, 
  activeConversationId, 
  onConversationSelect, 
  searchQuery, 
  onSearchChange,
  filterType,
  onFilterChange,
  isMobile 
}) => {
  const { xmtpClient } = useGlobal();
  const [dms, setDms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let streamController;

    if (xmtpClient) {
      (async () => {
        streamController = await xmtpClient.conversations.stream<Dm<string>>({
          onValue: (value) => {
            setDms((prevDms) => [...prevDms, value]);
          },
          onError: (err) => {
            console.error("Stream error:", err);
          },
        });
      })();
    }

    return () => {
      if (streamController && typeof streamController.return === "function") {
        streamController.return();
      }
    };
  }, [xmtpClient]);

  useEffect(() => {
    if (xmtpClient) {
      setLoading(true);
      (async () => {
        const allDms = await xmtpClient.conversations.list();
        setDms(allDms?.filter((item) => item.isActive));
        setLoading(false);
      })();
    } else {
      setDms([]);
    }
  }, [xmtpClient]);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

  const filterOptions = [
    { value: 'all', label: 'All Conversations' },
    { value: 'active', label: 'Active Deals' },
    { value: 'unread', label: 'Unread Messages' },
    { value: 'archived', label: 'Archived' }
  ];

  const filteredConversations = conversations?.filter(conversation => {
    const matchesSearch = conversation?.domainName?.toLowerCase()?.includes(localSearchQuery?.toLowerCase()) ||
                         conversation?.participant?.name?.toLowerCase()?.includes(localSearchQuery?.toLowerCase()) ||
                         conversation?.lastMessage?.content?.toLowerCase()?.includes(localSearchQuery?.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'active' && conversation?.status === 'active') ||
                         (filterType === 'unread' && conversation?.unreadCount > 0) ||
                         (filterType === 'archived' && conversation?.status === 'archived');
    
    return matchesSearch && matchesFilter;
  });

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e?.target?.value);
    onSearchChange(e?.target?.value);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return messageTime?.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'negotiating': return 'text-warning';
      case 'pending': return 'text-secondary';
      case 'archived': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  return (
    <div className={`bg-card border-r border-border ${isMobile ? 'w-full' : 'w-80'} flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-muted rounded-md transition-standard">
              <Icon name="Settings" size={16} className="text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-md transition-standard">
              <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Input
            type="search"
            placeholder="Search conversations..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Filter */}
        <Select
          options={filterOptions}
          value={filterType}
          onChange={onFilterChange}
          placeholder="Filter conversations"
        />
      </div>
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <Icon name="MessageSquare" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No conversations found</h3>
            <p className="text-sm text-muted-foreground">
              {localSearchQuery ? 'Try adjusting your search terms' : 'Start a conversation to see it here'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConversations?.map((conversation) => (
              <div
                key={conversation?.id}
                onClick={() => onConversationSelect(conversation?.id)}
                className={`p-4 cursor-pointer transition-standard hover:bg-muted ${
                  activeConversationId === conversation?.id ? 'bg-muted border-r-2 border-primary' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <Image
                      src={conversation?.participant?.avatar}
                      alt={conversation?.participant?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {conversation?.participant?.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {conversation?.participant?.name}
                      </h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTimestamp(conversation?.lastMessage?.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-primary truncate">
                        {conversation?.domainName}
                      </span>
                      <span className={`text-xs font-medium ${getStatusColor(conversation?.status)}`}>
                        {conversation?.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {conversation?.lastMessage?.type === 'offer' ? (
                          <span className="flex items-center">
                            <Icon name="DollarSign" size={12} className="mr-1" />
                            Offer: ${conversation?.lastMessage?.offerAmount?.toLocaleString()}
                          </span>
                        ) : conversation?.lastMessage?.type === 'file' ? (
                          <span className="flex items-center">
                            <Icon name="Paperclip" size={12} className="mr-1" />
                            Attachment
                          </span>
                        ) : (
                          conversation?.lastMessage?.content
                        )}
                      </p>
                      {conversation?.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 ml-2 flex-shrink-0">
                          {conversation?.unreadCount > 99 ? '99+' : conversation?.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    {conversation?.lastMessage?.type === 'offer' && conversation?.lastMessage?.requiresResponse && (
                      <div className="flex items-center space-x-2 mt-2">
                        <button className="text-xs bg-success text-success-foreground px-2 py-1 rounded hover:bg-success/90 transition-standard">
                          Accept
                        </button>
                        <button className="text-xs bg-warning text-warning-foreground px-2 py-1 rounded hover:bg-warning/90 transition-standard">
                          Counter
                        </button>
                        <button className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded hover:bg-destructive/90 transition-standard">
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredConversations?.length} conversations</span>
          <span>{conversations?.filter(c => c?.unreadCount > 0)?.length} unread</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;