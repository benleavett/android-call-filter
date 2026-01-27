import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Spacing } from "@/constants/theme";

interface EmptyStateProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={icon}
        size={56}
        color={Colors.outlineVariant}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
    marginTop: Spacing.md,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: Colors.outline,
    marginTop: Spacing.sm,
    textAlign: "center",
    lineHeight: 20,
  },
});
