import { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

interface BlockedCallCardProps {
  phoneNumber: string;
  matchedFilter: string;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 10_000;

export function BlockedCallCard({
  phoneNumber,
  matchedFilter,
  onDismiss,
}: BlockedCallCardProps) {
  const { t } = useTranslation();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => onDismiss());
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateY }] }]}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="phone-off"
          size={24}
          color={Colors.error}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t("dashboard.callBlocked")}</Text>
        <Text style={styles.phoneNumber} numberOfLines={1}>
          {phoneNumber}
        </Text>
        <Text style={styles.matchInfo} numberOfLines={1}>
          {t("callLog.matchedFilter", { filter: matchedFilter })}
        </Text>
      </View>
      <Pressable onPress={onDismiss} hitSlop={8} style={styles.dismissButton}>
        <MaterialCommunityIcons
          name="close"
          size={20}
          color={Colors.onSurfaceVariant}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.errorContainer,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.error + "14",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.error,
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  matchInfo: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  dismissButton: {
    padding: Spacing.xs,
  },
});
