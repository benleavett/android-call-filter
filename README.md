# Call Filter

Android app that screens incoming phone calls by number prefix, rejects matches, and logs filtered calls. Built with React Native (Expo) and Android's `CallScreeningService` API.

## Features

- Filter incoming calls by phone number prefix (e.g. block all calls starting with `0162`)
- Per-filter country code support with locale-based defaults
- Notification for each blocked call
- Call log of all filtered calls
- Enable/disable individual filters
- Ships with default French spam prefixes
- English and French localization with language picker
- Material Design 3 UI

## Requirements

- Android 10+ (API 29) — required for `CallScreeningService`
- Node.js 18+
- Expo SDK 54

## Getting Started

```bash
npm install
```

### Development (Expo Go — UI only)

```bash
npx expo start
```

Call screening features are unavailable in Expo Go. Filter management and UI work normally.

### Development Build (full native features)

```bash
npx eas build --platform android --profile development
```

Install the resulting APK, then:

```bash
npx expo start --dev-client
```

### Production Build

```bash
npx eas build --platform android --profile production
```

## Project Structure

```
app/                    Expo Router screens and tab layout
components/             Reusable UI components
constants/              Theme, country codes, default filters
hooks/                  React hooks (filters, call log, service status)
i18n/                   Localization (en.json, fr.json)
modules/call-screening/ Expo native module (Kotlin)
  android/src/          CallScreeningService, PrefixManager, CallLogDatabase
plugins/                Expo config plugin for AndroidManifest
```

## How It Works

1. Filters are stored in AsyncStorage and synced to native SharedPreferences
2. `CallFilterService` (Android `CallScreeningService`) reads filters from SharedPreferences
3. On incoming call, the service matches the number against enabled filters
4. Matched calls are rejected, logged to SQLite, and trigger a notification
5. Non-matching calls pass through to the default phone app
