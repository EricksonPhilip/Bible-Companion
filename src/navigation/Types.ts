import { NavigatorScreenParams } from '@react-navigation/native';

export type ReadStackParamList = {
  Books: undefined;
  Chapters: {
    bookId: number;
    bookName: string;
    chapters: number;
  };
  Verses: {
    bookId: number;
    bookName: string;
    chapter: number;
  };
  Reading: {
    bookId: number;
    chapter: number;
    /** Optional: 1-based verse number to scroll to after the chapter loads. */
    verseNumber?: number;
  };
};

export type RootTabParamList = {
  Home: undefined;
  Feed: undefined;
  NASA: undefined;
  Read: NavigatorScreenParams<ReadStackParamList>;
};
