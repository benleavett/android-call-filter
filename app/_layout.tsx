import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { initI18n } from "@/i18n";
import { seedDefaultFilters } from "@/hooks/useSeedDefaults";
import { Colors } from "@/constants/theme";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import { isServiceEnabled } from "@/modules/call-screening";

function AppInit() {
  const posthog = usePostHog();

  useEffect(() => {
    isServiceEnabled()
      .then((enabled) => {
        posthog.capture("app_loaded", { screening_active: enabled });
      })
      .catch(() => {
        posthog.capture("app_loaded", { screening_active: null });
      });
  }, []);

  return null;
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      await initI18n();
      await seedDefaultFilters();
    }
    init().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <PostHogProvider apiKey="phc_yevDQifamX983XE1vbfYWlspgOtzohJaKi8Wh8PyxNb" options={{ host: "https://eu.i.posthog.com", flushAt: 1 }}>
      <AppInit />
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </PostHogProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
});
