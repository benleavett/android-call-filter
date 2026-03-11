import { useState, useEffect, useCallback } from "react";
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { setLanguage } from "@/i18n";
import {
  COUNTRIES,
  getCountryPreference,
  setCountryPreference,
} from "@/constants/countryCodes";
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from "@/constants/legalDocs";
import { LegalModal } from "@/components/LegalModal";
import { Colors, Spacing, BorderRadius, Fonts } from "@/constants/theme";

const LANGUAGES = [
  { code: "en", labelKey: "settings.english", flag: "EN" },
  { code: "fr", labelKey: "settings.french", flag: "FR" },
  { code: "de", labelKey: "settings.german", flag: "DE" },
  { code: "it", labelKey: "settings.italian", flag: "IT" },
  { code: "es", labelKey: "settings.spanish", flag: "ES" },
];

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const [selectedCountry, setSelectedCountry] = useState("FR");
  const [countryOpen, setCountryOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);

  useEffect(() => {
    getCountryPreference().then(setSelectedCountry);
  }, []);

  const handleLanguageChange = async (code: string) => {
    await setLanguage(code);
    setLanguageOpen(false);
  };

  const handleCountryChange = useCallback(async (region: string) => {
    setSelectedCountry(region);
    setCountryOpen(false);
    await setCountryPreference(region);
  }, []);

  const selectedCountryData = COUNTRIES.find((c) => c.region === selectedCountry);
  const selectedLang = LANGUAGES.find((l) => l.code === currentLanguage);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Country dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.country")}</Text>
          <Text style={styles.sectionDescription}>
            {t("settings.countryDesc")}
          </Text>
          <Pressable
            style={[styles.dropdownTrigger, countryOpen && styles.dropdownTriggerOpen]}
            onPress={() => {
              setCountryOpen((v) => !v);
              setLanguageOpen(false);
            }}
          >
            <Text style={styles.triggerFlag}>
              {selectedCountryData?.region ?? "FR"}
            </Text>
            <Text style={styles.triggerLabel} numberOfLines={1}>
              {t(`settings.countries.${selectedCountry}`)}
            </Text>
            <Text style={styles.triggerDetail}>
              {selectedCountryData?.dialCode ?? "+33"}
            </Text>
            <MaterialCommunityIcons
              name={countryOpen ? "chevron-up" : "chevron-down"}
              size={22}
              color={Colors.onSurfaceVariant}
            />
          </Pressable>
          {countryOpen && (
            <ScrollView style={styles.dropdownList} nestedScrollEnabled>
              {COUNTRIES.map((country) => {
                const isActive = selectedCountry === country.region;
                return (
                  <Pressable
                    key={country.region}
                    style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                    onPress={() => handleCountryChange(country.region)}
                  >
                    <Text style={styles.itemFlag}>{country.region}</Text>
                    <Text
                      style={[styles.itemLabel, isActive && styles.itemLabelActive]}
                      numberOfLines={1}
                    >
                      {t(`settings.countries.${country.region}`)}
                    </Text>
                    <Text style={[styles.itemDetail, isActive && styles.itemDetailActive]}>
                      {country.dialCode}
                    </Text>
                    {isActive && (
                      <MaterialCommunityIcons
                        name="check"
                        size={18}
                        color={Colors.primary}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Language dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
          <Text style={styles.sectionDescription}>
            {t("settings.languageDesc")}
          </Text>
          <Pressable
            style={[styles.dropdownTrigger, languageOpen && styles.dropdownTriggerOpen]}
            onPress={() => {
              setLanguageOpen((v) => !v);
              setCountryOpen(false);
            }}
          >
            <Text style={styles.triggerFlag}>{selectedLang?.flag ?? "EN"}</Text>
            <Text style={styles.triggerLabel}>
              {selectedLang ? t(selectedLang.labelKey) : "English"}
            </Text>
            <MaterialCommunityIcons
              name={languageOpen ? "chevron-up" : "chevron-down"}
              size={22}
              color={Colors.onSurfaceVariant}
            />
          </Pressable>
          {languageOpen && (
            <View style={styles.dropdownList}>
              {LANGUAGES.map((lang) => {
                const isActive = currentLanguage === lang.code;
                return (
                  <Pressable
                    key={lang.code}
                    style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                    onPress={() => handleLanguageChange(lang.code)}
                  >
                    <Text style={styles.itemFlag}>{lang.flag}</Text>
                    <Text
                      style={[styles.itemLabel, isActive && styles.itemLabelActive]}
                    >
                      {t(lang.labelKey)}
                    </Text>
                    {isActive && (
                      <MaterialCommunityIcons
                        name="check"
                        size={18}
                        color={Colors.primary}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.about")}</Text>
          <View style={styles.aboutCard}>
            <View style={styles.aboutRow}>
              <Image
                source={require("@/assets/logo_512.png")}
                style={styles.aboutLogo}
              />
              <View style={styles.aboutText}>
                <Text style={styles.appName}>{t("settings.appName")}</Text>
                <Text style={styles.version}>
                  {t("settings.version")} {appVersion}
                </Text>
              </View>
            </View>

            <View style={styles.legalLinks}>
              <Pressable
                style={styles.legalRow}
                onPress={() => setLegalModal("privacy")}
              >
                <MaterialCommunityIcons
                  name="shield-account-outline"
                  size={18}
                  color={Colors.onSurfaceVariant}
                />
                <Text style={styles.legalText}>{t("settings.privacyPolicy")}</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color={Colors.outline}
                />
              </Pressable>

              <View style={styles.legalDivider} />

              <Pressable
                style={styles.legalRow}
                onPress={() => setLegalModal("terms")}
              >
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={18}
                  color={Colors.onSurfaceVariant}
                />
                <Text style={styles.legalText}>{t("settings.termsConditions")}</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color={Colors.outline}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <LegalModal
        visible={legalModal === "privacy"}
        title={t("settings.privacyPolicy")}
        content={PRIVACY_POLICY}
        onClose={() => setLegalModal(null)}
      />
      <LegalModal
        visible={legalModal === "terms"}
        title={t("settings.termsConditions")}
        content={TERMS_AND_CONDITIONS}
        onClose={() => setLegalModal(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 48,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.md,
  },

  /* Dropdown trigger (collapsed row) */
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    gap: Spacing.md,
  },
  dropdownTriggerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: Colors.outlineVariant,
  },
  triggerFlag: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.onSurfaceVariant,
    width: 28,
    textAlign: "center",
  },
  triggerLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.onSurface,
  },
  triggerDetail: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.onSurfaceVariant,
  },

  /* Dropdown options list */
  dropdownList: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: Colors.outlineVariant,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
    maxHeight: 260,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.outlineVariant,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primaryContainer + "30",
  },
  itemFlag: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.onSurfaceVariant,
    width: 28,
    textAlign: "center",
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.onSurface,
  },
  itemLabelActive: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
  },
  itemDetail: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.medium,
  },
  itemDetailActive: {
    color: Colors.primary,
  },

  /* About card */
  aboutCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: "hidden",
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
  },
  aboutLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  aboutText: {
    flex: 1,
  },
  appName: {
    fontSize: 17,
    fontFamily: Fonts.semiBold,
    color: Colors.onSurface,
  },
  version: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },

  /* Legal links */
  legalLinks: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.outlineVariant,
  },
  legalDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.outlineVariant,
    marginLeft: Spacing.md + 18 + Spacing.sm,
  },
  legalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
  },
  legalText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.onSurface,
  },
});
