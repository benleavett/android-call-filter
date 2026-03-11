import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { getSimCountryCode } from "@/modules/call-screening";

const COUNTRY_PREF_KEY = "country_preference";

export interface Country {
  region: string;
  dialCode: string;
}

export const COUNTRIES: Country[] = [
  { region: "FR", dialCode: "+33" },
  { region: "GB", dialCode: "+44" },
  { region: "US", dialCode: "+1" },
  { region: "CA", dialCode: "+1" },
  { region: "DE", dialCode: "+49" },
  { region: "ES", dialCode: "+34" },
  { region: "IT", dialCode: "+39" },
  { region: "PT", dialCode: "+351" },
  { region: "BE", dialCode: "+32" },
  { region: "CH", dialCode: "+41" },
  { region: "NL", dialCode: "+31" },
  { region: "AU", dialCode: "+61" },
  { region: "NZ", dialCode: "+64" },
  { region: "JP", dialCode: "+81" },
  { region: "CN", dialCode: "+86" },
  { region: "IN", dialCode: "+91" },
  { region: "BR", dialCode: "+55" },
  { region: "MX", dialCode: "+52" },
  { region: "SE", dialCode: "+46" },
  { region: "NO", dialCode: "+47" },
  { region: "DK", dialCode: "+45" },
  { region: "FI", dialCode: "+358" },
  { region: "IE", dialCode: "+353" },
  { region: "AT", dialCode: "+43" },
  { region: "PL", dialCode: "+48" },
];

const KNOWN_REGIONS = new Set(COUNTRIES.map((c) => c.region));

const DIAL_CODE_MAP: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.region, c.dialCode])
);

function getLocaleRegion(): string {
  const locales = getLocales();
  return locales[0]?.regionCode ?? "FR";
}

/**
 * Determine the best default country region:
 * 1. SIM card country (most accurate)
 * 2. Device locale region
 * 3. Fallback to FR
 */
async function getDeviceRegion(): Promise<string> {
  try {
    const simRegion = await getSimCountryCode();
    if (simRegion && KNOWN_REGIONS.has(simRegion)) return simRegion;
  } catch {
    // native module unavailable (Expo Go)
  }
  const localeRegion = getLocaleRegion();
  return KNOWN_REGIONS.has(localeRegion) ? localeRegion : "FR";
}

/** Get the stored country region code, falling back to SIM then locale. */
export async function getCountryPreference(): Promise<string> {
  const stored = await AsyncStorage.getItem(COUNTRY_PREF_KEY);
  if (stored) return stored;
  return getDeviceRegion();
}

/** Persist the chosen country region code. */
export async function setCountryPreference(region: string): Promise<void> {
  await AsyncStorage.setItem(COUNTRY_PREF_KEY, region);
}

/** Get the dial code for a region code. */
export function getDialCode(region: string): string {
  return DIAL_CODE_MAP[region] ?? "+33";
}

/** Get the dial code for the stored country preference. */
export async function getPreferredDialCode(): Promise<string> {
  const region = await getCountryPreference();
  return getDialCode(region);
}
