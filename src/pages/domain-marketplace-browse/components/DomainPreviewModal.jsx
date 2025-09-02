import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const DomainPreviewModal = ({ domain, isOpen, onClose, onContact }) => {
  if (!isOpen || !domain) return null;

  const formatPrice = (price) => {
    return `$${price?.toLocaleString()}`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={14}
        className={i < Math.floor(rating) ? "text-warning fill-current" : "text-muted-foreground"}
      />
    ));
  };

  const mockMetrics = {
    monthlyVisitors: '12.5K',
    pageViews: '45.2K',
    bounceRate: '32%',
    avgSessionDuration: '2:45',
    organicKeywords: 156,
    backlinks: 89,
    domainAuthority: 42,
    pageAuthority: 38
  };

  const mockHistory = [
    { date: '2024-01-15', event: 'Listed for sale', price: domain?.price },
    { date: '2023-12-10', event: 'Price reduced', price: domain?.price + 5000 },
    { date: '2023-11-01', event: 'Initial listing', price: domain?.price + 10000 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Globe" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{domain?.name}</h2>
              <p className="text-muted-foreground">Domain Preview</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-muted rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatPrice(domain?.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">Price</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{domain?.age}y</div>
                    <div className="text-sm text-muted-foreground">Age</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{domain?.length}</div>
                    <div className="text-sm text-muted-foreground">Length</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{domain?.tld}</div>
                    <div className="text-sm text-muted-foreground">TLD</div>
                  </div>
                </div>
              </div>

              {/* Traffic & SEO Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Traffic & SEO</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <Icon name="Users" size={24} className="text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{mockMetrics?.monthlyVisitors}</div>
                    <div className="text-sm text-muted-foreground">Monthly Visitors</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <Icon name="Eye" size={24} className="text-success mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{mockMetrics?.pageViews}</div>
                    <div className="text-sm text-muted-foreground">Page Views</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <Icon name="Search" size={24} className="text-warning mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{mockMetrics?.organicKeywords}</div>
                    <div className="text-sm text-muted-foreground">Keywords</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <Icon name="Link" size={24} className="text-secondary mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{mockMetrics?.backlinks}</div>
                    <div className="text-sm text-muted-foreground">Backlinks</div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              {domain?.categories && domain?.categories?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {domain?.categories?.map((category, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price History */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Price History</h3>
                <div className="space-y-3">
                  {mockHistory?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="Calendar" size={16} className="text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium text-foreground">{item?.event}</div>
                          <div className="text-xs text-muted-foreground">{item?.date}</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {formatPrice(item?.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Seller Info */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Seller Information</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} color="white" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{domain?.seller?.name}</div>
                    <div className="flex items-center space-x-1">
                      {renderStars(domain?.seller?.rating)}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({domain?.seller?.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Member since:</span>
                    <span className="text-foreground">2019</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Domains sold:</span>
                    <span className="text-foreground">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Response time:</span>
                    <span className="text-foreground">&lt; 2 hours</span>
                  </div>
                </div>

                {domain?.seller?.isVerified && (
                  <div className="flex items-center space-x-2 mt-3 p-2 bg-success/10 rounded">
                    <Icon name="BadgeCheck" size={16} className="text-success" />
                    <span className="text-sm text-success font-medium">Verified Seller</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Features</h3>
                <div className="space-y-3">
                  {domain?.hasEscrow && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Shield" size={16} className="text-success" />
                      <span className="text-sm text-foreground">Escrow Protection</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Icon name="Zap" size={16} className="text-primary" />
                    <span className="text-sm text-foreground">Fast Transfer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="FileText" size={16} className="text-warning" />
                    <span className="text-sm text-foreground">Documentation Included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Headphones" size={16} className="text-secondary" />
                    <span className="text-sm text-foreground">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => onContact(domain)}
                  className="w-full"
                  disabled={domain?.status === 'sold'}
                >
                  <Icon name="MessageSquare" size={16} />
                  <span className="ml-2">Contact Seller</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <Icon name="Heart" size={16} />
                  <span className="ml-2">Add to Watchlist</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <Icon name="Share" size={16} />
                  <span className="ml-2">Share Domain</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainPreviewModal;