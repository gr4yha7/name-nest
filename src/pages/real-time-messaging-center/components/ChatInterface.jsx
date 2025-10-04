import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatInterface = ({ 
  conversation, 
  messages, 
  onSendMessage, 
  onSendOffer, 
  currentUserId,
  isMobile,
  onBack 
}) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const quickResponses = [
    "Thanks for your interest!",
    "Let me think about it",
    "Can you provide more details?",
    "That sounds reasonable",
    "I\'ll get back to you soon"
  ];

  const emojis = ['👍', '👎', '😊', '🤔', '💰', '🔥', '✅', '❌', '📈', '🎯'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (messageText?.trim()) {
      onSendMessage({
        type: 'text',
        content: messageText?.trim(),
        timestamp: new Date()
      });
      setMessageText('');
    }
  };

  const handleSendOffer = () => {
    if (offerAmount && parseFloat(offerAmount) > 0) {
      onSendOffer({
        type: 'offer',
        content: `Offer: $${parseFloat(offerAmount)?.toLocaleString()}`,
        offerAmount: parseFloat(offerAmount),
        timestamp: new Date()
      });
      setOfferAmount('');
      setShowOfferModal(false);
    }
  };

  const handleQuickResponse = (response) => {
    onSendMessage({
      type: 'text',
      content: response,
      timestamp: new Date()
    });
  };

  const handleFileUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      onSendMessage({
        type: 'file',
        content: `Sent ${file?.name}`,
        fileName: file?.name,
        fileSize: file?.size,
        timestamp: new Date()
      });
    }
    setShowAttachmentMenu(false);
  };

  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="MessageSquare" size={64} className="text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
          <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <Icon name="ArrowLeft" size={16} />
              </Button>
            )}
            <div className="relative">
              <Image
                src={conversation?.participant?.avatar}
                alt={conversation?.participant?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {conversation?.participant?.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-foreground">{conversation?.participant?.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="font-medium text-primary">{conversation?.domainName}</span>
                <span>•</span>
                <span>${conversation?.currentPrice?.toLocaleString()}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  conversation?.participant?.isOnline ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                }`}>
                  {conversation?.participant?.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Icon name="Phone" size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Video" size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Info" size={16} />
            </Button>
          </div>
        </div>

        {/* Domain Context */}
        <div className="mt-3 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Globe" size={16} className="text-primary" />
              <span className="font-medium text-foreground">{conversation?.domainName}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Listed: ${conversation?.currentPrice?.toLocaleString()}</span>
              <Button variant="outline" size="sm">
                View Listing
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message, index) => {
          const isCurrentUser = message?.senderId === currentUserId;
          const showAvatar = index === 0 || messages?.[index - 1]?.senderId !== message?.senderId;
          
          return (
            <div key={message?.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!isCurrentUser && showAvatar && (
                  <Image
                    src={conversation?.participant?.avatar}
                    alt={conversation?.participant?.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                {!isCurrentUser && !showAvatar && <div className="w-6" />}
                
                <div className={`rounded-lg px-3 py-2 ${
                  isCurrentUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border border-border text-foreground'
                }`}>
                  {message?.type === 'offer' && (
                    <div className="mb-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="DollarSign" size={16} />
                        <span className="font-medium">
                          {isCurrentUser ? 'Your Offer' : 'Offer Received'}
                        </span>
                      </div>
                      <div className="text-lg font-bold">
                        ${message?.offerAmount?.toLocaleString()}
                      </div>
                      {!isCurrentUser && message?.requiresResponse && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Button variant="success" size="xs">Accept</Button>
                          <Button variant="warning" size="xs">Counter</Button>
                          <Button variant="destructive" size="xs">Decline</Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {message?.type === 'file' && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Paperclip" size={16} />
                      <div>
                        <div className="font-medium">{message?.fileName}</div>
                        <div className="text-xs opacity-75">{formatFileSize(message?.fileSize)}</div>
                      </div>
                    </div>
                  )}
                  
                  {message?.type === 'text' && (
                    <p className="whitespace-pre-wrap">{message?.content}</p>
                  )}
                  
                  <div className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {formatTimestamp(message?.timestamp)}
                    {isCurrentUser && (
                      <Icon name="Check" size={12} className="inline ml-1" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <Image
                src={conversation?.participant?.avatar}
                alt={conversation?.participant?.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="bg-card border border-border rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Quick Responses */}
      <div className="px-4 py-2 border-t border-border bg-muted/50">
        <div className="flex space-x-2 overflow-x-auto">
          {quickResponses?.map((response, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickResponse(response)}
              className="whitespace-nowrap flex-shrink-0"
            >
              {response}
            </Button>
          ))}
        </div>
      </div>
      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                >
                  <Icon name="Paperclip" size={16} />
                </Button>
                {showAttachmentMenu && (
                  <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-md shadow-elevated p-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef?.current?.click()}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted rounded"
                    >
                      <Icon name="File" size={14} />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOfferModal(true)}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted rounded"
                    >
                      <Icon name="DollarSign" size={14} />
                      <span>Send Offer</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                >
                  <Icon name="Smile" size={16} />
                </Button>
                {isEmojiPickerOpen && (
                  <div className="absolute bottom-full left-0 mb-2 bg-popover border border-border rounded-md shadow-elevated p-2">
                    <div className="grid grid-cols-5 gap-1">
                      {emojis?.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className="p-2 hover:bg-muted rounded text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e?.target?.value)}
              placeholder="Type your messagejh..."
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e?.key === 'Enter' && !e?.shiftKey) {
                  e?.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          
          <Button type="submit" disabled={!messageText?.trim()}>
            <Icon name="Send" size={16} />
          </Button>
        </form>
      </div>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Send Offer</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOfferModal(false)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Domain: {conversation?.domainName}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Current asking price: ${conversation?.currentPrice?.toLocaleString()}
                  </p>
                </div>
                
                <Input
                  type="number"
                  label="Your Offer ($)"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e?.target?.value)}
                  placeholder="Enter offer amount"
                  min="1"
                  step="1"
                />
                
                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowOfferModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendOffer}
                    disabled={!offerAmount || parseFloat(offerAmount) <= 0}
                  >
                    Send Offer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;