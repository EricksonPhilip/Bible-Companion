import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Linking,
  Share,
  StatusBar,
  Animated,
  FlatList,
  SafeAreaView
} from 'react-native';
import { BibleRepository } from '../../database/BibleRepository';
import { BibleNewsFeedResponse } from '../../models/BibleFeeds';
import React, { useCallback, useEffect, useState } from 'react';
import { homeStyles } from '../../Styles/HomeStyle';
import { feedStyles } from '../../Styles/FeedStyle';
import { BibleNewsItem } from '../../models/BibleFeeds';
import  WebView  from 'react-native-webview';
import { ArrowLeft } from 'lucide-react-native';
import { SvgUri } from 'react-native-svg';

export default function FeedScreen() {

const [Feed, setFeed] = useState<BibleNewsFeedResponse | null>(null);
const [error, SetError] = useState<String | null>(null);
const [loading, setLoading] = useState(true);
const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
const feedImageUrl = Feed?.feed.image?.trim();

    useEffect(() => {
      loadFeeds();
    }, []);

    const loadFeeds = async() => {
        try {
          setLoading(true);
          SetError(null);

          const feeds = await BibleRepository.getBibleFeeds();
          console.log('Feed Image Url')
          console.log(feeds.feed.image)
          console.log(feeds);
          setFeed(feeds);
        } catch (error) {
          setLoading(false);
          SetError('Failed to load Feeds');
          console.log(error);
        } finally {
          setLoading(false);
        }
    }

    const renderFeedItem = ({ item }: { item: BibleNewsItem }) => (
    <View style={feedStyles.feedCard}>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={feedStyles.feedImage}
        />
      )}

      <View style={homeStyles.container}>
        <Text style={feedStyles.feedTitle} numberOfLines={0}>
          {item.title}
        </Text>

        <Text style={feedStyles.feedDescText} numberOfLines={0}>
          {item.description}
        </Text>

        <Pressable onPress={() => setSelectedUrl(item.link)} >
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
          <Text style={homeStyles.appTitle}>{Feed?.feed.title}</Text>
        </View>

        <FlatList
          data={Feed?.items}
          keyExtractor={item => item.id}
          renderItem={renderFeedItem}
          contentContainerStyle={homeStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={homeStyles.sectionTitle}>Bible News</Text>
          }
          refreshing={loading}
          onRefresh={loadFeeds}
        />
      </SafeAreaView>
    );
}
