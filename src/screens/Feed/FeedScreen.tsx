/* Imports */
import {
  View, Text, Pressable,
  Image, StatusBar, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { homeStyles } from '../../Styles/HomeStyle';
import { feedStyles } from '../../Styles/FeedStyle';
import { BibleNewsItem } from '../../models/BibleFeeds';
import  WebView  from 'react-native-webview';
import { ArrowLeft } from 'lucide-react-native';
import { decodeHtml ,useFeedViewModel } from '../../hooks/useFeedViewModel';

function FeedItemImage({ uri }: { uri: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) return null;

  return (
    <Image
      source={{ uri }}
      style={feedStyles.feedImage}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function FeedScreen() {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const { 
    items, title, loading, error,
    selectedFeed, selectFeed, feedTags, reload 
  } = useFeedViewModel();

  const renderFeedItem = ({ item }: { item: BibleNewsItem }) => (

    <View style={feedStyles.feedCard}>
      <FeedItemImage uri={item.image?.trim() || null} />

      <View style={homeStyles.container}>
        <Text style={feedStyles.feedTitle} numberOfLines={0}>
          {item.title}
        </Text>

        <Text style={feedStyles.feedDescText} numberOfLines={0}>
          {item.description}
        </Text>

        {item.author && (
          <Text style={feedStyles.feedAuthorText}>{item.author}</Text>
        )}

        <Pressable onPress={() => setSelectedUrl(item.link)}>
          <Text style={feedStyles.feedReadArtText}>Read article →</Text>
        </Pressable>
      </View>
    </View>
  );

  if (selectedUrl) {
    return (
      <SafeAreaView style={homeStyles.safeArea}>
        <View style={homeStyles.header}>
          <Pressable onPress={() => setSelectedUrl(null)}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </Pressable>

          <Text style={feedStyles.feedHeader}>Bible News</Text>
        </View>

        <WebView
          source={{ uri: selectedUrl }}
          style={{ flex: 1 }}
          startInLoadingState
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={homeStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00191A" />

      <View style={feedStyles.feedHeader}>
        <Text style={feedStyles.feedHeaderTitle}>{decodeHtml(title)}</Text>
      </View>

      <FlatList
        style={feedStyles.tagList}
        data={feedTags}
        horizontal
        directionalLockEnabled
        bounces={false}
        keyExtractor={item => item.type}
        renderItem={({ item }) => {
          const isSelected = selectedFeed === item.type;

          return (
            <Pressable
              style={[
                feedStyles.tagButton,
                isSelected && feedStyles.selectedTagButton,
              ]}
              onPress={() => selectFeed(item.type)}
            >

              <Text
                style={[
                  feedStyles.tagText,
                  isSelected && feedStyles.selectedTagText,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        }}
        contentContainerStyle={feedStyles.tagContent}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        style={feedStyles.feedList}
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderFeedItem}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={reload}
      />
    </SafeAreaView>
  );
}
