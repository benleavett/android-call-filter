package expo.modules.callscreening

/**
 * Static event bus so [CallFilterService] (a background service) can notify
 * [CallScreeningExpoModule] when a call is blocked, without holding a direct
 * reference to the Expo module instance.
 */
object CallBlockedBus {

    private var listener: ((phoneNumber: String, matchedFilter: String, timestamp: Long) -> Unit)? = null

    fun setListener(l: ((String, String, Long) -> Unit)?) {
        listener = l
    }

    fun emit(phoneNumber: String, matchedFilter: String, timestamp: Long) {
        listener?.invoke(phoneNumber, matchedFilter, timestamp)
    }
}
