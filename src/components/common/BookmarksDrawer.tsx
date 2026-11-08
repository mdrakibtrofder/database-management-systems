import React from 'react';
import { Bookmark, X, Trash2, ArrowRight } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { bookmarks, removeBookmark } = useProgress();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Bookmark className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Saved Bookmarks
                </h3>
                <p className="text-xs text-slate-500">
                  {bookmarks.length} slide {bookmarks.length === 1 ? 'page' : 'pages'} pinned
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {bookmarks.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Bookmark className="w-10 h-10 mx-auto stroke-1 mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  No bookmarks yet
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Click the bookmark star while reading slides on any week to quickly return to important diagrams later.
                </p>
              </div>
            ) : (
              bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors flex items-start justify-between gap-3 group"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      onNavigate(`/week/${bm.weekId}?page=${bm.page}`);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      <span>Week {bm.weekId}</span>
                      <span aria-hidden="true">·</span>
                      <span>Slide {bm.page}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {bm.weekTitle}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {bm.deckTitle}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2">
                      Saved {bm.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={() => removeBookmark(bm.id)}
                      title="Remove bookmark"
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onNavigate(`/week/${bm.weekId}?page=${bm.page}`);
                        onClose();
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {bookmarks.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-xs text-slate-500 flex items-center justify-between">
              <span>Saved locally in your browser</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
