import React from "react";
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#00191A'
    },
    title: {
        fontSize: 30,
        color: 'white',
    }
})

export default function ChapterScreen() {
    const route = useRoute();

    const { bookId, bookName, chapters } = route.params as {
        bookId: number;
        bookName: string;
        chapters: number;
    }

    const chapterList = Array.from(
        { length: chapters },
        (_, index ) => index + 1
    );

    console.log(route.params)

    return (
      <SafeAreaView style={styles.container}>
        
        <FlatList
          data={chapterList}
          keyExtractor={item => item.toString()}
          renderItem={({ item }) => (
            <Pressable style={{ padding: 20, }}>
              <Text style={styles.title}>Chapter {item}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    );
}