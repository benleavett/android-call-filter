package expo.modules.callscreening

import android.app.Activity
import android.app.role.RoleManager
import android.content.Context
import android.os.Build
import android.telephony.TelephonyManager
import android.util.Log
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class CallScreeningExpoModule : Module() {

    companion object {
        private const val TAG = "CallScreening"
        private const val REQUEST_CODE_CALL_SCREENING = 1001
    }

    private val context: Context
        get() = requireNotNull(appContext.reactContext)

    override fun definition() = ModuleDefinition {
        Name("CallScreening")

        Events("onCallBlocked")

        OnStartObserving {
            CallBlockedBus.setListener { phoneNumber, matchedFilter, timestamp ->
                sendEvent("onCallBlocked", bundleOf(
                    "phoneNumber" to phoneNumber,
                    "matchedFilter" to matchedFilter,
                    "timestamp" to timestamp.toDouble()
                ))
            }
        }

        OnStopObserving {
            CallBlockedBus.setListener(null)
        }

        // Write the full prefix list to native SharedPreferences so the
        // CallFilterService can read it without the JS runtime.
        AsyncFunction("syncPrefixes") { json: String ->
            context.getSharedPreferences("call_filter_prefixes", Context.MODE_PRIVATE)
                .edit()
                .putString("prefixes_json", json)
                .apply()
        }

        // --- Call Log (written by CallFilterService, read here) ---

        AsyncFunction("getCallLog") { limit: Int, offset: Int ->
            CallLogDatabase(context).getEntries(limit, offset).map { entry ->
                bundleOf(
                    "id" to entry.id.toDouble(),
                    "phoneNumber" to entry.phoneNumber,
                    "matchedFilter" to entry.matchedFilter,
                    "timestamp" to entry.timestamp.toDouble(),
                    "callDirection" to entry.callDirection
                )
            }
        }

        AsyncFunction("clearCallLog") {
            CallLogDatabase(context).clearAll()
        }

        AsyncFunction("getCallLogStats") {
            val db = CallLogDatabase(context)
            bundleOf(
                "totalFiltered" to db.getTotalCount(),
                "todayCount" to db.getTodayCount()
            )
        }

        // --- SIM Info ---

        AsyncFunction("getSimCountryCode") {
            val tm = context.getSystemService(Context.TELEPHONY_SERVICE) as? TelephonyManager
            tm?.simCountryIso?.uppercase() ?: ""
        }

        // --- Service Status ---

        AsyncFunction("isServiceEnabled") {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val roleManager = context.getSystemService(RoleManager::class.java)
                roleManager?.isRoleHeld(RoleManager.ROLE_CALL_SCREENING) ?: false
            } else {
                false
            }
        }

        @Suppress("DEPRECATION")
        AsyncFunction("requestServiceEnable") {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val roleManager = context.getSystemService(RoleManager::class.java)
                if (roleManager == null) {
                    Log.w(TAG, "RoleManager not available")
                    false
                } else if (roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
                    Log.d(TAG, "Role already held")
                    true
                } else {
                    val activity = appContext.currentActivity
                    if (activity == null) {
                        Log.w(TAG, "No current activity to launch role request")
                        false
                    } else {
                        try {
                            val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING)
                            activity.startActivityForResult(intent, REQUEST_CODE_CALL_SCREENING)
                            Log.d(TAG, "Role request dialog launched via startActivityForResult")
                            true
                        } catch (e: Exception) {
                            Log.e(TAG, "Failed to launch role request", e)
                            false
                        }
                    }
                }
            } else {
                Log.w(TAG, "API level ${Build.VERSION.SDK_INT} does not support call screening roles")
                false
            }
        }
    }
}
