import { BibleRepository } from "../database/BibleRepository";
import { CURATED_DAILY_VERSES } from "../data/dailyVerses";
import { DailyVerse } from "../models/DailyVerse";
import { WeatherResponse } from "../data/Weather";
import { NewsFeedResponse } from "../models/BibleFeeds";
import { NASAAstroDay } from "../models/NASAAstroDay";
import { FeedType } from "../database/BibleRepository";

export class BibleServices {
    static getBooks() {
        return BibleRepository.getBooks();
    }
    
    static getChapter(bookId: number, chapter: number) {
        return BibleRepository.getChapter(bookId, chapter);
    }

    static getVerseOfDay(index?: number): DailyVerse {
        return BibleRepository.getVerseOfDay(index);
    }

    static getVerseOfDayAsync(index?: number): Promise<DailyVerse> {
        return BibleRepository.getVerseOfDayAsync(index);
    }

    static getRandomVerseOfDay(): DailyVerse {
        const randomIndex = Math.floor(Math.random() * CURATED_DAILY_VERSES.length);
        return BibleRepository.getVerseOfDay(randomIndex);
    }

    static getRandomVerseOfDayAsync(): Promise<DailyVerse> {
        const randomIndex = Math.floor(Math.random() * CURATED_DAILY_VERSES.length);
        return BibleRepository.getVerseOfDayAsync(randomIndex);
    }

    static async getWeatherData(): Promise<WeatherResponse> {
        try {
            const response =   await BibleRepository.getWeather()
             return response
        } catch(error) {
            console.error('Failed to fetch weather:', error);
            throw error;
        }
    }

    static async getFeeds(feedType: FeedType): Promise<NewsFeedResponse> {
        try {
            return await BibleRepository.getFeeds(feedType);
        } catch (error) {
            console.error('Failed to fetch Bible news:', error);
            throw error;
        }
    }

    static async getAstroPicOfThenDay(): Promise<[NASAAstroDay]> {
         try {
            return await BibleRepository.getAstroPicOfTheDay();
        } catch (error) {
            console.error('Failed to fetch NASA service:', error);
            throw error;
        }
    }
}