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