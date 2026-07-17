# Database Guidelines & SQLite Architecture

This subdirectory manages the application's connection to pre-populated SQLite databases. We use `react-native-quick-sqlite` to provide fast, direct synchronous and asynchronous queries over pre-packaged database files.

---

## 🏗️ SQLite Connection & Lifecycle Management

Database connection and state is managed in `src/database/DataBaseManager.ts` by the `DatabaseManager` class:

1. **Active Version**: Defined by the `BibleVersion` enum (e.g., `AKJV`, `KJV`, `ASV`, `Tamil`).
2. **Open Database Connection**: `DatabaseManager.database` returns an active database connection using `open({ name: `${this.version}.db` })`.
3. **Database Selection**: Change the active database version using `DatabaseManager.setVersion(version: BibleVersion)`.

---

## 📦 Database Distribution across Platforms

Pre-populated Bible database files (`AKJV.db`, `ASV.db`, `KJV.db`, `Tamil.db`) are platform-native resources. They must be present in the following locations to be bundled properly:

### 🤖 Android Setup
Database files must reside in:
`android/app/src/main/assets/databases/`

### 🍎 iOS Setup
Database files must reside in the root of the `ios/` folder:
`ios/`
*Note: After adding a `.db` file to the `ios/` directory, you must also add it to the Xcode project (`BibleApp.xcodeproj`) file references bundle so that it is compiled into the app's Main Bundle.*

### 📂 Source Backups
For backup and version control, keep master `.db` copies in:
- `resources/databases/`
- `src/asset/db/`

---

## ✍️ Repository Pattern & Queries

SQL Queries are handled by repositories such as `BibleRepository` (`src/database/BibleRepository.ts`).

### Query Conventions
- Avoid hardcoding database-specific table names when querying dynamically changed versions.
- Keep table names aligned with the schema pattern or version-specific suffix (e.g., `${this.version}_verses` or `verses` depending on SQLite schema).
- Always use parameterized queries `?` with bound arrays to prevent SQL injection and syntax errors:
  ```typescript
  const db = DatabaseManager.database;
  const result = db.execute(
    `SELECT * FROM ${tableName} WHERE book_id = ? AND chapter = ? ORDER BY verse`,
    [bookId, chapter]
  );
  ```

---

## ➕ Adding a New Bible Version

To support a new Bible version, complete the following steps:

1. **Update Enum**: Add the version key to the `BibleVersion` enum in `src/types/BibleVersion.ts`.
2. **Package DB Files**: Copy the corresponding `.db` database file to:
   - `android/app/src/main/assets/databases/<Version>.db`
   - `ios/<Version>.db` (and add to Xcode resources)
   - `resources/databases/<Version>.db` (backup)
   - `src/asset/db/<Version>Bible.db` (fallback)
3. **Verify Schema**: Ensure the new database table schema aligns with the expected querying structures, or add dynamic mapping in the repository layer if there are field-name differences.
