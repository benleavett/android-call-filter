import CallScreeningModule from "./src/CallScreeningModule";
import type {
  PrefixEntry,
  CallLogEntry,
  CallStats,
} from "./src/CallScreening.types";

export type { PrefixEntry, CallLogEntry, CallStats };

export async function getPrefixes(): Promise<PrefixEntry[]> {
  const raw = await CallScreeningModule.getPrefixes();
  return raw as unknown as PrefixEntry[];
}

export async function addPrefix(
  prefix: string,
  label: string = ""
): Promise<boolean> {
  return CallScreeningModule.addPrefix(prefix, label);
}

export async function removePrefix(prefix: string): Promise<boolean> {
  return CallScreeningModule.removePrefix(prefix);
}

export async function togglePrefix(
  prefix: string,
  enabled: boolean
): Promise<boolean> {
  return CallScreeningModule.togglePrefix(prefix, enabled);
}

export async function getCallLog(
  limit: number = 50,
  offset: number = 0
): Promise<CallLogEntry[]> {
  const raw = await CallScreeningModule.getCallLog(limit, offset);
  return raw as unknown as CallLogEntry[];
}

export async function clearCallLog(): Promise<void> {
  return CallScreeningModule.clearCallLog();
}

export async function getStats(): Promise<CallStats> {
  const raw = await CallScreeningModule.getStats();
  return raw as unknown as CallStats;
}

export async function isServiceEnabled(): Promise<boolean> {
  return CallScreeningModule.isServiceEnabled();
}

export async function requestServiceEnable(): Promise<boolean> {
  return CallScreeningModule.requestServiceEnable();
}
