const { withAndroidManifest, AndroidConfig } = require("expo/config-plugins");

function withCallScreening(config) {
  return withAndroidManifest(config, async (config) => {
    const mainApplication =
      AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    if (!mainApplication.service) {
      mainApplication.service = [];
    }

    const alreadyRegistered = mainApplication.service.some(
      (s) =>
        s.$?.["android:name"] ===
        "expo.modules.callscreening.CallFilterService"
    );

    if (!alreadyRegistered) {
      mainApplication.service.push({
        $: {
          "android:name": "expo.modules.callscreening.CallFilterService",
          "android:permission": "android.permission.BIND_SCREENING_SERVICE",
          "android:exported": "true",
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name":
                    "android.telecom.CallScreeningService",
                },
              },
            ],
          },
        ],
      });
    }

    return config;
  });
}

module.exports = withCallScreening;
