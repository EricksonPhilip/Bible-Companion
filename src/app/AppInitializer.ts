import { DatabaseInstaller } from "../database/DatabaseInstaller";
import { DatabaseManager } from "../database/DataBaseManager";

// Maximum time (ms) to wait for initialization before giving up.
const INIT_TIMEOUT_MS = 30_000;

export class AppInitializer {
    static async initialize() {
        console.log('🚀 Initializing App....');

        await withTimeout(
            this._doInitialize(),
            INIT_TIMEOUT_MS,
            'App initialization timed out after 30 s. This typically means the database files were not found or cannot be accessed. Check that:\n' +
            '1. For iOS: Database .db files are added to Xcode Resources\n' +
            '2. For Android: Database files exist in android/app/src/main/assets/databases/\n' +
            '3. React Native File System (RNFS) can access the bundle/assets'
        );

        console.log('✅ Initialization Complete');
    }

    private static async _doInitialize() {
        // Close any stale connection first (e.g. after Fast Refresh).
        try {
            DatabaseManager.close();
        } catch {
            // Ignore – nothing was open yet.
        }

        console.log('📦 Installing active database...');
        await DatabaseInstaller.install(DatabaseManager.version);

        console.log('🔓 Opening database...');
        DatabaseManager.open();
        console.log('✅ Database opened successfully');
    }
}

/** Races a promise against a timeout that rejects with a descriptive message. */
function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(message)), ms);
        promise
            .then((value) => { clearTimeout(timer); resolve(value); })
            .catch((err) => { clearTimeout(timer); reject(err); });
    });
}
