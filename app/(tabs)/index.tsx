import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StatsCard } from "@/components/StatsCard";
import { CallLogItem } from "@/components/CallLogItem";
import { BlockedCallCard } from "@/components/BlockedCallCard";
import { ServiceStatusBanner } from "@/components/ServiceStatusBanner";
import { EmptyState } from "@/components/EmptyState";
import { useServiceStatus } from "@/hooks/useServiceStatus";
import {
  getStats,
  getCallLog,
  addCallBlockedListener,
  type CallStats,
  type CallLogEntry,
  type CallBlockedEvent,
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
  const [blockedCall, setBlockedCall] = useState<CallBlockedEvent | null>(null);

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

  useEffect(() => {
    const subscription = addCallBlockedListener((event) => {
      setBlockedCall(event);
      loadData(); // refresh stats & recent calls
    });
    return () => {
      subscription?.remove();
    };
  }, [loadData]);

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

      {blockedCall ? (
        <BlockedCallCard
          phoneNumber={blockedCall.phoneNumber}
          matchedFilter={blockedCall.matchedFilter}
          onDismiss={() => setBlockedCall(null)}
        />
      ) : null}

      <View style={styles.statsList}>
        <StatsCard
          title={t("dashboard.totalFiltered")}
          value={stats?.totalFiltered ?? 0}
          icon="phone-off"
          color={Colors.primary}
          onPress={() => router.navigate("/log")}
        />
        <StatsCard
          title={t("dashboard.today")}
          value={stats?.todayCount ?? 0}
          icon="calendar-today"
          color={Colors.secondary}
          onPress={() => router.navigate("/log")}
        />
        <StatsCard
          title={t("dashboard.activeFilters")}
          value={stats?.activeFilters ?? 0}
          icon="filter-check"
          color={Colors.tertiary}
          onPress={() => router.navigate("/filters")}
        />
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
  statsList: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
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
