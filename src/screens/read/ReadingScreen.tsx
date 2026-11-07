import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Share,
  Clipboard,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Share2,
  Bookmark,
  Check,
  AArrowDown,
  AArrowUp,
} from 'lucide-react-native';

import { ReadStackParamList } from '../../navigation/Types';
import { BibleServices } from '../../services/BibleService';
import { Verse } from '../../models/Verse';
import { Book } from '../../data/book';
import { useBibleVersion } from '../../context/BibleVersionContext';

type ReadingRoute = RouteProp<ReadStackParamList, 'Reading'>;
type ReadingNavigation = NativeStackNavigationProp<ReadStackParamList, 'Reading'>;

export default function ReadingScreen() {
  const { bookId, chapter, verseNumber } = useRoute<ReadingRoute>().params;
  const navigation = useNavigation<ReadingNavigation>();
  const { version } = useBibleVersion();

  const flatListRef = useRef<import('react-native').FlatList<Verse>>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Prevents auto-scroll from firing more than once per navigation event.
  const hasScrolled = useRef(false);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [fontSize, setFontSize] = useState<number>(18);
  const [copiedToast, setCopiedToast] = useState(false);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<number>>(new Set());
  const [showFontControl, setShowFontControl] = useState(false);

  // 1️⃣  Load chapter data. Reset the scroll-guard whenever the chapter changes.
  useEffect(() => {
    hasScrolled.current = false;
    const allBooks = BibleServices.getBooks();
    const found = allBooks.find((b) => b.id === bookId);
    if (found) setCurrentBook(found);
    setVerses(BibleServices.getChapter(bookId, chapter));
    setSelectedVerse(null);

    return () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [bookId, chapter, version]);

  // 2️⃣  Scroll AFTER verses are in state (i.e. after React re-renders the list).
  //     requestAnimationFrame defers until the FlatList has finished its layout pass.
  useEffect(() => {
    if (!verseNumber || verseNumber <= 1 || verses.length === 0 || hasScrolled.current) {
      return;
    }

    const targetIndex = verses.findIndex((v) => v.verse === verseNumber);
    if (targetIndex === -1) return;

    hasScrolled.current = true;

    // Wait for the FlatList layout to be complete before scrolling.
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: targetIndex,
          animated: true,
          viewPosition: 0.2,
        });
      });
    }, 150);

    return () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [verses, verseNumber]);

  const handleSelectVerse = (item: Verse) => {
    if (selectedVerse?.id === item.id) {
      setSelectedVerse(null);
    } else {
      setSelectedVerse(item);
    }
  };

  const handleCopySelected = () => {
    if (!selectedVerse || !currentBook) return;
    const textToCopy = `"${selectedVerse.text.trim()}" - ${currentBook.name} ${chapter}:${selectedVerse.verse}`;
    Clipboard.setString(textToCopy);
    setCopiedToast(true);
    setTimeout(() => {
      setCopiedToast(false);
    }, 2000);
  };

  const handleShareSelected = async () => {
    if (!selectedVerse || !currentBook) return;
    try {
      await Share.share({
        message: `"${selectedVerse.text.trim()}" - ${currentBook.name} ${chapter}:${selectedVerse.verse} (Bible Companion)`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const toggleBookmark = (verseNumber: number) => {
    setBookmarkedVerses((prev) => {
      const next = new Set(prev);
      if (next.has(verseNumber)) {
        next.delete(verseNumber);
      } else {
        next.add(verseNumber);
      }
      return next;
    });
  };

  const goToPrevChapter = () => {
    if (chapter > 1) {
      navigation.navigate('Reading', { bookId, chapter: chapter - 1 });
    }
  };

  const goToNextChapter = () => {
    if (currentBook && chapter < currentBook.chapters) {
      navigation.navigate('Reading', { bookId, chapter: chapter + 1 });
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 28) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) setFontSize(fontSize - 2);
  };

  const bookName = currentBook ? currentBook.name : `Book ${bookId}`;
  const totalChapters = currentBook ? currentBook.chapters : 1;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00191A',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#0E3B3E',
      backgroundColor: '#00191A',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: 6,
      borderRadius: 10,
      backgroundColor: '#0A2B2D',
      marginRight: 10,
    },
    headerTitleContainer: {
      flexDirection: 'column',
    },
    headerTitle: {
      color: '#F5F5F5',
      fontSize: 18,
      fontWeight: '700',
    },
    headerSubtitle: {
      color: '#81A3A5',
      fontSize: 12,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    headerIconBtn: {
      padding: 8,
      borderRadius: 10,
      backgroundColor: '#0A2B2D',
    },
    fontControlPanel: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#0A2E30',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#1E5E62',
    },
    fontControlText: {
      color: '#D4AF37',
      fontSize: 14,
      fontWeight: '600',
    },
    fontBtnGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    fontBtn: {
      padding: 6,
      borderRadius: 8,
      backgroundColor: '#0E3B3E',
    },
    chapterBanner: {
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.05)',
      marginBottom: 10,
    },
    bannerBookTitle: {
      color: '#D4AF37',
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    bannerChapterTitle: {
      color: '#F5F5F5',
      fontSize: 28,
      fontWeight: '800',
      marginTop: 4,
    },
    bannerMeta: {
      color: '#81A3A5',
      fontSize: 13,
      marginTop: 4,
    },
    listContent: {
      paddingBottom: 100,
    },
    verseRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderLeftWidth: 3,
      borderLeftColor: 'transparent',
    },
    selectedVerseRow: {
      backgroundColor: 'rgba(212, 175, 55, 0.12)',
      borderLeftColor: '#D4AF37',
      borderLeftWidth: 4,
    },
    highlightedVerseRow: {
      backgroundColor: 'rgba(38, 129, 133, 0.15)',
      borderLeftColor: '#268185',
      borderLeftWidth: 4,
    },
    bookmarkedVerseRow: {
      backgroundColor: 'rgba(38, 129, 133, 0.1)',
    },
    verseNumberBadge: {
      minWidth: 28,
      height: 24,
      borderRadius: 6,
      backgroundColor: '#0A2E30',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginTop: 3,
    },
    selectedVerseNumberBadge: {
      backgroundColor: '#D4AF37',
    },
    verseNumber: {
      color: '#D4AF37',
      fontSize: 13,
      fontWeight: '700',
    },
    selectedVerseNumber: {
      color: '#00191A',
    },
    verseText: {
      color: '#F5F5F5',
      flex: 1,
      fontSize,
      lineHeight: fontSize * 1.6,
      fontWeight: '400',
    },
    actionToolbar: {
      position: 'absolute',
      bottom: 24,
      left: 20,
      right: 20,
      backgroundColor: '#0A2B2D',
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#1E5E62',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 10,
    },
    actionToolbarTitle: {
      color: '#D4AF37',
      fontSize: 14,
      fontWeight: '700',
    },
    actionButtonsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    toolbarIconBtn: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: '#0E3B3E',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeToolbarIconBtn: {
      backgroundColor: '#268185',
    },
    navFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: '#0E3B3E',
      backgroundColor: '#00191A',
    },
    navFooterBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: '#0A2B2D',
      borderWidth: 1,
      borderColor: '#184E52',
    },
    disabledNavBtn: {
      opacity: 0.4,
    },
    navFooterText: {
      color: '#F5F5F5',
      fontSize: 14,
      fontWeight: '600',
      marginHorizontal: 6,
    },
    toast: {
      position: 'absolute',
      top: 70,
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1E5E62',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
    },
    toastText: {
      color: '#F5F5F5',
      fontSize: 13,
      fontWeight: '600',
      marginLeft: 6,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00191A" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft color="#F5F5F5" size={22} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {bookName} {chapter}
            </Text>
            <Text style={styles.headerSubtitle}>{version} · Chapter {chapter} of {totalChapters}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            style={styles.headerIconBtn}
            onPress={() => setShowFontControl(!showFontControl)}
            accessibilityLabel="Adjust text size"
          >
            <AArrowUp color="#9EC5C7" size={18} />
          </Pressable>
          <Pressable
            style={[styles.headerIconBtn, chapter <= 1 && styles.disabledNavBtn]}
            onPress={goToPrevChapter}
            disabled={chapter <= 1}
          >
            <ChevronLeft color="#9EC5C7" size={20} />
          </Pressable>
          <Pressable
            style={[styles.headerIconBtn, chapter >= totalChapters && styles.disabledNavBtn]}
            onPress={goToNextChapter}
            disabled={chapter >= totalChapters}
          >
            <ChevronRight color="#9EC5C7" size={20} />
          </Pressable>
        </View>
      </View>

      {/* Font Control Dropdown */}
      {showFontControl && (
        <View style={styles.fontControlPanel}>
          <Text style={styles.fontControlText}>Text Size: {fontSize}px</Text>
          <View style={styles.fontBtnGroup}>
            <Pressable style={styles.fontBtn} onPress={decreaseFontSize}>
              <AArrowDown color="#F5F5F5" size={18} />
            </Pressable>
            <Pressable style={styles.fontBtn} onPress={increaseFontSize}>
              <AArrowUp color="#F5F5F5" size={18} />
            </Pressable>
          </View>
        </View>
      )}

      {/* Toast Notification */}
      {copiedToast && (
        <View style={styles.toast}>
          <Check color="#F5F5F5" size={14} />
          <Text style={styles.toastText}>Copied to clipboard!</Text>
        </View>
      )}

      {/* Verses List */}
      <FlatList
        ref={flatListRef}
        data={verses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          // The FlatList hasn't rendered far enough yet — jump to an
          // approximate offset first, then retry the precise scroll.
          const offset = index * averageItemLength;
          flatListRef.current?.scrollToOffset({ offset, animated: false });
          if (scrollTimer.current) clearTimeout(scrollTimer.current);
          scrollTimer.current = setTimeout(() => {
            requestAnimationFrame(() => {
              flatListRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.2,
              });
            });
          }, 200);
        }}
        ListHeaderComponent={
          <View style={styles.chapterBanner}>
            <Text style={bannerBookTitleStyle(styles)}>{bookName}</Text>
            <Text style={styles.bannerChapterTitle}>Chapter {chapter}</Text>
            <Text style={styles.bannerMeta}>{verses.length} Verses</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selectedVerse?.id === item.id;
          const isBookmarked = bookmarkedVerses.has(item.verse);
          const isHighlighted = !isSelected && item.verse === verseNumber;

          return (
            <Pressable
              style={[
                styles.verseRow,
                isSelected && styles.selectedVerseRow,
                isHighlighted && styles.highlightedVerseRow,
                isBookmarked && !isSelected && !isHighlighted && styles.bookmarkedVerseRow,
              ]}
              onPress={() => handleSelectVerse(item)}
            >
              <View
                style={[
                  styles.verseNumberBadge,
                  isSelected && styles.selectedVerseNumberBadge,
                ]}
              >
                <Text
                  style={[
                    styles.verseNumber,
                    isSelected && styles.selectedVerseNumber,
                  ]}
                >
                  {item.verse}
                </Text>
              </View>
              <Text style={styles.verseText}>{item.text.trim()}</Text>
            </Pressable>
          );
        }}
        ListFooterComponent={
          <View style={styles.navFooter}>
            <Pressable
              style={[styles.navFooterBtn, chapter <= 1 && styles.disabledNavBtn]}
              onPress={goToPrevChapter}
              disabled={chapter <= 1}
            >
              <ChevronLeft color="#F5F5F5" size={18} />
              <Text style={styles.navFooterText}>Previous</Text>
            </Pressable>
            <Pressable
              style={[styles.navFooterBtn, chapter >= totalChapters && styles.disabledNavBtn]}
              onPress={goToNextChapter}
              disabled={chapter >= totalChapters}
            >
              <Text style={styles.navFooterText}>Next Chapter</Text>
              <ChevronRight color="#F5F5F5" size={18} />
            </Pressable>
          </View>
        }
      />

      {/* Floating Action Bar for Selected Verse */}
      {selectedVerse && (
        <View style={styles.actionToolbar}>
          <Text style={styles.actionToolbarTitle}>
            Verse {selectedVerse.verse} Selected
          </Text>
          <View style={styles.actionButtonsRow}>
            <Pressable style={styles.toolbarIconBtn} onPress={handleCopySelected}>
              <Copy color="#F5F5F5" size={18} />
            </Pressable>
            <Pressable style={styles.toolbarIconBtn} onPress={handleShareSelected}>
              <Share2 color="#F5F5F5" size={18} />
            </Pressable>
            <Pressable
              style={[
                styles.toolbarIconBtn,
                bookmarkedVerses.has(selectedVerse.verse) && styles.activeToolbarIconBtn,
              ]}
              onPress={() => toggleBookmark(selectedVerse.verse)}
            >
              <Bookmark color="#F5F5F5" size={18} />
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function bannerBookTitleStyle(styles: any) {
  return styles.bannerBookTitle;
}
