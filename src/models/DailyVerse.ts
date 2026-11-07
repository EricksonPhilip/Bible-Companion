export interface DailyVerse {
    id: number;
    bookId: number;
    bookName: string;
    chapter: number;
    verse: number; 
    text: string;
    theme: string;
    reflection?: string;
    dateString: string;
}
