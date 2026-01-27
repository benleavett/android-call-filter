import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { StatsCard } from "@/components/StatsCard";
import { CallLogItem } from "@/components/CallLogItem";
import { ServiceStatusBanner } from "@/components/ServiceStatusBanner";
import { EmptyState } from "@/components/EmptyState";
import { useServiceStatus } from "@/hooks/useServiceStatus";
import {
  getStats,
  getCallLog,
  type CallStats,
  type CallLogEntry,
} from "@/modules/call-screening";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const {
    enabled,
    loading: statusLoading,
    requestEnable,
  } = useServiceStatus();
  const [stats, setStats] = useState<CallStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<CallLogEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [statsResult, callsResult] = await Promise.all([
        getStats(),
        getCallLog(5, 0),
      ]);
      setStats(statsResult);
      setRecentCalls(callsResult);
    } catch {
      // Native module not available (e.g. Expo Go)
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[Colors.primary]}
        />
      }
    >
      <ServiceStatusBanner
        enabled={enabled}
        loading={statusLoading}
        onEnable={requestEnable}
      />

      <View style={styles.statsRow}>
        <StatsCard
          title={t("dashboard.totalFiltered")}
          value={stats?.totalFiltered ?? 0}
          icon="phone-off"
          color={Colors.primary}
        />
        <StatsCard
          title={t("dashboard.today")}
          value={stats?.todayCount ?? 0}
          icon="calendar-today"
          color={Colors.secondary}
        />
      </View>

      <View style={styles.statsRow}>
        <StatsCard
          title={t("dashboard.activeFilters")}
          value={stats?.activeFilters ?? 0}
          icon="filter-check"
          color={Colors.tertiary}
        />
        <View style={styles.spacer} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t("dashboard.recentActivity")}
        </Text>
        {recentCalls.length > 0 ? (
          <View style={styles.recentList}>
            {recentCalls.map((call) => (
              <CallLogItem key={call.id} entry={call} />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="phone-check-outline"
            title={t("dashboard.noRecentActivity")}
            message={t("dashboard.noRecentActivityDesc")}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 48,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  spacer: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onSurface,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  recentList: {
    backgroundColor: Colors.surfaceContainerLowest,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
});
