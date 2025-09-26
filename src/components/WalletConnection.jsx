import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import Button from './ui/Button';

const WalletConnection = ({ onConnect, onDisconnect, className = "" }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
    if (onConnect) onConnect();
  };

  const handleDisconnect = () => {
    disconnect();
    if (onDisconnect) onDisconnect();
  };

  if (isConnected) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="text-sm text-gray-600">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      className={className}
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};

export default WalletConnection;
