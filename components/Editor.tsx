"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import ModelSelector from './ModelSelector';
import StoryPanel from './StoryPanel';
import { useStory } from '@/context/StoryContext';
import { Save, Upload } from 'lucide-react';

export default function Editor() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Consume workspace state
  const { 
    storyName,
    storyDescription,
    aiMode, setAiMode,
    language, 
    tone,  
    genre, 
    database, 
    chapters, 
    activeChapterId, 
    updateChapterContent,
    setSupportResponse,
    storySummary, setStorySummary,
    lastSummarizedChapterId, setLastSummarizedChapterId,
    loadWorkspace, workspaceVersion,
    selectedModel,
    setLastGenerationMetrics
  } = useStory();

  const currentChapter = chapters.find(c => c.id === activeChapterId);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story, or ask the AI to assist...',
      }),
    ],
    content: currentChapter?.content || '',
    onUpdate: ({ editor }) => {
      // Sync Tiptap content back to Context
      updateChapterContent(activeChapterId, editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: 'min-h-[60vh] max-w-full outline-none py-4 px-2 tiptap-editor',
        },
    },
  });

  // Hot swap chapters without destroying the editor
  useEffect(() => {
    if (editor && currentChapter) {
      if (editor.getHTML() !== currentChapter.content && editor.getText() !== currentChapter.content) {
        editor.commands.setContent(currentChapter.content);
      }
    }
  }, [activeChapterId, workspaceVersion, editor]);

  const handleExport = () => {
    const data = {
      storyName,
      storyDescription,
      storySummary,
      database,
      chapters,
      lastSummarizedChapterId,
      activeChapterId,
      aiSettings: { language, tone, genre }
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${storyName ? storyName.replace(/\s+/g, '-').toLowerCase() : 'untitled-story'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        loadWorkspace(json);
      } catch (err) {
        alert("Failed to parse workspace JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const activeIdx = chapters.findIndex(c => c.id === activeChapterId);
      let startIdx = 0;
      if (lastSummarizedChapterId) {
        const lastIdx = chapters.findIndex(c => c.id === lastSummarizedChapterId);
        if (lastIdx !== -1) startIdx = lastIdx + 1;
      }
      
      const chaptersToSummarize = chapters.slice(startIdx, activeIdx);
      if (chaptersToSummarize.length === 0) {
        alert("No new completed chapters to summarize.\n(The active chapter is skipped out of summarization until you create a new one).");
        return;
      }

      const textPayload = chaptersToSummarize.map(c => `[${c.title}]\n${c.content.replace(/<[^>]+>/g, '')}`).join('\n\n');

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel?.name,
          existingSummary: storySummary,
          newChaptersText: textPayload,
          storyName,
          storyDescription,
          database
        })
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      
      setStorySummary(data.summary);
      setLastSummarizedChapterId(chaptersToSummarize[chaptersToSummarize.length - 1].id);
      
    } catch (e: any) {
      console.error(e);
      alert("Summarization failed: " + e.message);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCritique = async () => {
    if (!editor || isGenerating) return;

    setAiMode(false); // Force output to side panel
    setIsGenerating(true);
    setSupportResponse(""); // Clear previous responses
    
    let fullText = editor.getText();
    if (fullText.length > 20000) fullText = fullText.slice(-20000); 

    if (!fullText.trim()) {
      alert("Please write something in the chapter before asking for a critique!");
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel?.name,
          prompt: fullText,
          customPrompt: "CRITIQUE MODE: Please provide a deep, constructive critique of the chapter text. Analyze character voice, pacing, prose flow, and dialogue. Highlight what works well, and boldly suggest specific areas for improvement.",
          language,
          tone,
          genre,
          aiMode: false,
          storyName,
          storyDescription,
          database,
          storySummary,
          fallbackContext: ""
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              setSupportResponse(prev => prev + parsed.response);
            }
            if (parsed.done) {
              setLastGenerationMetrics({
                tokens: parsed.eval_count || 0,
                duration: (parsed.total_duration || 0) / 1e9 // Convert nanoseconds to seconds
              });
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      alert("Critique failed: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async (customPrompt: string) => {
    if (!editor || isGenerating) return;

    const textContent = editor.getText();
    const promptContext = textContent.slice(aiMode ? -2000 : -4000); 

    if (aiMode && !promptContext.trim() && !customPrompt.trim()) {
      alert("Start writing something first so the AI has context, or add a custom instruction.");
      return;
    }

    if (!aiMode && !customPrompt.trim()) {
      alert("Please write a prompt/question for the AI in the Story Panel.");
      return;
    }

    setIsGenerating(true);
    if (!aiMode) setSupportResponse("");

    // Setup fallback context logic
    let fallbackContext = "";
    if (!storySummary) {
      const activeIdx = chapters.findIndex(c => c.id === activeChapterId);
      const startFallback = Math.max(0, activeIdx - 3);
      const prevChapters = chapters.slice(startFallback, activeIdx);
      fallbackContext = prevChapters.map(c => `[${c.title}]\n${c.content.replace(/<[^>]+>/g, '')}`).join('\n\n');
      if (fallbackContext.length > 6000) fallbackContext = fallbackContext.slice(-6000);
    }

    try {
      if (aiMode) {
        editor.commands.insertContent(' ');
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel?.name,
          prompt: promptContext,
          customPrompt,
          language,
          tone,
          genre,
          aiMode,
          storyName,
          storyDescription,
          database,
          storySummary,
          fallbackContext
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              if (aiMode) {
                editor.commands.insertContent(parsed.response);
              } else {
                setSupportResponse(prev => prev + parsed.response);
              }
            }
            if (parsed.done) {
              setLastGenerationMetrics({
                tokens: parsed.eval_count || 0,
                duration: (parsed.total_duration || 0) / 1e9 // Convert nanoseconds to seconds
              });
            }
          } catch (e) {
            console.error("Error parsing NDJSON chunk line:", line, e);
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      alert("Error generating text: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Pane: Main Editor Workspace */}
      <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col pt-12 pb-32 px-4 sm:px-6 lg:px-12 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
        
        {/* App Header section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-serif">
              {storyName || "Untitled Canvas"}
            </h1>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-2">
              {currentChapter?.title || "Active Chapter"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <input 
              type="file" 
              accept=".json" 
              id="file-upload" 
              className="hidden" 
              onChange={handleImport} 
            />
            <label 
              htmlFor="file-upload"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              title="Load project from JSON file"
            >
              <Upload className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              Load JSON
            </label>
            <button 
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
              title="Save project to JSON file"
            >
              <Save className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              Save JSON
            </button>
            <ModelSelector />
          </div>
        </div>

        <Toolbar editor={editor} isGenerating={isGenerating} onGenerate={() => handleGenerate("")} />

        {/* Editor Content Box */}
        <div className="flex-1 mt-2 tiptap-wrapper">
          <EditorContent editor={editor} className="editor-container w-full max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Right Pane: Story Control Panel */}
      <div className="w-full lg:w-1/3 xl:w-1/4 h-[unset] lg:h-screen lg:sticky lg:top-0">
        <StoryPanel 
          onGenerate={handleGenerate} 
          isGenerating={isGenerating} 
          onSummarize={handleSummarize}
          isSummarizing={isSummarizing}
          onCritique={handleCritique}
        />
      </div>
    </div>
  );
}
