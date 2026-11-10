import React from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { labsList, courseData } from '../data/course';
import { LabDispatcher } from '../components/labs/LabDispatcher';

interface LabViewProps {
  labId: string;
  onNavigate: (path: string) => void;
}

export const LabView: React.FC<LabViewProps> = ({ labId, onNavigate }) => {
  const lab = labsList.find((l) => l.id === labId) || labsList[0];

  const currentIndex = labsList.findIndex((l) => l.id === lab.id);
  const prevLab = currentIndex > 0 ? labsList[currentIndex - 1] : null;
  const nextLab = currentIndex < labsList.length - 1 ? labsList[currentIndex + 1] : null;

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => onNavigate('/labs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Visualizations</span>
        </button>

        <div className="flex items-center gap-4 text-xs">
          {prevLab && (
            <button
              onClick={() => onNavigate(`/lab/${prevLab.id}`)}
              className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{prevLab.title}</span>
            </button>
          )}

          {nextLab && (
            <button
              onClick={() => onNavigate(`/lab/${nextLab.id}`)}
              className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors"
            >
              <span>{nextLab.title}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lab Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              {lab.weekLabel}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {lab.category}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs font-mono text-slate-500">
              Difficulty: {lab.difficulty}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {lab.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {lab.summary}
          </p>
        </div>

        <button
          onClick={() => onNavigate(`/week/${lab.week}`)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors shrink-0"
        >
          <BookOpen className="w-4 h-4" />
          <span>Open Week {lab.week} Lecture Slides</span>
        </button>
      </div>

      {/* Lab Container */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm">
        <LabDispatcher labId={lab.id} />
      </div>
    </div>
  );
};
