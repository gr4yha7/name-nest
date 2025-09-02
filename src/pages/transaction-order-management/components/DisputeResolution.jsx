import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const DisputeResolution = ({ dispute, onClose, onSubmitResponse }) => {
  const [response, setResponse] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!response?.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitResponse({
        disputeId: dispute?.id,
        response: response?.trim(),
        attachments
      });
      setResponse('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to submit response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-warning text-warning-foreground',
      'in_review': 'bg-primary text-primary-foreground',
      'resolved': 'bg-success text-success-foreground',
      'escalated': 'bg-error text-error-foreground'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Dispute Resolution
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Case #{dispute?.id} - {dispute?.domain}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">
          {/* Dispute Details */}
          <div className="lg:w-1/3 p-6 border-r border-border bg-muted/30">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Dispute Status</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute?.status)}`}>
                  <Icon name="AlertTriangle" size={12} className="mr-1" />
                  {dispute?.status?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                </span>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domain:</span>
                    <span className="font-medium">{dispute?.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">{dispute?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buyer:</span>
                    <span>{dispute?.buyer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seller:</span>
                    <span>{dispute?.seller}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(dispute?.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Update:</span>
                    <span>{formatDate(dispute?.updatedAt)}</span>
                  </div>
                  {dispute?.mediator && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mediator:</span>
                      <span>{dispute?.mediator}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Dispute Reason</h3>
                <p className="text-sm text-muted-foreground bg-background p-3 rounded border">
                  {dispute?.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Communication Thread */}
          <div className="lg:w-2/3 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="font-medium text-foreground mb-4">Communication Thread</h3>
              
              <div className="space-y-4">
                {dispute?.messages?.map((message, index) => (
                  <div key={index} className={`flex ${message?.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-4 ${
                      message?.sender === 'You' ?'bg-primary text-primary-foreground' 
                        : message?.sender === 'Mediator' ?'bg-accent text-accent-foreground' :'bg-muted text-foreground'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{message?.sender}</span>
                        <span className="text-xs opacity-75">
                          {formatDate(message?.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{message?.content}</p>
                      
                      {message?.attachments && message?.attachments?.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-current/20">
                          <div className="flex flex-wrap gap-2">
                            {message?.attachments?.map((attachment, idx) => (
                              <div key={idx} className="flex items-center space-x-1 text-xs">
                                <Icon name="Paperclip" size={12} />
                                <span>{attachment?.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Form */}
            <div className="p-6 border-t border-border bg-muted/30">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Response"
                  type="text"
                  placeholder="Type your message..."
                  value={response}
                  onChange={(e) => setResponse(e?.target?.value)}
                  required
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                    >
                      <Icon name="Paperclip" size={14} />
                      <span className="ml-2">Attach File</span>
                    </Button>
                    
                    {attachments?.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {attachments?.length} file{attachments?.length !== 1 ? 's' : ''} attached
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!response?.trim() || isSubmitting}
                      loading={isSubmitting}
                    >
                      <Icon name="Send" size={14} />
                      <span className="ml-2">Send Response</span>
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeResolution;