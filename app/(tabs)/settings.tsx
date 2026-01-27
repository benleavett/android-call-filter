import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { setLanguage } from "@/i18n";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

const LANGUAGES = [
  { code: "en", labelKey: "settings.english", flag: "EN" },
  { code: "fr", labelKey: "settings.french", flag: "FR" },
];

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const handleLanguageChange = async (code: string) => {
    await setLanguage(code);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
        <Text style={styles.sectionDescription}>
          {t("settings.languageDesc")}
        </Text>
        <View style={styles.languageOptions}>
          {LANGUAGES.map((lang) => {
            const isActive = currentLanguage === lang.code;
            return (
              <Pressable
                key={lang.code}
                style={[
                  styles.languageOption,
                  isActive && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.languageLabel,
                    isActive && styles.languageLabelActive,
                  ]}
                >
                  {t(lang.labelKey)}
                </Text>
                {isActive && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={Colors.primary}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("settings.about")}</Text>
        <View style={styles.aboutCard}>
          <View style={styles.aboutRow}>
            <MaterialCommunityIcons
              name="phone-off"
              size={32}
              color={Colors.primary}
            />
            <View style={styles.aboutText}>
              <Text style={styles.appName}>{t("settings.appName")}</Text>
              <Text style={styles.version}>
                {t("settings.version")} {appVersion}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.md,
  },
  languageOptions: {
    gap: Spacing.sm,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    gap: Spacing.md,
  },
  languageOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer + "30",
  },
  flag: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.onSurfaceVariant,
    width: 28,
    textAlign: "center",
  },
  languageLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: Colors.onSurface,
  },
  languageLabelActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  aboutCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  aboutText: {
    flex: 1,
  },
  appName: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  version: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
});
