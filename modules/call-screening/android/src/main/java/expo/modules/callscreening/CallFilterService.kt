package expo.modules.callscreening

import android.telecom.Call
import android.telecom.CallScreeningService
import android.util.Log

class CallFilterService : CallScreeningService() {

    companion object {
        private const val TAG = "CallFilterService"
    }

    override fun onScreenCall(callDetails: Call.Details) {
        if (callDetails.callDirection != Call.Details.DIRECTION_INCOMING) {
            respondToCall(callDetails, CallResponse.Builder().build())
            return
        }

        val handle = callDetails.handle
        if (handle == null) {
            respondToCall(callDetails, CallResponse.Builder().build())
            return
        }

        val phoneNumber = handle.schemeSpecificPart ?: ""
        Log.d(TAG, "Incoming call from: $phoneNumber")

        val prefixManager = PrefixManager(applicationContext)
        val matchedPrefix = prefixManager.matchesPrefix(phoneNumber)

        if (matchedPrefix != null) {
            Log.d(TAG, "Matched prefix: $matchedPrefix — rejecting call")

            try {
                val db = CallLogDatabase(applicationContext)
                db.insertEntry(phoneNumber, matchedPrefix)
                db.close()
            } catch (e: Exception) {
                Log.e(TAG, "Failed to log blocked call", e)
            }

            try {
                NotificationHelper(applicationContext)
                    .showBlockedCallNotification(phoneNumber, matchedPrefix)
            } catch (e: Exception) {
                Log.e(TAG, "Failed to show notification", e)
            }

            val response = CallResponse.Builder()
                .setDisallowCall(true)
                .setRejectCall(true)
                .setSkipCallLog(false)
                .setSkipNotification(true)
                .build()

            respondToCall(callDetails, response)
        } else {
            Log.d(TAG, "No prefix match — allowing call")
            respondToCall(callDetails, CallResponse.Builder().build())
        }
    }
}
