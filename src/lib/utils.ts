
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const validDate = new Date(date);

  if (isNaN(validDate.getTime())) {
    return 'Invalid Date';
  }

  const day = validDate.getDate();
  const month = validDate.toLocaleString('en-US', { month: 'short' });
  const weekday = validDate.toLocaleString('en-US', { weekday: 'short' });
  const year = validDate.getFullYear();

  // Get ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (n: number): string => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  return `${weekday}, ${dayWithSuffix} ${month} ${year}`;
}


export function formatTime(date: Date | string): string {
  const validDate = new Date(date);

  if (isNaN(validDate.getTime())) {
    return 'Invalid Time';
  }

  return validDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}


// Calculate Net Run Rate (simplified example)
export function calculateNRR(runsScored: number, oversPlayed: number, runsConceded: number, oversBowled: number): number {
  const runRateScored = runsScored / oversPlayed;
  const runRateConceded = runsConceded / oversBowled;
  
  return parseFloat((runRateScored - runRateConceded).toFixed(3));
}
