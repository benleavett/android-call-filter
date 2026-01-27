package expo.modules.callscreening

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject

data class PrefixEntry(
    val prefix: String,
    val label: String,
    val enabled: Boolean,
    val createdAt: Long
)

class PrefixManager(private val context: Context) {

    companion object {
        private const val PREFS_NAME = "call_filter_prefixes"
        private const val KEY_PREFIXES = "prefixes_json"
    }

    private val prefs: SharedPreferences
        get() = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun getPrefixes(): List<PrefixEntry> {
        val json = prefs.getString(KEY_PREFIXES, "[]") ?: "[]"
        val array = JSONArray(json)
        val result = mutableListOf<PrefixEntry>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            result.add(
                PrefixEntry(
                    prefix = obj.getString("prefix"),
                    label = obj.optString("label", ""),
                    enabled = obj.optBoolean("enabled", true),
                    createdAt = obj.optLong("createdAt", System.currentTimeMillis())
                )
            )
        }
        return result
    }

    fun addPrefix(prefix: String, label: String): Boolean {
        val prefixes = getPrefixes().toMutableList()
        if (prefixes.any { it.prefix == prefix }) return false
        prefixes.add(
            PrefixEntry(
                prefix = prefix,
                label = label,
                enabled = true,
                createdAt = System.currentTimeMillis()
            )
        )
        savePrefixes(prefixes)
        return true
    }

    fun removePrefix(prefix: String): Boolean {
        val prefixes = getPrefixes().toMutableList()
        val removed = prefixes.removeAll { it.prefix == prefix }
        if (removed) savePrefixes(prefixes)
        return removed
    }

    fun togglePrefix(prefix: String, enabled: Boolean): Boolean {
        val prefixes = getPrefixes().toMutableList()
        val index = prefixes.indexOfFirst { it.prefix == prefix }
        if (index == -1) return false
        prefixes[index] = prefixes[index].copy(enabled = enabled)
        savePrefixes(prefixes)
        return true
    }

    fun getEnabledPrefixes(): List<String> {
        return getPrefixes().filter { it.enabled }.map { it.prefix }
    }

    fun matchesPrefix(phoneNumber: String): String? {
        val cleaned = phoneNumber.replace(Regex("[^\\d+]"), "")
        val enabledPrefixes = getEnabledPrefixes()
        return enabledPrefixes.firstOrNull { cleaned.startsWith(it) }
    }

    private fun savePrefixes(prefixes: List<PrefixEntry>) {
        val array = JSONArray()
        for (entry in prefixes) {
            val obj = JSONObject().apply {
                put("prefix", entry.prefix)
                put("label", entry.label)
                put("enabled", entry.enabled)
                put("createdAt", entry.createdAt)
            }
            array.put(obj)
        }
        prefs.edit().putString(KEY_PREFIXES, array.toString()).apply()
    }
}
