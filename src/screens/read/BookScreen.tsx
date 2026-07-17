import React from "react";
import { FlatList, Pressable, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ReadStackParamList } from "../../navigation/Types";
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { StyleSheet } from 'react-native';
import { books } from '../../data/book'

type BookScreenNavigationProp = 
    NativeStackNavigationProp<ReadStackParamList, 'Books'>;

export default function BookScreen() {
    const navigation = useNavigation<BookScreenNavigationProp>();

    const styles= StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#00191A',
            justifyContent: 'center',
            alignItems: 'center',
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

    return(
        <SafeAreaView style={styles.container}>
        <FlatList
            data={books}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <Pressable 
                style={styles.row} 
                onPress={() => 
                    navigation.navigate('Chapters', {
                        bookId: item.id,
                        bookName: item.name,
                        chapters: item.chapters
                    })
                }>
                    <Text
                        style={styles.title}>
                     {item.name}
                    </Text>
                </Pressable>
            )}
        />
        </SafeAreaView>
    );
}