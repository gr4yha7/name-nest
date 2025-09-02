import React, { useState, useCallback } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SmartContractPanel = ({ provider, signer, domains, currentNetwork }) => {
  const [activeSection, setActiveSection] = useState('ownership');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ownership proofs
  const [ownershipProof, setOwnershipProof] = useState('');
  
  // Transfer functionality
  const [transferTo, setTransferTo] = useState('');
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  
  // Renewal settings
  const [autoRenew, setAutoRenew] = useState(false);
  const [renewalPeriod, setRenewalPeriod] = useState(1);
  const [renewalBudget, setRenewalBudget] = useState('0.01');

  const sectionOptions = [
    { id: 'ownership', label: 'Ownership Proof', icon: 'Shield' },
    { id: 'transfer', label: 'Transfer Domain', icon: 'Send' },
    { id: 'renewal', label: 'Auto Renewal', icon: 'RefreshCw' }
  ];

  const generateOwnershipProof = useCallback(async () => {
    if (!signer || !selectedDomain) return;

    setIsLoading(true);
    try {
      const address = await signer?.getAddress();
      const message = `I own the domain ${selectedDomain?.name} at ${new Date()?.toISOString()}`;
      
      const signature = await signer?.signMessage(message);
      
      const proof = {
        domain: selectedDomain?.name,
        owner: address,
        timestamp: new Date()?.toISOString(),
        message,
        signature,
        contractAddress: selectedDomain?.ownership?.contractAddress,
        tokenId: selectedDomain?.ownership?.tokenId
      };
      
      setOwnershipProof(JSON.stringify(proof, null, 2));
      
    } catch (error) {
      console.error('Ownership proof generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [signer, selectedDomain]);

  const transferDomain = useCallback(async () => {
    if (!signer || !selectedDomain || !transferTo || !transferConfirmed) return;

    setIsLoading(true);
    try {
      console.log(`Transferring ${selectedDomain?.name} to ${transferTo}`);
      
      // Simulate transfer transaction
      const tx = await signer?.sendTransaction({
        to: selectedDomain?.ownership?.contractAddress,
        data: '0x', // Mock transfer data
        gasLimit: '100000'
      });
      
      await tx?.wait();
      
      setTransferTo('');
      setTransferConfirmed(false);
      
    } catch (error) {
      console.error('Domain transfer failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [signer, selectedDomain, transferTo, transferConfirmed]);

  const setupAutoRenewal = useCallback(async () => {
    if (!signer || !selectedDomain) return;

    setIsLoading(true);
    try {
      console.log(`Setting up auto-renewal for ${selectedDomain?.name}`);
      
      // Simulate auto-renewal setup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Auto-renewal setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [signer, selectedDomain, autoRenew, renewalPeriod, renewalBudget]);

  const renderOwnershipSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Domain Ownership Proofs</h3>
        
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
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-3">Domain Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Contract:</span>
                    <p className="font-mono text-foreground break-all">
                      {selectedDomain?.ownership?.contractAddress}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Token ID:</span>
                    <p className="font-mono text-foreground">
                      {selectedDomain?.ownership?.tokenId}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Network:</span>
                    <p className="text-foreground capitalize">
                      {selectedDomain?.network}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="text-foreground">
                      {selectedDomain?.type}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={generateOwnershipProof}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span className="ml-2">Generating Proof...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Shield" size={16} />
                    <span className="ml-2">Generate Ownership Proof</span>
                  </>
                )}
              </Button>

              {ownershipProof && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ownership Proof (JSON)
                  </label>
                  <div className="relative">
                    <textarea
                      value={ownershipProof}
                      readOnly
                      className="w-full px-3 py-2 border border-border rounded-md bg-muted font-mono text-sm text-foreground"
                      rows={12}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator?.clipboard?.writeText(ownershipProof)}
                      className="absolute top-2 right-2"
                    >
                      <Icon name="Copy" size={14} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This cryptographic proof can be used to verify domain ownership without revealing private keys.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderTransferSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Transfer Domain</h3>
        
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
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium text-warning mb-1">Important Warning</h4>
                    <p className="text-sm text-warning/80">
                      Domain transfers are permanent and cannot be undone. Make sure the recipient address is correct.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Recipient Address
                </label>
                <Input
                  type="text"
                  placeholder="0x..."
                  value={transferTo}
                  onChange={(e) => setTransferTo(e?.target?.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the wallet address of the new owner
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Transaction Preview</h4>
                <div className="bg-muted/30 p-4 rounded-lg text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground">Domain:</span>
                      <p className="font-medium text-foreground">{selectedDomain?.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">From:</span>
                      <p className="font-mono text-foreground text-xs">
                        {signer ? 'Your Wallet' : 'Not Connected'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">To:</span>
                      <p className="font-mono text-foreground text-xs break-all">
                        {transferTo || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Est. Gas:</span>
                      <p className="text-foreground">~0.001 ETH</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="transfer-confirm"
                  checked={transferConfirmed}
                  onChange={(e) => setTransferConfirmed(e?.target?.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                />
                <label htmlFor="transfer-confirm" className="text-sm text-foreground">
                  I understand this transfer is permanent and irreversible
                </label>
              </div>

              <Button
                onClick={transferDomain}
                disabled={!transferTo || !transferConfirmed || isLoading}
                variant="destructive"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span className="ml-2">Transferring...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} />
                    <span className="ml-2">Transfer Domain</span>
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderRenewalSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Automated Renewal</h3>
        
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
              {domains?.filter(d => d?.expirationDate !== 'Lifetime')?.map((domain) => (
                <option key={domain?.id} value={domain?.id}>
                  {domain?.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDomain && (
            <>
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                <input
                  type="checkbox"
                  id="auto-renew"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e?.target?.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                />
                <label htmlFor="auto-renew" className="text-sm text-foreground">
                  Enable automatic renewal for {selectedDomain?.name}
                </label>
              </div>

              {autoRenew && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Renewal Period
                    </label>
                    <select
                      value={renewalPeriod}
                      onChange={(e) => setRenewalPeriod(Number(e?.target?.value))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {[1, 2, 3, 5, 10]?.map(years => (
                        <option key={years} value={years}>
                          {years} year{years > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Maximum Budget per Renewal (ETH)
                    </label>
                    <Input
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="0.01"
                      value={renewalBudget}
                      onChange={(e) => setRenewalBudget(e?.target?.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Renewal will be skipped if cost exceeds this amount
                    </p>
                  </div>

                  <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="Info" size={20} className="text-info mt-0.5" />
                      <div>
                        <h4 className="font-medium text-info mb-1">How Auto-Renewal Works</h4>
                        <ul className="text-sm text-info/80 space-y-1">
                          <li>• Renewal attempts 30 days before expiration</li>
                          <li>• Uses your connected wallet's funds</li>
                          <li>• Can be cancelled anytime</li>
                          <li>• Respects your budget limits</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={setupAutoRenewal}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span className="ml-2">Setting up...</span>
                  </>
                ) : (
                  <>
                    <Icon name="RefreshCw" size={16} />
                    <span className="ml-2">
                      {autoRenew ? 'Enable Auto-Renewal' : 'Disable Auto-Renewal'}
                    </span>
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'ownership':
        return renderOwnershipSection();
      case 'transfer':
        return renderTransferSection();
      case 'renewal':
        return renderRenewalSection();
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

export default SmartContractPanel;