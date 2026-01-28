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
     * Filters are stored as domestic numbers (e.g. "0162") with a country code (e.g. "+33").
     *
     * Incoming numbers can arrive in many formats depending on the carrier / SIM:
     *   +33612345678   — E.164 international
     *   33612345678    — country code without +
     *   0033612345678  — 00-prefixed international
     *   0612345678     — domestic with leading zero
     *   612345678      — bare significant digits
     *
     * We normalise the incoming number to its "significant national digits"
     * (everything after the country code and trunk prefix) and compare against
     * the filter's significant digits.  We also keep direct prefix checks for
     * domestic and full international formats as a fast path.
     */
    fun matchesFilter(phoneNumber: String): String? {
        val cleaned = phoneNumber.replace(Regex("[^\\d+]"), "")
        val enabledFilters = getEnabledFilters()

        for (entry in enabledFilters) {
            val filterDigits = entry.filter

            // Fast path: direct domestic match (e.g. cleaned "0612..." starts with "06")
            if (cleaned.startsWith(filterDigits)) {
                return entry.filter
            }

            if (entry.countryCode.isNotEmpty()) {
                val ccDigits = entry.countryCode.trimStart('+')
                val filterSignificant = filterDigits.trimStart('0')

                if (filterSignificant.isEmpty()) continue

                // +CC match:  "+33612..." starts with "+33" + "612"
                if (cleaned.startsWith("+$ccDigits$filterSignificant")) {
                    return entry.filter
                }

                // CC without + match:  "33612..." starts with "33" + "612"
                if (cleaned.startsWith("$ccDigits$filterSignificant")) {
                    return entry.filter
                }

                // 00CC match:  "0033612..." starts with "0033" + "612"
                if (cleaned.startsWith("00$ccDigits$filterSignificant")) {
                    return entry.filter
                }

                // Bare significant digits:  "612..." starts with "612"
                if (cleaned.startsWith(filterSignificant)) {
                    return entry.filter
                }

                // Incoming number might itself be international — strip its
                // country code to get its significant digits, then compare.
                val incomingSignificant = stripCountryCode(cleaned, ccDigits)
                if (incomingSignificant != null && incomingSignificant.startsWith(filterSignificant)) {
                    return entry.filter
                }
            }
        }

        return null
    }

    /**
     * Strip country code from a cleaned phone number and return the remaining
     * significant national digits (without trunk prefix '0'), or null if the
     * number doesn't carry this country code.
     */
    private fun stripCountryCode(cleaned: String, ccDigits: String): String? {
        val national = when {
            cleaned.startsWith("+$ccDigits") -> cleaned.removePrefix("+$ccDigits")
            cleaned.startsWith("00$ccDigits") -> cleaned.removePrefix("00$ccDigits")
            cleaned.startsWith(ccDigits) && !cleaned.startsWith("+") -> cleaned.removePrefix(ccDigits)
            else -> return null
        }
        // Strip trunk prefix (leading 0) if present
        return national.trimStart('0')
    }
}
