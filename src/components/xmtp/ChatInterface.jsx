import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useXMTP } from '../../hooks/useXMTP';
import { toast } from 'sonner';

// UI Components
import Button from '../ui/Button';
import Input from '../ui/Input';

const ChatInterface = ({ domainContext = null, onOfferSent = null }) => {
  const { address } = useAccount();
  const {
    isConnected: isXMTPConnected,
    conversations,
    messages,
    sendMessage: xmtpSendMessage,
    sendOffer: xmtpSendOffer,
    loadConversationHistory,
  } = useXMTP();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [offerData, setOfferData] = useState({
    price: '',
    currency: 'ETH',
    expiresIn: '7'
  });
  const messagesEndRef = useRef(null);

  // Load messages for selected conversation
  const loadMessages = useCallback(async (conversation) => {
    if (!conversation) return;

    try {
      await loadConversationHistory(conversation.peerAddress);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    }
  }, [loadConversationHistory]);

  // Send message
  const sendMessage = useCallback(async (message = null) => {
    const messageToSend = message || newMessage;
    if (!selectedConversation || !messageToSend.trim() || isSending) return;

    setIsSending(true);
    try {
      await xmtpSendMessage(
        selectedConversation.peerAddress,
        messageToSend.trim(),
        domainContext
      );
      if (!message) setNewMessage('');
      // Reload messages to show the new one
      await loadMessages(selectedConversation);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  }, [selectedConversation, newMessage, isSending, xmtpSendMessage, loadMessages, domainContext]);

  // Send offer
  const sendOffer = useCallback(async () => {
    if (!selectedConversation || !offerData.price) return;

    try {
      await xmtpSendOffer(
        selectedConversation.peerAddress,
        {
          price: offerData.price,
          currency: offerData.currency,
          expiresAt: new Date(Date.now() + parseInt(offerData.expiresIn) * 24 * 60 * 60 * 1000)
        },
        domainContext
      );
      
      // Send a text message about the offer
      await sendMessage(`I've sent you an offer for ${domainContext?.name || 'this domain'}: ${offerData.price} ${offerData.currency}`);
      
      setShowOfferDialog(false);
      setOfferData({ price: '', currency: 'ETH', expiresIn: '7' });
      toast.success('Offer sent successfully!');
      
      if (onOfferSent) {
        onOfferSent(offerData);
      }
    } catch (error) {
      console.error('Failed to send offer:', error);
      toast.error('Failed to send offer');
    }
  }, [selectedConversation, offerData, domainContext, sendMessage, onOfferSent, xmtpSendOffer]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // No need to load conversations or start listener - handled by the hook

  // Group messages by date
  const groupedMessages = useMemo(() => {
    return messages.reduce((acc, msg) => {
      const dateKey = new Date(msg.sentAt).toISOString().split('T')[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(msg);
      return acc;
    }, {});
  }, [messages]);

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Conversations</h2>
          {domainContext && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Domain:</strong> {domainContext.name}
              </p>
              <p className="text-xs text-blue-600">
                {domainContext.network}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p>No conversations yet</p>
              <p className="text-sm">Start a conversation to see it here</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    loadMessages(conversation);
                  }}
                  className={`w-full text-left p-4 hover:bg-gray-100 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {conversation.peerAddress?.slice(0, 6)}...{conversation.peerAddress?.slice(-4)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {conversation.peerAddress}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation.peerAddress?.slice(0, 6)}...{selectedConversation.peerAddress?.slice(-4)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.peerAddress}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {domainContext && (
                    <Button
                      onClick={() => setShowOfferDialog(true)}
                      variant="outline"
                      size="sm"
                    >
                      Send Offer
                    </Button>
                  )}
                  <Button
                    onClick={() => setSelectedConversation(null)}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date} className="space-y-2">
                  <div className="text-center text-sm text-gray-500">
                    {new Date(date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  {msgs.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderAddress === address ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderAddress === address
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.sentAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={isSending}
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!newMessage.trim() || isSending}
                  className="px-6"
                >
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Offer Dialog */}
      {showOfferDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Offer</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <Input
                  type="number"
                  value={offerData.price}
                  onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={offerData.currency}
                  onChange={(e) => setOfferData({ ...offerData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ETH">ETH</option>
                  <option value="USDC">USDC</option>
                  <option value="WETH">WETH</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires In (Days)
                </label>
                <select
                  value={offerData.expiresIn}
                  onChange={(e) => setOfferData({ ...offerData, expiresIn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">7 Days</option>
                  <option value="15">15 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-6">
              <Button
                onClick={() => setShowOfferDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={sendOffer}
                disabled={!offerData.price}
                className="flex-1"
              >
                Send Offer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
