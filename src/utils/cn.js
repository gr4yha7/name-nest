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