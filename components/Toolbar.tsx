"use client";

import { Editor } from '@tiptap/react';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Wand2, Loader2, Code
} from 'lucide-react';
import clsx from 'clsx';

export default function Toolbar({ 
  editor, 
  onGenerate, 
  isGenerating 
}: { 
  editor: Editor | null;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  
  const toggleH1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleH3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
  
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();

  const ToolbarButton = ({ onClick, active, children, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "p-2 rounded-md transition-all duration-200",
        active 
          ? "bg-zinc-200 text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50" 
          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-sm mb-4 sticky top-4 z-10 transition-all">
      <ToolbarButton onClick={toggleBold} active={editor.isActive('bold')}>
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={toggleItalic} active={editor.isActive('italic')}>
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={toggleStrike} active={editor.isActive('strike')}>
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={toggleCode} active={editor.isActive('code')}>
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700/80 mx-1.5" />

      <ToolbarButton onClick={toggleH1} active={editor.isActive('heading', { level: 1 })}>
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={toggleH2} active={editor.isActive('heading', { level: 2 })}>
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={toggleH3} active={editor.isActive('heading', { level: 3 })}>
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700/80 mx-1.5" />

      <ToolbarButton onClick={toggleBulletList} active={editor.isActive('bulletList')}>
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={toggleOrderedList} active={editor.isActive('orderedList')}>
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={toggleBlockquote} active={editor.isActive('blockquote')}>
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <div className="flex-1 min-w-[20px]" />

      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={clsx(
          "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm",
          isGenerating 
            ? "border border-amber-200/50 bg-amber-50 text-amber-600 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400 cursor-not-allowed" 
            : "border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800/30 dark:text-blue-400 hover:shadow hover:scale-[1.02] active:scale-[0.98]"
        )}
      >
        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
        {isGenerating ? 'Generating...' : 'Continue Writing'}
      </button>
    </div>
  );
}
