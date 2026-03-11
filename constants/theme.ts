export const Colors = {
  primary: "#3949ab",
  onPrimary: "#ffffff",
  primaryContainer: "#dde1ff",
  onPrimaryContainer: "#00105c",

  secondary: "#1e88e5",
  onSecondary: "#ffffff",
  secondaryContainer: "#d3e4ff",
  onSecondaryContainer: "#001c38",

  tertiary: "#00897b",
  onTertiary: "#ffffff",
  tertiaryContainer: "#a7f5ec",

  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",

  surface: "#fefbff",
  onSurface: "#1b1b1f",
  surfaceVariant: "#e2e1ec",
  onSurfaceVariant: "#45464f",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f6f2fa",
  surfaceContainer: "#f0ecf4",
  surfaceContainerHigh: "#eae7ef",

  outline: "#767680",
  outlineVariant: "#c6c5d0",

  background: "#fefbff",
  onBackground: "#1b1b1f",

  inverseSurface: "#303034",
  inverseOnSurface: "#f3eff7",
  inversePrimary: "#b9c3ff",

  success: "#2e7d32",
  successContainer: "#e8f5e9",
  warning: "#f57f17",
  warningContainer: "#fff8e1",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  full: 999,
};

export const Typography = {
  headlineLarge: { fontSize: 32, lineHeight: 40, fontWeight: "400" as const },
  headlineMedium: { fontSize: 28, lineHeight: 36, fontWeight: "400" as const },
  headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: "400" as const },
  titleLarge: { fontSize: 22, lineHeight: 28, fontWeight: "400" as const },
  titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: "500" as const },
  titleSmall: { fontSize: 14, lineHeight: 20, fontWeight: "500" as const },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },
  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: "500" as const },
  labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: "500" as const },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: "500" as const },
};

export const Fonts = {
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  semiBold: "DMSans_600SemiBold",
  bold: "DMSans_700Bold",
};

export const Elevation = {
  level0: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  level2: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
};
