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

        // --- Prefix Management ---

        AsyncFunction("getPrefixes") {
            PrefixManager(context).getPrefixes().map { entry ->
                bundleOf(
                    "prefix" to entry.prefix,
                    "label" to entry.label,
                    "enabled" to entry.enabled,
                    "createdAt" to entry.createdAt.toDouble()
                )
            }
        }

        AsyncFunction("addPrefix") { prefix: String, label: String ->
            PrefixManager(context).addPrefix(prefix, label)
        }

        AsyncFunction("removePrefix") { prefix: String ->
            PrefixManager(context).removePrefix(prefix)
        }

        AsyncFunction("togglePrefix") { prefix: String, enabled: Boolean ->
            PrefixManager(context).togglePrefix(prefix, enabled)
        }

        // --- Call Log ---

        AsyncFunction("getCallLog") { limit: Int, offset: Int ->
            CallLogDatabase(context).getEntries(limit, offset).map { entry ->
                bundleOf(
                    "id" to entry.id.toDouble(),
                    "phoneNumber" to entry.phoneNumber,
                    "matchedPrefix" to entry.matchedPrefix,
                    "timestamp" to entry.timestamp.toDouble(),
                    "callDirection" to entry.callDirection
                )
            }
        }

        AsyncFunction("clearCallLog") {
            CallLogDatabase(context).clearAll()
        }

        // --- Stats ---

        AsyncFunction("getStats") {
            val db = CallLogDatabase(context)
            val pm = PrefixManager(context)
            bundleOf(
                "totalFiltered" to db.getTotalCount(),
                "todayCount" to db.getTodayCount(),
                "activePrefixes" to pm.getPrefixes().count { it.enabled },
                "totalPrefixes" to pm.getPrefixes().size
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
