import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ReviewPublishStep = ({ onPrev, formData, setFormData }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const handleSaveDraft = () => {
    setIsDraft(true);
    setTimeout(() => {
      setIsDraft(false);
      // Mock save to localStorage
      localStorage.setItem('domainListingDraft', JSON.stringify(formData));
    }, 1000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
      // Clear draft from localStorage
      localStorage.removeItem('domainListingDraft');
    }, 2500);
  };

  const formatCurrency = (amount, currency = 'usd') => {
    if (currency === 'eth') return `Ξ${(amount / 2500)?.toFixed(2)}`;
    if (currency === 'btc') return `₿${(amount / 45000)?.toFixed(4)}`;
    return `$${amount?.toLocaleString()}`;
  };

  const getPricingTypeLabel = (type) => {
    const labels = {
      fixed: 'Fixed Price',
      auction: 'Auction',
      offer: 'Make Offer',
      lease: 'Lease to Own'
    };
    return labels?.[type] || type;
  };

  const getPaymentMethodLabels = (methods) => {
    const labels = {
      crypto: 'Cryptocurrency',
      wire: 'Wire Transfer',
      escrow: 'Escrow Service',
      paypal: 'PayPal'
    };
    return methods?.map(method => labels?.[method])?.join(', ') || 'None selected';
  };

  if (publishSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-success/10 border border-success rounded-lg p-8 mb-6">
          <Icon name="CheckCircle" size={64} className="text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Listing Published Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Your domain listing for <strong>{formData?.domain}</strong> is now live on the marketplace.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg border">
              <Icon name="Eye" size={24} className="text-primary mx-auto mb-2" />
              <p className="font-medium text-foreground">Listing ID</p>
              <p className="text-sm text-muted-foreground">#{Math.random()?.toString(36)?.substr(2, 9)?.toUpperCase()}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <Icon name="Clock" size={24} className="text-primary mx-auto mb-2" />
              <p className="font-medium text-foreground">Published</p>
              <p className="text-sm text-muted-foreground">{new Date()?.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="default"
              iconName="ExternalLink"
              iconPosition="left"
              onClick={() => window.location.href = '/domain-marketplace-browse'}
            >
              View in Marketplace
            </Button>
            <Button
              variant="outline"
              iconName="BarChart3"
              iconPosition="left"
              onClick={() => window.location.href = '/analytics-performance-dashboard'}
            >
              View Analytics
            </Button>
            <Button
              variant="ghost"
              iconName="Plus"
              iconPosition="left"
              onClick={() => window.location?.reload()}
            >
              Create Another
            </Button>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">What's Next?</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <Icon name="MessageSquare" size={16} className="text-primary mt-1" />
              <div>
                <p className="font-medium text-foreground">Monitor Messages</p>
                <p className="text-sm text-muted-foreground">Respond to buyer inquiries promptly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="TrendingUp" size={16} className="text-primary mt-1" />
              <div>
                <p className="font-medium text-foreground">Track Performance</p>
                <p className="text-sm text-muted-foreground">Monitor views, clicks, and engagement</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="Share" size={16} className="text-primary mt-1" />
              <div>
                <p className="font-medium text-foreground">Share Your Listing</p>
                <p className="text-sm text-muted-foreground">Promote on social media and networks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Review & Publish</h2>
        <p className="text-muted-foreground">
          Review your domain listing before publishing to the marketplace
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Listing Preview */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Eye" size={20} className="mr-2 text-primary" />
              Listing Preview
            </h3>

            <div className="space-y-4">
              {/* Domain Header */}
              <div className="text-center p-6 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
                <h1 className="text-2xl font-bold mb-2">{formData?.domain}</h1>
                <p className="opacity-90">Premium Domain for Sale</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {formData?.pricing?.price ? formatCurrency(parseInt(formData?.pricing?.price), formData?.pricing?.currency) : 'Price TBD'}
                  </span>
                  <p className="text-sm opacity-80 mt-1">{getPricingTypeLabel(formData?.pricing?.type)}</p>
                </div>
              </div>

              {/* Landing Page Components Preview */}
              {formData?.landingPageComponents?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Landing Page Components</h4>
                  {formData?.landingPageComponents?.slice(0, 3)?.map((component, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center">
                        <Icon name="Layout" size={16} className="text-primary mr-2" />
                        <span className="text-sm font-medium">{component?.name}</span>
                      </div>
                    </div>
                  ))}
                  {formData?.landingPageComponents?.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{formData?.landingPageComponents?.length - 3} more components
                    </p>
                  )}
                </div>
              )}

              {/* SEO Preview */}
              {formData?.seoData?.title && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">SEO Preview</h4>
                  <div className="bg-background p-3 rounded border">
                    <h5 className="text-blue-600 text-sm hover:underline cursor-pointer">
                      {formData?.seoData?.title}
                    </h5>
                    <p className="text-green-700 text-xs">
                      namenest.com/listing/{formData?.domain?.toLowerCase()?.replace(/\./g, '-')}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {formData?.seoData?.metaDescription || `Premium domain ${formData?.domain} for sale`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Smartphone" size={20} className="mr-2 text-primary" />
              Mobile Preview
            </h3>

            <div className="max-w-xs mx-auto">
              <div className="bg-background border-2 border-border rounded-2xl p-4 shadow-elevated">
                <div className="text-center space-y-3">
                  <h4 className="font-bold text-foreground">{formData?.domain}</h4>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-lg font-bold text-primary">
                      {formData?.pricing?.price ? formatCurrency(parseInt(formData?.pricing?.price), formData?.pricing?.currency) : 'Price TBD'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded"></div>
                    <div className="h-2 bg-muted rounded w-3/4 mx-auto"></div>
                  </div>
                  <Button size="sm" fullWidth>Contact Seller</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="FileText" size={20} className="mr-2 text-primary" />
              Configuration Summary
            </h3>

            <div className="space-y-4">
              {/* Domain Info */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Domain Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domain:</span>
                    <span className="text-foreground font-medium">{formData?.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verification:</span>
                    <span className={`${formData?.isVerified ? 'text-success' : 'text-error'}`}>
                      {formData?.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="text-foreground">{formData?.verificationMethod || 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Info */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Pricing</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground">{getPricingTypeLabel(formData?.pricing?.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="text-foreground font-medium">
                      {formData?.pricing?.price ? formatCurrency(parseInt(formData?.pricing?.price), formData?.pricing?.currency) : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Currency:</span>
                    <span className="text-foreground">{formData?.pricing?.currency?.toUpperCase() || 'USD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Negotiation:</span>
                    <span className="text-foreground">{formData?.pricing?.allowNegotiation ? 'Allowed' : 'Fixed'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Payment Methods</h4>
                <p className="text-sm text-muted-foreground">
                  {getPaymentMethodLabels(formData?.pricing?.paymentMethods)}
                </p>
              </div>

              {/* SEO Info */}
              {formData?.seoData && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">SEO Configuration</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span className={formData?.seoData?.title ? 'text-success' : 'text-error'}>
                        {formData?.seoData?.title ? 'Set' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Description:</span>
                      <span className={formData?.seoData?.metaDescription ? 'text-success' : 'text-warning'}>
                        {formData?.seoData?.metaDescription ? 'Set' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Keywords:</span>
                      <span className={formData?.seoData?.keywords ? 'text-success' : 'text-warning'}>
                        {formData?.seoData?.keywords ? 'Set' : 'Optional'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Landing Page */}
              <div>
                <h4 className="font-medium text-foreground mb-2">Landing Page</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Template:</span>
                    <span className="text-foreground">{formData?.landingPageTemplate || 'Default'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Components:</span>
                    <span className="text-foreground">{formData?.landingPageComponents?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="CheckSquare" size={20} className="mr-2 text-primary" />
              Pre-publish Checklist
            </h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={formData?.isVerified ? "CheckCircle" : "XCircle"} 
                  size={16} 
                  className={formData?.isVerified ? "text-success" : "text-error"} 
                />
                <span className="text-sm text-foreground">Domain ownership verified</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon 
                  name={formData?.pricing?.price ? "CheckCircle" : "XCircle"} 
                  size={16} 
                  className={formData?.pricing?.price ? "text-success" : "text-error"} 
                />
                <span className="text-sm text-foreground">Pricing configured</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon 
                  name={formData?.pricing?.paymentMethods?.length ? "CheckCircle" : "AlertCircle"} 
                  size={16} 
                  className={formData?.pricing?.paymentMethods?.length ? "text-success" : "text-warning"} 
                />
                <span className="text-sm text-foreground">Payment methods selected</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon 
                  name={formData?.landingPageComponents?.length ? "CheckCircle" : "AlertCircle"} 
                  size={16} 
                  className={formData?.landingPageComponents?.length ? "text-success" : "text-warning"} 
                />
                <span className="text-sm text-foreground">Landing page configured</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon 
                  name={formData?.seoData?.title ? "CheckCircle" : "AlertCircle"} 
                  size={16} 
                  className={formData?.seoData?.title ? "text-success" : "text-warning"} 
                />
                <span className="text-sm text-foreground">SEO optimization completed</span>
              </div>
            </div>
          </div>

          {/* Estimated Metrics */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
              Estimated Performance
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">85</p>
                <p className="text-sm text-muted-foreground">SEO Score</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">12K</p>
                <p className="text-sm text-muted-foreground">Est. Monthly Views</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">3.2%</p>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">7</p>
                <p className="text-sm text-muted-foreground">Days to Sell</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-border mt-8 space-y-4 sm:space-y-0">
        <Button
          variant="outline"
          onClick={onPrev}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Pricing
        </Button>

        <div className="flex space-x-3">
          <Button
            variant="ghost"
            onClick={handleSaveDraft}
            loading={isDraft}
            iconName="Save"
            iconPosition="left"
          >
            Save Draft
          </Button>
          <Button
            variant="default"
            onClick={handlePublish}
            loading={isPublishing}
            disabled={!formData?.isVerified || !formData?.pricing?.price}
            iconName="Send"
            iconPosition="left"
          >
            {isPublishing ? 'Publishing...' : 'Publish Listing'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPublishStep;