import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Elevation, Fonts } from "@/constants/theme";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
  onPress?: () => void;
}

export function StatsCard({ title, value, icon, color, onPress }: StatsCardProps) {
  const iconColor = color ?? Colors.primary;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconColor + "14" }]}
      >
        <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.value, { color: iconColor }]}>{value}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Elevation.level1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.onSurfaceVariant,
    marginBottom: 2,
  },
  value: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.onSurface,
  },
});
