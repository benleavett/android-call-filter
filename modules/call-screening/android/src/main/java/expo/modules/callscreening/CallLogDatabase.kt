package expo.modules.callscreening

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

data class CallLogEntry(
    val id: Long,
    val phoneNumber: String,
    val matchedPrefix: String,
    val timestamp: Long,
    val callDirection: String
)

class CallLogDatabase(context: Context) :
    SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "call_filter_log.db"
        private const val DATABASE_VERSION = 1
        private const val TABLE_NAME = "filtered_calls"

        private const val COL_ID = "id"
        private const val COL_PHONE_NUMBER = "phone_number"
        private const val COL_MATCHED_PREFIX = "matched_prefix"
        private const val COL_TIMESTAMP = "timestamp"
        private const val COL_DIRECTION = "direction"
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL("""
            CREATE TABLE $TABLE_NAME (
                $COL_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                $COL_PHONE_NUMBER TEXT NOT NULL,
                $COL_MATCHED_PREFIX TEXT NOT NULL,
                $COL_TIMESTAMP INTEGER NOT NULL,
                $COL_DIRECTION TEXT NOT NULL DEFAULT 'incoming'
            )
        """.trimIndent())
        db.execSQL("CREATE INDEX idx_timestamp ON $TABLE_NAME ($COL_TIMESTAMP DESC)")
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
        onCreate(db)
    }

    fun insertEntry(phoneNumber: String, matchedPrefix: String): Long {
        val values = ContentValues().apply {
            put(COL_PHONE_NUMBER, phoneNumber)
            put(COL_MATCHED_PREFIX, matchedPrefix)
            put(COL_TIMESTAMP, System.currentTimeMillis())
            put(COL_DIRECTION, "incoming")
        }
        return writableDatabase.insert(TABLE_NAME, null, values)
    }

    fun getEntries(limit: Int = 50, offset: Int = 0): List<CallLogEntry> {
        val entries = mutableListOf<CallLogEntry>()
        val cursor = readableDatabase.query(
            TABLE_NAME, null, null, null, null, null,
            "$COL_TIMESTAMP DESC",
            "$offset,$limit"
        )
        cursor.use {
            while (it.moveToNext()) {
                entries.add(
                    CallLogEntry(
                        id = it.getLong(it.getColumnIndexOrThrow(COL_ID)),
                        phoneNumber = it.getString(it.getColumnIndexOrThrow(COL_PHONE_NUMBER)),
                        matchedPrefix = it.getString(it.getColumnIndexOrThrow(COL_MATCHED_PREFIX)),
                        timestamp = it.getLong(it.getColumnIndexOrThrow(COL_TIMESTAMP)),
                        callDirection = it.getString(it.getColumnIndexOrThrow(COL_DIRECTION))
                    )
                )
            }
        }
        return entries
    }

    fun getTotalCount(): Int {
        val cursor = readableDatabase.rawQuery("SELECT COUNT(*) FROM $TABLE_NAME", null)
        cursor.use {
            return if (it.moveToFirst()) it.getInt(0) else 0
        }
    }

    fun getTodayCount(): Int {
        val startOfDay = getStartOfDayMillis()
        val cursor = readableDatabase.rawQuery(
            "SELECT COUNT(*) FROM $TABLE_NAME WHERE $COL_TIMESTAMP >= ?",
            arrayOf(startOfDay.toString())
        )
        cursor.use {
            return if (it.moveToFirst()) it.getInt(0) else 0
        }
    }

    fun clearAll() {
        writableDatabase.delete(TABLE_NAME, null, null)
    }

    private fun getStartOfDayMillis(): Long {
        val calendar = java.util.Calendar.getInstance().apply {
            set(java.util.Calendar.HOUR_OF_DAY, 0)
            set(java.util.Calendar.MINUTE, 0)
            set(java.util.Calendar.SECOND, 0)
            set(java.util.Calendar.MILLISECOND, 0)
        }
        return calendar.timeInMillis
    }
}
