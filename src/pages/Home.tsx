import React from 'react';
import {
  Database,
  ArrowRight,
  BookOpen,
  FileText,
  Calendar,
  Layers,
  FlaskConical,
  GraduationCap,
  Map,
  Library,
  BookMarked,
  ChevronRight,
} from 'lucide-react';
import { courseData } from '../data/course';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const pages = [
    {
      title: 'Weekly Roadmap',
      description:
        '14 structured weekly modules guiding you through DBMS architecture, relational theory, SQL, indexing, and transactions.',
      icon: Map,
      path: '/weeks',
      color: 'indigo',
      badge: '14 Weeks',
    },
    {
      title: 'Notes Library',
      description:
        'Lecture notes, handouts, and previous year exam papers — all available to read and download as PDF.',
      icon: FileText,
      path: '/notes',
      color: 'violet',
      badge: '6 Handouts',
    },
    {
      title: 'Visualizations',
      description:
        '20 interactive concept visualizers: B+ trees, SQL playground, normalization stepper, precedence graphs, and more.',
      icon: FlaskConical,
      path: '/labs',
      color: 'emerald',
      badge: '20 Simulations',
    },
    {
      title: 'Glossary',
      description:
        'Searchable reference of all key DBMS terms, definitions, and concepts organized by topic cluster.',
      icon: BookMarked,
      path: '/glossary',
      color: 'teal',
      badge: 'All Terms',
    },
  ];

  const colorMap: Record<
    string,
    { badge: string; icon: string; border: string; hover: string; arrow: string }
  > = {
    indigo: {
      badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
      icon: 'bg-indigo-600 text-white',
      border: 'hover:border-indigo-300 dark:hover:border-indigo-700',
      hover: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
      arrow: 'text-indigo-600 dark:text-indigo-400',
    },
    violet: {
      badge: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
      icon: 'bg-violet-600 text-white',
      border: 'hover:border-violet-300 dark:hover:border-violet-700',
      hover: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
      arrow: 'text-violet-600 dark:text-violet-400',
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      icon: 'bg-emerald-600 text-white',
      border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      hover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
      arrow: 'text-emerald-600 dark:text-emerald-400',
    },
    teal: {
      badge: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
      icon: 'bg-teal-600 text-white',
      border: 'hover:border-teal-300 dark:hover:border-teal-700',
      hover: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
      arrow: 'text-teal-600 dark:text-teal-400',
    },
  };

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-50/70 via-white to-white dark:from-slate-900/80 dark:via-slate-900 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left */}
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
              Database Management
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                Systems
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              A <strong>Database Management System (DBMS)</strong> is software that enables users to
              define, create, maintain, and control access to a database. It acts as an intermediary
              between applications and persistent data, ensuring consistency, security, and
              concurrent access across structured information.
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Core concepts include the relational model, SQL, normalization, indexing, transaction
              management, concurrency control, and recovery — all of which form the backbone of
              modern data-driven applications.
            </p>

            {/* CTAs */}
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

            {/* Instructor */}
            <div className="pt-4 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
              <GraduationCap className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                Instructor:{' '}
                <strong>
                  {courseData.instructor.name}
                </strong>
                , Lecturer, Department of CSE, BAUST
              </span>
            </div>
          </div>

          {/* Right: decorative B+ tree visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-200/50 dark:border-indigo-800/40 p-6 flex flex-col justify-between shadow-lg">
              {/* Relational Table */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Relational Tuples</span>
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

              {/* Connector */}
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                <ArrowRight className="w-4 h-4 rotate-90" />
                <span>B+ Tree Indexing O(log n)</span>
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              {/* B+ Tree Nodes */}
              <div className="space-y-2">
                <div className="w-24 mx-auto py-1.5 px-3 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold text-center shadow-md">
                  [ 30 | 60 ]
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['[ 10, 20 ]', '[ 30, 40 ]', '[ 60, 70 ]'].map((node) => (
                    <div
                      key={node}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500 text-center font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-300"
                    >
                      {node}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {[
          { count: '14', label: 'Curriculum Weeks', color: 'text-indigo-600 dark:text-indigo-400' },
          { count: '13', label: 'Lecture Slide Decks', color: 'text-violet-600 dark:text-violet-400' },
          { count: '6', label: 'Course Notes & Handouts', color: 'text-teal-600 dark:text-teal-400' },
          { count: '20', label: 'Interactive Visualizations', color: 'text-emerald-600 dark:text-emerald-400' },
        ].map(({ count, label, color }) => (
          <div
            key={label}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
          >
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${color}`}>{count}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </section>

      {/* ── What is a DBMS? ── */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Foundations
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            What is a Database Management System?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="space-y-4">
            <p>
              A <strong className="text-slate-900 dark:text-slate-100">DBMS</strong> is a software
              system that provides a structured and reliable way to store, retrieve, and manage large
              volumes of data. Unlike traditional file systems, a DBMS eliminates data redundancy,
              enforces integrity constraints, and allows multiple users to access data concurrently
              without conflicts.
            </p>
            <p>
              The <strong className="text-slate-900 dark:text-slate-100">relational model</strong>{' '}
              — introduced by E.F. Codd in 1970 — organizes data into tables (relations) of rows
              (tuples) and columns (attributes), and uses keys to establish relationships between
              entities. SQL (Structured Query Language) is the standard language for querying and
              manipulating relational data.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              <strong className="text-slate-900 dark:text-slate-100">
                Core properties (ACID)
              </strong>{' '}
              — Atomicity, Consistency, Isolation, and Durability — guarantee that transactions are
              processed reliably, even in the face of system failures or concurrent access. These
              properties underpin the correctness of every real-world transactional system.
            </p>
            <p>
              Modern database systems extend beyond the relational model to include document stores,
              column-family databases, graph databases, and time-series stores — each optimized for
              different workload characteristics and query patterns.
            </p>
          </div>
        </div>

        {/* Key pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {[
            { label: 'Relational Model', desc: 'Tables, keys & foreign-key integrity' },
            { label: 'SQL', desc: 'DDL, DML, aggregations & joins' },
            { label: 'Normalization', desc: '1NF → BCNF decomposition' },
            { label: 'Indexing', desc: 'B+ trees & hashing strategies' },
            { label: 'Transactions', desc: 'ACID, 2PL & serializability' },
            { label: 'Recovery', desc: 'WAL, REDO/UNDO, ARIES' },
          ].map(({ label, desc }) => (
            <div
              key={label}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{label}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Page Cards ── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Explore the Study Portal
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Everything you need for {courseData.code} — in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pages.map((page) => {
            const Icon = page.icon;
            const c = colorMap[page.color];
            return (
              <div
                key={page.path}
                onClick={() => onNavigate(page.path)}
                className={`cursor-pointer group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all ${c.border}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${c.badge}`}>
                        {page.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors ${c.hover}`}>
                        {page.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {page.description}
                      </p>
                    </div>
                  </div>

                  <div className={`mt-1 shrink-0 ${c.arrow} group-hover:translate-x-1 transition-transform`}>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
