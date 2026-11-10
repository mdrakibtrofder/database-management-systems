import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Award,
  BookOpen,
  ArrowRight,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { courseData } from '../data/course';
import { useProgress } from '../context/ProgressContext';

interface ExamPrepProps {
  onNavigate: (path: string) => void;
}

export const ExamPrep: React.FC<ExamPrepProps> = ({ onNavigate }) => {
  const { completedWeeks, isWeekCompleted } = useProgress();
  const [examDate, setExamDate] = useState<string>('2026-08-15');
  const [selectedCoFilter, setSelectedCoFilter] = useState<string>('ALL');

  // Study plan calculation: calculate days remaining until examDate
  const calculateDaysRemaining = () => {
    const today = new Date();
    const target = new Date(examDate);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return isNaN(diff) || diff < 1 ? 14 : diff;
  };

  const daysRemaining = calculateDaysRemaining();
  const unfinishedWeeks = courseData.weeks.filter((w) => !isWeekCompleted(w.id));

  // High-yield topic weight distribution
  const topicDistribution = [
    { topic: 'Transactions, Concurrency (2PL) & Recovery', weight: 32, weeks: 'W8, W10-11', co: 'CO4' },
    { topic: 'Normalization (1NF–BCNF) & Functional Dependencies', weight: 24, weeks: 'W4', co: 'CO2' },
    { topic: 'Indexing, B+ Trees & Hashing Calculations', weight: 18, weeks: 'W7', co: 'CO3' },
    { topic: 'Relational Algebra & Advanced SQL Aggregations', weight: 16, weeks: 'W3, W5, W6', co: 'CO3' },
    { topic: 'ER Modeling & 3-Tier ANSI-SPARC Architecture', weight: 10, weeks: 'W1, W2', co: 'CO1' },
  ];

  const filteredQuestions = courseData.examQuestions.filter((q) => {
    return selectedCoFilter === 'ALL' || q.co === selectedCoFilter;
  });

  return (
    <div className="space-y-10 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            60% Course Weight
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Term Final Examination Preparation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Previous years&apos; question papers, question-to-week mapping, solved transaction practice sheets, and personalized study timeline generator.
          </p>
        </div>

        {/* 60% Exam Weight Badge */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-sm">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Final Exam: 60 Marks (3 Hours)</span>
          </div>
          <p className="text-amber-800 dark:text-amber-300">
            Continuous Assessment: 40% (CTs 20%, Attendance 10%, Assignments 10%)
          </p>
        </div>
      </div>

      {/* Scanned Final Exam Questions Paper Feature Box */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            Official Question Bank
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Previous Years&apos; Final Examination Question Papers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            18-page collection of actual scanned exam papers from previous Level-2 Term-II semesters at BAUST. Practice real problem statements across all 4 Course Outcomes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('/notes')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs shadow-xs transition-colors text-center"
          >
            Open in Document Viewer
          </button>
          <a
            href={`${import.meta.env.BASE_URL}notes/CSE_2205_Previous_Years_Final_Questions.pdf`}
            download="CSE_2205_Previous_Years_Final_Questions.pdf"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF (1.2 MB)</span>
          </a>
        </div>
      </div>

      {/* Study Plan Generator */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Personalized Study Plan Generator</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              Distribute Unfinished Modules Before Exam Day
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Pick Final Exam Date:
            </span>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-center">
            <div className="text-xs text-slate-400 font-sans">Days Until Exam</div>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
              {daysRemaining} Days
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-center">
            <div className="text-xs text-slate-400 font-sans">Modules Pending</div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {unfinishedWeeks.length} Weeks
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-center">
            <div className="text-xs text-slate-400 font-sans">Target Pace</div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {(daysRemaining / Math.max(1, unfinishedWeeks.length)).toFixed(1)} Days / Module
            </div>
          </div>
        </div>

        {/* Schedule Distribution List */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recommended Daily Study Schedule
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unfinishedWeeks.slice(0, 6).map((w, idx) => (
              <div
                key={w.id}
                onClick={() => onNavigate(`/week/${w.id}`)}
                className="cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    Target Day {idx * 2 + 1}–{idx * 2 + 2}
                  </span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {w.label}: {w.title}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            ))}
          </div>
          {unfinishedWeeks.length === 0 && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Outstanding! You have completed all 13 weekly modules. Focus on reviewing previous year exam questions below.</span>
            </div>
          )}
        </div>
      </section>

      {/* Most Asked Exam Topics Bar Chart */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Exam Topic Weight Distribution (Historical Exam Analysis)
            </h3>
            <p className="text-xs text-slate-500">
              Statistical breakdown of question marks distribution across previous semesters
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-600 font-bold">100% Total</span>
        </div>

        <div className="space-y-3 pt-2">
          {topicDistribution.map((t) => (
            <div key={t.topic} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-800 dark:text-slate-200">
                  {t.topic} ({t.weeks}) · <strong className="text-slate-500 font-mono">{t.co}</strong>
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {t.weight}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
                  style={{ width: `${t.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Question-to-Week Mapping Table */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Question-to-Week Mapping Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Direct mapping of term final question patterns to corresponding syllabus weeks
            </p>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {['ALL', 'CO1', 'CO2', 'CO3', 'CO4'].map((co) => (
              <button
                key={co}
                onClick={() => setSelectedCoFilter(co)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedCoFilter === co
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {co}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-3">Exam Term</th>
                <th className="p-3">Question #</th>
                <th className="p-3">Specific Topic</th>
                <th className="p-3">CO</th>
                <th className="p-3">Marks</th>
                <th className="p-3">Study Module</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-sans font-medium text-slate-600 dark:text-slate-400">
                    {q.year} {q.exam}
                  </td>
                  <td className="p-3 font-bold text-indigo-600">{q.questionNo}</td>
                  <td className="p-3 font-sans text-slate-900 dark:text-slate-100">{q.topic}</td>
                  <td className="p-3 text-slate-500">{q.co}</td>
                  <td className="p-3">{q.marks} Marks</td>
                  <td className="p-3">
                    <button
                      onClick={() => onNavigate(`/week/${q.weekId}`)}
                      className="font-sans font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Week {q.weekId} →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
