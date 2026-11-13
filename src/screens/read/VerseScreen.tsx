import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';

import { Verse } from '../../models/Verse';
import { ReadStackParamList } from '../../navigation/Types';
import { BibleServices } from '../../services/BibleService';
import { useBibleVersion } from '../../context/BibleVersionContext';

type VerseRoute = RouteProp<ReadStackParamList, 'Verses'>;
type VerseNavigation = NativeStackNavigationProp<ReadStackParamList, 'Verses'>;

export default function VerseScreen() {
  const { bookId, bookName, chapter } = useRoute<VerseRoute>().params;
  const navigation = useNavigation<VerseNavigation>();
  const { version } = useBibleVersion();
  const [verses, setVerses] = useState<Verse[]>([]);

  useEffect(() => {
    setVerses(BibleServices.getChapter(bookId, chapter));
  }, [bookId, chapter, version]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00191A" />
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back to chapter selection"
        >
          <ChevronLeft color="#F5F5F5" size={22} />
        </Pressable>
        <View>
          <Text style={styles.title}>Select a verse</Text>
          <Text style={styles.subtitle}>{bookName} · Chapter {chapter}</Text>
        </View>
      </View>

      <FlatList
        data={verses}
        keyExtractor={(item) => item.id.toString()}
        numColumns={5}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={
          <Text style={styles.helperText}>
            Choose a verse to open it in the reader.
          </Text>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No verses are available for this chapter.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.verseTile}
            onPress={() => navigation.navigate('Reading', {
              bookId,
              chapter,
              verseNumber: item.verse,
            })}
            accessibilityRole="button"
            accessibilityLabel={`Open ${bookName} chapter ${chapter}, verse ${item.verse}`}
          >
            <Text style={styles.verseNumber}>{item.verse}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#00191A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0E3B3E',
  },
  backButton: {
    padding: 7,
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: '#0A2B2D',
  },
  title: { color: '#F5F5F5', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#81A3A5', fontSize: 13, marginTop: 2 },
  grid: { padding: 20, paddingBottom: 40 },
  // Keep incomplete rows aligned from the left instead of pushing the last
  // verse to the far right (for example, verses 26 and 27).
  gridRow: { justifyContent: 'flex-start', marginBottom: 12 },
  helperText: {
    color: '#81A3A5',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  verseTile: {
    width: 54,
    height: 54,
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#0A2B2D',
    borderWidth: 1,
    borderColor: '#184E52',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumber: { color: '#F5F5F5', fontSize: 16, fontWeight: '700' },
  emptyText: { color: '#81A3A5', fontSize: 15, textAlign: 'center', marginTop: 28 },
});
