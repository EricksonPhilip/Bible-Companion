import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, BookOpen, Newspaper } from 'lucide-react-native';
import { StyleSheet, View, Text } from 'react-native';
import HomeScreen from '../screens/home/HomeScreen';
import FeedScreen from '../screens/Feed/FeedScreen';
import ReadNavigator from './ReadNavigator';
import { RootTabParamList } from './Types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00191A',
  },
  tabBar: {
    backgroundColor: '#00191A',
    borderTopWidth: 1,
    borderTopColor: '#0E3B3E',
    paddingBottom: 4,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center' as const,
  },
  activeIndicator: {
    width: 32,
    height: 3,
    backgroundColor: '#D4AF37',
    borderRadius: 1.5,
    marginBottom: 4,
  },
});

function HomeTabIcon({ color, size, focused }: { color: string; size: number; focused?: boolean }) {
  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.activeIndicator} />}
      <House color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
    </View>
  );
}

function ReadTabIcon({ color, size, focused }: { color: string; size: number; focused?: boolean }) {
  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.activeIndicator} />}
      <BookOpen color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
    </View>
  );
}

function FeedTabIcon({ color, size, focused }: { color: string; size: number; focused?: boolean }) {
  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.activeIndicator} />}
      <Newspaper color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
    </View>
  );
}

export default function TabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          sceneStyle: styles.container,
          tabBarStyle: styles.tabBar,
          headerShown: false,
          tabBarActiveTintColor: '#D4AF37',
          tabBarInactiveTintColor: '#81A3A5',
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>
              {route.name === 'Home' ? 'Home' : 'Read'}
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === 'Home') {
              return <HomeTabIcon color={color} size={size} focused={focused} />;
            } else if (route.name == 'Feed') {
               return <FeedTabIcon color={color} size={size} focused={focused} />;
            } else {
               return <ReadTabIcon color={color} size={size} focused={focused} />;
            }
            
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
          }}
        />

        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarLabel: 'Feed',
          }}
        />

        <Tab.Screen
          name="Read"
          component={ReadNavigator}
          options={{
            tabBarLabel: 'Read',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}