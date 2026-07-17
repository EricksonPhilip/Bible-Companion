export type ReadStackParamList = {
  Books: undefined;
  Chapters: {
    bookId: number;
    bookName: string;
    chapters: number;
  };
  Reading: {
    bookId: number;
    chapter: number;
  };
};