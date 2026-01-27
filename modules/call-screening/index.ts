import AsyncStorage from "@react-native-async-storage/async-storage";
import CallScreeningModule from "./src/CallScreeningModule";
import type {
  FilterEntry,
  CallLogEntry,
  CallStats,
} from "./src/CallScreening.types";

export type { FilterEntry, CallLogEntry, CallStats };

const native = CallScreeningModule;

// ---------------------------------------------------------------------------
// Filters — always stored in AsyncStorage (single code path).
// After every mutation we sync to native SharedPreferences so the
// CallFilterService can read them without the JS runtime.
// ---------------------------------------------------------------------------

const FILTERS_KEY = "call_filter_entries";

async function syncToNative(entries: FilterEntry[]): Promise<void> {
  if (native) {
    await native.syncPrefixes(JSON.stringify(entries));
  }
}

export async function getFilters(): Promise<FilterEntry[]> {
  const raw = await AsyncStorage.getItem(FILTERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addFilter(
  filter: string,
  label: string = "",
  countryCode: string = ""
): Promise<boolean> {
  const entries = await getFilters();
  if (entries.some((e) => e.filter === filter && e.countryCode === countryCode))
    return false;
  entries.push({
    filter,
    label,
    countryCode,
    enabled: true,
    createdAt: Date.now(),
  });
  await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(entries));
  await syncToNative(entries);
  return true;
}

export async function removeFilter(filter: string): Promise<boolean> {
  const entries = await getFilters();
  const filtered = entries.filter((e) => e.filter !== filter);
  if (filtered.length === entries.length) return false;
  await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(filtered));
  await syncToNative(filtered);
  return true;
}

export async function toggleFilter(
  filter: string,
  enabled: boolean
): Promise<boolean> {
  const entries = await getFilters();
  const entry = entries.find((e) => e.filter === filter);
  if (!entry) return false;
  entry.enabled = enabled;
  await AsyncStorage.setItem(FILTERS_KEY, JSON.stringify(entries));
  await syncToNative(entries);
  return true;
}

// ---------------------------------------------------------------------------
// Call log — only populated by the native CallFilterService.
// ---------------------------------------------------------------------------

export async function getCallLog(
  limit: number = 50,
  offset: number = 0
): Promise<CallLogEntry[]> {
  if (!native) return [];
  const raw = await native.getCallLog(limit, offset);
  return raw as unknown as CallLogEntry[];
}

export async function clearCallLog(): Promise<void> {
  if (!native) return;
  await native.clearCallLog();
}

// ---------------------------------------------------------------------------
// Stats — filter counts from AsyncStorage, call log counts from native.
// ---------------------------------------------------------------------------

export async function getStats(): Promise<CallStats> {
  const filters = await getFilters();

  let totalFiltered = 0;
  let todayCount = 0;
  if (native) {
    const logStats = await native.getCallLogStats();
    totalFiltered = (logStats as Record<string, number>).totalFiltered ?? 0;
    todayCount = (logStats as Record<string, number>).todayCount ?? 0;
  }

  return {
    totalFiltered,
    todayCount,
    activeFilters: filters.filter((f) => f.enabled).length,
    totalFilters: filters.length,
  };
}

// ---------------------------------------------------------------------------
// Service status — native only.
// ---------------------------------------------------------------------------

export async function isServiceEnabled(): Promise<boolean> {
  if (!native) return false;
  return native.isServiceEnabled();
}

export async function requestServiceEnable(): Promise<boolean> {
  if (!native) return false;
  return native.requestServiceEnable();
}
