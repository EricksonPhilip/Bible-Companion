import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { House, BookOpen } from 'lucide-react-native';
import HomeScreen from '../screens/home/HomeScreen';
import ReadScreen from '../screens/read/BookScreen';
import ReadNavigator from './ReadNavigator';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const styles= StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#00191A'
        },
        row: {
            padding: 20,
        },
        title: {
            color: '#F5F5F5',
            fontSize: 22,
            textAlign: 'center',
        }
    });

export default function TabNavigator() {
    return (
      <NavigationContainer >
        <Tab.Navigator
          screenOptions={({ route }) => ({
            sceneContainerStyle: styles.container,
            tabBarStyle: {backgroundColor: styles.container.backgroundColor},
            headerShown: false,
            tabBarActiveTintColor: '#F5F5F5',
            tabBarInactiveTintColor: 'gray',
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Home') {
                return <House color={color} size={size} />;
              } else if (route.name === 'Read') {
                 return <BookOpen color={color} size={size} />;
              }
            },
          })}
        >

         <Tab.Screen name="Home" component={HomeScreen} />
         <Tab.Screen name="Read" component={ReadNavigator} />
        </Tab.Navigator>
      </NavigationContainer>
    );
}