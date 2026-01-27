package expo.modules.callscreening

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray

data class FilterEntry(
    val filter: String,
    val label: String,
    val countryCode: String,
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

    fun getFilters(): List<FilterEntry> {
        val json = prefs.getString(KEY_PREFIXES, "[]") ?: "[]"
        val array = JSONArray(json)
        val result = mutableListOf<FilterEntry>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            result.add(
                FilterEntry(
                    filter = obj.getString("filter"),
                    label = obj.optString("label", ""),
                    countryCode = obj.optString("countryCode", ""),
                    enabled = obj.optBoolean("enabled", true),
                    createdAt = obj.optLong("createdAt", System.currentTimeMillis())
                )
            )
        }
        return result
    }

    fun getEnabledFilters(): List<FilterEntry> {
        return getFilters().filter { it.enabled }
    }

    /**
     * Match an incoming phone number against enabled filters.
     *
     * Incoming numbers arrive in international format (e.g. +33162123456).
     * Filters are stored as domestic numbers (e.g. 0162) with a country code (+33).
     *
     * Matching strategy:
     * 1. International: strip leading 0 from filter, prepend country code → "+33162",
     *    check if the incoming number starts with it.
     * 2. Domestic: check if the cleaned number starts with the filter as-is.
     */
    fun matchesFilter(phoneNumber: String): String? {
        val cleaned = phoneNumber.replace(Regex("[^\\d+]"), "")
        val enabledFilters = getEnabledFilters()

        for (entry in enabledFilters) {
            val filterDigits = entry.filter

            // International match: country code + filter without leading zero
            if (entry.countryCode.isNotEmpty()) {
                val withoutLeadingZero = filterDigits.trimStart('0')
                val international = entry.countryCode + withoutLeadingZero
                if (cleaned.startsWith(international)) {
                    return entry.filter
                }
            }

            // Domestic match: direct prefix check
            if (cleaned.startsWith(filterDigits)) {
                return entry.filter
            }
        }

        return null
    }
}
