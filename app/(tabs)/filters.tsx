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
import { FilterItem } from "@/components/FilterItem";
import { AddFilterSheet } from "@/components/AddFilterSheet";
import { EmptyState } from "@/components/EmptyState";
import { useFilters } from "@/hooks/useFilters";
import { Colors, Spacing, BorderRadius, Elevation } from "@/constants/theme";

export default function FiltersScreen() {
  const { t } = useTranslation();
  const { filters, loading, refresh, add, remove, toggle } = useFilters();
  const [showAddSheet, setShowAddSheet] = useState(false);

  const handleDelete = useCallback(
    (filter: string) => {
      Alert.alert(
        t("filters.removeTitle"),
        t("filters.removeMessage", { filter }),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("common.remove"),
            style: "destructive",
            onPress: () => remove(filter),
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
        data={filters}
        keyExtractor={(item) => item.filter}
        renderItem={({ item }) => (
          <FilterItem
            entry={item}
            onToggle={toggle}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={
          filters.length === 0 ? styles.emptyContent : undefined
        }
        ListEmptyComponent={
          <EmptyState
            icon="filter-off-outline"
            title={t("filters.emptyTitle")}
            message={t("filters.emptyMessage")}
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

      <AddFilterSheet
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
