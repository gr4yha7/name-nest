import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NetworkSelector = ({ currentNetwork, onNetworkChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCurrentOption = () => {
    return options?.find(opt => opt?.value === currentNetwork) || options?.[0];
  };

  const handleNetworkSelect = async (network) => {
    try {
      setIsOpen(false);
      
      if (network?.value === 'all') {
        onNetworkChange?.(network?.value);
        return;
      }

      // Request network switch if wallet is connected
      if (typeof window.ethereum !== 'undefined') {
        const networkConfigs = {
          ethereum: { chainId: '0x1' },
          polygon: { chainId: '0x89' },
          arbitrum: { chainId: '0xa4b1' },
          optimism: { chainId: '0xa' },
          base: { chainId: '0x2105' }
        };

        const config = networkConfigs?.[network?.value];
        if (config) {
          await window.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: config?.chainId }]
          });
        }
      }
      
      onNetworkChange?.(network?.value);
    } catch (error) {
      console.error('Network switch failed:', error);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 w-40"
      >
        <Icon name={getCurrentOption()?.icon || 'Globe'} size={16} />
        <span className="text-sm">{getCurrentOption()?.label}</span>
        <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={16} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated z-50">
          <div className="py-1">
            {options?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleNetworkSelect(option)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-standard"
              >
                <Icon name={option?.icon || 'Circle'} size={16} />
                <span>{option?.label}</span>
                {option?.value === currentNetwork && (
                  <Icon name="Check" size={16} className="ml-auto text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;