import { useState } from "react";
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
import { useTranslation } from "react-i18next";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

interface AddPrefixSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (prefix: string, label: string) => Promise<boolean>;
}

export function AddPrefixSheet({ visible, onClose, onAdd }: AddPrefixSheetProps) {
  const { t } = useTranslation();
  const [prefix, setPrefix] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    const cleaned = prefix.replace(/\s/g, "");
    if (!cleaned || !/^[+\d][\d]*$/.test(cleaned)) {
      setError(t("prefixes.invalidError"));
      return;
    }

    setSubmitting(true);
    setError(null);

    const success = await onAdd(cleaned, label.trim());
    setSubmitting(false);

    if (success) {
      setPrefix("");
      setLabel("");
      setError(null);
      onClose();
    } else {
      setError(t("prefixes.duplicateError"));
    }
  };

  const handleClose = () => {
    setPrefix("");
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
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t("prefixes.addPrefix")}</Text>

          <Text style={styles.inputLabel}>{t("prefixes.prefixLabel")}</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={prefix}
            onChangeText={(text) => {
              setPrefix(text);
              setError(null);
            }}
            placeholder={t("prefixes.prefixPlaceholder")}
            placeholderTextColor={Colors.outline}
            keyboardType="phone-pad"
            autoFocus
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.inputLabel}>{t("prefixes.labelLabel")}</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder={t("prefixes.labelPlaceholder")}
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
    paddingBottom: Spacing.xxl,
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
  inputError: {
    borderColor: Colors.error,
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
