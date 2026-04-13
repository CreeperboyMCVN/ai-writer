"use client";

import React, { createContext, useContext, useState } from 'react';
import { StoryChapter, StoryDatabaseEntity } from '../types/story';

interface StoryContextProps {
  // General Settings
  storyName: string;
  setStoryName: (val: string) => void;
  storyDescription: string;
  setStoryDescription: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  tone: string;
  setTone: (val: string) => void;
  genre: string;
  setGenre: (val: string) => void;
  
  // Database
  database: StoryDatabaseEntity[];
  addEntity: (entity: Omit<StoryDatabaseEntity, 'id'>) => void;
  updateEntity: (id: string, entity: Partial<StoryDatabaseEntity>) => void;
  deleteEntity: (id: string) => void;

  // Chapters
  chapters: StoryChapter[];
  activeChapterId: string;
  addChapter: (title: string) => void;
  updateChapterContent: (id: string, content: string) => void;
  updateChapterTitle: (id: string, title: string) => void;
  deleteChapter: (id: string) => void;
  setActiveChapterId: (id: string) => void;

  // Auto-Summarization
  storySummary: string;
  setStorySummary: (val: string) => void;
  lastSummarizedChapterId: string | null;
  setLastSummarizedChapterId: (val: string | null) => void;
  
  // Transient AI State
  aiMode: boolean;
  setAiMode: (val: boolean) => void;
  supportResponse: string;
  setSupportResponse: (val: string | ((prev: string) => string)) => void;

  // Master Loader
  loadWorkspace: (data: any) => void;
  workspaceVersion: number;
}

const StoryContext = createContext<StoryContextProps | undefined>(undefined);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [storyName, setStoryName] = useState("Untitled Canvas");
  const [storyDescription, setStoryDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Professional");
  const [genre, setGenre] = useState("General Fiction");

  const [database, setDatabase] = useState<StoryDatabaseEntity[]>([]);

  const [chapters, setChapters] = useState<StoryChapter[]>([
    { id: 'chap-1', title: 'Chapter 1', content: '' }
  ]);
  const [activeChapterId, setActiveChapterId] = useState<string>('chap-1');
  const [workspaceVersion, setWorkspaceVersion] = useState(0);

  const [storySummary, setStorySummary] = useState("");
  const [lastSummarizedChapterId, setLastSummarizedChapterId] = useState<string | null>(null);

  const [aiMode, setAiMode] = useState(true);
  const [supportResponse, setSupportResponse] = useState("");

  const addEntity = (entity: Omit<StoryDatabaseEntity, 'id'>) => {
    const newEntity = { ...entity, id: Math.random().toString(36).substring(2, 9) };
    setDatabase(prev => [...prev, newEntity]);
  };

  const updateEntity = (id: string, partial: Partial<StoryDatabaseEntity>) => {
    setDatabase(prev => prev.map(e => e.id === id ? { ...e, ...partial } : e));
  };

  const deleteEntity = (id: string) => {
    setDatabase(prev => prev.filter(e => e.id !== id));
  };

  const addChapter = (title: string) => {
    const newChap = { id: Math.random().toString(36).substring(2, 9), title, content: '' };
    setChapters(prev => [...prev, newChap]);
    setActiveChapterId(newChap.id);
  };

  const updateChapterContent = (id: string, content: string) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, content } : c));
  };

  const updateChapterTitle = (id: string, title: string) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, title } : c));
  };

  const deleteChapter = (id: string) => {
    setChapters(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (filtered.length === 0) {
        const dummy = { id: 'chap-1', title: 'Chapter 1', content: '' };
        setActiveChapterId(dummy.id);
        return [dummy];
      }
      if (activeChapterId === id) {
        setActiveChapterId(filtered[0].id);
      }
      return filtered;
    });
  };

  const loadWorkspace = (data: any) => {
    if (data.storyName !== undefined) setStoryName(data.storyName);
    if (data.storyDescription !== undefined) setStoryDescription(data.storyDescription);
    if (data.database !== undefined) setDatabase(data.database);
    if (data.chapters !== undefined && data.chapters.length > 0) {
      setChapters(data.chapters);
      if (data.activeChapterId !== undefined) {
        setActiveChapterId(data.activeChapterId);
      } else {
        setActiveChapterId(data.chapters[0].id);
      }
    }
    if (data.storySummary !== undefined) setStorySummary(data.storySummary);
    if (data.lastSummarizedChapterId !== undefined) setLastSummarizedChapterId(data.lastSummarizedChapterId);
    
    if (data.aiSettings) {
      if (data.aiSettings.language !== undefined) setLanguage(data.aiSettings.language);
      if (data.aiSettings.tone !== undefined) setTone(data.aiSettings.tone);
      if (data.aiSettings.genre !== undefined) setGenre(data.aiSettings.genre);
    }
    setWorkspaceVersion(v => v + 1);
  };

  return (
    <StoryContext.Provider value={{
      storyName, setStoryName,
      storyDescription, setStoryDescription,
      language, setLanguage,
      tone, setTone,
      genre, setGenre,
      database, addEntity, updateEntity, deleteEntity,
      chapters, activeChapterId, addChapter, updateChapterContent, updateChapterTitle, deleteChapter, setActiveChapterId,
      storySummary, setStorySummary, lastSummarizedChapterId, setLastSummarizedChapterId,
      aiMode, setAiMode,
      supportResponse, setSupportResponse,
      loadWorkspace, workspaceVersion
    }}>
      {children}
    </StoryContext.Provider>
  );
}

export const useStory = () => {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error("useStory must be used within StoryProvider");
  return ctx;
};
