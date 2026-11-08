import React from 'react';
import {
  GraduationCap,
  Mail,
  Building,
  Clock,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { courseData } from '../data/course';

interface AboutProps {
  onNavigate: (path: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 py-6 sm:py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Course Specification
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
          {courseData.code} · {courseData.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
          Complete academic curriculum facts, instructor details, assessment policy, and Course Outcome (CO) mapping for {courseData.semester}.
        </p>
      </div>

      {/* Facts & Instructor Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Facts */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Course Facts & Administrative Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-slate-400">Course Code & Title</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {courseData.code} · {courseData.title}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-slate-400">Credit Hours & Contact</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {courseData.credit}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-slate-400">Level & Term</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {courseData.levelTerm} ({courseData.semester})
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-slate-400">Department & Institution</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                {courseData.university}
              </div>
            </div>
          </div>
        </div>

        {/* Instructor Card */}
        <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/60 via-white to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              RT
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {courseData.instructor.name}
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                {courseData.instructor.designation}, CSE
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a
                href={`mailto:${courseData.instructor.email}`}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-2"
              >
                {courseData.instructor.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Room: {courseData.instructor.room}</span>
            </div>
            <div className="pt-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Student Counselling Hours:
              </span>
              <ul className="space-y-1 font-mono text-[11px] text-slate-500">
                {courseData.instructor.hours.map((h, i) => (
                  <li key={i}>↳ {h}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Policy Breakdown */}
      <section className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Grading Structure
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            Course Assessment & Weight Distribution
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {courseData.assessment.map((item) => (
            <div
              key={item.component}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                item.weight === 60
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <div>
                <div
                  className={`text-2xl font-black font-mono ${
                    item.weight === 60
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {item.weight}%
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">
                  {item.component}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Course Outcomes (COs) Table */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Outcome-Based Education (OBE)
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            Course Outcomes (COs) and Mapping
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-4 w-20">CO</th>
                <th className="p-4">Outcome Statement</th>
                <th className="p-4 w-36">Mapped PO</th>
                <th className="p-4 w-36">Bloom&apos;s Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {courseData.outcomes.map((co) => (
                <tr key={co.co} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {co.co}
                  </td>
                  <td className="p-4 text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {co.statement}
                  </td>
                  <td className="p-4 text-slate-500 font-mono">{co.po}</td>
                  <td className="p-4 text-slate-500 font-mono">{co.bloom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Textbooks & References */}
      <section className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Academic References
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            Textbooks & Official Documentation
          </h2>
        </div>

        <div className="space-y-3">
          {courseData.textbooks.map((book, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                book.isPrimary
                  ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {book.title}
                  </span>
                  {book.isPrimary && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                      Primary Textbook
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {book.authors} · {book.edition} · {book.publisher}
                </div>
              </div>

              {book.url && (
                <a
                  href={book.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                >
                  <span>Publisher Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
