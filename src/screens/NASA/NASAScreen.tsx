import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import { ArrowLeft, ExternalLink, X } from 'lucide-react-native';
import { NASAAstroDay } from '../../models/NASAAstroDay';
import { BibleRepository } from '../../database/BibleRepository';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const stripHtml = (html: string): string =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

export default function NASAScreen() {
  const [nasaFeeds, setNasaFeeds] = useState<NASAAstroDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    loadNasaFeeds();
  }, []);

  const loadNasaFeeds = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await BibleRepository.getAstroPicOfTheDay();
      setNasaFeeds(Array.isArray(response) ? response : [response]);
    } catch (loadError) {
      console.error('Failed to load NASA APOD:', loadError);
      setError('Failed to load NASA pictures.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: NASAAstroDay }) => {
    const isImage = item.media_type === 'image' && Boolean(item.hdurl);

    return (
      <View style={styles.card}>
        {isImage ? (
          <Pressable
            style={styles.imagePressable}
            onPress={() => setSelectedImage(item.hdurl || null)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`View ${item.title} full screen`}
          >
            <View pointerEvents="none">
              <Image
                source={{ uri: item.hdurl }}
                style={styles.image}
                resizeMode="cover"
                accessibilityLabel={item.alt || item.title}
              />
            </View>
          </Pressable>
        ) : (
          <View style={styles.mediaPlaceholder}>
            <Text style={styles.mediaType}>
              {item.media_type.toUpperCase()}
            </Text>
            <Text style={styles.mediaHint}>
              Open the NASA article to view this media
            </Text>
          </View>
        )}

        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.title}>{item.title}</Text>

        <RenderHTML
          contentWidth={width - 60}
          source={{ html: item.explanation }}
          baseStyle={{
            color: '#D7E5E5',
            fontSize: 15,
            lineHeight: 23,
          }}
          tagsStyles={{
            strong: {
              color: '#D4AF37',
              fontWeight: '800',
            },
            em: {
              fontStyle: 'italic',
            },
            a: {
              color: '#7DD3D8',
              textDecorationLine: 'underline',
            },
          }}
        />

        {(item.credit || item.copyright) && (
          <Text style={styles.credit}>{item.credit || item.copyright}</Text>
        )}

        <Pressable
          style={styles.articleButton}
          onPress={() => setSelectedUrl(item.permalink || item.url)}
          accessibilityRole="button"
          accessibilityLabel={`Open NASA article ${item.title}`}
        >
          <Text style={styles.articleButtonText}>Open NASA article</Text>
          <ExternalLink color="#FFFFFF" size={17} />
        </Pressable>
      </View>
    );
  };

  if (selectedUrl) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#00191A" />
        <View style={styles.webHeader}>
          <Pressable style={styles.backButton} onPress={() => setSelectedUrl(null)}>
            <ArrowLeft color="#FFFFFF" size={22} />
          </Pressable>
          <Text style={styles.webHeaderTitle}>NASA APOD</Text>
        </View>
        <WebView source={{ uri: selectedUrl }} style={styles.webView} startInLoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00191A" />

      <Modal
        visible={selectedImage !== null}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.fullScreenViewer}>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />
          <Pressable
            style={styles.closeViewerButton}
            onPress={() => setSelectedImage(null)}
            accessibilityRole="button"
            accessibilityLabel="Close full-screen image"
          >
            <X color="#FFFFFF" size={26} />
          </Pressable>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>NASA Astronomy Picture</Text>
        <Text style={styles.headerSubtitle}>Explore the universe every day</Text>
      </View>

      {loading && nasaFeeds.length === 0 ? (
        <View style={styles.centerMessage}>
          <ActivityIndicator color="#D4AF37" size="large" />
          <Text style={styles.messageText}>Loading NASA pictures...</Text>
        </View>
      ) : error && nasaFeeds.length === 0 ? (
        <View style={styles.centerMessage}>
          <Text style={styles.messageText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadNasaFeeds}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={nasaFeeds}
          keyExtractor={(item) => `${item.post_id}-${item.date}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadNasaFeeds}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#00191A' },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  headerTitle: { color: '#F5F5F5', fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: '#81A3A5', fontSize: 14, marginTop: 4 },
  listContent: { padding: 16, paddingBottom: 36 },
  card: {
    backgroundColor: '#0A2B2D',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#184E52',
    padding: 14,
    marginBottom: 18,
  },
  image: { width: '100%', height: 210, borderRadius: 12, backgroundColor: '#0E3B3E' },
  imagePressable: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaPlaceholder: {
    height: 150,
    borderRadius: 12,
    backgroundColor: '#0E3B3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaType: { color: '#D4AF37', fontSize: 18, fontWeight: '800' },
  mediaHint: { color: '#9EC5C7', fontSize: 13, marginTop: 6 },
  date: { color: '#D4AF37', fontSize: 13, fontWeight: '700', marginTop: 14 },
  title: { color: '#F5F5F5', fontSize: 20, fontWeight: '800', marginTop: 5, paddingVertical: 10 },
  description: { color: '#D7E5E5', fontSize: 15, lineHeight: 23, marginTop: 10 },
  credit: { color: '#81A3A5', fontSize: 12, marginTop: 12 },
  articleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#268185',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
  },
  articleButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  centerMessage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  messageText: { color: '#D7E5E5', fontSize: 15, textAlign: 'center', marginTop: 12 },
  retryButton: { backgroundColor: '#268185', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10, marginTop: 16 },
  retryButtonText: { color: '#FFFFFF', fontWeight: '700' },
  webHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#0E3B3E' },
  backButton: { padding: 6, marginRight: 10 },
  webHeaderTitle: { color: '#F5F5F5', fontSize: 18, fontWeight: '800' },
  webView: { flex: 1 },
  fullScreenViewer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeViewerButton: {
    position: 'absolute',
    zIndex: 2,
    top: 54,
    right: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
});
