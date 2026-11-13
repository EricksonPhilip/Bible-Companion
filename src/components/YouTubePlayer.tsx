import React from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

interface YouTubePlayerProps {
  videoId: string;
}

export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  const videoUrl =
    `https://www.youtube.com/embed/${videoId}` +
    '?playsinline=1&rel=0&controls=1';

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: videoUrl }}
        style={styles.player}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#000000',
  },
  player: {
    flex: 1,
    backgroundColor: '#000000',
  },
});