/**
 * Legal document text for in-app display.
 * Keep in sync with PRIVACY.txt and TERMS.txt.
 * Last updated: 11 March 2026
 */

export const PRIVACY_POLICY = `Privacy Policy

Simple Call Blocker / Stop Appels
Published by Cadence Digital — cadencedigital.fr
Last updated: 11 March 2026


Summary

Simple Call Blocker screens and blocks unwanted incoming calls entirely on your device. Your call filters, blocked call log, and preferences never leave your phone.


Data We Collect

Most data stays on your device and is never transmitted. The one exception is anonymised usage analytics described below.

Data stored locally on your device (never transmitted):

• Call filters — The phone number prefixes and labels you configure.
• Blocked call log — A record of calls that were blocked, including the caller's number, the filter matched, and the timestamp. You can clear this log at any time from within the App.
• Preferences — Your chosen language and country setting.

All local data is deleted when you uninstall the App.


Analytics

The App uses PostHog (posthog.com) to collect anonymised usage events. This helps us understand how the app is used and improve it. The data collected is:

• App launch events, including whether call screening was active at launch.
• When a call is blocked (no phone number or personal data is sent).

No phone numbers, call log entries, filter content, or personally identifiable information are sent to PostHog. PostHog data is hosted in the United States. PostHog's privacy policy is available at posthog.com/privacy.


Permissions

The App requests a single Android system role:

• Call Screening role (ROLE_CALL_SCREENING) — Required for the App to screen incoming calls. This is granted via the Android system dialog and can be revoked at any time in your device settings under Default apps.

The App does not request access to your contacts, microphone, camera, location, or any other device permissions.


Contacts

The App does not read or access your contacts. Android's CallScreeningService API does not invoke call screening for phone numbers saved in your address book — those calls always ring through normally.


Children's Privacy

The App does not knowingly collect any data from children under 13.


Changes to This Policy

We may update this Privacy Policy from time to time. The updated version will be indicated by the "Last updated" date above and will be available within the App and at cadencedigital.fr.


Contact

Cadence Digital
Website: cadencedigital.fr`;

export const TERMS_AND_CONDITIONS = `Terms & Conditions

Simple Call Blocker / Stop Appels
Published by Cadence Digital — cadencedigital.fr
Last updated: 11 March 2026


1. Introduction

These Terms & Conditions govern your use of the Simple Call Blocker mobile application ("the App") published by Cadence Digital ("we", "us", "our"), a company registered in France.

By installing or using the App, you agree to be bound by these Terms. If you do not agree, please uninstall the App and discontinue use.


2. Description of Service

The App provides call screening functionality on Android devices. It allows users to define phone number filters and automatically reject incoming calls that match those filters. The App uses Android's CallScreeningService API and operates entirely on-device.


3. Requirements

• Android 10 (API level 29) or later.
• The user must grant the App the Call Screening role via Android system settings for call blocking to function.


4. Data & Privacy

• On-device storage. Call filters, blocked call logs, and preferences are stored locally on your device and never transmitted to external servers.
• No account required. The App does not require registration or personal information.
• Analytics. The App sends anonymised usage events (app launches and call-blocked counts) to PostHog to help us improve the App. No phone numbers or personal data are included. See our Privacy Policy for details.
• Call log. The App maintains a local log of calls it has blocked. You may clear this log at any time from within the App.
• Contacts. The App does not access your contacts. Android's CallScreeningService does not invoke call screening for numbers in your address book.


5. Limitations

• The App relies on Android's CallScreeningService API. Call screening behaviour is subject to the capabilities and restrictions of your Android version, device manufacturer, and carrier.
• Calls from numbers saved in your device's contacts are not screened by the operating system and cannot be blocked by the App.
• We do not guarantee that all unwanted calls will be blocked. Filter effectiveness depends on the filters you configure.
• The App is provided for personal, non-commercial use.


6. Disclaimer of Warranties

The App is provided "as is" and "as available" without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.


7. Limitation of Liability

To the fullest extent permitted by applicable law, Cadence Digital shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, missed calls, or damages resulting from calls that were incorrectly blocked or not blocked.

Our total liability for any claim arising from or related to the App shall not exceed the amount you paid for the App.


8. Intellectual Property

The App and its original content, features, and functionality are owned by Cadence Digital and are protected by applicable intellectual property laws.


9. Changes to These Terms

We reserve the right to modify these Terms at any time. Updated Terms will be made available within the App or at cadencedigital.fr.


10. Governing Law

These Terms are governed by the laws of France. Any disputes shall be subject to the exclusive jurisdiction of the courts of France.


11. Contact

Cadence Digital
Website: cadencedigital.fr`;
