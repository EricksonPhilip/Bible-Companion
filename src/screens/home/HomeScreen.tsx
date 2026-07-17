import React from "react";
import {View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#00191A',
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: '#F5F5F5',
            fontSize: 22,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }) ;

    return(
        <View style={styles.container}>
            <Text style={styles.text}>Home</Text>
        </View>
    );
}