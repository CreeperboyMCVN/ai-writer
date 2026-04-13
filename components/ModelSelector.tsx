"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Cpu } from 'lucide-react';
import clsx from 'clsx';

export default function ModelSelector({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (val: string) => void;
}) {
  const [models, setModels] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        if (data.models && Array.isArray(data.models)) {
          const names = data.models.map((m: any) => m.name);
          setModels(names);
          if (!value && names.length > 0) {
            onChange(names[0]);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [value, onChange]);

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
        <Cpu className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        {loading ? 'Loading variants...' : value || 'No local models'}
        <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      </button>

      {isOpen && models.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-48 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden">
          {models.map(m => (
            <button
              key={m}
              className={clsx(
                "block w-full text-left px-4 py-2 text-sm transition-colors",
                value === m ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 font-medium" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
              onClick={() => {
                onChange(m);
                setIsOpen(false);
              }}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
