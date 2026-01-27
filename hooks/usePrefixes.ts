import { useState, useEffect, useCallback } from "react";
import {
  getPrefixes,
  addPrefix,
  removePrefix,
  togglePrefix,
  type PrefixEntry,
} from "@/modules/call-screening";

export function usePrefixes() {
  const [prefixes, setPrefixes] = useState<PrefixEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getPrefixes();
      setPrefixes(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load prefixes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (prefix: string, label: string = "") => {
      const success = await addPrefix(prefix, label);
      if (success) await refresh();
      return success;
    },
    [refresh]
  );

  const remove = useCallback(
    async (prefix: string) => {
      const success = await removePrefix(prefix);
      if (success) await refresh();
      return success;
    },
    [refresh]
  );

  const toggle = useCallback(
    async (prefix: string, enabled: boolean) => {
      const success = await togglePrefix(prefix, enabled);
      if (success) await refresh();
      return success;
    },
    [refresh]
  );

  return { prefixes, loading, error, refresh, add, remove, toggle };
}
