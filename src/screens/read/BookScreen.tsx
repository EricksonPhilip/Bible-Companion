import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, X, ChevronDown, ChevronUp, BookOpen } from 'lucide-react-native';

import { Book } from '../../data/book';
import { BibleServices } from '../../services/BibleService';
import { ReadStackParamList } from '../../navigation/Types';
import { BIBLE_VERSION_OPTIONS, useBibleVersion } from '../../context/BibleVersionContext';

type BookScreenNavigationProp = NativeStackNavigationProp<ReadStackParamList, 'Books'>;

type TestamentFilter = 'ALL' | 'OT' | 'NT';

export default function BookScreen() {
  const navigation = useNavigation<BookScreenNavigationProp>();
  const { version, setVersion } = useBibleVersion();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [testament, setTestament] = useState<TestamentFilter>('ALL');
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null);

  const expansion = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<Book>>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loaded = BibleServices.getBooks();
    setBooks(loaded);
    setFilteredBooks(loaded);
    setExpandedBookId(null);
  }, [version]);

  useEffect(() => {
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    let result = books;

    if (testament === 'OT') {
      result = result.filter((b) => b.id <= 39);
    } else if (testament === 'NT') {
      result = result.filter((b) => b.id >= 40);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) => b.name.toLowerCase().includes(q));
    }

    setFilteredBooks(result);
  }, [searchQuery, testament, books]);

  const scrollToBook = (bookId: number, delay = 0) => {
    const index = filteredBooks.findIndex((book) => book.id === bookId);
    if (index === -1) return;

    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.3,
      });
    }, delay);
  };

  const toggleBook = (bookId: number) => {
    expansion.stopAnimation();

    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    if (expandedBookId === bookId) {
      Animated.timing(expansion, {
        toValue: 0,
        duration: 160,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setExpandedBookId(null);
        }
      });
      return;
    }

    setExpandedBookId(bookId);
    expansion.setValue(0);
    Animated.timing(expansion, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    scrollToBook(bookId, 240);
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#00191A',
    },
    container: {
      flex: 1,
      backgroundColor: '#00191A',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: '#F5F5F5',
      marginLeft: 10,
    },
    versionPicker: {
      flexDirection: 'row',
      backgroundColor: '#092426',
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: '#144346',
      marginBottom: 14,
    },
    versionButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: 9,
    },
    activeVersionButton: {
      backgroundColor: '#D4AF37',
    },
    versionButtonText: {
      color: '#81A3A5',
      fontSize: 12,
      fontWeight: '700',
    },
    activeVersionButtonText: {
      color: '#00191A',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#0A2B2D',
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: '#184E52',
      marginBottom: 14,
    },
    searchInput: {
      flex: 1,
      color: '#F5F5F5',
      fontSize: 15,
      marginLeft: 10,
      padding: 0,
    },
    tabsRow: {
      flexDirection: 'row',
      backgroundColor: '#092426',
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: '#144346',
    },
    tabBtn: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 9,
    },
    activeTabBtn: {
      backgroundColor: '#268185',
    },
    tabText: {
      color: '#81A3A5',
      fontSize: 11,
      fontWeight: '600',
    },
    activeTabText: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      paddingTop: 8,
    },
    bookCard: {
      backgroundColor: '#0A2B2D',
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 18,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#184E52',
    },
    expandedBookCard: {
      borderColor: '#D4AF37',
      backgroundColor: '#0B3134',
    },
    bookHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bookLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bookIdBadge: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: '#0F3A3D',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    bookIdText: {
      color: '#D4AF37',
      fontSize: 13,
      fontWeight: '700',
    },
    bookName: {
      color: '#F5F5F5',
      fontSize: 18,
      fontWeight: '700',
    },
    chapterCountText: {
      color: '#81A3A5',
      fontSize: 12,
      marginTop: 2,
    },
    testamentHeader: {
      color: '#D4AF37',
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginTop: 14,
      marginBottom: 10,
    },
    chapterGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.08)',
      gap: 10,
    },
    chapterTile: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: '#0E3B3E',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#1E5E62',
    },
    chapterTileText: {
      color: '#F5F5F5',
      fontSize: 15,
      fontWeight: '600',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      color: '#81A3A5',
      fontSize: 16,
      marginTop: 10,
    },
  });

  const animatedChapterStyle = {
    opacity: expansion,
    transform: [
      {
        translateY: expansion.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        }),
      },
      {
        scaleY: expansion.interpolate({
          inputRange: [0, 1],
          outputRange: [0.92, 1],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00191A" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <BookOpen color="#D4AF37" size={26} />
            <Text style={styles.headerTitle}>Holy Bible · {version}</Text>
          </View>

          <View style={styles.versionPicker} accessibilityLabel="Bible version selector">
            {BIBLE_VERSION_OPTIONS.map((option) => {
              const isActive = option.value === version;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.versionButton, isActive && styles.activeVersionButton]}
                  onPress={() => setVersion(option.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={`Use ${option.label} Bible version`}
                >
                  <Text style={[styles.versionButtonText, isActive && styles.activeVersionButtonText]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search color="#81A3A5" size={18} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search books (e.g. Genesis, John)..."
              placeholderTextColor="#5B7E80"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <Pressable onPress={() => setSearchQuery('')}>
                <X color="#81A3A5" size={18} />
              </Pressable>
            )}
          </View>

          {/* Testament Tabs */}
          <View style={styles.tabsRow}>
            <Pressable
              style={[styles.tabBtn, testament === 'ALL' && styles.activeTabBtn]}
              onPress={() => setTestament('ALL')}
            >
              <Text style={[styles.tabText, testament === 'ALL' && styles.activeTabText]}>
                All
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tabBtn, testament === 'OT' && styles.activeTabBtn]}
              onPress={() => setTestament('OT')}
            >
              <Text style={[styles.tabText, testament === 'OT' && styles.activeTabText]}>
                Old Testament
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tabBtn, testament === 'NT' && styles.activeTabBtn]}
              onPress={() => setTestament('NT')}
            >
              <Text style={[styles.tabText, testament === 'NT' && styles.activeTabText]}>
                New Testament
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Books List */}
        <FlatList
          ref={flatListRef}
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={({ index, averageItemLength }) => {
            flatListRef.current?.scrollToOffset({
              offset: index * averageItemLength,
              animated: true,
            });
            scrollTimer.current = setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.3,
              });
            }, 100);
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Search color="#5B7E80" size={40} />
              <Text style={styles.emptyText}>No books found matching "{searchQuery}"</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isExpanded = expandedBookId === item.id;
            const isFirstNewTestament =
              testament === 'ALL' &&
              searchQuery === '' &&
              item.id === 40 &&
              index > 0;
            const isFirstOldTestament =
              testament === 'ALL' && searchQuery === '' && item.id === 1;

            return (
              <View>
                {isFirstOldTestament && (
                  <Text style={styles.testamentHeader}>Old Testament</Text>
                )}
                {isFirstNewTestament && (
                  <Text style={styles.testamentHeader}>New Testament</Text>
                )}

                <Pressable
                  style={[styles.bookCard, isExpanded && styles.expandedBookCard]}
                  onPress={() => toggleBook(item.id)}
                >
                  <View style={styles.bookHeader}>
                    <View style={styles.bookLeft}>
                      <View style={styles.bookIdBadge}>
                        <Text style={styles.bookIdText}>{item.id}</Text>
                      </View>
                      <View>
                        <Text style={styles.bookName}>{item.name}</Text>
                        <Text style={styles.chapterCountText}>
                          {item.chapters} {item.chapters === 1 ? 'Chapter' : 'Chapters'}
                        </Text>
                      </View>
                    </View>

                    {isExpanded ? (
                      <ChevronUp color="#D4AF37" size={22} />
                    ) : (
                      <ChevronDown color="#81A3A5" size={22} />
                    )}
                  </View>

                  {isExpanded && (
                    <Animated.View style={animatedChapterStyle}>
                      <View style={styles.chapterGrid}>
                        {Array.from({ length: item.chapters }).map((_, idx) => {
                          const chapNum = idx + 1;
                          return (
                            <Pressable
                              key={chapNum}
                              style={styles.chapterTile}
                              onPress={(event) => {
                                event.stopPropagation();
                                navigation.navigate('Verses', {
                                  bookId: item.id,
                                  bookName: item.name,
                                  chapter: chapNum,
                                });
                              }}
                            >
                              <Text style={styles.chapterTileText}>{chapNum}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </Animated.View>
                  )}
                </Pressable>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
