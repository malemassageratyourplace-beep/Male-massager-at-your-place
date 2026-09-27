/**
 * Utility functions for parsing and rendering customer GPS coordinates and address blocks.
 */

/**
 * Extracts a high-precision Google Maps query link from any address text.
 */
export const extractMapsUrl = (address: string): string | null => {
  if (!address) return null;
  const match = address.match(/https:\/\/www\.google\.com\/maps\?q=[-?\d.]+,[-?\d.]+/);
  return match ? match[0] : null;
};

/**
 * Extracts GPS coordinates as numeric latitude and longitude.
 */
export const extractGPSCoordinates = (address: string): [number, number] | null => {
  if (!address) return null;
  const match = address.match(/GPS Coordinates:\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
  }
  return null;
};

/**
 * Cleans technical coordinates and URLs out of the address text for pristine, readable UI display.
 */
export const getCleanAddress = (address: string): string => {
  if (!address) return '';
  return address
    .replace(/,\s*GPS Coordinates:\s*[-?\d.]+\s*,\s*[-?\d.]+/, '')
    .replace(/,\s*Google Maps Link:\s*https:\/\/www\.google\.com\/maps\?q=[-?\d.]+,[-?\d.]+/, '');
};
