import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PricingConfigurationStep = ({ onNext, onPrev, formData, setFormData }) => {
  const [showComparables, setShowComparables] = useState(false);
  const [isGeneratingValuation, setIsGeneratingValuation] = useState(false);

  const pricingTypes = [
    { value: 'fixed', label: 'Fixed Price', description: 'Set a specific price for immediate purchase' },
    { value: 'auction', label: 'Auction', description: 'Let buyers bid on your domain' },
    { value: 'offer', label: 'Make Offer', description: 'Accept offers and negotiate' },
    { value: 'lease', label: 'Lease to Own', description: 'Monthly payments with ownership transfer' }
  ];

  const currencies = [
    { value: 'usd', label: 'USD ($)', description: 'US Dollar' },
    { value: 'eth', label: 'ETH (Ξ)', description: 'Ethereum' },
    { value: 'btc', label: 'BTC (₿)', description: 'Bitcoin' },
    { value: 'eur', label: 'EUR (€)', description: 'Euro' }
  ];

  const paymentMethods = [
    { id: 'crypto', label: 'Cryptocurrency', description: 'ETH, BTC, USDC and other tokens' },
    { id: 'wire', label: 'Wire Transfer', description: 'Bank wire transfer' },
    { id: 'escrow', label: 'Escrow Service', description: 'Third-party escrow protection' },
    { id: 'paypal', label: 'PayPal', description: 'PayPal payments (fees apply)' }
  ];

  const mockComparables = [
    { domain: 'techstartup.com', price: '$45,000', sold: '2024-01-15', similarity: 85 },
    { domain: 'businesshub.net', price: '$32,000', sold: '2024-02-03', similarity: 78 },
    { domain: 'innovatetech.org', price: '$28,500', sold: '2024-01-28', similarity: 72 },
    { domain: 'digitalsolutions.co', price: '$38,000', sold: '2024-02-10', similarity: 69 }
  ];

  const handlePricingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev?.pricing,
        [field]: value
      }
    }));
  };

  const handlePaymentMethodToggle = (methodId) => {
    const current = formData?.pricing?.paymentMethods || [];
    const updated = current?.includes(methodId)
      ? current?.filter(m => m !== methodId)
      : [...current, methodId];
    handlePricingChange('paymentMethods', updated);
  };

  const generateValuation = () => {
    setIsGeneratingValuation(true);
    setTimeout(() => {
      const estimatedValue = Math.floor(Math.random() * 50000) + 15000;
      handlePricingChange('estimatedValue', estimatedValue);
      handlePricingChange('suggestedPrice', Math.floor(estimatedValue * 1.2));
      setIsGeneratingValuation(false);
    }, 2000);
  };

  const formatCurrency = (amount, currency = 'usd') => {
    if (currency === 'eth') return `Ξ${(amount / 2500)?.toFixed(2)}`;
    if (currency === 'btc') return `₿${(amount / 45000)?.toFixed(4)}`;
    return `$${amount?.toLocaleString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Pricing Configuration</h2>
        <p className="text-muted-foreground">
          Set your pricing strategy and payment preferences
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pricing Strategy */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="DollarSign" size={20} className="mr-2 text-primary" />
              Pricing Strategy
            </h3>

            <div className="space-y-4">
              <Select
                label="Pricing Type"
                placeholder="Choose pricing method"
                options={pricingTypes}
                value={formData?.pricing?.type || ''}
                onChange={(value) => handlePricingChange('type', value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Currency"
                  placeholder="Select currency"
                  options={currencies}
                  value={formData?.pricing?.currency || 'usd'}
                  onChange={(value) => handlePricingChange('currency', value)}
                />

                <Input
                  label={formData?.pricing?.type === 'auction' ? 'Starting Bid' : 'Price'}
                  type="number"
                  placeholder="0"
                  value={formData?.pricing?.price || ''}
                  onChange={(e) => handlePricingChange('price', e?.target?.value)}
                  required
                />
              </div>

              {formData?.pricing?.type === 'auction' && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Reserve Price"
                    type="number"
                    placeholder="Minimum acceptable price"
                    value={formData?.pricing?.reservePrice || ''}
                    onChange={(e) => handlePricingChange('reservePrice', e?.target?.value)}
                  />
                  <Input
                    label="Auction Duration (days)"
                    type="number"
                    placeholder="7"
                    value={formData?.pricing?.auctionDuration || ''}
                    onChange={(e) => handlePricingChange('auctionDuration', e?.target?.value)}
                  />
                </div>
              )}

              {formData?.pricing?.type === 'lease' && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Monthly Payment"
                    type="number"
                    placeholder="Monthly lease amount"
                    value={formData?.pricing?.monthlyPayment || ''}
                    onChange={(e) => handlePricingChange('monthlyPayment', e?.target?.value)}
                  />
                  <Input
                    label="Lease Duration (months)"
                    type="number"
                    placeholder="12"
                    value={formData?.pricing?.leaseDuration || ''}
                    onChange={(e) => handlePricingChange('leaseDuration', e?.target?.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="CreditCard" size={20} className="mr-2 text-primary" />
              Payment Methods
            </h3>

            <div className="space-y-3">
              {paymentMethods?.map((method) => (
                <div key={method?.id} className="flex items-start space-x-3">
                  <Checkbox
                    checked={formData?.pricing?.paymentMethods?.includes(method?.id) || false}
                    onChange={() => handlePaymentMethodToggle(method?.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{method?.label}</p>
                    <p className="text-sm text-muted-foreground">{method?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Settings" size={20} className="mr-2 text-primary" />
              Advanced Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={formData?.pricing?.allowNegotiation || false}
                  onChange={(e) => handlePricingChange('allowNegotiation', e?.target?.checked)}
                />
                <div>
                  <p className="font-medium text-foreground">Allow Negotiation</p>
                  <p className="text-sm text-muted-foreground">Let buyers make counteroffers</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={formData?.pricing?.requireEscrow || false}
                  onChange={(e) => handlePricingChange('requireEscrow', e?.target?.checked)}
                />
                <div>
                  <p className="font-medium text-foreground">Require Escrow</p>
                  <p className="text-sm text-muted-foreground">Mandatory escrow for transactions</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={formData?.pricing?.autoAcceptOffers || false}
                  onChange={(e) => handlePricingChange('autoAcceptOffers', e?.target?.checked)}
                />
                <div>
                  <p className="font-medium text-foreground">Auto-accept at asking price</p>
                  <p className="text-sm text-muted-foreground">Automatically accept full price offers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Valuation & Analysis */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
                Domain Valuation
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={generateValuation}
                loading={isGeneratingValuation}
                iconName="Calculator"
                iconPosition="left"
              >
                Generate
              </Button>
            </div>

            {formData?.pricing?.estimatedValue ? (
              <div className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Value</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(formData?.pricing?.estimatedValue, formData?.pricing?.currency)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Suggested Price</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(formData?.pricing?.suggestedPrice, formData?.pricing?.currency)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Market Range</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(formData?.pricing?.estimatedValue * 0.8, formData?.pricing?.currency)} - {formatCurrency(formData?.pricing?.estimatedValue * 1.4, formData?.pricing?.currency)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Domain Length</span>
                    <span className="text-success">Excellent</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Brandability</span>
                    <span className="text-success">High</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SEO Potential</span>
                    <span className="text-warning">Medium</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Market Demand</span>
                    <span className="text-success">Strong</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="Calculator" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Click generate to get domain valuation</p>
              </div>
            )}
          </div>

          {/* Comparable Sales */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
                Comparable Sales
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComparables(!showComparables)}
                iconName={showComparables ? "ChevronUp" : "ChevronDown"}
              />
            </div>

            {showComparables && (
              <div className="space-y-3">
                {mockComparables?.map((comp, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{comp?.domain}</p>
                      <p className="text-sm text-muted-foreground">Sold {comp?.sold}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{comp?.price}</p>
                      <p className="text-xs text-muted-foreground">{comp?.similarity}% similar</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Summary */}
          {formData?.pricing?.price && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Receipt" size={20} className="mr-2 text-primary" />
                Price Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listing Price</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(parseInt(formData?.pricing?.price), formData?.pricing?.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (3%)</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(parseInt(formData?.pricing?.price) * 0.03, formData?.pricing?.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transfer Fee</span>
                  <span className="text-muted-foreground">$50</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">You'll Receive</span>
                  <span className="font-bold text-success">
                    {formatCurrency(parseInt(formData?.pricing?.price) * 0.97 - 50, formData?.pricing?.currency)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-border mt-8">
        <Button
          variant="outline"
          onClick={onPrev}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to SEO Setup
        </Button>
        <Button
          variant="default"
          onClick={onNext}
          disabled={!formData?.pricing?.type || !formData?.pricing?.price}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};

export default PricingConfigurationStep;