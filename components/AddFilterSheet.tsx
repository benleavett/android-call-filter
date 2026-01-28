import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getPreferredDialCode } from "@/constants/countryCodes";

interface AddFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (filter: string, label: string, countryCode: string) => Promise<boolean>;
}

export function AddFilterSheet({ visible, onClose, onAdd }: AddFilterSheetProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("");
  const [label, setLabel] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      getPreferredDialCode().then(setCountryCode);
    }
  }, [visible]);

  const handleAdd = async () => {
    const cleaned = filter.replace(/\s/g, "");
    if (!cleaned || !/^[\d]+$/.test(cleaned)) {
      setError(t("filters.invalidError"));
      return;
    }

    setSubmitting(true);
    setError(null);

    const success = await onAdd(cleaned, label.trim(), countryCode.trim());
    setSubmitting(false);

    if (success) {
      setFilter("");
      setLabel("");
      setError(null);
      onClose();
    } else {
      setError(t("filters.duplicateError"));
    }
  };

  const handleClose = () => {
    setFilter("");
    setLabel("");
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={[styles.sheet, { paddingBottom: Spacing.lg + insets.bottom }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t("filters.addFilter")}</Text>

          <Text style={styles.inputLabel}>{t("filters.numberLabel")}</Text>
          <View style={[styles.numberRow, error ? styles.numberRowError : null]}>
            <Text style={styles.countryCodePrefix}>{countryCode}</Text>
            <View style={styles.divider} />
            <TextInput
              style={styles.numberInput}
              value={filter}
              onChangeText={(text) => {
                setFilter(text);
                setError(null);
              }}
              placeholder={t("filters.numberPlaceholder")}
              placeholderTextColor={Colors.outline}
              keyboardType="phone-pad"
              autoFocus
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.inputLabel}>{t("filters.labelLabel")}</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder={t("filters.labelPlaceholder")}
            placeholderTextColor={Colors.outline}
          />

          <View style={styles.buttons}>
            <Pressable
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>
                {t("common.cancel")}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.addButton,
                submitting && styles.addButtonDisabled,
              ]}
              onPress={handleAdd}
              disabled={submitting}
            >
              <Text style={styles.addButtonText}>
                {t("common.add")}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outlineVariant,
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.onSurface,
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xs,
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.md,
  },
  numberRowError: {
    borderColor: Colors.error,
  },
  countryCodePrefix: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: Colors.outlineVariant,
    marginVertical: 8,
  },
  numberInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.onSurface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  input: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.md,
  },
  buttons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceVariant,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
  },
  addButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.onPrimary,
  },
});
