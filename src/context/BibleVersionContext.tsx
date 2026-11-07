import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { DatabaseInstaller } from '../database/DatabaseInstaller';
import { DatabaseManager } from '../database/DataBaseManager';
import { BibleVersion } from '../types/BibleVersion';

type BibleVersionContextValue = {
  version: BibleVersion;
  setVersion: (version: BibleVersion) => Promise<void>;
};

const BibleVersionContext = createContext<BibleVersionContextValue | undefined>(undefined);

export const BIBLE_VERSION_OPTIONS: Array<{ value: BibleVersion; label: string }> = [
  { value: BibleVersion.AKJV, label: 'AKJV' },
  { value: BibleVersion.KJV, label: 'KJV' },
  { value: BibleVersion.ASV, label: 'ASV' },
  { value: BibleVersion.Tamil, label: 'Tamil' },
];

export function BibleVersionProvider({ children }: { children: ReactNode }) {
  const [version, setSelectedVersion] = useState<BibleVersion>(DatabaseManager.version);

  const value = useMemo(() => ({
    version,
    setVersion: async (nextVersion: BibleVersion) => {
      if (nextVersion === version) return;
      await DatabaseInstaller.install(nextVersion);
      DatabaseManager.setVersion(nextVersion);
      setSelectedVersion(nextVersion);
    },
  }), [version]);

  return (
    <BibleVersionContext.Provider value={value}>
      {children}
    </BibleVersionContext.Provider>
  );
}

export function useBibleVersion() {
  const context = useContext(BibleVersionContext);
  if (!context) {
    throw new Error('useBibleVersion must be used within BibleVersionProvider.');
  }
  return context;
}
