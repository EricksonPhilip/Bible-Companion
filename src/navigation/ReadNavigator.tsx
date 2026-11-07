import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {ReadStackParamList} from "./Types";

import BookScreen from '../screens/read/BookScreen';
import ChapterScreen from '../screens/read/ChapterScreen';
import VerseScreen from '../screens/read/VerseScreen';
import ReadingScreen from '../screens/read/ReadingScreen';

export default function ReadNavigator() {
    const Stack = createNativeStackNavigator<ReadStackParamList>();

    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
            name="Books"
            component={BookScreen}
            />

            <Stack.Screen
            name="Chapters"
            component={ChapterScreen}
            />

            <Stack.Screen
            name="Verses"
            component={VerseScreen}
            />

            <Stack.Screen
            name="Reading"
            component={ReadingScreen}
            />
        </Stack.Navigator>
    )
}
