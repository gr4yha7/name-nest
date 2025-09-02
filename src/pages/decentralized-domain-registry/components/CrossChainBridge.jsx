import React, { useState, useCallback } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CrossChainBridge = ({ provider, signer, domains, currentNetwork }) => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [targetNetwork, setTargetNetwork] = useState('');
  const [bridgeStep, setBridgeStep] = useState('select'); // select, estimate, confirm, bridge, complete
  const [estimatedFees, setEstimatedFees] = useState(null);
  const [bridgeProgress, setBridgeProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const supportedNetworks = [
    { id: 'ethereum', name: 'Ethereum', icon: 'Coins', gasToken: 'ETH' },
    { id: 'polygon', name: 'Polygon', icon: 'Triangle', gasToken: 'MATIC' },
    { id: 'arbitrum', name: 'Arbitrum', icon: 'Zap', gasToken: 'ETH' },
    { id: 'optimism', name: 'Optimism', icon: 'Circle', gasToken: 'ETH' },
    { id: 'base', name: 'Base', icon: 'Square', gasToken: 'ETH' }
  ];

  const bridgeSteps = [
    { id: 'initiate', label: 'Initiate Bridge', description: 'Start the bridging process' },
    { id: 'lock', label: 'Lock on Source', description: 'Domain locked on current network' },
    { id: 'validate', label: 'Validate', description: 'Cross-chain validation in progress' },
    { id: 'mint', label: 'Mint on Target', description: 'Minting domain on target network' },
    { id: 'complete', label: 'Complete', description: 'Bridge completed successfully' }
  ];

  const getCurrentNetworkInfo = () => {
    return supportedNetworks?.find(n => n?.id === currentNetwork) || supportedNetworks?.[0];
  };

  const getTargetNetworkInfo = () => {
    return supportedNetworks?.find(n => n?.id === targetNetwork);
  };

  const estimateBridgeFees = useCallback(async () => {
    if (!selectedDomain || !targetNetwork) return;

    setIsLoading(true);
    try {
      // Simulate fee estimation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockFees = {
        sourceFee: '0.003',
        targetFee: '0.002',
        bridgeFee: '0.001',
        total: '0.006',
        estimatedTime: '10-15 minutes'
      };
      
      setEstimatedFees(mockFees);
      setBridgeStep('estimate');
      
    } catch (error) {
      console.error('Fee estimation failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDomain, targetNetwork]);

  const initiateBridge = useCallback(async () => {
    if (!signer || !selectedDomain || !targetNetwork) return;

    setIsLoading(true);
    setBridgeStep('bridge');
    setBridgeProgress(0);
    
    try {
      // Simulate bridge process
      const steps = bridgeSteps?.length;
      
      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setBridgeProgress(((i + 1) / steps) * 100);
      }
      
      setBridgeStep('complete');
      
    } catch (error) {
      console.error('Bridge failed:', error);
      setBridgeStep('estimate');
    } finally {
      setIsLoading(false);
    }
  }, [signer, selectedDomain, targetNetwork]);

  const resetBridge = () => {
    setBridgeStep('select');
    setSelectedDomain(null);
    setTargetNetwork('');
    setEstimatedFees(null);
    setBridgeProgress(0);
  };

  const renderNetworkSelector = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Cross-Chain Domain Bridge</h3>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Domain to Bridge
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
              {domain?.name} ({domain?.network})
            </option>
          ))}
        </select>
      </div>

      {selectedDomain && (
        <div className="bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Current Location</h4>
          <div className="flex items-center space-x-3">
            <Icon name={getCurrentNetworkInfo()?.icon} size={20} className="text-primary" />
            <span className="text-foreground font-medium">{getCurrentNetworkInfo()?.name}</span>
            <span className="text-sm text-muted-foreground">({selectedDomain?.name})</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Target Network
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {supportedNetworks
            ?.filter(network => network?.id !== currentNetwork)
            ?.map((network) => (
            <button
              key={network?.id}
              onClick={() => setTargetNetwork(network?.id)}
              className={`flex items-center space-x-2 p-3 rounded-lg border transition-standard ${
                targetNetwork === network?.id
                  ? 'border-primary bg-primary/10 text-primary' :'border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={network?.icon} size={16} />
              <span className="text-sm font-medium">{network?.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedDomain && targetNetwork && (
        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-info mt-0.5" />
            <div>
              <h4 className="font-medium text-info mb-1">Bridge Information</h4>
              <ul className="text-sm text-info/80 space-y-1">
                <li>• Domain will be locked on {getCurrentNetworkInfo()?.name}</li>
                <li>• A wrapped version will be minted on {getTargetNetworkInfo()?.name}</li>
                <li>• You can bridge back to the original network anytime</li>
                <li>• Bridge process typically takes 10-30 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={estimateBridgeFees}
        disabled={!selectedDomain || !targetNetwork || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span className="ml-2">Estimating Fees...</span>
          </>
        ) : (
          <>
            <Icon name="Calculator" size={16} />
            <span className="ml-2">Estimate Bridge Fees</span>
          </>
        )}
      </Button>
    </div>
  );

  const renderFeeEstimate = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Fee Estimation</h3>
        <Button variant="ghost" size="sm" onClick={() => setBridgeStep('select')}>
          <Icon name="ArrowLeft" size={16} />
        </Button>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-3">Bridge Summary</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name={getCurrentNetworkInfo()?.icon} size={20} className="text-primary" />
            <span className="font-medium text-foreground">{getCurrentNetworkInfo()?.name}</span>
          </div>
          <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
          <div className="flex items-center space-x-3">
            <Icon name={getTargetNetworkInfo()?.icon} size={20} className="text-primary" />
            <span className="font-medium text-foreground">{getTargetNetworkInfo()?.name}</span>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {selectedDomain?.name}
        </p>
      </div>

      {estimatedFees && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Fee Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Source Network Fee:</span>
                <span className="text-foreground font-mono">
                  {estimatedFees?.sourceFee} {getCurrentNetworkInfo()?.gasToken}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Network Fee:</span>
                <span className="text-foreground font-mono">
                  {estimatedFees?.targetFee} {getTargetNetworkInfo()?.gasToken}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bridge Fee:</span>
                <span className="text-foreground font-mono">
                  {estimatedFees?.bridgeFee} ETH
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between font-medium">
                <span className="text-foreground">Total Estimated:</span>
                <span className="text-foreground font-mono">
                  ~{estimatedFees?.total} ETH
                </span>
              </div>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Clock" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-warning mb-1">Estimated Time</h4>
                <p className="text-sm text-warning/80">
                  {estimatedFees?.estimatedTime} for complete bridge process
                </p>
              </div>
            </div>
          </div>

          <Button onClick={initiateBridge} className="w-full">
            <Icon name="ArrowLeftRight" size={16} />
            <span className="ml-2">Confirm Bridge</span>
          </Button>
        </div>
      )}
    </div>
  );

  const renderBridgeProgress = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Bridging in Progress</h3>
        <p className="text-muted-foreground">
          Please don't close this window. Bridge completion will be automatic.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">{Math.round(bridgeProgress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${bridgeProgress}%` }}
          />
        </div>
      </div>

      {/* Bridge Steps */}
      <div className="space-y-3">
        {bridgeSteps?.map((step, index) => {
          const isCompleted = bridgeProgress > (index * 20);
          const isCurrent = bridgeProgress >= (index * 20) && bridgeProgress < ((index + 1) * 20);
          
          return (
            <div key={step?.id} className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                isCompleted 
                  ? 'bg-success text-success-foreground'
                  : isCurrent
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <Icon name="Check" size={14} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.label}
                </p>
                <p className="text-xs text-muted-foreground">{step?.description}</p>
              </div>
              {isCurrent && (
                <Icon name="Loader2" size={16} className="animate-spin text-primary" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
        <Icon name="CheckCircle" size={32} className="text-success" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Bridge Complete!</h3>
        <p className="text-muted-foreground">
          {selectedDomain?.name} has been successfully bridged to {getTargetNetworkInfo()?.name}
        </p>
      </div>

      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <p className="text-sm text-success">
          Your domain is now available on both networks. You can manage it from either network.
        </p>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={resetBridge} className="flex-1">
          <Icon name="ArrowLeft" size={16} />
          <span className="ml-2">Bridge Another</span>
        </Button>
        <Button onClick={() => window.location?.reload()} className="flex-1">
          <Icon name="RefreshCw" size={16} />
          <span className="ml-2">Refresh Domains</span>
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (bridgeStep) {
      case 'select':
        return renderNetworkSelector();
      case 'estimate':
        return renderFeeEstimate();
      case 'bridge':
        return renderBridgeProgress();
      case 'complete':
        return renderComplete();
      default:
        return renderNetworkSelector();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {renderContent()}
    </div>
  );
};

export default CrossChainBridge;