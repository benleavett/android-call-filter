import { useCallback } from "react";
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useFocusEffect, Stack } from "expo-router";
import { CallLogItem } from "@/components/CallLogItem";
import { EmptyState } from "@/components/EmptyState";
import { useCallLog } from "@/hooks/useCallLog";
import { Colors, Spacing } from "@/constants/theme";

export default function CallLogScreen() {
  const { t } = useTranslation();
  const {
    entries,
    loading,
    refreshing,
    hasMore,
    refresh,
    loadMore,
    clear,
  } = useCallLog();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleClear = useCallback(() => {
    Alert.alert(
      t("callLog.clearTitle"),
      t("callLog.clearMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.clear"),
          style: "destructive",
          onPress: clear,
        },
      ]
    );
  }, [clear, t]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () =>
            entries.length > 0 ? (
              <Pressable onPress={handleClear} hitSlop={8}>
                <MaterialCommunityIcons
                  name="delete-sweep-outline"
                  size={24}
                  color={Colors.onSurfaceVariant}
                />
              </Pressable>
            ) : null,
        }}
      />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CallLogItem entry={item} />}
        contentContainerStyle={
          entries.length === 0 ? styles.emptyContent : undefined
        }
        ListEmptyComponent={
          <EmptyState
            icon="phone-check-outline"
            title={t("callLog.emptyTitle")}
            message={t("callLog.emptyMessage")}
          />
        }
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore && entries.length > 0 ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  emptyContent: {
    flex: 1,
  },
  footer: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
  },
});
