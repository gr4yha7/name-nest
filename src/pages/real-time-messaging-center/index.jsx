import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ConversationList from './components/ConversationList';
import ChatInterface from './components/ChatInterface';
import MessageSearch from './components/MessageSearch';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RealTimeMessagingCenter = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [typingUsers, setTypingUsers] = useState(new Set());

  const currentUserId = 'current-user';

  // Mock conversations data
  const mockConversations = [
    {
      id: 'conv-1',
      domainName: 'techstartup.com',
      participant: {
        id: 'user-1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        isOnline: true
      },
      lastMessage: {
        id: 'msg-1',
        senderId: 'user-1',
        type: 'offer',
        content: 'New offer received',
        offerAmount: 15000,
        timestamp: new Date(Date.now() - 300000),
        requiresResponse: true
      },
      currentPrice: 25000,
      status: 'negotiating',
      unreadCount: 2
    },
    {
      id: 'conv-2',
      domainName: 'ecommercehub.net',
      participant: {
        id: 'user-2',
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isOnline: false
      },
      lastMessage: {
        id: 'msg-2',
        senderId: 'current-user',
        type: 'text',
        content: 'Thanks for your interest! Let me know if you have any questions.',
        timestamp: new Date(Date.now() - 1800000)
      },
      currentPrice: 45000,
      status: 'active',
      unreadCount: 0
    },
    {
      id: 'conv-3',
      domainName: 'cryptotrading.io',
      participant: {
        id: 'user-3',
        name: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isOnline: true
      },
      lastMessage: {
        id: 'msg-3',
        senderId: 'user-3',
        type: 'text',
        content: 'Can you provide more details about the domain history?',
        timestamp: new Date(Date.now() - 3600000)
      },
      currentPrice: 75000,
      status: 'active',
      unreadCount: 1
    },
    {
      id: 'conv-4',
      domainName: 'healthtech.org',
      participant: {
        id: 'user-4',
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isOnline: false
      },
      lastMessage: {
        id: 'msg-4',
        senderId: 'user-4',
        type: 'file',
        content: 'Sent business_plan.pdf',
        fileName: 'business_plan.pdf',
        fileSize: 2048576,
        timestamp: new Date(Date.now() - 7200000)
      },
      currentPrice: 35000,
      status: 'pending',
      unreadCount: 0
    },
    {
      id: 'conv-5',
      domainName: 'aiplatform.dev',
      participant: {
        id: 'user-5',
        name: 'Lisa Wang',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        isOnline: true
      },
      lastMessage: {
        id: 'msg-5',
        senderId: 'current-user',
        type: 'text',
        content: 'I appreciate your offer, but I was hoping for something closer to the asking price.',
        timestamp: new Date(Date.now() - 10800000)
      },
      currentPrice: 120000,
      status: 'negotiating',
      unreadCount: 3
    }
  ];

  // Mock messages for active conversation
  const mockMessages = [
    {
      id: 'msg-1',
      conversationId: activeConversationId,
      senderId: 'user-1',
      type: 'text',
      content: `Hi! I'm very interested in purchasing techstartup.com. I've been following the domain for a while and think it would be perfect for my new venture.`,
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: 'msg-2',
      conversationId: activeConversationId,
      senderId: 'current-user',
      type: 'text',
      content: `Thanks for reaching out! I'm glad you're interested. The domain has great potential and comes with some existing traffic and backlinks. What kind of business are you planning to build?`,
      timestamp: new Date(Date.now() - 82800000)
    },
    {
      id: 'msg-3',
      conversationId: activeConversationId,
      senderId: 'user-1',
      type: 'text',
      content: `I'm launching a B2B SaaS platform for startup management. The domain would be perfect for our brand. What's your best price?`,
      timestamp: new Date(Date.now() - 79200000)
    },
    {
      id: 'msg-4',
      conversationId: activeConversationId,
      senderId: 'current-user',
      type: 'text',
      content: `That sounds like an excellent use case! The domain is currently listed at $25,000. Given the brandability and .com extension, I think it's fairly priced, but I'm open to reasonable offers.`,
      timestamp: new Date(Date.now() - 75600000)
    },
    {
      id: 'msg-5',
      conversationId: activeConversationId,
      senderId: 'user-1',
      type: 'offer',
      content: `I'd like to make an offer of $15,000 for techstartup.com`,
      offerAmount: 15000,
      timestamp: new Date(Date.now() - 300000),
      requiresResponse: true
    },
    {
      id: 'msg-6',
      conversationId: activeConversationId,
      senderId: 'user-1',
      type: 'text',
      content: `I know it's below asking, but I'm a serious buyer and can close quickly. Let me know what you think!`,
      timestamp: new Date(Date.now() - 240000)
    }
  ];

  useEffect(() => {
    setConversations(mockConversations);
    if (mockConversations?.length > 0) {
      setActiveConversationId(mockConversations?.[0]?.id);
    }
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      setMessages(mockMessages);
    }
  }, [activeConversationId]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileChat(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate WebSocket connection
  useEffect(() => {
    const simulateWebSocket = () => {
      // Simulate connection status changes
      const connectionInterval = setInterval(() => {
        setIsConnected(prev => Math.random() > 0.1 ? true : prev);
      }, 30000);

      // Simulate typing indicators
      const typingInterval = setInterval(() => {
        if (Math.random() > 0.8) {
          const randomUser = mockConversations?.[Math.floor(Math.random() * mockConversations?.length)]?.participant?.id;
          if (randomUser) {
            setTypingUsers(prev => new Set([...prev, randomUser]));
            setTimeout(() => {
              setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet?.delete(randomUser);
                return newSet;
              });
            }, 3000);
          }
        }
      }, 10000);

      return () => {
        clearInterval(connectionInterval);
        clearInterval(typingInterval);
      };
    };

    const cleanup = simulateWebSocket();
    return cleanup;
  }, []);

  const handleConversationSelect = (conversationId) => {
    setActiveConversationId(conversationId);
    if (isMobile) {
      setShowMobileChat(true);
    }
    
    // Mark conversation as read
    setConversations(prev => 
      prev?.map(conv => 
        conv?.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = (messageData) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: currentUserId,
      ...messageData
    };

    setMessages(prev => [...prev, newMessage]);

    // Update last message in conversation
    setConversations(prev =>
      prev?.map(conv =>
        conv?.id === activeConversationId
          ? {
              ...conv,
              lastMessage: {
                id: newMessage?.id,
                senderId: currentUserId,
                type: newMessage?.type,
                content: newMessage?.content,
                timestamp: newMessage?.timestamp,
                offerAmount: newMessage?.offerAmount
              }
            }
          : conv
      )
    );

    // Simulate response after delay
    if (Math.random() > 0.3) {
      setTimeout(() => {
        const activeConv = conversations?.find(c => c?.id === activeConversationId);
        if (activeConv) {
          const responseMessage = {
            id: `msg-${Date.now() + 1}`,
            conversationId: activeConversationId,
            senderId: activeConv?.participant?.id,
            type: 'text',
            content: getRandomResponse(messageData?.type),
            timestamp: new Date()
          };

          setMessages(prev => [...prev, responseMessage]);
          
          setConversations(prev =>
            prev?.map(conv =>
              conv?.id === activeConversationId
                ? {
                    ...conv,
                    lastMessage: responseMessage,
                    unreadCount: conv?.unreadCount + 1
                  }
                : conv
            )
          );
        }
      }, 2000 + Math.random() * 3000);
    }
  };

  const handleSendOffer = (offerData) => {
    handleSendMessage(offerData);
  };

  const getRandomResponse = (messageType) => {
    const responses = {
      text: [
        "Thanks for the message! Let me get back to you on that.",
        "That sounds interesting. Can you tell me more?",
        "I appreciate you reaching out. I\'ll consider this carefully.",
        "Great point! I hadn\'t thought of it that way.",
        "Let me discuss this with my team and get back to you."
      ],
      offer: [
        "Thanks for the offer! Let me review it and get back to you.",
        "I appreciate the offer, but I was hoping for something closer to asking price.",
        "That\'s an interesting proposal. Can we meet somewhere in the middle?",
        "Let me think about this offer and respond within 24 hours.",
        "I\'ll need to discuss this with my partners before making a decision."
      ],
      file: [
        "Thanks for sharing the document. I'll review it and get back to you.",
        "Received the file. This looks helpful for our discussion.",
        "Great, I'll take a look at this and let you know my thoughts."
      ]
    };

    const typeResponses = responses?.[messageType] || responses?.text;
    return typeResponses?.[Math.floor(Math.random() * typeResponses?.length)];
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const activeConversation = conversations?.find(conv => conv?.id === activeConversationId);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Messages', path: '/real-time-messaging-center', isLast: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb customItems={breadcrumbItems} />
        
        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-4 p-3 bg-warning/20 border border-warning/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="WifiOff" size={16} className="text-warning" />
              <span className="text-sm text-warning-foreground">
                Connection lost. Attempting to reconnect...
              </span>
            </div>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground">
              Manage your domain negotiations and communications
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Icon name="Search" size={16} />
              <span className="hidden sm:inline ml-2">Search Messages</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/domain-marketplace-browse')}
            >
              <Icon name="Plus" size={16} />
              <span className="hidden sm:inline ml-2">New Conversation</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
          <div className="flex h-[calc(100vh-200px)] mx-4">
            {/* Mobile Layout */}
            {isMobile ? (
              <>
                {!showMobileChat ? (
                  <ConversationList
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onConversationSelect={handleConversationSelect}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterType={filterType}
                    onFilterChange={setFilterType}
                    isMobile={isMobile}
                  />
                ) : (
                  <ChatInterface
                    conversation={activeConversation}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onSendOffer={handleSendOffer}
                    currentUserId={currentUserId}
                    isMobile={isMobile}
                    onBack={handleBackToList}
                  />
                )}
              </>
            ) : (
              /* Desktop Layout */
              <>
                <ConversationList
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onConversationSelect={handleConversationSelect}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterType={filterType}
                  onFilterChange={setFilterType}
                  isMobile={isMobile}
                />
                <ChatInterface
                  conversation={activeConversation}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onSendOffer={handleSendOffer}
                  currentUserId={currentUserId}
                  isMobile={isMobile}
                  onBack={handleBackToList}
                />
              </>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {conversations?.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Conversations</div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {conversations?.filter(c => c?.status === 'active')?.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Deals</div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-warning">
              {conversations?.reduce((sum, c) => sum + c?.unreadCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Unread Messages</div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {conversations?.filter(c => c?.participant?.isOnline)?.length}
            </div>
            <div className="text-sm text-muted-foreground">Online Now</div>
          </div>
        </div>
      </div>
      {/* Search Modal */}
      <MessageSearch
        conversations={conversations}
        onSearchResults={handleSearchResults}
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
};

export default RealTimeMessagingCenter;