import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MessagingPanel = ({ domain, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock messages data
  useEffect(() => {
    const mockMessages = [
      {
        id: 1,
        sender: 'seller',
        senderName: domain?.seller?.name,
        content: `Hi! Thanks for your interest in ${domain?.name}. This domain has been performing really well with consistent traffic growth. Happy to answer any questions you might have.`,
        timestamp: new Date(Date.now() - 3600000),
        read: true
      },
      {
        id: 2,
        sender: 'buyer',
        senderName: 'You',
        content: 'Hello! I\'m very interested in this domain. Can you provide more details about the traffic sources and any existing monetization?',
        timestamp: new Date(Date.now() - 3000000),
        read: true
      },
      {
        id: 3,
        sender: 'seller',
        senderName: domain?.seller?.name,
        content: 'Absolutely! The traffic is primarily organic search (65%) and direct visits (25%). The domain currently has Google AdSense running which generates about $200-300 monthly. I can provide analytics screenshots if needed.',
        timestamp: new Date(Date.now() - 2400000),
        read: true
      },
      {
        id: 4,
        sender: 'buyer',
        senderName: 'You',
        content: 'That sounds great! Would you be open to negotiating on the price? I\'m thinking around $8,500.',
        timestamp: new Date(Date.now() - 1800000),
        read: true
      },
      {
        id: 5,
        sender: 'seller',
        senderName: domain?.seller?.name,
        content: 'I appreciate the offer! Given the domain\'s performance and growth potential, I\'d be willing to come down to $9,200. This includes a smooth transfer process and 30 days of support.',
        timestamp: new Date(Date.now() - 900000),
        read: false,
        isNew: true
      }
    ];
    setMessages(mockMessages);
  }, [domain]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!newMessage?.trim() && attachments?.length === 0) return;

    const message = {
      id: messages?.length + 1,
      sender: 'buyer',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      read: true,
      attachments: attachments?.length > 0 ? [...attachments] : undefined
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setAttachments([]);

    // Simulate seller typing
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Add auto-reply (optional)
      }, 2000);
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e?.target?.files);
    const newAttachments = files?.map(file => ({
      id: Date.now() + Math.random(),
      name: file?.name,
      size: file?.size,
      type: file?.type,
      url: URL.createObjectURL(file)
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments?.filter(att => att?.id !== id));
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })?.format(date);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 lg:relative lg:inset-auto bg-background lg:bg-transparent z-50 lg:z-auto">
      <div className="h-full lg:h-auto bg-card border border-border rounded-lg shadow-card flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={20} color="white" />
            </div>
            <div>
              <div className="font-medium text-foreground">{domain?.seller?.name}</div>
              <div className="text-sm text-success flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Online</span>
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
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 lg:max-h-80">
          {messages?.map((message) => (
            <div
              key={message?.id}
              className={`flex ${message?.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-lg ${
                  message?.sender === 'buyer' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground'
                } ${message?.isNew ? 'ring-2 ring-primary/20' : ''}`}
              >
                <div className="text-sm">{message?.content}</div>
                {message?.attachments && (
                  <div className="mt-2 space-y-1">
                    {message?.attachments?.map((att) => (
                      <div key={att?.id} className="flex items-center space-x-2 text-xs opacity-80">
                        <Icon name="Paperclip" size={12} />
                        <span>{att?.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs opacity-70 mt-1">{formatTime(message?.timestamp)}</div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachments Preview */}
        {attachments?.length > 0 && (
          <div className="px-4 py-2 border-t border-border bg-muted/30">
            <div className="flex flex-wrap gap-2">
              {attachments?.map((att) => (
                <div key={att?.id} className="flex items-center space-x-2 bg-background rounded-md px-3 py-2 text-sm">
                  <Icon name="File" size={14} />
                  <span className="truncate max-w-32">{att?.name}</span>
                  <span className="text-muted-foreground">({formatFileSize(att?.size)})</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removeAttachment(att?.id)}
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef?.current?.click()}
                >
                  <Icon name="Paperclip" size={16} />
                </Button>
                <Button type="button" variant="ghost" size="sm">
                  <Icon name="Smile" size={16} />
                </Button>
              </div>
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e?.target?.value)}
                className="resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={!newMessage?.trim() && attachments?.length === 0}
              iconName="Send"
            >
              Send
            </Button>
          </form>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>
      </div>
    </div>
  );
};

export default MessagingPanel;