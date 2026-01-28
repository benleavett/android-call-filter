import { NativeModule, requireOptionalNativeModule } from "expo";
import type { CallBlockedEvent } from "./CallScreening.types";

type CallScreeningEvents = {
  onCallBlocked(event: CallBlockedEvent): void;
};

declare class CallScreeningModuleType extends NativeModule<CallScreeningEvents> {
  syncPrefixes(json: string): Promise<void>;
  getCallLog(limit: number, offset: number): Promise<Array<Record<string, unknown>>>;
  clearCallLog(): Promise<void>;
  getCallLogStats(): Promise<Record<string, number>>;
  isServiceEnabled(): Promise<boolean>;
  requestServiceEnable(): Promise<boolean>;
}

export default requireOptionalNativeModule<CallScreeningModuleType>("CallScreening");
