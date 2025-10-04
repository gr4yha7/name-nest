import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatUnits } from 'ethers';
import { formatDistance, parseISO } from 'date-fns';
import { formatEthereumAddress, shortenAddress } from 'utils/cn';
import { BadgeDollarSign, ListOrderedIcon, LucideAnchor, LucideCurrency, PersonStanding, RemoveFormattingIcon, Timer, TimerIcon } from 'lucide-react';
import { domaSubgraphService } from 'services/doma';
import { useNavigate } from 'react-router-dom';


const DomainPreviewModal = ({ domain, isOpen, onClose, onContact }) => {
  if (!isOpen || !domain) {
    return null;
  }
  const [domainOffers, setDomainOffers] = useState(null);
  const [fullDomainDetails, setFullDomainDetails] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (domain?.name) {
      domaSubgraphService.getDomainOffers({"tokenId":domain?.name}).then((offers) => setDomainOffers(offers))
      domaSubgraphService.getDomainDetails(domain?.name).then((details) => setFullDomainDetails(details))
    }
  }, [domain?.name])


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg w-full max-w-5xl max-h-[130vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Globe" size={20} color="white" />
            </div>
            <div>
              {fullDomainDetails ? (
                <>
                  <h2 className="text-xl font-bold text-foreground">{fullDomainDetails?.name}</h2>
                  <p className="text-muted-foreground">Domain Preview</p>
                </>
              ) : (
                <div className="animate-pulse">
                  <div className="h-5 w-40 bg-muted rounded mb-2" />
                  <div className="h-4 w-28 bg-muted rounded" />
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6">
          {fullDomainDetails?.name ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    
                  {fullDomainDetails?.tokens[0]?.listings?.length > 0 &&
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {formatUnits(fullDomainDetails?.tokens[0]?.listings[0]?.price, fullDomainDetails?.tokens[0]?.listings[0]?.currency?.decimals)} {fullDomainDetails?.tokens[0]?.listings[0]?.currency?.symbol}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        USD - ${Number(fullDomainDetails?.tokens[0]?.listings[0].currency.usdExchangeRate * formatUnits(fullDomainDetails?.tokens[0]?.listings[0]?.price, fullDomainDetails?.tokens[0]?.listings[0]?.currency?.decimals)).toFixed(2)}
                      </div>
                    </div>
                  }
                    <div>
                      <div className="text-xl font-bold text-foreground">{formatDistance(parseISO(fullDomainDetails?.expiresAt), new Date(), { addSuffix: true })}</div>
                      <div className="text-sm text-muted-foreground">Domain Expires</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{fullDomainDetails?.activeOffersCount}</div>
                      <div className="text-sm text-muted-foreground">Active Offers</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{fullDomainDetails?.name?.split('.').pop()}</div>
                      <div className="text-sm text-muted-foreground">TLD</div>
                    </div>
                  </div>
                </div>

                {/* Highest Offers */}
                {fullDomainDetails?.highestOffer !== null ? 
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Highest Offer</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-card border border-border rounded-lg p-4 text-center">
                        <BadgeDollarSign name="Users" size={16} className="text-primary mx-auto mb-2" />
                        <div className="text-md font-bold text-foreground">{formatUnits(fullDomainDetails?.highestOffer?.price, fullDomainDetails?.highestOffer?.currency?.decimals) ?? 0} {fullDomainDetails?.highestOffer.currency.symbol}</div>
                        <div className="text-sm text-muted-foreground">Price</div>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-4 text-center">
                        <PersonStanding name="Eye" size={16} className="text-success mx-auto mb-2" />
                        <div className="text-md font-bold text-foreground">{shortenAddress(formatEthereumAddress(fullDomainDetails?.highestOffer?.offererAddress))}</div>
                        <div className="text-sm text-muted-foreground">Offerer</div>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-4 text-center">
                        <LucideAnchor name="Search" size={16} className="text-warning mx-auto mb-2" />
                        <div className="text-md font-bold text-foreground">{formatDistance(parseISO(fullDomainDetails?.highestOffer?.createdAt), new Date(), { addSuffix: true })}</div>
                        <div className="text-sm text-muted-foreground">Created</div>
                      </div>
                      <div className="bg-card border border-border rounded-lg p-4 text-center">
                        <Timer name="Link" size={16} className="text-secondary mx-auto mb-2" />
                        <div className="text-md font-bold text-foreground">{formatDistance(parseISO(fullDomainDetails?.highestOffer?.expiresAt), new Date(), { addSuffix: true })}</div>
                        <div className="text-sm text-muted-foreground">Expires</div>
                      </div>
                    </div>
                  </div>
                  :
                  <div className="text-sm text-muted-foreground">No Offers Yet</div>
                }

                {/* Offers History */}
                {domainOffers?.length > 0 &&
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Offers History</h3>
                  <div className="space-y-3">
                    {domainOffers?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon name="Calendar" size={16} className="text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium text-foreground">{shortenAddress(formatEthereumAddress(item?.offererAddress))}</div>
                            <div className="text-xs text-muted-foreground">expires {formatDistance(parseISO(item?.expiresAt), new Date(), { addSuffix: true })}</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-foreground">
                        {formatUnits(item?.price, item?.currency.decimals) ?? 0} {item?.currency.symbol}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                }
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
                      <div className="font-medium text-foreground">{formatEthereumAddress(fullDomainDetails?.tokens[0]?.ownerAddress)}</div>
                      <div className="flex items-center space-x-1">
                        {renderStars(domain?.seller?.rating)}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({domain?.seller?.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {fullDomainDetails?.tokens[0]?.listings?.length > 0 &&
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Listing Details</h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <ListOrderedIcon name="Shield" size={16} className="text-success" />
                          <span className="text-sm text-foreground">Listed {formatDistance(parseISO(fullDomainDetails?.tokens[0]?.listings[0]?.createdAt), new Date(), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TimerIcon name="Shield" size={16} className="text-success" />
                          <span className="text-sm text-foreground">Listing Expires {formatDistance(parseISO(fullDomainDetails?.tokens[0]?.listings[0]?.expiresAt), new Date(), { addSuffix: true })}</span>
                        </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Zap" size={16} className="text-primary" />
                      <span className="text-sm text-foreground">Order Book {fullDomainDetails?.tokens[0]?.listings[0]?.orderbook}</span>
                      </div>
                    </div>
                  </div>
                }

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
                  <Button onClick={() => navigate(`/domain-detail-negotiation?token_id=${fullDomainDetails?.tokens[0]?.tokenId}&domain=${fullDomainDetails?.name}`)} variant="outline" className="w-full">
                    <Icon name="BadgeDollarSign" size={16} />
                    <span className="ml-2">Purchase Domain</span>
                  </Button>
                  <Button variant="outline" className="w-full hidden">
                    <Icon name="Share" size={16} />
                    <span className="ml-2">Share Domain</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
              {/* Main Content Skeleton */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[0,1,2,3].map((k) => (
                      <div key={k} className="space-y-2">
                        <div className="h-6 bg-muted-foreground/20 rounded w-24 mx-auto" />
                        <div className="h-3 bg-muted-foreground/10 rounded w-20 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="h-5 w-28 bg-muted rounded mb-4" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0,1,2,3].map((k) => (
                      <div key={k} className="bg-card border border-border rounded-lg p-4">
                        <div className="h-4 w-6 bg-muted rounded mb-3 mx-auto" />
                        <div className="h-4 w-24 bg-muted rounded mb-2 mx-auto" />
                        <div className="h-3 w-16 bg-muted rounded mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="h-5 w-32 bg-muted rounded mb-4" />
                  <div className="space-y-3">
                    {[0,1,2].map((k) => (
                      <div key={k} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-4 w-4 bg-muted-foreground/20 rounded" />
                          <div>
                            <div className="h-4 w-32 bg-muted-foreground/20 rounded mb-1" />
                            <div className="h-3 w-24 bg-muted-foreground/10 rounded" />
                          </div>
                        </div>
                        <div className="h-4 w-16 bg-muted-foreground/20 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Skeleton */}
              <div className="space-y-6">
                <div className="bg-muted rounded-lg p-4">
                  <div className="h-5 w-40 bg-muted rounded mb-4" />
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-muted-foreground/20 rounded" />
                      <div className="h-3 w-28 bg-muted-foreground/10 rounded" />
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="h-5 w-36 bg-muted rounded mb-4" />
                  <div className="space-y-3">
                    {[0,1,2].map((k) => (
                      <div key={k} className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-muted-foreground/20 rounded" />
                        <div className="h-4 w-40 bg-muted-foreground/20 rounded" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {[0,1,2].map((k) => (
                    <div key={k} className="h-10 bg-muted rounded" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainPreviewModal;