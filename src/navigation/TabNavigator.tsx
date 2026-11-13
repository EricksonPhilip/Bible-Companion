import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, BookOpen, Newspaper, Rocket } from 'lucide-react-native';
import { StyleSheet, View, Text } from 'react-native';
import HomeScreen from '../screens/home/HomeScreen';
import FeedScreen from '../screens/Feed/FeedScreen';
import ReadNavigator from './ReadNavigator';
import { RootTabParamList } from './Types';
import NASAScreen from '../screens/NASA/NASAScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5ec4c7',
  },
  tabBar: {
    backgroundColor: '#023e40',
    borderTopWidth: 1,
    borderTopColor: '#0E3B3E',
    paddingBottom: 2,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 17,
    fontWeight: '600',
    padding: 12 
  },
  iconContainer: {
    alignItems: 'center' as const,
  },
  activeIndicator: {
    width: 32,
    height: 0,
    backgroundColor: '#D4AF37',
    borderRadius: 1.5,
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

function NasaTabIcon({ color, size, focused }: { color: string; size: number; focused?: boolean }) {
  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.activeIndicator} />}
      <Rocket color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
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
            <Text style={[styles.tabLabel, { color }]}></Text>
          ),
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === 'Home') {
              return <HomeTabIcon color={color} size={size} focused={focused} />;
            } else if (route.name == 'Read') {
               return <ReadTabIcon color={color} size={size} focused={focused} />;
               
            } else if (route.name == 'Feed') {
               return <FeedTabIcon color={color} size={size} focused={focused} />;
            } else {
               return <NasaTabIcon color={color} size={size} focused={focused} />;
            }
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />

         <Tab.Screen
          name="Read"
          component={ReadNavigator}
        />

        <Tab.Screen
          name="Feed"
          component={FeedScreen}
        />

        <Tab.Screen
          name="NASA"
          component={NASAScreen}
        />

       
      </Tab.Navigator>
    </NavigationContainer>
  );
}