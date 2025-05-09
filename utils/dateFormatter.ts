/**
 * Format a date as "DD Month YY" (e.g., "09 May 24")
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear().toString().slice(2);
  
  return `${day} ${month}, ${year}`;
}