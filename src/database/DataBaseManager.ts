import { open } from 'react-native-quick-sqlite';
import { BibleVersion } from '../types/BibleVersion';

export class DatabaseManager {

  private static version = BibleVersion.AKJV;

  static get database() {
    return open({
      name: `${this.version}.db`,
    });
  }

  static setVersion(version: BibleVersion) {
    this.version = version;
  }

}