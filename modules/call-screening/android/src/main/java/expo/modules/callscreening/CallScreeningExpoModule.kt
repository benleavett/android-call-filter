package expo.modules.callscreening

import android.app.role.RoleManager
import android.content.Context
import android.os.Build
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class CallScreeningExpoModule : Module() {

    private val context: Context
        get() = requireNotNull(appContext.reactContext)

    override fun definition() = ModuleDefinition {
        Name("CallScreening")

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

        // --- Service Status ---

        AsyncFunction("isServiceEnabled") {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val roleManager = context.getSystemService(RoleManager::class.java)
                roleManager?.isRoleHeld(RoleManager.ROLE_CALL_SCREENING) ?: false
            } else {
                false
            }
        }

        AsyncFunction("requestServiceEnable") {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val roleManager = context.getSystemService(RoleManager::class.java)
                if (roleManager != null && !roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
                    val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING)
                    val activity = appContext.currentActivity
                    if (activity != null) {
                        activity.startActivity(intent)
                        true
                    } else {
                        false
                    }
                } else {
                    false
                }
            } else {
                false
            }
        }
    }
}
