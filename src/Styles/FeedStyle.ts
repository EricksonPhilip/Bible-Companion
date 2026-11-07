import { StyleSheet } from 'react-native';

export const feedStyles = StyleSheet.create({
    feedCard: {
        backgroundColor: '#0A2B2D',
        padding: 16,
    },
    feedHeader: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 16,
    },
    feedTitle: {
        color: '#F5F5F5',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 14,
    },

    feedDescText: {
        color: '#D4AF37',
        fontSize: 16,
        fontWeight: '600',
    },
    feedImage: {
        width: '100%',
        height: 180,
        borderRadius: 14,
        marginBottom: 12,
        backgroundColor: '#0E3B3E',
    },
    feedReadArtText: {
        color: '#625a3f',
        fontSize: 14,
        fontWeight: '800',
        marginRight: 6,
        paddingVertical: 8
    },
});