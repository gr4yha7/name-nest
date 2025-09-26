import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
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

export function getDomainsWithActiveOffers(domains) {
  // Filter domains where activeOffersCount > 0
  const domainsWithActiveOffers = domains.filter(domain => domain.activeOffersCount > 0);

  // Return the count of such domains
  return domainsWithActiveOffers.length;
}