import React from "react";
import {View, Text } from 'react-native';

export default function ReadingScreen() {
    return(
        <View style={{
            flex:1,
            justifyContent: "center",
            alignItems: "center",
        }}>
        <Text style={{ fontSize: 30 }}>Reading</Text>
        </View>
    );
}