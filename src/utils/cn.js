import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { avalancheFuji, baseSepolia, curtis, sepolia, shibariumTestnet } from "viem/chains";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

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
}

export const SUPPORTED_CHAINS = [
  domaTestnet,
  baseSepolia,
  curtis,
  sepolia,
  avalancheFuji,
];

export const currencies = [
  {
      "contractAddress": "0x2f3463756C59387D6Cd55b034100caf7ECfc757b",
      "name": "USDC",
      "symbol": "USDC",
      "decimals": 6,
      "type": "ALL",
      "nativeWrapper": false
  },
  {
      "contractAddress": "0x6f898cd313dcEe4D28A87F675BD93C471868B0Ac",
      "name": "WETH",
      "symbol": "WETH",
      "decimals": 18,
      "type": "ALL",
      "nativeWrapper": false
  },
  {
      "contractAddress": null,
      "name": "Ethereum",
      "symbol": "ETH",
      "decimals": 18,
      "type": "LISTING_ONLY",
      "nativeWrapper": false
  }
];

export const transformDomainsToListings = (domains) => {
  const listings = [];

  domains.forEach(domain => {
    const token = domain.tokens?.[0];
    if (!token) return;

    // Process each listing in the token
    token.listings?.forEach(listing => {
      listings.push({
        __typename: "NameListingModel",
        id: listing.id,
        externalId: listing.externalId,
        price: listing.price,
        offererAddress: listing.offererAddress,
        orderbook: listing.orderbook,
        currency: {
          __typename: "CurrencyModel",
          symbol: listing.currency.symbol,
          name: listing.currency.name,
          decimals: listing.currency.decimals,
          usdExchangeRate: listing.currency.usdExchangeRate
        },
        expiresAt: listing.expiresAt,
        createdAt: listing.createdAt,
        updatedAt: listing.createdAt,
        name: domain.name,
        nameExpiresAt: domain.expiresAt,
        registrar: {
          __typename: "RegistrarModel",
          ianaId: domain.registrar.ianaId,
          name: domain.registrar.name,
          websiteUrl: domain.registrar.websiteUrl
        },
        tokenId: token.tokenId,
        tokenAddress: token.tokenAddress,
        chain: {
          __typename: "ChainModel",
          networkId: token.chain.networkId,
          name: token.chain.name,
          addressUrlTemplate: token.chain.addressUrlTemplate || null
        }
      });
    });
  });

  console.log("listings", listings)

  return listings;
}

export const calculateExpiryDate = (expiryUnit, expiryValue) => {
  const date = new Date();
  if (expiryUnit === 'day') {
    date.setDate(date.getDate() + expiryValue);
  } else if (expiryUnit === 'week') {
    date.setDate(date.getDate() + (expiryValue * 7));
  } else if (expiryUnit === 'month') {
    date.setMonth(date.getMonth() + expiryValue);
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export function inFromNowSeconds(count, unit) {
  const units = {
    day: 24 * 60 * 60,
    week: 7 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60, // approx. month
  };
  const key = unit.toLowerCase().replace(/s$/, ''); // normalize plural
  const sec = units[key];
  if (!sec) throw new Error(`Unsupported unit: ${unit}`);
  return Math.floor(Date.now() / 1000) + count * sec;
}

export function shortenAddress(address, chars = 4) {
    // Ensure the address is a valid hex string with '0x' prefix
    if (!address.startsWith('0x') || address.length < chars * 2 + 2) {
      return address; // Return original if not a valid address to shorten
    }
    
    const start = address.substring(0, chars + 2);
    const end = address.substring(address.length - chars);
    
    return `${start}...${end}`;
  }

export function formatEthereumAddress(input) {
  // Extract the Ethereum address (assuming it's the last part after the last colon)
  const address = input.split(":").pop();

  // Truncate the address to show the first 5 and last 3 characters
  return `${address.slice(0, 5)}...${address.slice(-3)}`;
}

export function formatJustEthereumAddress(input) {
  // Extract the Ethereum address (assuming it's the last part after the last colon)
  const address = input.split(":").pop();

  // Truncate the address to show the first 5 and last 3 characters
  return `${address}`;
}

const networkColors = {
  "Sepolia Testnet": '#627EEA',
  "Base Sepolia Testnet": '#00FFA3',
  "Doma Testnet": '#8247E5'
};

export function getChainNameAndCountArray(domains) {
  // Create a map to store chain names and their counts
  const chainCountMap = new Map();

  // Iterate through the domains
  domains.forEach(domain => {
    const chainName = domain.tokens[0].chain.name;

    // Update the count for the chain name
    if (chainCountMap.has(chainName)) {
      chainCountMap.set(chainName, chainCountMap.get(chainName) + 1);
    } else {
      chainCountMap.set(chainName, 1);
    }
  });

  // Convert the map to an array of objects
  const result = Array.from(chainCountMap).map(([name, value]) => ({
    name,
    color: networkColors[name] ?? networkColors["Doma Testnet"],
    value,
  }));

  return result;
}

export function getTotalActiveOffersCount(domains) {
  // Use reduce to sum up the activeOffersCount for all domains
  const totalActiveOffersCount = domains.reduce((total, domain) => {
    return total + (domain.activeOffersCount || 0); // Add the activeOffersCount (default to 0 if undefined)
  }, 0);

  return totalActiveOffersCount;
}

export function getPortfolioValueInUSD(domains) {
  // Sum up the USD value of all listings across all domains
  const totalPortfolioValueInUSD = domains.reduce((total, domain) => {
    // Check if domain has tokens and listings
    if (domain.tokens && domain.tokens.length > 0) {
      const domainValue = domain.tokens.reduce((tokenTotal, token) => {
        if (token.listings && token.listings.length > 0) {
          // Sum up all listings for this token
          const tokenValue = token.listings.reduce((listingTotal, listing) => {
            if (listing.currency && listing.currency.usdExchangeRate) {
              const usdValue = listing.currency.usdExchangeRate;
              return usdValue;
            }
            return listingTotal;
          }, 0);
          return tokenTotal + tokenValue;
        }
        return tokenTotal;
      }, 0);
      return total + domainValue;
    }
    return total;
  }, 0);

  return totalPortfolioValueInUSD;
}

export function getDomainsWithActiveOffers(domains) {
  // Filter domains where activeOffersCount > 0
  const domainsWithActiveOffers = domains.filter(domain => domain.activeOffersCount > 0);

  // Return the count of such domains
  return domainsWithActiveOffers.length;
}

export function getListedDomainsCount(domains) {
  // Filter domains where activeOffersCount > 0
  const domainsWithListings = domains.filter(domain => domain.tokens[0].listings.length > 0);

  // Return the count of such domains
  return domainsWithListings.length;
}