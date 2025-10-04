import { Client } from '@xmtp/browser-sdk';
import { useSignMessage } from 'wagmi';


/**
 * Check if an address has XMTP set up (can send/receive messages)
 * @param {string} address - The wallet address to check
 * @returns {Promise<boolean>} - True if address can message, false otherwise
 */
export const checkXMTPStatus = async (address) => {
  if (!address) {
    throw new Error('Address is required');
  }

  try {
    console.log('Checking XMTP status for address:', address);
    
    // Check if address can message on XMTP
    const canMessage = await Client.canMessage([
      { identifier: address, identifierKind: 'Ethereum' }
    ]);
    
    const result = Array.from(canMessage.values());
    
    // Check if the address exists in the map
    const canMessageResult = result[0];
    console.log('XMTP status check result:', canMessageResult);
    
    // If still undefined, default to false
    return canMessageResult;
  } catch (error) {
    console.error('Error checking XMTP status:', error);
    throw error;
  }
};

/**
 * Create XMTP client for an address (if it can message)
 * @param {string} address - The wallet address
 * @returns {Promise<Client|null>} - XMTP client or null if can't message
 */
export const getExistingXMTPClient = async (address) => {
  if (!address) {
    throw new Error('Address is required');
  }

  try {
    // First check if address can message
    const canMessage = await Client.canMessage([
      { identifier: address, identifierKind: 'Ethereum' }
    ]);
    
    const canMessageResult = Array.from(canMessage.values())[0];
    
    if (canMessageResult) {
      // Build existing client
      const client = await Client.build(
        { identifier: address, identifierKind: 'Ethereum' },
        { env: 'production', appVersion: 'namenest/1.0.0' }
      );
      
      console.log('Built existing XMTP client');
      return client;
    } else {
      console.log('Address cannot message on XMTP');
      return null;
    }
  } catch (error) {
    console.error('Error creating XMTP client:', error);
    throw error;
  }
};


export const createXMTPClient = async (address) => {
  if (!address) {
    throw new Error('Address is required');
  }

  const { signMessageAsync } = useSignMessage();

  
  const signer = useMemo(() => {
    if (!address || !signMessageAsync) return null;
    
    return {
      type: 'EOA',
      getIdentifier: () => ({
        identifier: address,
        identifierKind: 'Ethereum'
      }),
      signMessage: async (message) => {
        console.log('Signing message with useSignMessage:', message);
        const signature = await signMessageAsync({
          account: address,
          message,
        });
        console.log('Signature received:', signature);
        return toBytes(signature);
      }
    };
  }, [address, signMessageAsync]);

  try {
    // Build existing client
    const client = await Client.create(signer, { env: 'production', appVersion: 'namenest/1.0.0' })
    
    console.log('Built existing XMTP client');
    return client;
  } catch (error) {
    console.error('Error creating XMTP client:', error);
    throw error;
  }
};

/**
 * Revoke XMTP installations for an address
 * @param {string} address - The wallet address
 * @returns {Promise<boolean>} - Success status
 */
export const revokeXMTPInstallations = async (address) => {
  if (!address) {
    throw new Error('Address is required');
  }

  try {
    const { signMessageAsync } = useSignMessage();

  
  const signer = useMemo(() => {
    if (!address || !signMessageAsync) return null;
    
    return {
      type: 'EOA',
      getIdentifier: () => ({
        identifier: address,
        identifierKind: 'Ethereum'
      }),
      signMessage: async (message) => {
        console.log('Signing message with useSignMessage:', message);
        const signature = await signMessageAsync({
          account: address,
          message,
        });
        console.log('Signature received:', signature);
        return toBytes(signature);
      }
    };
  }, [address, signMessageAsync]);
    // First check if address can message
    const canMessage = await Client.canMessage([
      { identifier: address, identifierKind: 'Ethereum' }
    ]);
    
    const canMessageResult = Array.from(canMessage.values())[0];
    
    if (canMessageResult) {
      // Build client first, then revoke installations
      const client = await Client.build(
        { identifier: address, identifierKind: 'Ethereum' },
        { env: 'production', appVersion: 'namenest/1.0.0' }
      );
      
      // Now call revokeAllOtherInstallations on the client instance
      await client.revokeAllOtherInstallations();
      console.log('Revoked all other XMTP installations');
      return true;
    } else {
      console.log('Address cannot message on XMTP, nothing to revoke');
      return false;
    }
  } catch (error) {
    console.error('Error revoking XMTP installations:', error);
    throw error;
  }
};

/**
 * Get detailed XMTP status information
 * @param {string} address - The wallet address to check
 * @returns {Promise<{canMessage: boolean, isSetup: boolean, error?: string}>}
 */
export const getXMTPStatusDetails = async (address) => {
  if (!address) {
    return {
      canMessage: false,
      isSetup: false,
      error: 'Address is required'
    };
  }

  try {
    const canMessage = await Client.canMessage([
      { identifier: address, identifierKind: 'Ethereum' }
    ]);
    
    const result = Array.from(canMessage.values());
    const canMessageResult = result[0];
    
    // Ensure we return a boolean
    const isSetup = canMessageResult === true;
    
    return {
      canMessage: isSetup,
      isSetup: isSetup,
      address: address
    };
  } catch (error) {
    console.error('Error getting XMTP status details:', error);
    return {
      canMessage: false,
      isSetup: false,
      error: error.message,
      address: address
    };
  }
};