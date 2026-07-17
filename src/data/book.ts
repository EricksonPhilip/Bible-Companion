export interface Book {
    id: number;
    name: string;
    chapters: number;
}

export const books: Book[] = [
    {
        id: 1,
        name: "Genesis",
        chapters: 50,
    },
    {
        id: 2,
        name: "Exodus",
        chapters: 40,
    },
    {
        id: 3,
        name: "Leviticus",
        chapters: 27,
    },
];