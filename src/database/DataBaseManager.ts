import { open } from 'react-native-quick-sqlite';
import { BibleVersion } from '../types/BibleVersion';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export class DatabaseManager {
    private static database?: ReturnType<typeof open>;
    private static activeVersion: BibleVersion = BibleVersion.AKJV;

    static open(version: BibleVersion = BibleVersion.AKJV) {
        this.activeVersion = version;
        const dbFileName = `${version}.db`;
        const dbPath = `${RNFS.DocumentDirectoryPath}/${dbFileName}`;

        console.log(`🔓 Opening database: ${dbFileName}`);
        console.log(`   Path: ${dbPath}`);
        console.log(`   Platform: ${Platform.OS}`);

        try {
            this.database = open({
                name: dbFileName,
            });
            console.log(`✅ Database opened successfully: ${dbFileName}`);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error(`❌ Failed to open database ${dbFileName}: ${errorMsg}`);
            throw new Error(
                `Could not open database "${dbFileName}". ` +
                `Path: ${dbPath}. ` +
                `Error: ${errorMsg}. ` +
                `Ensure the database file was properly copied to DocumentDirectory by DatabaseInstaller.`
            );
        }
    }

    static setVersion(version: BibleVersion) {
        if (this.database) {
            this.close();
        }
        this.open(version);
    }

    static get version(): BibleVersion {
        return this.activeVersion;
    }

    static getDatabase() {
        return this.connection;
    }

    static close() {
        this.database?.close();
        this.database = undefined;
    }

    static get connection() {
        if (!this.database) {
            throw new Error('Database has not been opened. Call DatabaseManager.open() first.');
        }

        return this.database;
    }
}
