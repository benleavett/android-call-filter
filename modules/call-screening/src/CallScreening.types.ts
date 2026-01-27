export interface FilterEntry {
  filter: string;
  label: string;
  countryCode: string;
  enabled: boolean;
  createdAt: number;
}

export interface CallLogEntry {
  id: number;
  phoneNumber: string;
  matchedFilter: string;
  timestamp: number;
  callDirection: string;
}

export interface CallStats {
  totalFiltered: number;
  todayCount: number;
  activeFilters: number;
  totalFilters: number;
}
