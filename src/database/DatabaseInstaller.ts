import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { BibleVersion } from '../types/BibleVersion';

export class DatabaseInstaller {

    // Bump this whenever one of the bundled database files changes. Each
    // database keeps its own install marker so startup can install only the
    // currently selected version and avoid copying every file on launch.
    private static readonly bundleVersion = '2';

    private static databases = [
        'AKJV.db',
        'ASV.db',
        'KJV.db',
        'Tamil.db',
    ];

    static async install(version: BibleVersion | string) {
        const database = this.resolveDatabaseName(version);
        console.log(`📂 DatabaseInstaller: checking ${database}...`);

        const shouldReplace = await this.shouldReplace(database);

        const destination = `${RNFS.DocumentDirectoryPath}/${database}`;
        const exists = await RNFS.exists(destination);

        if (exists && !shouldReplace) {
            console.log(`✅ ${database} already installed – skipping.`);
            return;
        }

        if (exists) {
            console.log(`🗑️  Removing stale ${database}...`);
            await RNFS.unlink(destination);
        }

        console.log(`📋 Copying ${database} (this may take a moment for large files)...`);
        await this.copyDatabase(database);
        await this.writeInstalledVersion(database);
        console.log(`✅ ${database} ready.`);
    }

    private static async shouldReplace(database: string) {
        const installedVersion = await this.readInstalledVersion(database);
        const shouldReplace = installedVersion !== this.bundleVersion;

        if (shouldReplace) {
            console.log(
                `📂 Bundle version changed for ${database} (stored: ${installedVersion ?? 'none'} → ${this.bundleVersion}). ` +
                'Replacing database.'
            );
        }

        return shouldReplace;
    }

    private static getInstallMarker(database: string) {
        return `${RNFS.DocumentDirectoryPath}/${database}.version`;
    }

    private static async readInstalledVersion(database: string) {
        const installMarker = this.getInstallMarker(database);
        const markerExists = await RNFS.exists(installMarker);
        return markerExists ? RNFS.readFile(installMarker, 'utf8') : null;
    }

    private static async writeInstalledVersion(database: string) {
        const installMarker = this.getInstallMarker(database);
        await RNFS.writeFile(installMarker, this.bundleVersion, 'utf8');
    }

    private static async copyDatabase(database: string) {
        const destination = `${RNFS.DocumentDirectoryPath}/${database}`;

        if (Platform.OS === 'ios') {
            // Try multiple possible bundle paths for better simulator compatibility
            const possiblePaths = [
                `${RNFS.MainBundlePath}/${database}`,
                `${RNFS.MainBundlePath}/databases/${database}`,
                `${RNFS.MainBundlePath}/Frameworks/BibleApp.framework/${database}`,
            ];

            let bundlePath: string | null = null;
            for (const path of possiblePaths) {
                const exists = await RNFS.exists(path);
                if (exists) {
                    bundlePath = path;
                    console.log(`✅ Found database at: ${path}`);
                    break;
                }
            }

            if (!bundlePath) {
                throw new Error(
                    `Database file "${database}" was not found in the iOS main bundle. ` +
                    `Tried paths: ${possiblePaths.join(', ')}. ` +
                    'Make sure the .db file is added to the Xcode project file references.'
                );
            }

            await RNFS.copyFile(bundlePath, destination);
        } else {
            // Android: try both possible asset paths
            const assetPaths = [
                `databases/${database}`,
                database,
            ];

            let success = false;
            let lastError: Error | null = null;

            for (const assetPath of assetPaths) {
                try {
                    console.log(`Attempting to copy asset: ${assetPath}`);
                    await RNFS.copyFileAssets(assetPath, destination);
                    console.log(`✅ Successfully copied from: ${assetPath}`);
                    success = true;
                    break;
                } catch (err) {
                    lastError = err instanceof Error ? err : new Error(String(err));
                    console.log(`❌ Failed to copy from ${assetPath}: ${lastError.message}`);
                }
            }

            if (!success) {
                throw new Error(
                    `Failed to copy Android database "${database}" from assets. ` +
                    `Tried paths: ${assetPaths.join(', ')}. ` +
                    `Last error: ${lastError?.message}`
                );
            }
        }
    }

    private static resolveDatabaseName(version: BibleVersion | string) {
        const database = version.endsWith('.db') ? version : `${version}.db`;

        if (!this.databases.includes(database)) {
            throw new Error(`Unknown database requested for install: ${version}`);
        }

        return database;
    }
}
