import React, { useState } from 'react';
import { Database, RotateCcw, Mail, Building, ExternalLink, Check } from 'lucide-react';
import { courseData } from '../../data/course';
import { useProgress } from '../../context/ProgressContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { resetProgress, completedWeeks } = useProgress();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetProgress();
    setShowConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Course Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-base">
              <div className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                <Database className="w-3.5 h-3.5" />
              </div>
              <span>{courseData.code} · {courseData.title}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Official study portal for Level-2 Term-II students at {courseData.university}. Complete with weekly lecture slides, solved note handouts, and 20 interactive DBMS concept visualizers.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 shrink-0" />
                <span>{courseData.department}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <a
                  href={`mailto:${courseData.instructor.email}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-2 transition-colors"
                >
                  {courseData.instructor.name} ({courseData.instructor.email})
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Hub Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Study Hub
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/weeks')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Weekly Roadmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/notes')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Notes Library (6 Documents)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/labs')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  20 Interactive Labs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/lab/sql-playground')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  SQL Playground
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/exam')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Exam Prep (Final 60%)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/glossary')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  A–Z DBMS Glossary
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Data & Controls */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Student Progress
            </h4>
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                <span>Progress is stored locally in your browser.</span>
                <div className="mt-1 font-medium text-slate-700 dark:text-slate-300">
                  {completedWeeks.length} of 13 weeks completed
                </div>
              </div>

              {resetDone ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>Progress reset successfully</span>
                </div>
              ) : showConfirmReset ? (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs space-y-2">
                  <p className="text-rose-700 dark:text-rose-300 font-medium">
                    Reset completed weeks, bookmarks, and quiz scores?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReset}
                      className="px-2.5 py-1 bg-rose-600 text-white rounded text-xs font-semibold hover:bg-rose-700 transition-colors"
                    >
                      Yes, reset
                    </button>
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="px-2 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset my progress</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Built for BAUST CSE students · Summer 2026 Semester
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/about')}
              className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Course Information & Outline
            </button>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.db-book.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-600 dark:hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
            >
              <span>Silberschatz Textbook</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
