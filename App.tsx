import React, { useCallback, useEffect, useState } from "react";
import TabNavigator from "./src/navigation/TabNavigator";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppInitializer } from "./src/app/AppInitializer";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BibleVersionProvider } from './src/context/BibleVersionContext';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  const runInitialize = useCallback(() => {
    setInitializationError(null);
    setIsReady(false);
    AppInitializer.initialize()
      .then(() => setIsReady(true))
      .catch(error => setInitializationError(String(error)));
  }, []);

  useEffect(() => {
    runInitialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styles = StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#00191A',
      padding: 24,
    },
    root: {
      flex: 1,
    },
    errorTitle: {
      color: '#FF6B6B',
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
      textAlign: 'center',
    },
    errorScroll: {
      maxHeight: 200,
      width: '100%',
      backgroundColor: '#0A2B2D',
      borderRadius: 10,
      padding: 12,
      marginBottom: 20,
    },
    errorText: {
      color: '#F5F5F5',
      fontSize: 13,
      fontFamily: 'monospace',
    },
    retryButton: {
      backgroundColor: '#268185',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 12,
    },
    retryText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
    loadingText: {
      color: '#81A3A5',
      marginTop: 14,
      fontSize: 14,
    },
  });

  if (initializationError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>⚠️ Initialization Failed</Text>
        <ScrollView style={styles.errorScroll}>
          <Text style={styles.errorText}>{initializationError}</Text>
        </ScrollView>
        <Pressable style={styles.retryButton} onPress={runInitialize}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#D4AF37" size="large" />
        <Text style={styles.loadingText}>Preparing Bible databases…</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <BibleVersionProvider>
        <TabNavigator />
      </BibleVersionProvider>
    </GestureHandlerRootView>
  );
}
