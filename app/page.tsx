"use client";

import Editor from "@/components/Editor";
import { StoryProvider } from "@/context/StoryContext";

export default function Home() {
  return (
    <StoryProvider>
      <main className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-50 selection:bg-blue-200 dark:selection:bg-blue-900 leading-relaxed transition-colors duration-300">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none" />
        <div className="relative z-10 font-sans">
          <Editor />
        </div>
      </main>
    </StoryProvider>
  );
}
