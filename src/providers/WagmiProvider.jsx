import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia, sepolia, base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import { domaTestnet } from 'utils/domaTestnet';

// Build connectors; only include WalletConnect if a real projectId is provided
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const connectors = [injected(), metaMask()];
if (walletConnectProjectId && walletConnectProjectId !== 'your-project-id') {
  connectors.push(
    walletConnect({
      projectId: walletConnectProjectId,
    })
  );
}

// Create wagmi config
const config = createConfig({
  chains: [domaTestnet, sepolia, base],
  connectors,
  transports: {
    [domaTestnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

// Create a client
const queryClient = new QueryClient();

export const WagmiProviderWrapper = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WagmiProviderWrapper;
