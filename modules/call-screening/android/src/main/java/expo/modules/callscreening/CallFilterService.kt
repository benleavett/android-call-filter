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
        Log.d(TAG, "Incoming call — raw handle: $handle, schemeSpecificPart: $phoneNumber")

        val prefixManager = PrefixManager(applicationContext)
        val matchedFilter = prefixManager.matchesFilter(phoneNumber)

        if (matchedFilter != null) {
            Log.d(TAG, "Matched filter: $matchedFilter — rejecting call")

            try {
                val db = CallLogDatabase(applicationContext)
                db.insertEntry(phoneNumber, matchedFilter)
                db.close()
            } catch (e: Exception) {
                Log.e(TAG, "Failed to log blocked call", e)
            }

            try {
                NotificationHelper(applicationContext)
                    .showBlockedCallNotification(phoneNumber, matchedFilter)
            } catch (e: Exception) {
                Log.e(TAG, "Failed to show notification", e)
            }

            // Notify the Expo module (if the app is in the foreground)
            CallBlockedBus.emit(phoneNumber, matchedFilter, System.currentTimeMillis())

            val response = CallResponse.Builder()
                .setDisallowCall(true)
                .setRejectCall(true)
                .setSkipCallLog(false)
                .setSkipNotification(true)
                .build()

            respondToCall(callDetails, response)
        } else {
            Log.d(TAG, "No filter match — allowing call")
            respondToCall(callDetails, CallResponse.Builder().build())
        }
    }
}
