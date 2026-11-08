import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  ExternalLink,
  BookOpen,
  Eye,
  X,
  AlertCircle,
  UploadCloud,
  FileSearch,
} from 'lucide-react';
import { courseData } from '../data/course';
import { CourseNote } from '../types';

interface NotesLibraryProps {
  onNavigate: (path: string) => void;
}

export const NotesLibrary: React.FC<NotesLibraryProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [activeModalNote, setActiveModalNote] = useState<CourseNote | null>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(courseData.notes.flatMap((n) => n.tags)));

  const filteredNotes = courseData.notes.filter((note) => {
    const matchesQuery =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'ALL' || note.tags.includes(selectedTag);

    return matchesQuery && matchesTag;
  });

  return (
    <div className="space-y-10 py-6 sm:py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Course Repository
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Notes & Handouts Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Access all 6 official course lecture notes, ER teaching guides with 10 worked scenarios, SQL practice sheets, and previous years&apos; final exams.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or tags..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Tags:</span>
        <button
          onClick={() => setSelectedTag('ALL')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            selectedTag === 'ALL'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All ({courseData.notes.length})
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedTag === tag
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Meta row */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <FileText className="w-4 h-4" />
                  <span>PDF Document</span>
                </span>
                <span className="font-mono text-[11px]">{note.pages} pages · {note.size}</span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {note.title}
              </h3>

              {/* Scanned Badge (for the large 29MB scan) */}
              {note.isScanned && (
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300">
                  Scanned note · light compressed version shown · download full quality
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {note.description}
              </p>

              {/* Weeks and Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {note.weeks.map((wId) => (
                  <button
                    key={wId}
                    onClick={() => onNavigate(`/week/${wId}`)}
                    className="text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded hover:underline"
                  >
                    Week {wId}
                  </button>
                ))}
                {note.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setActiveModalNote(note)}
                className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Eye className="w-4 h-4" />
                <span>View in Browser</span>
              </button>

              <a
                href={note.file}
                download={note.fileName}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Note Preview Modal */}
      {activeModalNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {activeModalNote.title}
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {activeModalNote.fileName} · {activeModalNote.pages} pages · {activeModalNote.size}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeModalNote.file}
                  download={activeModalNote.fileName}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setActiveModalNote(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Document Preview Stage */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                    <FileSearch className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                      {activeModalNote.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Supports Weeks: {activeModalNote.weeks.map((w) => `Week ${w}`).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                  {activeModalNote.description}
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-semibold">
                    <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Target Document Path:</span>
                  </div>
                  <code className="block font-mono text-[11px] text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 p-2 rounded border border-indigo-200 dark:border-indigo-800 overflow-x-auto">
                    {activeModalNote.file}
                  </code>
                  <p className="text-indigo-900/80 dark:text-indigo-300/80">
                    Once the PDF file is placed into your assets folder, this viewer renders page-by-page directly in-browser using PDF.js.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
