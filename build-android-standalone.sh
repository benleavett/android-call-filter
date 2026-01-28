#!/usr/bin/env bash
set -euo pipefail

# Build a release APK that runs standalone (no Expo dev server needed).
# Prereqs: Android SDK, Java 17+, and a connected device or running emulator.

npx expo run:android --variant release
