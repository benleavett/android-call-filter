import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Colors, Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { getPreferredDialCode } from "@/constants/countryCodes";
import { formatLocalNumber, getMinLocalDigits } from "@/constants/phoneFormat";

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
  const [dialCode, setDialCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const numberInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      getPreferredDialCode().then(setDialCode);
      setFilter("");
      setLabel("");
      setError(null);
    }
  }, [visible]);

  // Build a formatted preview of the filter as it will appear after saving.
  function buildPreview(): string | null {
    const digits = filter.replace(/\s/g, "");
    if (!digits) return null;
    const formatted = formatLocalNumber(digits, dialCode);
    const isPrefix = digits.length < getMinLocalDigits(dialCode);
    const suffix = isPrefix ? " *" : "";
    return dialCode ? `${dialCode} ${formatted}${suffix}` : `${formatted}${suffix}`;
  }

  const handleAdd = async () => {
    const cleanedCode = dialCode.trim();
    if (!cleanedCode || !/^\+\d{1,4}$/.test(cleanedCode)) {
      setError(t("filters.invalidCountryCode"));
      return;
    }
    const cleaned = filter.replace(/\s/g, "");
    if (!cleaned || !/^\d+$/.test(cleaned)) {
      setError(t("filters.invalidError"));
      return;
    }
    if (!cleaned.startsWith("0")) {
      setError(t("filters.invalidLeadingZero"));
      return;
    }

    setSubmitting(true);
    setError(null);

    const success = await onAdd(cleaned, label.trim(), dialCode.trim());
    setSubmitting(false);

    if (success) {
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

  const preview = buildPreview();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior="height"
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={[styles.sheet, { paddingBottom: Spacing.lg + insets.bottom }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t("filters.addFilter")}</Text>

          <Text style={styles.inputLabel}>{t("filters.numberLabel")}</Text>
          <View style={[styles.numberRow, error ? styles.numberRowError : null]}>
            {/* Editable dial code */}
            <TextInput
              style={styles.dialCodeInput}
              value={dialCode}
              onChangeText={(text) => {
                setDialCode(text);
                setError(null);
              }}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => numberInputRef.current?.focus()}
            />
            <View style={styles.divider} />
            {/* Local number */}
            <TextInput
              ref={numberInputRef}
              style={styles.numberInput}
              value={filter}
              onChangeText={(text) => {
                setFilter(text);
                setError(null);
              }}
              placeholder={t("filters.numberPlaceholder")}
              placeholderTextColor={Colors.outline}
              keyboardType="number-pad"
              autoFocus
            />
          </View>

          {/* Formatted preview */}
          {preview ? (
            <Text style={styles.previewText}>{preview}</Text>
          ) : null}

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
    fontFamily: Fonts.semiBold,
    color: Colors.onSurface,
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: Fonts.medium,
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
    marginBottom: Spacing.xs,
  },
  numberRowError: {
    borderColor: Colors.error,
  },
  dialCodeInput: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.onSurface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    minWidth: 60,
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
  previewText: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.sm,
    fontVariant: ["tabular-nums"],
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginBottom: Spacing.md,
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
    fontFamily: Fonts.semiBold,
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
    fontFamily: Fonts.semiBold,
    color: Colors.onPrimary,
  },
});
