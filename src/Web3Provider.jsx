import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

// Define your custom chain
const customChain = {
  id: 97476, // Replace with your custom chain ID
  name: "Domain Testnet",
  network: "domainTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Domain Testnet",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.doma.xyz"], // Replace with your custom RPC URL
    },
  },
  blockExplorers: {
    default: {
      name: "Domain Explorer",
      url: "https://explorer-testnet.doma.xyz", // Replace with your custom block explorer URL
    },
  },
  testnet: true, // Set to false if it's a mainnet
};

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    // Your dApps chains
    chains: [mainnet, customChain], // Add your custom chain here
    transports: {
      [customChain.id]: http("https://rpc-testnet.doma.xyz"), // Add RPC for custom chain
    },

    // Required App Info
    appName: "NameNest",

    // Optional App Info
    appDescription: "NameNest is a secure platform for buying and selling domain names.",
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