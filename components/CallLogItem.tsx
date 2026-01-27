import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { CallLogEntry } from "@/modules/call-screening";

interface CallLogItemProps {
  entry: CallLogEntry;
}

function formatRelativeTime(timestamp: number, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t("callLog.justNow");
  if (minutes < 60) return t("callLog.minutesAgo", { count: minutes });
  if (hours < 24) return t("callLog.hoursAgo", { count: hours });
  if (days === 1) return t("callLog.yesterday");
  if (days < 30) return t("callLog.daysAgo", { count: days });

  return new Date(timestamp).toLocaleDateString();
}

export function CallLogItem({ entry }: CallLogItemProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="phone-off"
          size={20}
          color={Colors.error}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.phoneNumber} numberOfLines={1}>
          {entry.phoneNumber}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.filterBadge}>
            <Text style={styles.filterText}>
              {t("callLog.matchedFilter", { filter: entry.matchedFilter })}
            </Text>
          </View>
          <Text style={styles.timestamp}>
            {formatRelativeTime(entry.timestamp, t)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.errorContainer,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onSurface,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  filterBadge: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  filterText: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.onPrimaryContainer,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
});
