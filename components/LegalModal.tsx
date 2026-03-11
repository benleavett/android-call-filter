import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, Fonts } from "@/constants/theme";

interface LegalModalProps {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export function LegalModal({ visible, title, content, onClose }: LegalModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top || Spacing.lg }]}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={8} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={22} color={Colors.onSurfaceVariant} />
          </Pressable>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}
        >
          <Text style={styles.content}>{content}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontFamily: Fonts.semiBold,
    color: Colors.onSurface,
  },
  closeButton: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  body: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.onSurface,
  },
});
