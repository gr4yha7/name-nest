import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, mainnet, sepolia, shibariumTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { domaTestnet } from "utils/cn";

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    // Your dApps chains
    chains: [mainnet, baseSepolia, sepolia, shibariumTestnet, domaTestnet], // Add your custom chain here
    transports: {
      [mainnet.id]: http(mainnet?.rpcUrls), // Add RPC for custom chain
      [baseSepolia.id]: http(baseSepolia?.rpcUrls), // Add RPC for custom chain
      [sepolia.id]: http(sepolia?.rpcUrls), // Add RPC for custom chain
      [sepolia.id]: http(sepolia?.rpcUrls), // Add RPC for custom chain
      [shibariumTestnet.id]: http(shibariumTestnet?.rpcUrls), // Add RPC for custom chain
      [domaTestnet.id]: http("https://rpc-testnet.doma.xyz"), // Add RPC for custom chain
    },

    // Required App Info
    appName: "NameNest",

    // Optional App Info
    appDescription: "NameNest is a secure messaging platform for buying and selling domain names.",
    appUrl: "https://family.co", // your app's url
    appIcon: "/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider 
        theme="rounded" 
        options={{
        embedGoogleFonts: true,
        }}
        
        >{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};