import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import en from "./en.json";
import fr from "./fr.json";
import de from "./de.json";
import it from "./it.json";
import es from "./es.json";

const LANGUAGE_KEY = "app_language";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  es: { translation: es },
};

function getDeviceLanguage(): string {
  const locales = getLocales();
  const deviceLang = locales[0]?.languageCode ?? "en";
  return deviceLang in resources ? deviceLang : "en";
}

async function getStoredLanguage(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch {
    return null;
  }
}

export async function setLanguage(lang: string): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
}

export async function initI18n(): Promise<void> {
  const stored = await getStoredLanguage();
  const lang = stored ?? getDeviceLanguage();

  await i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
