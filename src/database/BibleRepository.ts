import { DatabaseManager } from './DataBaseManager';
import { Verse } from '../models/Verse' 

export class BibleRepository {

    static getChapter(
        bookId: number,
        chapter: number
    ) {

        const db = DatabaseManager.database
        
        return db.execute(
        `
        SELECT *
        FROM AKJV_verses
        WHERE book_id = ?
        AND chapter = ?
        ORDER BY verse
        `,
        [bookId, chapter],

        );
    }
}