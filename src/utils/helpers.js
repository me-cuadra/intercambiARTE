import CryptoJS from 'crypto-js';

// Format dates for display
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // If it's already formatted like "May 21, 2023", return as is
  if (/[A-Za-z]+ \d{1,2}, \d{4}/.test(dateString)) {
    return dateString;
  }
  
  // Otherwise format the date
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Format wallet address for display
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Calculate SHA-256 hash for metadata
export const calculateSHA256Hash = (data) => {
  return CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
};

// Generate a random token ID for mock data
export const generateTokenId = () => {
  return `0x${CryptoJS.lib.WordArray.random(20).toString()}`;
};