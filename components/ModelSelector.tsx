"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Cpu, Cloud, Database } from 'lucide-react';
import clsx from 'clsx';
import { useStory } from '@/context/StoryContext';

export default function ModelSelector() {
  const { selectedModel, setSelectedModel } = useStory();
  const [models, setModels] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        if (data.models && Array.isArray(data.models)) {
          setModels(data.models);
          if (!selectedModel && data.models.length > 0) {
            setSelectedModel(data.models[0]);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedModel, setSelectedModel]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
      >
        {selectedModel?.type === 'cloud' ? (
          <Cloud className="w-4 h-4 text-blue-500" />
        ) : (
          <Cpu className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
        {loading ? 'Loading variants...' : selectedModel?.name || 'No models'}
        <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      </button>

      {isOpen && models.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-64 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Available Models</div>
          {models.map(m => (
            <button
              key={m.name}
              className={clsx(
                "flex items-center justify-between w-full text-left px-4 py-2.5 text-sm transition-colors",
                selectedModel?.name === m.name ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 font-medium" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
              onClick={() => {
                setSelectedModel(m);
                setIsOpen(false);
              }}
            >
              <div className="flex flex-col">
                <span className="truncate max-w-[140px]">{m.name}</span>
                <span className="text-[10px] opacity-60">{m.provider}</span>
              </div>
              <div className={clsx(
                "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                m.type === 'cloud' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              )}>
                {m.type}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
