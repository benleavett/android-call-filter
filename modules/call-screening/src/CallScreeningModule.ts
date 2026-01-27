import { NativeModule, requireNativeModule } from "expo";

declare class CallScreeningModuleType extends NativeModule {
  getPrefixes(): Promise<Array<Record<string, unknown>>>;
  addPrefix(prefix: string, label: string): Promise<boolean>;
  removePrefix(prefix: string): Promise<boolean>;
  togglePrefix(prefix: string, enabled: boolean): Promise<boolean>;
  getCallLog(limit: number, offset: number): Promise<Array<Record<string, unknown>>>;
  clearCallLog(): Promise<void>;
  getStats(): Promise<Record<string, unknown>>;
  isServiceEnabled(): Promise<boolean>;
  requestServiceEnable(): Promise<boolean>;
}

export default requireNativeModule<CallScreeningModuleType>("CallScreening");
