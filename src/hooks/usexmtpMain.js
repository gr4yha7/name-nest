import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { checkXMTPStatus, getXMTPStatusDetails } from './xmtpUtils'; // Assuming you put the functions above in a utils file

/**
 * Hook to check XMTP status for the connected wallet
 */
export const useXMTPStatus = () => {
  const { address, isConnected } = useAccount();
  const [xmtpStatus, setXmtpStatus] = useState({
    isSetup: false,
    isLoading: false,
    error: null,
    lastChecked: null
  });

  const checkStatus = useCallback(async () => {
    if (!address || !isConnected) {
      setXmtpStatus({
        isSetup: false,
        isLoading: false,
        error: 'Wallet not connected',
        lastChecked: null
      });
      return;
    }

    setXmtpStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const statusDetails = await getXMTPStatusDetails(address);
      
      setXmtpStatus({
        isSetup: statusDetails.isSetup,
        isLoading: false,
        error: statusDetails.error || null,
        lastChecked: new Date().toISOString()
      });
    } catch (error) {
      setXmtpStatus({
        isSetup: false,
        isLoading: false,
        error: error.message,
        lastChecked: new Date().toISOString()
      });
    }
  }, [address, isConnected]);

  // Auto-check when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      checkStatus();
    } else {
      setXmtpStatus({
        isSetup: false,
        isLoading: false,
        error: null,
        lastChecked: null
      });
    }
  }, [isConnected, address, checkStatus]);

  return {
    ...xmtpStatus,
    checkStatus,
    address
  };
};