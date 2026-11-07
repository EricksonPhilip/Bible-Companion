
import { StyleSheet } from 'react-native';

export const styles= StyleSheet.create({
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
            fontSize: 26,
            textAlign: 'center',
        },
        chapterNumber: {
            color: '#F5F5F5',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontSize: 18,
            width: 44,
            height: 44,
        },
        chapterContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 15,
            borderTopWidth: 1,
            borderTopColor: '#F5F5F5',
            paddingTop: 10,
            gap: 15,
        }
    });