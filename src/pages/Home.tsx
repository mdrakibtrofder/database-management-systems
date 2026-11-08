import React from 'react';
import {
  Database,
  ArrowRight,
  BookOpen,
  Sparkles,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { courseData, labsList } from '../data/course';
import { useProgress } from '../context/ProgressContext';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { completedWeeks, progressPercentage, lastVisitedWeek } = useProgress();

  const previewWeeks = courseData.weeks.slice(0, 4);
  const lastWeek = lastVisitedWeek
    ? courseData.weeks.find((w) => w.id === lastVisitedWeek)
    : courseData.weeks[0];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-50/70 via-white to-white dark:from-slate-900/80 dark:via-slate-900 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {courseData.code}
              </span>
              <span aria-hidden="true">·</span>
              <span>{courseData.semester}</span>
              <span aria-hidden="true">·</span>
              <span>Level-2, Term-II</span>
              <span aria-hidden="true">·</span>
              <span>3.00 Credits</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15] text-balance">
              Master Database Management Systems,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                Week by Week.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Official study portal for BAUST CSE students. Explore 14 structured weekly modules, 13 slide decks, 6 comprehensive notes, and 20 interactive concept visualizers.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/weeks')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all hover:scale-[1.01]"
              >
                <span>Explore Weekly Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/lab/sql-playground')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs transition-colors"
              >
                <Database className="w-4 h-4 text-indigo-600" />
                <span>Open SQL Playground</span>
              </button>
            </div>

            {/* Instructor Attribution */}
            <div className="pt-4 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
              <GraduationCap className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                Instructor: <strong>{courseData.instructor.name}</strong>, Lecturer, Department of CSE, BAUST
              </span>
            </div>
          </div>

          {/* Hero Right: Animated Visual (Table → Index → B+ Tree) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-200/50 dark:border-indigo-800/40 p-6 flex flex-col justify-between shadow-lg">
              {/* Top: Relational Table */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>1. Relational Tuples</span>
                  <span className="font-mono text-indigo-600">Student Table</span>
                </div>
                <div className="h-1.5 w-full bg-indigo-100 dark:bg-indigo-950 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-indigo-500 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-1 font-mono text-[10px] text-slate-500 pt-1">
                  <span className="bg-slate-50 dark:bg-slate-800 p-1 rounded text-center">ID 101</span>
                  <span className="bg-slate-50 dark:bg-slate-800 p-1 rounded text-center">Rahim</span>
                  <span className="bg-slate-50 dark:bg-slate-800 p-1 rounded text-center">3.85</span>
                </div>
              </div>

              {/* Middle: Index Routing */}
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                <ArrowRight className="w-4 h-4 rotate-90" />
                <span>B+ Tree Indexing O(log n)</span>
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              {/* Bottom: B+ Tree Nodes */}
              <div className="space-y-2">
                <div className="w-24 mx-auto py-1.5 px-3 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold text-center shadow-md">
                  [ 30 | 60 ]
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500 text-center font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    [ 10, 20 ]
                  </div>
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500 text-center font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    [ 30, 40 ]
                  </div>
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500 text-center font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    [ 60, 70 ]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid & Continue Card */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Continue Reading Card */}
        <div
          onClick={() => onNavigate(`/week/${lastWeek?.id || 1}`)}
          className="cursor-pointer md:col-span-2 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/60 to-white dark:from-indigo-950/40 dark:to-slate-900 shadow-sm flex items-center justify-between gap-4 group hover:shadow-md transition-all"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Continue Where You Left Off
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {lastWeek?.label} · {lastWeek?.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {lastWeek?.summary}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform shadow-xs">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Progress Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600"
                strokeDasharray={`${progressPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
              {progressPercentage}%
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-500">Course Completion</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
              {completedWeeks.length} of 13 Weeks
            </div>
          </div>
        </div>

        {/* Exam Weight Card */}
        <div
          onClick={() => onNavigate('/exam')}
          className="cursor-pointer p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0 font-extrabold text-sm font-mono">
            60%
          </div>
          <div>
            <div className="text-xs text-slate-500">Term Final Exam</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
              Exam Prep Hub →
            </div>
          </div>
        </div>
      </section>

      {/* Hub Inventory Bar */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            14
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">Curriculum Weeks</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400 font-mono">
            13
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">Lecture Slide Decks</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
            6
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">Course Notes & Handouts</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            20
          </div>
          <div className="text-xs font-medium text-slate-500 mt-1">Interactive Labs</div>
        </div>
      </section>

      {/* Weekly Roadmap Preview (First 4 Weeks) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Weekly Learning Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Start from the relational foundations and progress into transactions and cloud databases
            </p>
          </div>

          <button
            onClick={() => onNavigate('/weeks')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View Full 14-Week Roadmap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewWeeks.map((week) => (
            <div
              key={week.id}
              onClick={() => onNavigate(`/week/${week.id}`)}
              className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md">
                    {week.label}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    {week.co.join(', ')}
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {week.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {week.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{week.decks[0]?.slides || 0} slides</span>
                <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Study <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access Portals */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notes Library */}
        <div
          onClick={() => onNavigate('/notes')}
          className="cursor-pointer p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 transition-colors space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Notes Library
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All 6 lecture notes including ER Diagrams with 10 worked scenarios, SQL practice sheet, and Transactions handouts.
          </p>
        </div>

        {/* 20 Interactive Labs */}
        <div
          onClick={() => onNavigate('/labs')}
          className="cursor-pointer p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 transition-colors space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            20 Interactive DBMS Labs
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            B+ Tree splits, Precedence graph cycle detection, Normalization 0NF→BCNF, RAID parity, and WAL log recovery.
          </p>
        </div>

        {/* Glossary */}
        <div
          onClick={() => onNavigate('/glossary')}
          className="cursor-pointer p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 transition-colors space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            60+ DBMS Glossary
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instant A–Z definitions of core terms: 2PL, MVCC, ARIES, BCNF, closure (X+), ACID, and relational algebra.
          </p>
        </div>
      </section>
    </div>
  );
};
