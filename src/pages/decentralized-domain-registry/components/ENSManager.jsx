import React, { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ENSManager = ({ provider, signer, currentNetwork, onDomainUpdate }) => {
  const [activeSection, setActiveSection] = useState('register');
  const [domainName, setDomainName] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [registrationYears, setRegistrationYears] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState(null);
  
  // Subdomain management
  const [subdomainName, setSubdomainName] = useState('');
  const [subdomainTarget, setSubdomainTarget] = useState('');
  
  // Resolver configuration
  const [resolverAddress, setResolverAddress] = useState('');
  const [addressRecords, setAddressRecords] = useState({
    ETH: '',
    BTC: '',
    USDC: ''
  });
  const [contentHash, setContentHash] = useState('');
  const [textRecords, setTextRecords] = useState({
    description: '',
    url: '',
    email: '',
    avatar: ''
  });

  // Reverse record
  const [reverseRecord, setReverseRecord] = useState('');

  const sectionOptions = [
    { id: 'register', label: 'Register Domain', icon: 'Plus' },
    { id: 'subdomains', label: 'Subdomains', icon: 'GitBranch' },
    { id: 'resolver', label: 'Resolver Config', icon: 'Settings' },
    { id: 'reverse', label: 'Reverse Records', icon: 'RotateCcw' }
  ];

  const checkAvailability = useCallback(async () => {
    if (!domainName?.trim() || !provider) return;
    
    setIsChecking(true);
    try {
      // Simulate ENS availability check
      // In real implementation, use ENS registry contract
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock availability (randomized for demo)
      const available = Math.random() > 0.3;
      setIsAvailable(available);
    } catch (error) {
      console.error('Availability check failed:', error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  }, [domainName, provider]);

  const registerDomain = useCallback(async () => {
    if (!signer || !domainName || !isAvailable) return;
    
    try {
      // In real implementation, interact with ENS registrar contract
      console.log(`Registering ${domainName}.eth for ${registrationYears} years`);
      
      // Simulate transaction
      const tx = await signer.sendTransaction({
        to: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
        value: ethers.parseEther('0.01'),
        data: '0x'
      });
      
      await tx.wait();
      
      // Update domain collection
      const newDomain = {
        id: Date.now(),
        name: `${domainName}.eth`,
        type: 'ENS',
        network: 'ethereum',
        expirationDate: new Date(Date.now() + registrationYears * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        isResolved: false,
        hasSubdomains: false,
        ownership: {
          tokenId: String(Date.now()),
          contractAddress: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
          isOwner: true
        },
        analytics: {
          resolutions: 0,
          uniqueVisitors: 0,
          lastResolved: null
        }
      };
      
      onDomainUpdate?.(newDomain);
      setDomainName('');
      setIsAvailable(null);
      
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }, [signer, domainName, isAvailable, registrationYears, onDomainUpdate]);

  const createSubdomain = useCallback(async () => {
    if (!signer || !subdomainName || !subdomainTarget) return;
    
    try {
      console.log(`Creating subdomain ${subdomainName}.${selectedDomain?.name} → ${subdomainTarget}`);
      
      // Simulate subdomain creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubdomainName('');
      setSubdomainTarget('');
      
    } catch (error) {
      console.error('Subdomain creation failed:', error);
    }
  }, [signer, subdomainName, subdomainTarget, selectedDomain]);

  const updateResolver = useCallback(async () => {
    if (!signer || !selectedDomain) return;
    
    try {
      console.log('Updating resolver configuration for', selectedDomain?.name);
      
      // Simulate resolver update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update domain in collection
      const updatedDomain = {
        ...selectedDomain,
        resolverAddress,
        addresses: addressRecords,
        contentHash,
        textRecords
      };
      
      onDomainUpdate?.(updatedDomain);
      
    } catch (error) {
      console.error('Resolver update failed:', error);
    }
  }, [signer, selectedDomain, resolverAddress, addressRecords, contentHash, textRecords, onDomainUpdate]);

  const setReverseRecordHandler = useCallback(async () => {
    if (!signer || !reverseRecord) return;
    
    try {
      console.log('Setting reverse record to:', reverseRecord);
      
      // Simulate reverse record setting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReverseRecord('');
      
    } catch (error) {
      console.error('Reverse record setting failed:', error);
    }
  }, [signer, reverseRecord]);

  const renderRegisterSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Register ENS Domain</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="myawesome"
                value={domainName}
                onChange={(e) => setDomainName(e?.target?.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground">.eth</span>
              <Button
                variant="outline"
                onClick={checkAvailability}
                disabled={!domainName?.trim() || isChecking}
              >
                {isChecking ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <Icon name="Search" size={16} />
                )}
              </Button>
            </div>
            
            {isAvailable !== null && (
              <div className={`mt-2 flex items-center space-x-2 ${isAvailable ? 'text-success' : 'text-error'}`}>
                <Icon name={isAvailable ? 'CheckCircle' : 'XCircle'} size={16} />
                <span className="text-sm">
                  {isAvailable ? 'Domain is available!' : 'Domain is not available'}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Registration Period
            </label>
            <select
              value={registrationYears}
              onChange={(e) => setRegistrationYears(Number(e?.target?.value))}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[1, 2, 3, 5, 10].map(years => (
                <option key={years} value={years}>
                  {years} year{years > 1 ? 's' : ''} (~{(0.01 * years).toFixed(3)} ETH)
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={registerDomain}
            disabled={!isAvailable || !signer}
            className="w-full"
          >
            <Icon name="Plus" size={16} />
            <span className="ml-2">Register Domain</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSubdomainsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Manage Subdomains</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => setSelectedDomain({ id: e?.target?.value, name: e?.target?.options[e?.target?.selectedIndex]?.text })}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              <option value="1">myawesome.eth</option>
              <option value="2">blockchain.eth</option>
            </select>
          </div>

          {selectedDomain && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subdomain Name
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="blog"
                    value={subdomainName}
                    onChange={(e) => setSubdomainName(e?.target?.value)}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">.{selectedDomain?.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Target Address/Content
                </label>
                <Input
                  type="text"
                  placeholder="0x... or IPFS hash"
                  value={subdomainTarget}
                  onChange={(e) => setSubdomainTarget(e?.target?.value)}
                />
              </div>

              <Button
                onClick={createSubdomain}
                disabled={!subdomainName || !subdomainTarget}
                className="w-full"
              >
                <Icon name="Plus" size={16} />
                <span className="ml-2">Create Subdomain</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderResolverSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Resolver Configuration</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Domain
            </label>
            <select
              value={selectedDomain?.id || ''}
              onChange={(e) => setSelectedDomain({ id: e?.target?.value, name: e?.target?.options[e?.target?.selectedIndex]?.text })}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a domain...</option>
              <option value="1">myawesome.eth</option>
              <option value="2">blockchain.eth</option>
            </select>
          </div>

          {selectedDomain && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Resolver Address
                </label>
                <Input
                  type="text"
                  placeholder="0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41"
                  value={resolverAddress}
                  onChange={(e) => setResolverAddress(e?.target?.value)}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Address Records</h4>
                <div className="space-y-3">
                  {Object.entries(addressRecords)?.map(([coin, address]) => (
                    <div key={coin} className="flex items-center space-x-3">
                      <span className="w-12 text-sm font-medium text-foreground">{coin}</span>
                      <Input
                        type="text"
                        placeholder={`Enter ${coin} address`}
                        value={address}
                        onChange={(e) => setAddressRecords(prev => ({ ...prev, [coin]: e?.target?.value }))}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Content Hash (IPFS)
                </label>
                <Input
                  type="text"
                  placeholder="ipfs://QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N"
                  value={contentHash}
                  onChange={(e) => setContentHash(e?.target?.value)}
                />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Text Records</h4>
                <div className="space-y-3">
                  {Object.entries(textRecords)?.map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <span className="w-20 text-sm font-medium text-foreground capitalize">{key}</span>
                      <Input
                        type="text"
                        placeholder={`Enter ${key}`}
                        value={value}
                        onChange={(e) => setTextRecords(prev => ({ ...prev, [key]: e?.target?.value }))}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={updateResolver}
                disabled={!selectedDomain}
                className="w-full"
              >
                <Icon name="Save" size={16} />
                <span className="ml-2">Update Resolver</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderReverseSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Reverse Records</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Set up reverse resolution to display your ENS name when your address is looked up.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Primary ENS Name
            </label>
            <select
              value={reverseRecord}
              onChange={(e) => setReverseRecord(e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select primary ENS name...</option>
              <option value="myawesome.eth">myawesome.eth</option>
              <option value="blockchain.eth">blockchain.eth</option>
            </select>
          </div>

          <Button
            onClick={setReverseRecordHandler}
            disabled={!reverseRecord}
            className="w-full"
          >
            <Icon name="RotateCcw" size={16} />
            <span className="ml-2">Set Reverse Record</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'register':
        return renderRegisterSection();
      case 'subdomains':
        return renderSubdomainsSection();
      case 'resolver':
        return renderResolverSection();
      case 'reverse':
        return renderReverseSection();
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

export default ENSManager;