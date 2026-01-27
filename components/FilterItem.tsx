import { View, Text, Switch, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { FilterEntry } from "@/modules/call-screening";

interface FilterItemProps {
  entry: FilterEntry;
  onToggle: (filter: string, enabled: boolean) => void;
  onDelete: (filter: string) => void;
}

export function FilterItem({ entry, onToggle, onDelete }: FilterItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="phone-outline"
            size={20}
            color={entry.enabled ? Colors.primary : Colors.outline}
          />
        </View>
        <View style={styles.textSection}>
          <Text
            style={[styles.filter, !entry.enabled && styles.disabledText]}
            numberOfLines={1}
          >
            {entry.countryCode ? `${entry.countryCode} ${entry.filter}` : entry.filter}
          </Text>
          {entry.label ? (
            <Text
              style={[styles.label, !entry.enabled && styles.disabledText]}
              numberOfLines={1}
            >
              {entry.label}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.rightSection}>
        <Switch
          value={entry.enabled}
          onValueChange={(val) => onToggle(entry.filter, val)}
          trackColor={{
            false: Colors.surfaceVariant,
            true: Colors.primaryContainer,
          }}
          thumbColor={entry.enabled ? Colors.primary : Colors.outline}
        />
        <Pressable
          onPress={() => onDelete(entry.filter)}
          style={styles.deleteButton}
          hitSlop={8}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={20}
            color={Colors.error}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surfaceContainerLowest,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  textSection: {
    flex: 1,
  },
  filter: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  label: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  disabledText: {
    color: Colors.outline,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
});
