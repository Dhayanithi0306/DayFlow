/**
 * Formats integer minutes into human-readable duration (e.g. 485 -> "8h 5m")
 */
export const formatMinutes = (minutes?: number | null): string => {
  if (!minutes || minutes <= 0) return '0h 0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
};

/**
 * Formats ISO timestamp string to time string (e.g. 09:30 AM)
 */
export const formatTime = (isoString?: string | Date | null): string => {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

/**
 * Formats ISO timestamp or Date to readable date (e.g. Aug 22, 2026)
 */
export const formatDate = (isoString?: string | Date | null): string => {
  if (!isoString) return '--';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '--';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};
