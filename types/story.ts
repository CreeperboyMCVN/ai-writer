export interface StoryDatabaseEntity {
  id: string;
  type: 'character' | 'place' | 'item' | 'other';
  name: string;
  description: string;
  color: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  content: string;
}
