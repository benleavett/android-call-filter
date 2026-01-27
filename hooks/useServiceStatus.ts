import { useState, useEffect, useCallback } from "react";
import { AppState, type AppStateStatus } from "react-native";
import {
  isServiceEnabled,
  requestServiceEnable,
} from "@/modules/call-screening";

export function useServiceStatus() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      const result = await isServiceEnabled();
      setEnabled(result);
    } catch {
      setEnabled(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === "active") {
        checkStatus();
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [checkStatus]);

  const requestEnable = useCallback(async () => {
    await requestServiceEnable();
  }, []);

  return { enabled, loading, checkStatus, requestEnable };
}
