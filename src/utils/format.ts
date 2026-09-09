/**
 * Utility functions for formatting values across the application.
 */

/**
 * Formats a distance in meters to a human-readable string in Thai.
 * - Under 1,000 meters: displays in meters (e.g., "800 เมตร")
 * - 1,000 meters and above: displays in kilometers with 1 decimal place (e.g., "1.2 กิโลเมตร")
 *
 * @param meters Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} กิโลเมตร`;
  }
  return `${meters} เมตร`;
}
