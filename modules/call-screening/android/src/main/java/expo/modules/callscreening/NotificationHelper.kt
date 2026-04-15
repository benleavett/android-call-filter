package expo.modules.callscreening

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class NotificationHelper(private val context: Context) {

    companion object {
        private const val CHANNEL_ID = "call_filter_blocked"
        private const val CHANNEL_NAME = "Blocked Calls"
        private const val CHANNEL_DESCRIPTION = "Notifications for blocked incoming calls"
        private var notificationId = 1000
    }

    init {
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            CHANNEL_NAME,
            NotificationManager.IMPORTANCE_DEFAULT
        ).apply {
            description = CHANNEL_DESCRIPTION
        }
        val manager = context.getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)
    }

    fun showBlockedCallNotification(phoneNumber: String, matchedFilter: String) {
        val smallIconRes = resolveSmallIconRes()
        val largeIcon = resolveAppIconBitmap()

        val contentIntent = buildFilteredCallsPendingIntent()

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(smallIconRes)
            .setContentTitle("Call Blocked")
            .setContentText("Blocked call from $phoneNumber (filter: $matchedFilter)")
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(contentIntent)
            .setAutoCancel(true)

        if (largeIcon != null) {
            builder.setLargeIcon(largeIcon)
        }

        try {
            NotificationManagerCompat.from(context).notify(notificationId++, builder.build())
        } catch (e: SecurityException) {
            // POST_NOTIFICATIONS permission not granted on Android 13+
        }
    }

    private fun resolveSmallIconRes(): Int {
        // Prefer a dedicated monochrome notification icon if one has been added,
        // otherwise fall back to the app's launcher icon so the notification is
        // branded with the app rather than a generic system phone icon.
        return try {
            val res = context.resources
            val pkg = context.packageName
            res.getIdentifier("ic_notification", "drawable", pkg).takeIf { it != 0 }
                ?: res.getIdentifier("ic_launcher_foreground", "mipmap", pkg).takeIf { it != 0 }
                ?: res.getIdentifier("ic_launcher", "mipmap", pkg).takeIf { it != 0 }
                ?: android.R.drawable.ic_menu_call
        } catch (e: Exception) {
            android.R.drawable.ic_menu_call
        }
    }

    private fun resolveAppIconBitmap(): android.graphics.Bitmap? {
        return try {
            val iconId = context.resources.getIdentifier(
                "ic_launcher",
                "mipmap",
                context.packageName
            )
            if (iconId != 0) BitmapFactory.decodeResource(context.resources, iconId) else null
        } catch (e: Exception) {
            null
        }
    }

    private fun buildFilteredCallsPendingIntent(): PendingIntent {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("callfilter:///log")).apply {
            setPackage(context.packageName)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        return PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }
}
