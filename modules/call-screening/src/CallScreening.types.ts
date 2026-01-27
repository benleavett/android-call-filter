export interface PrefixEntry {
  prefix: string;
  label: string;
  enabled: boolean;
  createdAt: number;
}

export interface CallLogEntry {
  id: number;
  phoneNumber: string;
  matchedPrefix: string;
  timestamp: number;
  callDirection: string;
}

export interface CallStats {
  totalFiltered: number;
  todayCount: number;
  activePrefixes: number;
  totalPrefixes: number;
}
