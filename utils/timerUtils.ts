/**
 * timerUtils.ts
 * Utility functions for timer formatting and calculations
 */

/** Format seconds → "MM:SS" */
export const formatTime = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/** Returns progress 0–1 for the arc */
export const calcProgress = (
  currentSeconds: number,
  totalSeconds: number
): number => {
  if (totalSeconds === 0) return 0;
  return 1 - currentSeconds / totalSeconds;
};

/** Returns a human-friendly label for the phase */
export const phaseLabel = (phase: string): string => {
  switch (phase) {
    case 'focus':       return 'Focus Session';
    case 'short_break': return 'Short Break';
    case 'long_break':  return 'Long Break';
    default:            return '';
  }
};

/** Converts minutes to a display string like "1h 25m" */
export const minsToDisplay = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

/** Get the last 7 days as YYYY-MM-DD strings, newest last */
export const getLast7Days = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
};

/** Short day label for chart axis */
export const shortDay = (dateStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00');
  return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()];
};
