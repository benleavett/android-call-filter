import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

interface ServiceStatusBannerProps {
  enabled: boolean | null;
  loading: boolean;
  onEnable: () => void;
}

export function ServiceStatusBanner({
  enabled,
  loading,
  onEnable,
}: ServiceStatusBannerProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={[styles.banner, styles.loadingBanner]}>
        <ActivityIndicator size="small" color={Colors.outline} />
      </View>
    );
  }

  if (enabled) {
    return (
      <View style={[styles.banner, styles.activeBanner]}>
        <MaterialCommunityIcons
          name="shield-check"
          size={20}
          color={Colors.success}
        />
        <Text style={[styles.text, styles.activeText]}>
          {t("service.active")}
        </Text>
      </View>
    );
  }

  return (
    <Pressable style={[styles.banner, styles.inactiveBanner]} onPress={onEnable}>
      <View style={styles.inactiveContent}>
        <MaterialCommunityIcons
          name="shield-alert-outline"
          size={20}
          color={Colors.warning}
        />
        <View style={styles.inactiveTextContainer}>
          <Text style={[styles.text, styles.inactiveText]}>
            {t("service.inactive")}
          </Text>
          <Text style={styles.description}>
            {t("service.enableDesc")}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={Colors.warning}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  loadingBanner: {
    backgroundColor: Colors.surfaceVariant,
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  activeBanner: {
    backgroundColor: Colors.successContainer,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  inactiveBanner: {
    backgroundColor: Colors.warningContainer,
  },
  inactiveContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  inactiveTextContainer: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeText: {
    color: Colors.success,
  },
  inactiveText: {
    color: Colors.warning,
  },
  description: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  enableButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  enableButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.onPrimary,
  },
});
