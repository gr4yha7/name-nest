import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const UnstoppableDomainsManager = ({ provider, signer, currentNetwork, onDomainUpdate }) => {
  const [activeSection, setActiveSection] = useState('content');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // IPFS Content Management
  const [websiteFiles, setWebsiteFiles] = useState([]);
  const [ipfsHash, setIpfsHash] = useState('');
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [websiteDescription, setWebsiteDescription] = useState('');
  
  // Address Mapping
  const [cryptoAddresses, setCryptoAddresses] = useState({
    ETH: '',
    BTC: '',
    MATIC: '',
    USDC: '',
    USDT: '',
    ADA: '',
    DOT: '',
    SOL: ''
  });
  
  // Website Configuration
  const [redirectUrl, setRedirectUrl] = useState('');
  const [customHTML, setCustomHTML] = useState('');

  const sectionOptions = [
    { id: 'content', label: 'IPFS Content', icon: 'FileText' },
    { id: 'addresses', label: 'Crypto Addresses', icon: 'Wallet' },
    { id: 'website', label: 'Website Hosting', icon: 'Globe' }
  ];

  const supportedCryptos = [
    { code: 'ETH', name: 'Ethereum', icon: 'Coins' },
    { code: 'BTC', name: 'Bitcoin', icon: 'Bitcoin' },
    { code: 'MATIC', name: 'Polygon', icon: 'Triangle' },
    { code: 'USDC', name: 'USD Coin', icon: 'DollarSign' },
    { code: 'USDT', name: 'Tether', icon: 'DollarSign' },
    { code: 'ADA', name: 'Cardano', icon: 'Heart' },
    { code: 'DOT', name: 'Polkadot', icon: 'Circle' },
    { code: 'SOL', name: 'Solana', icon: 'Sun' }
  ];

  const handleFileUpload = useCallback(async (event) => {
    const files = Array.from(event?.target?.files);
    if (!files?.length) return;

    setIsUploading(true);
    try {
      // Simulate IPFS upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockHash = `QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5${Date.now()}`;
      setIpfsHash(mockHash);
      setWebsiteFiles(files);
      
      console.log('Files uploaded to IPFS:', mockHash);
    } catch (error) {
      console.error('IPFS upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const updateContentHash = useCallback(async () => {
    if (!signer || !selectedDomain || !ipfsHash) return;

    try {
      console.log(`Updating content hash for ${selectedDomain?.name} to ${ipfsHash}`);
      
      // Simulate content hash update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedDomain = {
        ...selectedDomain,
        ipfsContent: ipfsHash,
        hasWebsite: true
      };
      
      onDomainUpdate?.(updatedDomain);
      
    } catch (error) {
      console.error('Content hash update failed:', error);
    }
  }, [signer, selectedDomain, ipfsHash, onDomainUpdate]);

  const updateCryptoAddresses = useCallback(async () => {
    if (!signer || !selectedDomain) return;

    try {
      console.log(`Updating crypto addresses for ${selectedDomain?.name}`);
      
      // Simulate address updates
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedDomain = {
        ...selectedDomain,
        addresses: { ...cryptoAddresses }
      };
      
      onDomainUpdate?.(updatedDomain);
      
    } catch (error) {
      console.error('Address update failed:', error);
    }
  }, [signer, selectedDomain, cryptoAddresses, onDomainUpdate]);

  const updateWebsiteConfig = useCallback(async () => {
    if (!signer || !selectedDomain) return;

    try {
      console.log(`Updating website configuration for ${selectedDomain?.name}`);
      
      // Simulate website config update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedDomain = {
        ...selectedDomain,
        redirectUrl,
        customHTML,
        websiteTitle,
        websiteDescription
      };
      
      onDomainUpdate?.(updatedDomain);
      
    } catch (error) {
      console.error('Website config update failed:', error);
    }
  }, [signer, selectedDomain, redirectUrl, customHTML, websiteTitle, websiteDescription, onDomainUpdate]);

  const renderContentSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">IPFS Content Management</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => setSelectedDomain({ 
                id: e?.target?.value, 
                name: e?.target?.options?.[e?.target?.selectedIndex]?.text 
              })}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              <option value="2">blockchain.crypto</option>
              <option value="3">defi.wallet</option>
            </select>
          </div>

          {selectedDomain && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website Title
                </label>
                <Input
                  type="text"
                  placeholder="My Awesome Website"
                  value={websiteTitle}
                  onChange={(e) => setWebsiteTitle(e?.target?.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website Description
                </label>
                <textarea
                  placeholder="Describe your website..."
                  value={websiteDescription}
                  onChange={(e) => setWebsiteDescription(e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Website Files
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".html,.css,.js,.png,.jpg,.jpeg,.gif,.svg"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {isUploading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Icon name="Loader2" size={20} className="animate-spin text-primary" />
                        <span className="text-foreground">Uploading to IPFS...</span>
                      </div>
                    ) : websiteFiles?.length > 0 ? (
                      <div>
                        <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
                        <p className="text-foreground font-medium">
                          {websiteFiles?.length} file(s) uploaded
                        </p>
                        <p className="text-sm text-muted-foreground">
                          IPFS Hash: {ipfsHash}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Icon name="Upload" size={24} className="text-muted-foreground mx-auto mb-2" />
                        <p className="text-foreground font-medium">
                          Drag & drop files or click to upload
                        </p>
                        <p className="text-sm text-muted-foreground">
                          HTML, CSS, JS, images supported
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {ipfsHash && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    IPFS Hash
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={ipfsHash}
                      onChange={(e) => setIpfsHash(e?.target?.value)}
                      className="flex-1 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator?.clipboard?.writeText(`ipfs://${ipfsHash}`)}
                    >
                      <Icon name="Copy" size={16} />
                    </Button>
                  </div>
                </div>
              )}

              <Button
                onClick={updateContentHash}
                disabled={!ipfsHash}
                className="w-full"
              >
                <Icon name="Save" size={16} />
                <span className="ml-2">Update Content Hash</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderAddressesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Cryptocurrency Address Mapping</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => setSelectedDomain({ 
                id: e?.target?.value, 
                name: e?.target?.options?.[e?.target?.selectedIndex]?.text 
              })}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              <option value="2">blockchain.crypto</option>
              <option value="3">defi.wallet</option>
            </select>
          </div>

          {selectedDomain && (
            <>
              <div>
                <h4 className="font-medium text-foreground mb-4">Configure Wallet Addresses</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportedCryptos?.map((crypto) => (
                    <div key={crypto?.code} className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-foreground">
                        <Icon name={crypto?.icon} size={16} />
                        <span>{crypto?.name} ({crypto?.code})</span>
                      </label>
                      <Input
                        type="text"
                        placeholder={`Enter ${crypto?.code} address`}
                        value={cryptoAddresses?.[crypto?.code]}
                        onChange={(e) => setCryptoAddresses(prev => ({ 
                          ...prev, 
                          [crypto?.code]: e?.target?.value 
                        }))}
                        className="font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={updateCryptoAddresses}
                disabled={!selectedDomain}
                className="w-full"
              >
                <Icon name="Save" size={16} />
                <span className="ml-2">Update Addresses</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderWebsiteSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Decentralized Website Hosting</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => setSelectedDomain({ 
                id: e?.target?.value, 
                name: e?.target?.options?.[e?.target?.selectedIndex]?.text 
              })}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              <option value="2">blockchain.crypto</option>
              <option value="3">defi.wallet</option>
            </select>
          </div>

          {selectedDomain && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Redirect URL (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://mywebsite.com"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e?.target?.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Redirect visitors to an existing website
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Custom HTML
                </label>
                <textarea
                  placeholder={`<!DOCTYPE html>
<html>
<head>
    <title>My Decentralized Website</title>
</head>
<body>
    <h1>Welcome to my blockchain domain!</h1>
    <p>This website is hosted on IPFS.</p>
</body>
</html>`}
                  value={customHTML}
                  onChange={(e) => setCustomHTML(e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                  rows={12}
                />
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h5 className="font-medium text-foreground mb-2">Preview</h5>
                <div className="bg-card border border-border rounded p-4 h-32 overflow-auto">
                  {customHTML ? (
                    <div dangerouslySetInnerHTML={{ __html: customHTML }} />
                  ) : (
                    <p className="text-muted-foreground text-sm">Enter HTML to see preview</p>
                  )}
                </div>
              </div>

              <Button
                onClick={updateWebsiteConfig}
                disabled={!selectedDomain}
                className="w-full"
              >
                <Icon name="Globe" size={16} />
                <span className="ml-2">Update Website</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'content':
        return renderContentSection();
      case 'addresses':
        return renderAddressesSection();
      case 'website':
        return renderWebsiteSection();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
        {sectionOptions?.map((section) => (
          <Button
            key={section?.id}
            variant={activeSection === section?.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection(section?.id)}
            className="flex items-center space-x-2"
          >
            <Icon name={section?.icon} size={16} />
            <span>{section?.label}</span>
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default UnstoppableDomainsManager;