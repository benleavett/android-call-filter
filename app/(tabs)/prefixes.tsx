import { useState, useCallback } from "react";
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
import { PrefixItem } from "@/components/PrefixItem";
import { AddPrefixSheet } from "@/components/AddPrefixSheet";
import { EmptyState } from "@/components/EmptyState";
import { usePrefixes } from "@/hooks/usePrefixes";
import { Colors, Spacing, BorderRadius, Elevation } from "@/constants/theme";

export default function PrefixesScreen() {
  const { t } = useTranslation();
  const { prefixes, loading, refresh, add, remove, toggle } = usePrefixes();
  const [showAddSheet, setShowAddSheet] = useState(false);

  const handleDelete = useCallback(
    (prefix: string) => {
      Alert.alert(
        t("prefixes.removeTitle"),
        t("prefixes.removeMessage", { prefix }),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("common.remove"),
            style: "destructive",
            onPress: () => remove(prefix),
          },
        ]
      );
    },
    [remove, t]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={prefixes}
        keyExtractor={(item) => item.prefix}
        renderItem={({ item }) => (
          <PrefixItem
            entry={item}
            onToggle={toggle}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={
          prefixes.length === 0 ? styles.emptyContent : undefined
        }
        ListEmptyComponent={
          <EmptyState
            icon="filter-off-outline"
            title={t("prefixes.emptyTitle")}
            message={t("prefixes.emptyMessage")}
          />
        }
        refreshing={false}
        onRefresh={refresh}
      />

      <Pressable
        style={styles.fab}
        onPress={() => setShowAddSheet(true)}
      >
        <MaterialCommunityIcons name="plus" size={24} color={Colors.onPrimary} />
      </Pressable>

      <AddPrefixSheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAdd={add}
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
  fab: {
    position: "absolute",
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Elevation.level2,
  },
});
