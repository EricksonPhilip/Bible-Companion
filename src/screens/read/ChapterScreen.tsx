import React from "react";
import { StyleSheet, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReadStackParamList } from '../../navigation/Types';

type ChapterRoute = RouteProp<ReadStackParamList, 'Chapters'>;
type ChapterNavigation = NativeStackNavigationProp<ReadStackParamList, 'Chapters'>;

export default function ChapterScreen() {
    const route = useRoute<ChapterRoute>();
    const navigation = useNavigation<ChapterNavigation>();
    const { bookId, bookName, chapters } = route.params;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#00191A',
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: '700',
            color: '#F5F5F5',
            paddingHorizontal: 20,
            paddingVertical: 12,
        },
        row: {
            padding: 20,
        },
        title: {
            fontSize: 20,
            color: '#F5F5F5',
        },
    });

    const chapterList = Array.from(
        { length: chapters },
        (_, index) => index + 1
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>{bookName}</Text>
            <FlatList
                data={chapterList}
                keyExtractor={item => item.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.row}
                        onPress={() => navigation.navigate('Verses', { bookId, bookName, chapter: item })}
                    >
                        <Text style={styles.title}>Chapter {item}</Text>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
}
