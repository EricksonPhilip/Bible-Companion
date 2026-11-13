import React, { useCallback, useEffect, useState } from 'react';
import {
    Sun,
    Cloud,
    CloudRain,
    CloudLightning,
    Snowflake,
    Wind,
    CloudFog,
    Moon,
    Droplets,
    Thermometer,
    MapPin,
} from 'lucide-react-native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Clipboard,
  Image,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  BookOpen,
  Share2,
  Copy,
  Heart,
  RefreshCw,
  Sparkles,
  Calendar,
  ChevronRight,
  Check,
} from 'lucide-react-native';

import { RootTabParamList } from '../../navigation/Types';
import { BibleServices } from '../../services/BibleService';
import { BibleRepository } from '../../database/BibleRepository';
import { DailyVerse } from '../../models/DailyVerse';
import { useBibleVersion } from '../../context/BibleVersionContext';
import { WeatherResponse } from '../../data/Weather';
import { homeStyles } from '../../Styles/HomeStyle';

type NavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { version } = useBibleVersion();
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [error, SetError] = useState<String | null>(null)
  const [loading, setLoading] = useState(true)

  const loadDailyVerse = useCallback(async (customIndex?: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const verse = await BibleRepository.getVerseOfDayAsync(customIndex);
    setDailyVerse(verse);
    setIsFavorite(false);
  }, [fadeAnim]);

  useEffect(() => {
    loadDailyVerse().catch((error) => {
      console.warn('Unable to load the daily verse:', error);
    });
  }, [loadDailyVerse, version]);

  useEffect(() => {
    loadWeather()
  }, []);

  const loadWeather = async () => {
      try {
          setLoading(true)
          SetError(null)
          
          const weather = await BibleRepository.getWeather()
          console.log(weather)
          setWeather(weather)
      } catch(error) {
          setLoading(false)
          SetError("Failed to load Weather")
          console.log(error)
      } finally {
          setLoading(false)
      }
  }

  const handleRefresh = async () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const randomVerse = await BibleServices.getRandomVerseOfDayAsync();
    setDailyVerse(randomVerse);
    setIsFavorite(false);
  };

  const handleReadChapter = () => {
    if (!dailyVerse) return;
    navigation.navigate('Read', {
      screen: 'Reading',
      params: {
        bookId: dailyVerse.bookId,
        chapter: dailyVerse.chapter,
        verseNumber: dailyVerse.verse,
      },
    });
  };

  const handleShare = async () => {
    if (!dailyVerse) return;
    try {
      await Share.share({
        message: `"${dailyVerse.text.trim()}" - ${dailyVerse.bookName} ${dailyVerse.chapter}:${dailyVerse.verse} (Bible Companion)`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleCopy = () => {
    if (!dailyVerse) return;
    const textToCopy = `"${dailyVerse.text.trim()}" - ${dailyVerse.bookName} ${dailyVerse.chapter}:${dailyVerse.verse}`;
    Clipboard.setString(textToCopy);
    setCopiedToast(true);
    setTimeout(() => {
      setCopiedToast(false);
    }, 2000);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const weatherIcon = weather?.current.condition.icon
    ? `https:${weather.current.condition.icon}`
    : null;

  return (
    <SafeAreaView style={homeStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00191A" />
      <ScrollView
        style={homeStyles.container}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={homeStyles.header}>
          <View>
            <Text style={homeStyles.greetingText}>{getGreeting()}</Text>
            <Text style={homeStyles.appTitle}>Bible Companion</Text>
          </View>
          <View style={homeStyles.dateBadge}>
            <Calendar color="#D4AF37" size={14} />
            <Text style={homeStyles.dateText}>
              {dailyVerse ? dailyVerse.dateString : 'Today'}
            </Text>
          </View>
        </View>

        {/* Weather */}
        <View style={homeStyles.weatherCard}>
          <View style={homeStyles.weatherCompactRow}>
            <View style={homeStyles.weatherCompactLocation}>
              <MapPin color="#D4AF37" size={14} />
              <Text style={homeStyles.weatherLocation} numberOfLines={1}>
                {weather?.location.name || 'Weather'}
              </Text>
            </View>

            {loading ? (
              <Text style={homeStyles.weatherLoadingText}>Loading...</Text>
            ) : error ? (
              <Text style={homeStyles.weatherLoadingText}>Unavailable</Text>
            ) : weather ? (
              <>
                {weatherIcon ? (
                  <Image source={{ uri: weatherIcon }} style={homeStyles.weatherCompactIcon} />
                ) : (
                  <Cloud color="#D4AF37" size={25} />
                )}
                <Text style={homeStyles.weatherCompactTemperature}>
                  {Math.round(weather.current.temp_f)}°
                </Text>
                <Text style={homeStyles.weatherCompactCondition} numberOfLines={1}>
                  {weather.current.condition.text}
                </Text>
              </>
            ) : null}

            <Pressable style={homeStyles.weatherCompactRefresh} onPress={loadWeather} accessibilityLabel="Refresh weather">
              <RefreshCw color="#9EC5C7" size={15} />
            </Pressable>
          </View>
        </View>

        {/* Verse of the Day Main Card */}
        {dailyVerse && (
          <Animated.View style={[homeStyles.card, { opacity: fadeAnim }]}>
            <View style={homeStyles.cardHeader}>
              <View style={homeStyles.tagContainer}>
                <Sparkles color="#D4AF37" size={14} />
                <Text style={homeStyles.tagText}>VERSE OF THE DAY · {version}</Text>
              </View>
              <Pressable
                onPress={handleRefresh}
                style={homeStyles.refreshButton}
                accessibilityLabel="Get another verse"
              >
                <RefreshCw color="#9EC5C7" size={18} />
              </Pressable>
            </View>

            <View style={homeStyles.quoteContainer}>
              <Text style={homeStyles.verseText}>"{dailyVerse.text.trim()}"</Text>
            </View>

            <View style={homeStyles.referenceContainer}>
              <Text style={homeStyles.referenceText}>
                {dailyVerse.bookName} {dailyVerse.chapter}:{dailyVerse.verse}
              </Text>
              <View style={homeStyles.themeBadge}>
                <Text style={homeStyles.themeText}>{dailyVerse.theme}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={homeStyles.actionsRow}>
              <Pressable style={homeStyles.primaryButton} onPress={handleReadChapter}>
                <BookOpen color="#FFFFFF" size={18} />
                <Text style={homeStyles.primaryButtonText}>Read Chapter</Text>
              </Pressable>

              <Pressable
                style={homeStyles.iconButton}
                onPress={handleShare}
                accessibilityLabel="Share verse"
              >
                <Share2 color="#9EC5C7" size={20} />
              </Pressable>

              <Pressable
                style={homeStyles.iconButton}
                onPress={handleCopy}
                accessibilityLabel="Copy verse"
              >
                <Copy color="#9EC5C7" size={20} />
              </Pressable>

              <Pressable
                style={[
                  homeStyles.iconButton,
                  isFavorite && homeStyles.favoriteIconButton,
                ]}
                onPress={toggleFavorite}
                accessibilityLabel="Favorite verse"
              >
                <Heart
                  color={isFavorite ? '#D4AF37' : '#9EC5C7'}
                  fill={isFavorite ? '#D4AF37' : 'none'}
                  size={20}
                />
              </Pressable>
            </View>

            {copiedToast && (
              <View style={homeStyles.toast}>
                <Check color="#F5F5F5" size={14} />
                <Text style={homeStyles.toastText}>Copied to clipboard!</Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Reflection / Thought for Today */}
        {dailyVerse?.reflection && (
          <View style={homeStyles.reflectionCard}>
            <View style={homeStyles.reflectionHeader}>
              <Sparkles color="#268185" size={16} />
              <Text style={homeStyles.reflectionTitle}>Thought for Today</Text>
            </View>
            <Text style={homeStyles.reflectionText}>{dailyVerse.reflection}</Text>
          </View>
        )}

        {/* Quick Actions */}
        <Text style={homeStyles.sectionTitle}>Explore Scripture</Text>
        <Pressable
          style={homeStyles.quickNavCard}
          onPress={() => navigation.navigate('Read', { screen: 'Books' })}
        >
          <View style={homeStyles.quickNavIcon}>
            <BookOpen color="#D4AF37" size={22} />
          </View>
          <View style={homeStyles.quickNavContent}>
            <Text style={homeStyles.quickNavTitle}>Browse All Books</Text>
            <Text style={homeStyles.quickNavSub}>Explore Old & New Testaments</Text>
          </View>
          <ChevronRight color="#81A3A5" size={20} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
