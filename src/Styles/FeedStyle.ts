import { AlignCenter } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export const feedStyles = StyleSheet.create({
    feedHeaderTitle: {
        fontSize: 23,
        fontWeight: '800',
        color: '#F5F5F5',
        paddingVertical: 8,
        alignItems: 'center',
    },
    feedCard: {
        backgroundColor: '#0A2B2D',
        padding: 16,
    },
    feedHeader: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8
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
    feedAuthorText: {
        color: '#aea790',
        fontSize: 14,
        fontWeight: '900',
        marginRight: 6,
        paddingVertical: 8
    },
    feedReadArtText: {
        color: '#625a3f',
        fontSize: 14,
        fontWeight: '800',
        marginRight: 6,
        paddingVertical: 8
    },
    tag: {
        color: '#aea790',
        fontSize: 18,
        fontWeight: 700,
        padding: 8
    },
    tagList: {
        height: 52,
        flexGrow: 0
    },
    tagContent: {
        height: 52,
        paddingHorizontal: 16,
        alignItems: 'center',
        gap: 8,
    },
    tagText: {
        color: '#9EC5C7',
        fontSize: 13,
        fontWeight: '700',
    },
    tagButton: {
        height: 36,
        paddingHorizontal: 16,
        borderRadius: 18,
        justifyContent: 'center',
        backgroundColor: '#0A2B2D',
        borderWidth: 1,
        borderColor: '#184E52',
    },
    selectedTagButton: {
        backgroundColor: '#268185',
        borderColor: '#268185',
    },
    selectedTagText: {
        color: '#FFFFFF',
    },
    feedList: {
        flex: 1,
    },
});
