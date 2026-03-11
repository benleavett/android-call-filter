import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { Colors, Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { usePostHog } from "posthog-react-native";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();
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
      posthog.capture("call_filtered");
    });
    return () => {
      subscription?.remove();
    };
  }, [loadData]);

  const handleEnablePress = useCallback(() => {
    Alert.alert(
      t("service.enableTitle"),
      t("service.enableInstructions"),
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("service.continue"), onPress: requestEnable },
      ]
    );
  }, [requestEnable, t]);

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
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Image source={require("@/assets/logo_512.png")} style={styles.logo} />
        <Text style={styles.appName}>{t("settings.appName")}</Text>
      </View>

      <ServiceStatusBanner
        enabled={enabled}
        loading={statusLoading}
        onEnable={handleEnablePress}
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
  header: {
    alignItems: "center",
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  appName: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.onSurface,
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
    fontFamily: Fonts.semiBold,
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
