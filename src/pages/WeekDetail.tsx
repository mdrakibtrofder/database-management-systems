import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Award,
  HelpCircle,
  Menu,
} from 'lucide-react';
import { courseData, labsList } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import { SlideViewer } from '../components/common/SlideViewer';
import { QuizModal } from '../components/common/QuizModal';
import { FlashcardDeck } from '../components/common/FlashcardDeck';
import { LabDispatcher } from '../components/labs/LabDispatcher';

interface WeekDetailProps {
  weekId: number;
  initialPage?: number;
  onNavigate: (path: string) => void;
}

export const WeekDetail: React.FC<WeekDetailProps> = ({
  weekId,
  initialPage = 1,
  onNavigate,
}) => {
  const { toggleWeekCompleted, isWeekCompleted, setLastVisitedWeek } = useProgress();

  // Find target week. Special alias: Week 11 maps to Week 10
  const normalizedId = weekId === 11 ? 10 : weekId;
  const week = courseData.weeks.find((w) => w.id === normalizedId) || courseData.weeks[0];

  const [activeDeckIdx, setActiveDeckIdx] = useState<number>(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    setLastVisitedWeek(week.id);
    setActiveDeckIdx(0);
  }, [week.id, setLastVisitedWeek]);

  const isDone = isWeekCompleted(week.id);
  const currentDeck = week.decks[activeDeckIdx] || week.decks[0];

  // Prev / Next Week navigation
  const currentIndex = courseData.weeks.findIndex((w) => w.id === week.id);
  const prevWeek = currentIndex > 0 ? courseData.weeks[currentIndex - 1] : null;
  const nextWeek = currentIndex < courseData.weeks.length - 1 ? courseData.weeks[currentIndex + 1] : null;

  // Related notes
  const relatedNotes = courseData.notes.filter((n) => n.weeks.includes(week.id));

  // Lab metadata
  const weekLabs = labsList.filter((l) => week.labs.includes(l.id));

  return (
    <div className="py-6 sm:py-8">
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs"
        >
          <span className="flex items-center gap-2">
            <Menu className="w-4 h-4" />
            <span>Select Curriculum Week ({week.label})</span>
          </span>
          <span className="text-indigo-600 font-bold">Browse 14 Weeks ↓</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Left Sidebar (Desktop + Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 lg:sticky lg:top-24 space-y-4 ${
            mobileSidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Curriculum Syllabus
              </span>
              <span className="text-xs font-mono text-slate-500">14 Weeks</span>
            </div>

            <nav className="space-y-1 max-h-[75vh] overflow-y-auto pr-1">
              {courseData.weeks.map((w) => {
                const isSelected = w.id === week.id;
                const completed = isWeekCompleted(w.id);

                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      onNavigate(`/week/${w.id}`);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {w.id}
                      </span>
                      <span className="truncate">{w.label} · {w.title}</span>
                    </div>

                    {completed && (
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'text-white' : 'text-emerald-500'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Column */}
        <main className="lg:col-span-9 space-y-12">
          {/* 1. Header */}
          <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            {/* Prev / Next arrows */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              {prevWeek ? (
                <button
                  onClick={() => onNavigate(`/week/${prevWeek.id}`)}
                  className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{prevWeek.label}: {prevWeek.title}</span>
                </button>
              ) : (
                <span />
              )}

              {nextWeek ? (
                <button
                  onClick={() => onNavigate(`/week/${nextWeek.id}`)}
                  className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium ml-auto"
                >
                  <span>{nextWeek.label}: {nextWeek.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span />
              )}
            </div>

            {/* Title & Chips */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {week.label}
                  </span>
                  <span className="text-xs text-slate-400">
                    {courseData.clusters[week.cluster]?.name}
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <div className="flex items-center gap-1">
                    {week.co.map((c) => (
                      <span key={c} className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {week.title}
                </h1>
              </div>

              {/* Mark Done Button */}
              <button
                onClick={() => toggleWeekCompleted(week.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isDone ? 'fill-current' : ''}`} />
                <span>{isDone ? 'Completed ✓' : 'Mark as Done'}</span>
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {week.summary}
            </p>
          </div>

          {/* 2. Slide Viewer Section (or Revision for Week 14) */}
          {week.id === 14 ? (
            /* Week 14 Revision Page */
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Course Revision & Wrap-Up Hub</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Final Examination Checklist & Review
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Week 14 is dedicated to synthesizing all 4 Course Outcomes (CO1–CO4) in preparation for the 60% Term Final exam. Review the high-yield topics below:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {courseData.outcomes.map((co) => (
                  <div
                    key={co.co}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs font-mono text-indigo-600 dark:text-indigo-400">
                        {co.co}
                      </span>
                      <span className="text-[11px] text-slate-400">{co.bloom}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {co.statement}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => onNavigate('/exam')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Open Previous Years&apos; Exam Papers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Slide Viewer for Weeks 1 to 13 */
            <div className="space-y-4">
              {/* If week has multiple decks (Week 3), render tabs! */}
              {week.decks.length > 1 && (
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium w-fit">
                  {week.decks.map((deck, dIdx) => (
                    <button
                      key={deck.id}
                      onClick={() => setActiveDeckIdx(dIdx)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeDeckIdx === dIdx
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {deck.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Slide Viewer */}
              {currentDeck && (
                <SlideViewer
                  deck={currentDeck}
                  weekId={week.id}
                  weekTitle={week.title}
                  initialPage={initialPage}
                />
              )}
            </div>
          )}

          {/* 3. What You'll Learn & Topics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Key Topics Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {week.topics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* 4. Key Takeaways */}
          {week.keyTakeaways.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Conceptual Takeaways
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {week.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <span>Takeaway {idx + 1}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {takeaway}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Interactive Concept Labs (Inline embedded) */}
          {week.labs.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Interactive DBMS Concept Visualizer</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    Hands-on Simulation for {week.label}
                  </h3>
                </div>
              </div>

              {/* Render all labs for this week */}
              <div className="space-y-10">
                {week.labs.map((labId) => {
                  const labMeta = labsList.find((l) => l.id === labId);
                  return (
                    <div
                      key={labId}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {labMeta?.category || 'Concept Lab'}
                          </span>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {labMeta?.title || labId}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {labMeta?.summary}
                          </p>
                        </div>

                        <button
                          onClick={() => onNavigate(`/lab/${labId}`)}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                        >
                          Full-Screen Mode →
                        </button>
                      </div>

                      {/* The Lab component itself */}
                      <LabDispatcher labId={labId} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. Related Study Notes */}
          {relatedNotes.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Supporting Lecture Notes & Handouts ({relatedNotes.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                          <FileText className="w-4 h-4" />
                          <span>PDF Document</span>
                        </span>
                        <span className="font-mono">{note.pages} pages · {note.size}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                        {note.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {note.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => onNavigate('/notes')}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Read Note in Viewer →
                      </button>
                      <a
                        href={note.file}
                        download
                        className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Check Yourself 5-Question MCQ Quiz */}
          {week.quiz.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <QuizModal
                weekId={week.id}
                weekTitle={week.title}
                questions={week.quiz}
              />
            </div>
          )}

          {/* 8. Active Recall Flashcards */}
          {week.flashcards.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <FlashcardDeck cards={week.flashcards} weekTitle={week.title} />
            </div>
          )}

          {/* 9. Previous Year Questions link banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Exam Preparation
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                Past Final Exam Questions on {week.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">
                View previous semester final exam papers to practice real questions asked on this topic.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/exam')}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs shadow-xs transition-colors shrink-0"
            >
              Open Exam Prep →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
