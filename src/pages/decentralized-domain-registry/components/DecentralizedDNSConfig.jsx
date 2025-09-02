import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DecentralizedDNSConfig = ({ domains, provider, currentNetwork }) => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [activeSection, setActiveSection] = useState('resolver');
  
  // Resolver Configuration
  const [customResolver, setCustomResolver] = useState('');
  const [resolverType, setResolverType] = useState('default');
  
  // IPFS Gateway
  const [selectedGateway, setSelectedGateway] = useState('ipfs.io');
  const [customGateway, setCustomGateway] = useState('');
  
  // Distributed Hosting
  const [hostingProvider, setHostingProvider] = useState('ipfs');
  const [hostingConfig, setHostingConfig] = useState({
    ipfs: { pin: true, redundancy: 3 },
    arweave: { permanent: true },
    filecoin: { duration: '1y', replication: 2 }
  });

  const sectionOptions = [
    { id: 'resolver', label: 'Custom Resolver', icon: 'Settings' },
    { id: 'gateway', label: 'IPFS Gateway', icon: 'Globe' },
    { id: 'hosting', label: 'Distributed Hosting', icon: 'Server' }
  ];

  const resolverOptions = [
    { value: 'default', label: 'Default Public Resolver', description: 'Standard ENS public resolver' },
    { value: 'custom', label: 'Custom Resolver', description: 'Your own resolver contract' },
    { value: 'cloudflare', label: 'Cloudflare DNS-over-HTTPS', description: 'Enterprise-grade DNS' },
    { value: 'quad9', label: 'Quad9 Secure DNS', description: 'Privacy-focused DNS' }
  ];

  const gatewayOptions = [
    { value: 'ipfs.io', label: 'IPFS.io', url: 'https://ipfs.io/ipfs/', status: 'online' },
    { value: 'cloudflare', label: 'Cloudflare IPFS', url: 'https://cloudflare-ipfs.com/ipfs/', status: 'online' },
    { value: 'pinata', label: 'Pinata', url: 'https://gateway.pinata.cloud/ipfs/', status: 'online' },
    { value: 'infura', label: 'Infura', url: 'https://ipfs.infura.io/ipfs/', status: 'online' },
    { value: 'dweb', label: 'DWeb.link', url: 'https://dweb.link/ipfs/', status: 'online' },
    { value: 'custom', label: 'Custom Gateway', url: '', status: 'unknown' }
  ];

  const hostingProviders = [
    {
      id: 'ipfs',
      name: 'IPFS',
      icon: 'FileText',
      description: 'InterPlanetary File System - Distributed storage',
      features: ['Content addressing', 'Deduplication', 'Peer-to-peer'],
      pricing: 'Free + Pinning services'
    },
    {
      id: 'arweave',
      name: 'Arweave',
      icon: 'Archive',
      description: 'Permanent storage on the permaweb',
      features: ['Permanent storage', 'One-time payment', 'Immutable'],
      pricing: '~$5 per MB (one-time)'
    },
    {
      id: 'filecoin',
      name: 'Filecoin',
      icon: 'HardDrive',
      description: 'Decentralized storage marketplace',
      features: ['Storage deals', 'Redundancy', 'Retrieval market'],
      pricing: 'Market-based pricing'
    }
  ];

  const updateResolver = useCallback(async () => {
    if (!selectedDomain) return;

    console.log(`Updating resolver for ${selectedDomain?.name}`, {
      type: resolverType,
      resolver: customResolver
    });

    // Simulate resolver update
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, [selectedDomain, resolverType, customResolver]);

  const updateGateway = useCallback(async () => {
    if (!selectedDomain) return;

    const gateway = selectedGateway === 'custom' ? customGateway : selectedGateway;
    console.log(`Updating IPFS gateway for ${selectedDomain?.name} to ${gateway}`);

    // Simulate gateway update
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, [selectedDomain, selectedGateway, customGateway]);

  const configureHosting = useCallback(async () => {
    if (!selectedDomain) return;

    console.log(`Configuring distributed hosting for ${selectedDomain?.name}`, {
      provider: hostingProvider,
      config: hostingConfig?.[hostingProvider]
    });

    // Simulate hosting configuration
    await new Promise(resolve => setTimeout(resolve, 1500));
  }, [selectedDomain, hostingProvider, hostingConfig]);

  const renderResolverSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Custom Resolver Setup</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => {
                const domain = domains?.find(d => d?.id === parseInt(e?.target?.value));
                setSelectedDomain(domain);
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              {domains?.map((domain) => (
                <option key={domain?.id} value={domain?.id}>
                  {domain?.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDomain && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Resolver Type
                </label>
                <div className="space-y-3">
                  {resolverOptions?.map((option) => (
                    <div
                      key={option?.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-standard ${
                        resolverType === option?.value
                          ? 'border-primary bg-primary/5' :'border-border bg-card hover:bg-muted/50'
                      }`}
                      onClick={() => setResolverType(option?.value)}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <input
                          type="radio"
                          checked={resolverType === option?.value}
                          onChange={() => setResolverType(option?.value)}
                          className="w-4 h-4 text-primary border-border"
                        />
                        <span className="font-medium text-foreground">{option?.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {option?.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {resolverType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Custom Resolver Address
                  </label>
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={customResolver}
                    onChange={(e) => setCustomResolver(e?.target?.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the smart contract address of your custom resolver
                  </p>
                </div>
              )}

              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-info mt-0.5" />
                  <div>
                    <h4 className="font-medium text-info mb-1">Custom Resolver Benefits</h4>
                    <ul className="text-sm text-info/80 space-y-1">
                      <li>• Full control over domain resolution</li>
                      <li>• Custom logic and features</li>
                      <li>• Enhanced privacy and security</li>
                      <li>• Support for advanced record types</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button onClick={updateResolver} className="w-full">
                <Icon name="Save" size={16} />
                <span className="ml-2">Update Resolver</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderGatewaySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">IPFS Gateway Selection</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => {
                const domain = domains?.find(d => d?.id === parseInt(e?.target?.value));
                setSelectedDomain(domain);
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              {domains?.filter(d => d?.ipfsContent)?.map((domain) => (
                <option key={domain?.id} value={domain?.id}>
                  {domain?.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDomain && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  IPFS Gateway
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gatewayOptions?.map((gateway) => (
                    <div
                      key={gateway?.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-standard ${
                        selectedGateway === gateway?.value
                          ? 'border-primary bg-primary/5' :'border-border bg-card hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedGateway(gateway?.value)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={selectedGateway === gateway?.value}
                            onChange={() => setSelectedGateway(gateway?.value)}
                            className="w-4 h-4 text-primary border-border"
                          />
                          <span className="font-medium text-foreground">{gateway?.label}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          gateway?.status === 'online' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                        }`}>
                          {gateway?.status}
                        </span>
                      </div>
                      {gateway?.url && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {gateway?.url}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedGateway === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Custom Gateway URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://your-gateway.com/ipfs/"
                    value={customGateway}
                    onChange={(e) => setCustomGateway(e?.target?.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must end with '/ipfs/' for proper content resolution
                  </p>
                </div>
              )}

              {selectedDomain?.ipfsContent && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Preview</h4>
                  <p className="text-sm text-muted-foreground">Current IPFS content:</p>
                  <p className="font-mono text-xs text-foreground break-all">
                    {selectedDomain?.ipfsContent}
                  </p>
                  <div className="mt-2">
                    <a
                      href={`${gatewayOptions?.find(g => g?.value === selectedGateway)?.url || customGateway}${selectedDomain?.ipfsContent?.replace('ipfs://', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      View via selected gateway →
                    </a>
                  </div>
                </div>
              )}

              <Button onClick={updateGateway} className="w-full">
                <Icon name="Globe" size={16} />
                <span className="ml-2">Update Gateway</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderHostingSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Distributed Hosting Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => {
                const domain = domains?.find(d => d?.id === parseInt(e?.target?.value));
                setSelectedDomain(domain);
              }}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              {domains?.map((domain) => (
                <option key={domain?.id} value={domain?.id}>
                  {domain?.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDomain && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Storage Provider
                </label>
                <div className="space-y-3">
                  {hostingProviders?.map((provider) => (
                    <div
                      key={provider?.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-standard ${
                        hostingProvider === provider?.id
                          ? 'border-primary bg-primary/5' :'border-border bg-card hover:bg-muted/50'
                      }`}
                      onClick={() => setHostingProvider(provider?.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          checked={hostingProvider === provider?.id}
                          onChange={() => setHostingProvider(provider?.id)}
                          className="w-4 h-4 text-primary border-border mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Icon name={provider?.icon} size={16} className="text-primary" />
                            <span className="font-medium text-foreground">{provider?.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {provider?.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {provider?.features?.map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <strong>Pricing:</strong> {provider?.pricing}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provider-specific configuration */}
              {hostingProvider === 'ipfs' && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">IPFS Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ipfs-pin"
                        checked={hostingConfig?.ipfs?.pin}
                        onChange={(e) => setHostingConfig(prev => ({
                          ...prev,
                          ipfs: { ...prev?.ipfs, pin: e?.target?.checked }
                        }))}
                        className="w-4 h-4 text-primary border-border rounded"
                      />
                      <label htmlFor="ipfs-pin" className="text-sm text-foreground">
                        Pin content for persistence
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Redundancy Level
                      </label>
                      <select
                        value={hostingConfig?.ipfs?.redundancy}
                        onChange={(e) => setHostingConfig(prev => ({
                          ...prev,
                          ipfs: { ...prev?.ipfs, redundancy: parseInt(e?.target?.value) }
                        }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value={1}>1 copy (Basic)</option>
                        <option value={3}>3 copies (Recommended)</option>
                        <option value={5}>5 copies (High availability)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {hostingProvider === 'arweave' && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Arweave Configuration</h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="arweave-permanent"
                      checked={hostingConfig?.arweave?.permanent}
                      onChange={(e) => setHostingConfig(prev => ({
                        ...prev,
                        arweave: { permanent: e?.target?.checked }
                      }))}
                      className="w-4 h-4 text-primary border-border rounded"
                    />
                    <label htmlFor="arweave-permanent" className="text-sm text-foreground">
                      Permanent storage (recommended)
                    </label>
                  </div>
                </div>
              )}

              {hostingProvider === 'filecoin' && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Filecoin Configuration</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Storage Duration
                      </label>
                      <select
                        value={hostingConfig?.filecoin?.duration}
                        onChange={(e) => setHostingConfig(prev => ({
                          ...prev,
                          filecoin: { ...prev?.filecoin, duration: e?.target?.value }
                        }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="6m">6 months</option>
                        <option value="1y">1 year</option>
                        <option value="2y">2 years</option>
                        <option value="5y">5 years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Replication Factor
                      </label>
                      <select
                        value={hostingConfig?.filecoin?.replication}
                        onChange={(e) => setHostingConfig(prev => ({
                          ...prev,
                          filecoin: { ...prev?.filecoin, replication: parseInt(e?.target?.value) }
                        }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value={1}>1 copy</option>
                        <option value={2}>2 copies</option>
                        <option value={3}>3 copies</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={configureHosting} className="w-full">
                <Icon name="Save" size={16} />
                <span className="ml-2">Configure Hosting</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'resolver':
        return renderResolverSection();
      case 'gateway':
        return renderGatewaySection();
      case 'hosting':
        return renderHostingSection();
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

export default DecentralizedDNSConfig;