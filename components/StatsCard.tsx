import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Elevation } from "@/constants/theme";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const iconColor = color ?? Colors.primary;

  return (
    <View style={styles.card}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconColor + "14" }]}
      >
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Elevation.level1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.onSurface,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.onSurfaceVariant,
  },
});
