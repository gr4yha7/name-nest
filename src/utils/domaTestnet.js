export const domaTestnet = {
  id: 97476,
  name: "Doma Testnet",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.doma.xyz"],
    },
    public: {
      http: ["https://rpc-testnet.doma.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Doma Explorer",
      url: "https://explorer-testnet.doma.xyz",
    },
  },
  testnet: true,
};
