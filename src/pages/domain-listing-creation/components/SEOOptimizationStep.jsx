import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SEOOptimizationStep = ({ onNext, onPrev, formData, setFormData }) => {
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);

  const mockKeywordSuggestions = [
    { keyword: 'premium domain', volume: '12K', difficulty: 'Medium' },
    { keyword: 'brandable domain', volume: '8.5K', difficulty: 'Low' },
    { keyword: 'business domain', volume: '15K', difficulty: 'High' },
    { keyword: 'domain investment', volume: '6.2K', difficulty: 'Medium' },
    { keyword: 'memorable domain', volume: '4.8K', difficulty: 'Low' }
  ];

  const structuredDataTypes = [
    { value: 'product', label: 'Product', description: 'Mark domain as a product for sale' },
    { value: 'organization', label: 'Organization', description: 'Business or company information' },
    { value: 'website', label: 'Website', description: 'General website information' },
    { value: 'offer', label: 'Offer', description: 'Commercial offer details' }
  ];

  const handleMetaChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      seoData: {
        ...prev?.seoData,
        [field]: value
      }
    }));
  };

  const generateKeywords = () => {
    setIsGeneratingKeywords(true);
    setTimeout(() => {
      setKeywordSuggestions(mockKeywordSuggestions);
      setIsGeneratingKeywords(false);
    }, 1500);
  };

  const addKeyword = (keyword) => {
    const currentKeywords = formData?.seoData?.keywords || '';
    const newKeywords = currentKeywords 
      ? `${currentKeywords}, ${keyword}` 
      : keyword;
    handleMetaChange('keywords', newKeywords);
  };

  const handleStructuredDataToggle = (type) => {
    const current = formData?.seoData?.structuredData || [];
    const updated = current?.includes(type)
      ? current?.filter(t => t !== type)
      : [...current, type];
    handleMetaChange('structuredData', updated);
  };

  const generateMetaDescription = () => {
    const domain = formData?.domain || 'premium domain';
    const suggestion = `Acquire ${domain} - a premium, brandable domain perfect for your business. Professional, memorable, and SEO-friendly. Contact us for pricing and details.`;
    handleMetaChange('metaDescription', suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">SEO Optimization</h2>
        <p className="text-muted-foreground">
          Optimize your domain listing for search engines and better visibility
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Meta Tags Section */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Tag" size={20} className="mr-2 text-primary" />
              Meta Tags
            </h3>

            <div className="space-y-4">
              <Input
                label="Page Title"
                type="text"
                placeholder="Premium Domain for Sale - [Domain Name]"
                value={formData?.seoData?.title || ''}
                onChange={(e) => handleMetaChange('title', e?.target?.value)}
                description="Recommended: 50-60 characters"
                maxLength={60}
              />

              <div className="relative">
                <Input
                  label="Meta Description"
                  type="text"
                  placeholder="Describe your domain and its benefits..."
                  value={formData?.seoData?.metaDescription || ''}
                  onChange={(e) => handleMetaChange('metaDescription', e?.target?.value)}
                  description="Recommended: 150-160 characters"
                  maxLength={160}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateMetaDescription}
                  className="absolute right-2 top-8"
                  iconName="Wand2"
                />
              </div>

              <Input
                label="Keywords"
                type="text"
                placeholder="premium domain, brandable, business..."
                value={formData?.seoData?.keywords || ''}
                onChange={(e) => handleMetaChange('keywords', e?.target?.value)}
                description="Separate keywords with commas"
              />

              <Input
                label="Canonical URL"
                type="url"
                placeholder="https://domainhub.com/listing/[domain]"
                value={formData?.seoData?.canonicalUrl || ''}
                onChange={(e) => handleMetaChange('canonicalUrl', e?.target?.value)}
                description="Preferred URL for this page"
              />
            </div>
          </div>

          {/* Structured Data */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Code" size={20} className="mr-2 text-primary" />
              Structured Data
            </h3>

            <div className="space-y-3">
              {structuredDataTypes?.map((type) => (
                <div
                  key={type?.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-standard ${
                    formData?.seoData?.structuredData?.includes(type?.value)
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleStructuredDataToggle(type?.value)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{type?.label}</p>
                      <p className="text-sm text-muted-foreground">{type?.description}</p>
                    </div>
                    {formData?.seoData?.structuredData?.includes(type?.value) && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keywords & Analysis */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Icon name="Search" size={20} className="mr-2 text-primary" />
                Keyword Research
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={generateKeywords}
                loading={isGeneratingKeywords}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Generate
              </Button>
            </div>

            {keywordSuggestions?.length > 0 ? (
              <div className="space-y-2">
                {keywordSuggestions?.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-standard"
                  >
                    <div>
                      <p className="font-medium text-foreground">{suggestion?.keyword}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Volume: {suggestion?.volume}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          suggestion?.difficulty === 'Low' ? 'bg-success/20 text-success' :
                          suggestion?.difficulty === 'Medium'? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'
                        }`}>
                          {suggestion?.difficulty}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addKeyword(suggestion?.keyword)}
                      iconName="Plus"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Click generate to get keyword suggestions</p>
              </div>
            )}
          </div>

          {/* SEO Preview */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Eye" size={20} className="mr-2 text-primary" />
              Search Preview
            </h3>

            <div className="bg-background p-4 rounded-lg border">
              <div className="space-y-1">
                <h4 className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {formData?.seoData?.title || `${formData?.domain} - Premium Domain for Sale`}
                </h4>
                <p className="text-green-700 text-sm">
                  domainhub.com/listing/{formData?.domain?.toLowerCase()?.replace(/\./g, '-') || 'domain'}
                </p>
                <p className="text-muted-foreground text-sm">
                  {formData?.seoData?.metaDescription || 
                    `Acquire ${formData?.domain || 'this premium domain'} - perfect for your business. Professional, memorable, and SEO-friendly.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* SEO Score */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Target" size={20} className="mr-2 text-primary" />
              SEO Score
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Title Tag</span>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    formData?.seoData?.title ? 'bg-success' : 'bg-error'
                  }`}></div>
                  <span className="text-sm text-muted-foreground">
                    {formData?.seoData?.title ? 'Good' : 'Missing'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Meta Description</span>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    formData?.seoData?.metaDescription ? 'bg-success' : 'bg-warning'
                  }`}></div>
                  <span className="text-sm text-muted-foreground">
                    {formData?.seoData?.metaDescription ? 'Good' : 'Recommended'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Keywords</span>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    formData?.seoData?.keywords ? 'bg-success' : 'bg-warning'
                  }`}></div>
                  <span className="text-sm text-muted-foreground">
                    {formData?.seoData?.keywords ? 'Good' : 'Optional'}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
          Back to Landing Page
        </Button>
        <Button
          variant="default"
          onClick={onNext}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Pricing
        </Button>
      </div>
    </div>
  );
};

export default SEOOptimizationStep;