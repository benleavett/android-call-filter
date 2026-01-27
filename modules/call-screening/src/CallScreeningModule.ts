import { NativeModule, requireOptionalNativeModule } from "expo";

declare class CallScreeningModuleType extends NativeModule {
  syncPrefixes(json: string): Promise<void>;
  getCallLog(limit: number, offset: number): Promise<Array<Record<string, unknown>>>;
  clearCallLog(): Promise<void>;
  getCallLogStats(): Promise<Record<string, number>>;
  isServiceEnabled(): Promise<boolean>;
  requestServiceEnable(): Promise<boolean>;
}

export default requireOptionalNativeModule<CallScreeningModuleType>("CallScreening");
