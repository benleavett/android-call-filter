import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts } from "@/constants/theme";

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: Colors.surfaceContainerLow,
          borderTopColor: Colors.outlineVariant,
          paddingBottom: insets.bottom + 8,
          paddingTop: 10,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: Fonts.medium,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.onSurface,
        headerTitleStyle: {
          fontFamily: Fonts.semiBold,
          fontSize: 20,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: t("tabs.home"),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "view-dashboard" : "view-dashboard-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="filters"
        options={{
          title: t("tabs.filters"),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "filter" : "filter-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: t("tabs.callLog"),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="phone-log" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "cog" : "cog-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
