import { DatabaseManager } from './DataBaseManager';
import { Verse } from '../models/Verse';
import { DailyVerse } from '../models/DailyVerse';
import { Book } from '../data/book';
import { BibleVersion } from '../types/BibleVersion';
import { CURATED_DAILY_VERSES, CuratedVerseRef } from '../data/dailyVerses';
import { WeatherResponse } from '../data/Weather';
import {
  BibleNewsFeedResponse,
  Rss2JsonResponse,
} from '../models/BibleFeeds';

export interface VerseWithBook extends Verse {
    bookName: string;
}

export class BibleRepository {

    private static getTableNames() {
        let version: BibleVersion = BibleVersion.AKJV;
        try {
            version = DatabaseManager.version;
        } catch {
            version = BibleVersion.AKJV;
        }

        if (version === BibleVersion.AKJV) {
            return {
                booksTable: 'books',
                booksIdCol: 'id',
                booksNameCol: 'name',
                versesTable: 'verses',
                versesBookIdCol: 'book_id',
                versesChapterCol: 'chapter',
                versesVerseCol: 'verse',
                versesTextCol: 'text',
            };
        } else if (version === BibleVersion.ASV) {
            return {
                booksTable: 'books',
                booksIdCol: 'id',
                booksNameCol: 'name',
                versesTable: 'verses',
                versesBookIdCol: 'book_id',
                versesChapterCol: 'chapter',
                versesVerseCol: 'verse',
                versesTextCol: 'text',
            };
        } else if (version === BibleVersion.KJV) {
            return {
                booksTable: 'books',
                booksIdCol: 'id',
                booksNameCol: 'name',
                versesTable: 'verses',
                versesBookIdCol: 'book_id',
                versesChapterCol: 'chapter',
                versesVerseCol: 'verse',
                versesTextCol: 'text',
            };
        } else if (version === BibleVersion.Tamil) {
            return {
                booksTable: 'books',
                booksIdCol: 'book_id',
                booksNameCol: 'name',
                versesTable: 'verses',
                versesBookIdCol: 'Book',
                versesChapterCol: 'Chapter',
                versesVerseCol: 'Versecount',
                versesTextCol: 'verse',
            };
        }

        throw new Error(`Unsupported Bible version: ${version}`);
    }

    static getBooks(): Book[] {
        const { booksTable, booksIdCol, booksNameCol, versesTable, versesBookIdCol, versesChapterCol } = this.getTableNames();
        const db = DatabaseManager.connection;

        const result = db.execute(
            `
            SELECT b.${booksIdCol} AS id, b.${booksNameCol} AS name, MAX(v.${versesChapterCol}) AS chapters
            FROM ${booksTable} b
            LEFT JOIN ${versesTable} v ON v.${versesBookIdCol} = b.${booksIdCol}
            GROUP BY b.${booksIdCol}, b.${booksNameCol}
            ORDER BY b.${booksIdCol}
            `
        );

        return (result.rows?._array ?? []) as Book[];
    }

    static getChapter(
        bookId: number,
        chapter: number
    ): Verse[] {
        const { versesTable, versesBookIdCol, versesChapterCol, versesVerseCol, versesTextCol } = this.getTableNames();
        const db = DatabaseManager.connection;

        const result = db.execute(
            `
            SELECT rowid AS id, ${versesBookIdCol} AS bookId, ${versesChapterCol} AS chapter, ${versesVerseCol} AS verse, ${versesTextCol} AS text
            FROM ${versesTable}
            WHERE ${versesBookIdCol} = ?
            AND ${versesChapterCol} = ?
            ORDER BY ${versesVerseCol}
            `,
            [bookId, chapter]
        );

        return (result.rows?._array ?? []) as Verse[];
    }

    static getVerse(
        bookId: number,
        chapter: number,
        verseNum: number
    ): VerseWithBook | null {
        const { booksTable, booksIdCol, booksNameCol, versesTable, versesBookIdCol, versesChapterCol, versesVerseCol, versesTextCol } = this.getTableNames();
        const db = DatabaseManager.connection;

        const result = db.execute(
            `
            SELECT v.rowid AS id, v.${versesBookIdCol} AS bookId, v.${versesChapterCol} AS chapter, v.${versesVerseCol} AS verse, v.${versesTextCol} AS text, b.${booksNameCol} AS bookName
            FROM ${versesTable} v
            JOIN ${booksTable} b ON b.${booksIdCol} = v.${versesBookIdCol}
            WHERE v.${versesBookIdCol} = ?
            AND v.${versesChapterCol} = ?
            AND v.${versesVerseCol} = ?
            LIMIT 1
            `,
            [bookId, chapter, verseNum]
        );

        const rows = (result.rows?._array ?? []) as VerseWithBook[];
        return rows.length > 0 ? rows[0] : null;
    }

    static async getVerseAsync(
        bookId: number,
        chapter: number,
        verseNum: number
    ): Promise<VerseWithBook | null> {
        const { booksTable, booksIdCol, booksNameCol, versesTable, versesBookIdCol, versesChapterCol, versesVerseCol, versesTextCol } = this.getTableNames();
        const db = DatabaseManager.connection;

        const result = await db.executeAsync(
            `
            SELECT v.rowid AS id, v.${versesBookIdCol} AS bookId, v.${versesChapterCol} AS chapter, v.${versesVerseCol} AS verse, v.${versesTextCol} AS text, b.${booksNameCol} AS bookName
            FROM ${versesTable} v
            JOIN ${booksTable} b ON b.${booksIdCol} = v.${versesBookIdCol}
            WHERE v.${versesBookIdCol} = ?
            AND v.${versesChapterCol} = ?
            AND v.${versesVerseCol} = ?
            LIMIT 1
            `,
            [bookId, chapter, verseNum]
        );

        const rows = (result.rows?._array ?? []) as VerseWithBook[];
        return rows.length > 0 ? rows[0] : null;
    }

    private static getVerseReference(index?: number): CuratedVerseRef {
        const safeIndex = typeof index === 'number' ? index : new Date().getDate() - 1;
        const normalizedIndex = ((safeIndex % CURATED_DAILY_VERSES.length) + CURATED_DAILY_VERSES.length) % CURATED_DAILY_VERSES.length;
        return CURATED_DAILY_VERSES[normalizedIndex];
    }

    private static buildDailyVerse(reference: CuratedVerseRef, text: string, bookName: string): DailyVerse {
        return {
            id: reference.bookId * 1000 + reference.chapter * 10 + reference.verse,
            bookId: reference.bookId,
            bookName,
            chapter: reference.chapter,
            verse: reference.verse,
            text,
            theme: reference.theme,
            reflection: reference.reflection,
            dateString: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
        };
    }

    static getVerseOfDay(index?: number): DailyVerse {
        const reference = this.getVerseReference(index);
        const verse = this.getVerse(reference.bookId, reference.chapter, reference.verse);
        const text = verse?.text ?? `The selected verse is not currently available in the local database.`;
        return this.buildDailyVerse(reference, text, verse?.bookName ?? `Book ${reference.bookId}`);
    }

    static async getVerseOfDayAsync(index?: number): Promise<DailyVerse> {
        const reference = this.getVerseReference(index);
        const verse = await this.getVerseAsync(reference.bookId, reference.chapter, reference.verse);
        const text = verse?.text ?? `The selected verse is not currently available in the local database.`;
        return this.buildDailyVerse(reference, text, verse?.bookName ?? `Book ${reference.bookId}`);
    }

    static async getWeather(): Promise<WeatherResponse> {
        console.log('Calling weather')
        const key =  '9d5dc52ed86247e4a4f30255260708'
        const lalo = '35.2982,-81.015'
        const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${lalo}&aqi=no`;
        
        console.log(url)
        const response = await fetch(url)
        const data: WeatherResponse = await response.json()
        
        return data
    }

    static async getCurrentWeatherImage() {
        
    }

    static async getBibleFeeds(): Promise<BibleNewsFeedResponse> {
        const rssUrl = encodeURIComponent(
            'https://www.christiantoday.com/rss.xml'
        );

        const url =
            `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

        console.log("Feed Url..")
        console.log(url)

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`News request failed: ${response.status}`);
        }

        const raw: Rss2JsonResponse = await response.json();

        if (raw.status !== 'ok') {
            throw new Error(raw.message || 'News feed failed');
        }

        return {
            status: 'ok',
            feed: {
                title: raw.feed.title,
                link: raw.feed.link,
                description: raw.feed.description,
                image: raw.feed.image,
            },
            items: raw.items.map(item => ({
                id: item.guid || item.link,
                title: item.title,
                description: item.description.replace(/<[^>]*>/g, '').trim(),
                image: item.thumbnail || item.enclosure?.link || null,
                link: item.link,
                publishedAt: item.pubDate,
                author: item.author,
            })),
        };
    }
}
