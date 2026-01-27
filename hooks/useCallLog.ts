import { useState, useEffect, useCallback } from "react";
import {
  getCallLog,
  clearCallLog,
  type CallLogEntry,
} from "@/modules/call-screening";

const PAGE_SIZE = 30;

export function useCallLog() {
  const [entries, setEntries] = useState<CallLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const result = await getCallLog(PAGE_SIZE, 0);
      setEntries(result);
      setHasMore(result.length === PAGE_SIZE);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load call log");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    try {
      const result = await getCallLog(PAGE_SIZE, entries.length);
      setEntries((prev) => [...prev, ...result]);
      setHasMore(result.length === PAGE_SIZE);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load more");
    }
  }, [entries.length, hasMore, loading]);

  const clear = useCallback(async () => {
    await clearCallLog();
    setEntries([]);
    setHasMore(false);
  }, []);

  return {
    entries,
    loading,
    refreshing,
    hasMore,
    error,
    refresh,
    loadMore,
    clear,
  };
}
