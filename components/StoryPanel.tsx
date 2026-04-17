"use client";

import { useState } from 'react';
import { useStory } from '@/context/StoryContext';
import {
  MessageSquare, Sparkles, Languages, Settings2, BookOpen,
  Database, ListTree, Settings, Plus, Trash2, Cpu, Loader2, Cloud
} from 'lucide-react';
import clsx from 'clsx';
import { StoryDatabaseEntity } from '@/types/story';

export default function StoryPanel({
  onGenerate,
  isGenerating,
  onSummarize,
  isSummarizing,
  onCritique
}: {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  onSummarize: () => void;
  isSummarizing: boolean;
  onCritique: () => void;
}) {
  const {
    storyName, setStoryName,
    storyDescription, setStoryDescription,
    language, setLanguage,
    tone, setTone,
    genre, setGenre,
    database, addEntity, updateEntity, deleteEntity,
    chapters, activeChapterId, addChapter, updateChapterTitle, deleteChapter, setActiveChapterId,
    aiMode, setAiMode,
    supportResponse,
    storySummary, setStorySummary,
    selectedModel,
    lastGenerationMetrics
  } = useStory();

  const [activeTab, setActiveTab] = useState<'settings' | 'database' | 'chapters' | 'ai'>('ai');
  const [customPrompt, setCustomPrompt] = useState("");

  const languages = ['English', 'Vietnamese', 'Spanish', 'French', 'German', 'Japanese'];
  const tones = ['Professional', 'Casual', 'Humorous', 'Dark', 'Romantic', 'Dramatic', 'Melancholic'];
  const genres = ['General Fiction', 'Sci-Fi', 'Fantasy', 'Thriller', 'Romance', 'Non-fiction', 'Horror', 'Light Novel'];
  const entityTypes = ['character', 'place', 'item', 'other'] as const;

  const [newEntity, setNewEntity] = useState<Partial<StoryDatabaseEntity>>({ type: 'character', name: '', description: '', color: '#3b82f6' });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111111] border-l border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden w-full transition-colors relative">

      {/* Tabs Header */}
      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl mb-6 flex-shrink-0">
        <button onClick={() => setActiveTab('settings')} className={clsx("flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all", activeTab === 'settings' ? "bg-white dark:bg-zinc-700 shadow shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300")}>
          <Settings className="w-3 h-3" /> Config
        </button>
        <button onClick={() => setActiveTab('database')} className={clsx("flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all", activeTab === 'database' ? "bg-white dark:bg-zinc-700 shadow shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300")}>
          <Database className="w-3 h-3" /> Lore
        </button>
        <button onClick={() => setActiveTab('chapters')} className={clsx("flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all", activeTab === 'chapters' ? "bg-white dark:bg-zinc-700 shadow shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300")}>
          <ListTree className="w-3 h-3" /> Chapters
        </button>
        <button onClick={() => setActiveTab('ai')} className={clsx("flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all", activeTab === 'ai' ? "bg-white dark:bg-zinc-700 shadow shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300")}>
          <Sparkles className="w-3 h-3 ml-0.5" /> AI
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200">

            {/* Story Meta */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Book Title</label>
              <input type="text" value={storyName} onChange={e => setStoryName(e.target.value)} className="w-full text-sm bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-blue-500 outline-none" />
            </div>

            {/* Summary Block */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Story Summary Engine</label>
                <button
                  onClick={onSummarize}
                  disabled={isSummarizing}
                  className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 border border-indigo-200/50 dark:border-indigo-800/50"
                >
                  {isSummarizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Cpu className="w-3 h-3" />}
                  {isSummarizing ? "Compressing..." : "Auto-Summarize"}
                </button>
              </div>
              <textarea
                value={storySummary}
                onChange={e => setStorySummary(e.target.value)}
                placeholder="Click 'Auto-Summarize' to compress previous chapters, or type summary here directly..."
                className="w-full text-xs leading-relaxed bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-zinc-900 dark:text-zinc-300 placeholder:text-zinc-400 focus:border-blue-500 outline-none resize-none h-32"
              />
              <p className="text-[10px] text-zinc-500 mt-1.5">Saves context tokens by rolling up everything except the active chapter.</p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">AI Insert Mode</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{aiMode ? "Writes into editor." : "Writes to support box."}</p>
                </div>
                <button onClick={() => setAiMode(!aiMode)} className={clsx("relative inline-flex h-6 w-11 rounded-full transition-colors", aiMode ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-700")}>
                  <span className={clsx("inline-block h-5 w-5 transform rounded-full bg-white shadow mt-0.5 ml-0.5 transition duration-200", aiMode ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"><Languages className="w-3 h-3" /> Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full text-sm bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 appearance-none">
                  {languages.map(l => <option key={l} value={l} className="dark:bg-zinc-900">{l}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"><Settings2 className="w-3 h-3" /> Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full text-sm bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 appearance-none">
                  {tones.map(t => <option key={t} value={t} className="dark:bg-zinc-900">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"><BookOpen className="w-3 h-3" /> Genre</label>
                <select value={genre} onChange={e => setGenre(e.target.value)} className="w-full text-sm bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 appearance-none">
                  {genres.map(g => <option key={g} value={g} className="dark:bg-zinc-900">{g}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Lore Entities</h3>
            <div className="space-y-3">
              {database.map(entity => (
                <div key={entity.id} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="flex justify-between items-start mb-1">
                    <span style={{ color: entity.color }} className="text-xs font-bold uppercase">{entity.type}</span>
                    <button onClick={() => deleteEntity(entity.id)} className="text-zinc-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </div>
                  <input value={entity.name} onChange={e => updateEntity(entity.id, { name: e.target.value })} className="w-full font-medium text-sm bg-transparent outline-none text-zinc-900 dark:text-zinc-100 mb-1" />
                  <textarea value={entity.description} onChange={e => updateEntity(entity.id, { description: e.target.value })} className="w-full text-xs bg-transparent outline-none text-zinc-600 dark:text-zinc-400 resize-none h-12" />
                </div>
              ))}
              {database.length === 0 && <p className="text-xs text-zinc-500 italic">No lore added yet.</p>}
            </div>

            {/* Add New Entity Form */}
            <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <h4 className="text-xs font-medium text-zinc-500 mb-3">Add New</h4>
              <select value={newEntity.type} onChange={e => setNewEntity({ ...newEntity, type: e.target.value as any })} className="w-full text-xs bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-md p-1.5 mb-2 outline-none dark:text-zinc-200">
                {entityTypes.map(t => <option key={t} value={t} className="dark:bg-zinc-900">{t}</option>)}
              </select>
              <input value={newEntity.name} onChange={e => setNewEntity({ ...newEntity, name: e.target.value })} placeholder="Name..." className="w-full text-xs bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-md p-1.5 mb-2 outline-none dark:text-zinc-200" />
              <textarea value={newEntity.description} onChange={e => setNewEntity({ ...newEntity, description: e.target.value })} placeholder="Description details..." className="w-full text-xs bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-md p-1.5 mb-2 outline-none resize-none h-12 dark:text-zinc-200" />

              <div className="flex gap-2 items-center">
                <input type="color" value={newEntity.color} onChange={e => setNewEntity({ ...newEntity, color: e.target.value })} className="w-6 h-6 border-0 p-0 rounded cursor-pointer" />
                <button
                  onClick={() => {
                    if (!newEntity.name?.trim()) return;
                    addEntity(newEntity as Omit<StoryDatabaseEntity, 'id'>);
                    setNewEntity({ type: 'character', name: '', description: '', color: '#3b82f6' });
                  }}
                  className="flex-1 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-md py-1.5 text-xs font-medium flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Save To Lore
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chapters' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Story Chapters</h3>
              <button
                onClick={() => addChapter(`Chapter ${chapters.length + 1}`)}
                className="text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            </div>

            <div className="space-y-2">
              {chapters.map((chap, idx) => (
                <div
                  key={chap.id}
                  className={clsx(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                    activeChapterId === chap.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  )}
                  onClick={() => setActiveChapterId(chap.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs font-bold text-zinc-400 w-4">{idx + 1}.</span>
                    <input
                      value={chap.title}
                      onChange={(e) => updateChapterTitle(chap.id, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="bg-transparent font-medium text-sm text-zinc-900 dark:text-zinc-100 outline-none flex-1 min-w-0"
                    />
                  </div>
                  {chapters.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteChapter(chap.id); }}
                      className="text-zinc-400 hover:text-red-500 ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4 animate-in fade-in duration-200 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">AI Assistant</h3>
              {selectedModel?.type === 'cloud' && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Cloud Active</span>
                </div>
              )}
            </div>

            {lastGenerationMetrics && (
              <div className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                {/* Decorative background elements */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Last Generation</p>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Performance Metrics</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Success</span>
                    <span className="text-[9px] text-zinc-400">Just now</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-100/50 dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-200/50 dark:border-zinc-700/50">
                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 mb-1">
                      <Database className="w-3 h-3" />
                      <span className="text-[10px] font-medium uppercase">Tokens</span>
                    </div>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {lastGenerationMetrics.tokens} <span className="text-[10px] font-normal text-zinc-500">chars</span>
                    </p>
                  </div>
                  <div className="bg-zinc-100/50 dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-200/50 dark:border-zinc-700/50">
                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 mb-1">
                      <Loader2 className="w-3 h-3" />
                      <span className="text-[10px] font-medium uppercase">Time</span>
                    </div>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {lastGenerationMetrics.duration.toFixed(2)} <span className="text-[10px] font-normal text-zinc-500">sec</span>
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Speed: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{(lastGenerationMetrics.tokens / lastGenerationMetrics.duration).toFixed(1)} chars/s</span>
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1 h-1 rounded-full bg-emerald-500/30" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800/80 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">AI Insert Mode</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{aiMode ? "Writes into editor." : "Writes to support box."}</p>
                </div>
                <button onClick={() => setAiMode(!aiMode)} className={clsx("relative inline-flex h-6 w-11 rounded-full transition-colors", aiMode ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-700")}>
                  <span className={clsx("inline-block h-5 w-5 transform rounded-full bg-white shadow mt-0.5 ml-0.5 transition duration-200", aiMode ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-500 font-bold">Ask AI</span> / Custom Instruction
                </label>
                <div className="flex flex-col gap-2">
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Write a dramatic dialogue between John and the King..."
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none h-24"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onGenerate(customPrompt)}
                      disabled={isGenerating}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-1"
                    >
                      {isGenerating ? '...' : (aiMode ? 'Insert to Editor' : 'Ask AI')}
                    </button>
                    {!aiMode && (
                      <button
                        onClick={onCritique}
                        disabled={isGenerating}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 px-3 font-semibold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                      >
                        Critique Chapter
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!aiMode && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 flex-1">
                  <div className="bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 min-h-[150px] whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200 h-full">
                    {supportResponse || <span className="text-zinc-400 italic">Support answers will appear here...</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
