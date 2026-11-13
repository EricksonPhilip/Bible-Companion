import { useCallback, useEffect, useState } from 'react';
import { BibleServices } from '../services/BibleService';
import { BibleNewsItem } from '../models/BibleFeeds';
import { FeedType } from '../database/BibleRepository';

export function useFeedViewModel() {
    const [items, setItems] = useState<BibleNewsItem[]>([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFeed, setSelectedFeed] = useState<FeedType>(FeedType.All);
    const feedTags = [
        { label: 'All', type: FeedType.All },
        { label: 'News', type: FeedType.News },
        { label: 'Tech', type: FeedType.Tech },
        { label: 'Finance', type: FeedType.Finance },
    ];

    const selectFeed = async (feedType: FeedType) => {
        setSelectedFeed(feedType);

        await loadFeeds(feedType);
    };

    const loadFeeds = useCallback(async (feedType: FeedType) => {
        try {
            setLoading(true);
            setError(null);

            const response = await BibleServices.getFeeds(feedType);
            setItems(response.items);
            setTitle(response.feed.title);
        } catch {
            setError('Failed to load feeds');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFeeds(FeedType.All);
    }, [loadFeeds]);

    return {
        items,
        title,
        loading,
        error,
        selectedFeed,
        selectFeed,
        feedTags,
        reload: () => loadFeeds(selectedFeed),
    };
}

export const decodeHtml = (text: string = '') =>
        text
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;|&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
