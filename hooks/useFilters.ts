import { useState, useEffect, useCallback } from "react";
import {
  getFilters,
  addFilter,
  removeFilter,
  toggleFilter,
  type FilterEntry,
} from "@/modules/call-screening";

export function useFilters() {
  const [filters, setFilters] = useState<FilterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getFilters();
      setFilters(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load filters");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (filter: string, label: string = "", countryCode: string = "") => {
      const success = await addFilter(filter, label, countryCode);
      if (success) await refresh();
      return success;
    },
    [refresh]
  );

  const remove = useCallback(
    async (filter: string) => {
      // Optimistic update
      setFilters((prev) => prev.filter((e) => e.filter !== filter));
      const success = await removeFilter(filter);
      if (!success) await refresh();
      return success;
    },
    [refresh]
  );

  const toggle = useCallback(
    async (filter: string, enabled: boolean) => {
      // Optimistic update — flip locally first, no flicker
      setFilters((prev) =>
        prev.map((e) => (e.filter === filter ? { ...e, enabled } : e))
      );
      const success = await toggleFilter(filter, enabled);
      if (!success) await refresh();
      return success;
    },
    [refresh]
  );

  return { filters, loading, error, refresh, add, remove, toggle };
}
