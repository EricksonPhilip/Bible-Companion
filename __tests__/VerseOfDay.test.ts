import { BibleServices } from '../src/services/BibleService';
import { CURATED_DAILY_VERSES } from '../src/data/dailyVerses';

describe('Verse of the Day', () => {
    it('returns a valid daily verse structure', () => {
        const dailyVerse = BibleServices.getVerseOfDay(0);
        expect(dailyVerse).toBeDefined();
        expect(dailyVerse.bookId).toBe(CURATED_DAILY_VERSES[0].bookId);
        expect(dailyVerse.chapter).toBe(CURATED_DAILY_VERSES[0].chapter);
        expect(dailyVerse.verse).toBe(CURATED_DAILY_VERSES[0].verse);
        expect(dailyVerse.theme).toBe(CURATED_DAILY_VERSES[0].theme);
        expect(typeof dailyVerse.text).toBe('string');
        expect(typeof dailyVerse.dateString).toBe('string');
    });

    it('returns random daily verse when requested', () => {
        const randomVerse = BibleServices.getRandomVerseOfDay();
        expect(randomVerse).toBeDefined();
        expect(typeof randomVerse.text).toBe('string');
        expect(typeof randomVerse.theme).toBe('string');
    });
});
