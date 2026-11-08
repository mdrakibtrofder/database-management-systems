import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, BookOpen, Sparkles, FileText, ArrowRight, X, ExternalLink } from 'lucide-react';
import { courseData, labsList } from '../../data/course';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { weeks: [], labs: [], notes: [], glossary: [] };

    const weeks = courseData.weeks
      .filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.topics.some((t) => t.toLowerCase().includes(q)) ||
          w.summary.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const labs = labsList
      .filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.summary.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const notes = courseData.notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.description.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const glossary = courseData.glossary
      .filter(
        (g) =>
          g.term.toLowerCase().includes(q) ||
          g.definition.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      )
      .slice(0, 5);

    return { weeks, labs, notes, glossary };
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.weeks.length +
    results.labs.length +
    results.notes.length +
    results.glossary.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search weeks, labs, notes, or 60+ DBMS terms..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                Quick DBMS Lookups
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {['B+ Tree', 'Precedence Graph', 'BCNF', 'SQL Playground', 'RAID 5', 'ARIES Recovery', 'Wait-Die'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded-md transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              No direct matches found for &ldquo;{query}&rdquo;. Try terms like <span className="font-mono text-indigo-500">2PL</span>, <span className="font-mono text-indigo-500">ER</span>, or <span className="font-mono text-indigo-500">GROUP BY</span>.
            </div>
          )}

          {/* Weeks */}
          {results.weeks.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Weekly Curricula
              </div>
              <div className="space-y-1">
                {results.weeks.map((week) => (
                  <button
                    key={week.id}
                    onClick={() => {
                      onNavigate(`/week/${week.id}`);
                      onClose();
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                        W{week.id}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {week.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {week.topics.slice(0, 3).join(' · ')}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Labs */}
          {results.labs.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Interactive Concept Labs
              </div>
              <div className="space-y-1">
                {results.labs.map((lab) => (
                  <button
                    key={lab.id}
                    onClick={() => {
                      onNavigate(`/lab/${lab.id}`);
                      onClose();
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {lab.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {lab.weekLabel} · {lab.category}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {results.notes.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Study Notes & Handouts
              </div>
              <div className="space-y-1">
                {results.notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      onNavigate(`/notes`);
                      onClose();
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {note.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {note.pages} pages · {note.size}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Glossary */}
          {results.glossary.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                DBMS Glossary
              </div>
              <div className="space-y-1.5">
                {results.glossary.map((item) => (
                  <div
                    key={item.term}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {item.term}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.category} · Week {item.weekId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Press <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">ESC</kbd> to exit
          </span>
          <button
            onClick={() => {
              onNavigate('/glossary');
              onClose();
            }}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
          >
            Open Full 60+ Glossary →
          </button>
        </div>
      </div>
    </div>
  );
};
