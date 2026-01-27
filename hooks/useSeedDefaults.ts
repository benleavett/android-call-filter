import AsyncStorage from "@react-native-async-storage/async-storage";
import { addFilter, getFilters } from "@/modules/call-screening";
import { DEFAULT_FILTERS_FR } from "@/constants/defaults";

const SEEDED_KEY = "defaults_seeded_v3";

export async function seedDefaultFilters(): Promise<void> {
  const alreadySeeded = await AsyncStorage.getItem(SEEDED_KEY);
  if (alreadySeeded) {
    const existing = await getFilters();
    if (existing.length > 0) return;
  }

  for (const entry of DEFAULT_FILTERS_FR) {
    await addFilter(entry.filter, entry.label, entry.countryCode);
  }

  await AsyncStorage.setItem(SEEDED_KEY, "1");
}
