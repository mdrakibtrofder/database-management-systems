import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  FileText,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  BookOpen,
} from 'lucide-react';
import { courseData } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import { TopicClusterId } from '../types';

interface RoadmapProps {
  onNavigate: (path: string) => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({ onNavigate }) => {
  const { completedWeeks, toggleWeekCompleted, isWeekCompleted } = useProgress();
  const [selectedCo, setSelectedCo] = useState<string>('ALL');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [showOnlyUncompleted, setShowOnlyUncompleted] = useState<boolean>(false);

  // Filter weeks
  const filteredWeeks = courseData.weeks.filter((week) => {
    if (selectedCo !== 'ALL' && !week.co.includes(selectedCo as any)) return false;
    if (selectedCluster !== 'ALL' && week.cluster !== selectedCluster) return false;
    if (showOnlyUncompleted && isWeekCompleted(week.id)) return false;
    return true;
  });

  const getClusterColor = (clusterId: TopicClusterId) => {
    switch (clusterId) {
      case 'foundations':
        return 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400';
      case 'relational':
        return 'border-violet-500 text-violet-600 bg-violet-50 dark:bg-violet-950/60 dark:text-violet-400';
      case 'sql':
        return 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400';
      case 'storage':
        return 'border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400';
      case 'transactions':
        return 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400';
      case 'modern':
        return 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400';
      case 'revision':
        return 'border-slate-500 text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400';
      default:
        return 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60';
    }
  };

  return (
    <div className="space-y-10 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Interactive Course Syllabus
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Weekly Study Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            14 consecutive modules guiding you through architectural foundations, relational math, SQL design, indexing trees, and transaction engines.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* CO filter */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {['ALL', 'CO1', 'CO2', 'CO3', 'CO4'].map((co) => (
              <button
                key={co}
                onClick={() => setSelectedCo(co)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedCo === co
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {co}
              </button>
            ))}
          </div>

          {/* Not done toggle */}
          <button
            onClick={() => setShowOnlyUncompleted(!showOnlyUncompleted)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showOnlyUncompleted
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {showOnlyUncompleted ? 'Showing: Not Done Yet' : 'Filter: Uncompleted'}
          </button>
        </div>
      </div>

      {/* Cluster Legend Tags */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Clusters:</span>
        <button
          onClick={() => setSelectedCluster('ALL')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
            selectedCluster === 'ALL'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Clusters
        </button>
        {Object.entries(courseData.clusters).map(([cId, cluster]) => (
          <button
            key={cId}
            onClick={() => setSelectedCluster(cId)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedCluster === cId
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cluster.name}
          </button>
        ))}
      </div>

      {/* Vertical Timeline / Metro Path Layout */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filteredWeeks.map((week) => {
          const isDone = isWeekCompleted(week.id);
          const clusterStyle = getClusterColor(week.cluster);
          const totalSlides = week.decks.reduce((sum, d) => sum + d.slides, 0);

          return (
            <div key={week.id} className="relative group">
              {/* Timeline Node Icon */}
              <div
                onClick={() => toggleWeekCompleted(week.id)}
                className={`cursor-pointer absolute -left-6 sm:-left-10 top-5 w-6 h-6 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center transition-all ${
                  isDone
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-xs ring-4 ring-emerald-50 dark:ring-emerald-950'
                    : 'border-slate-300 dark:border-slate-700 text-slate-300 hover:border-slate-400'
                }`}
                title={isDone ? 'Mark as Incomplete' : 'Mark as Done'}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-2.5 h-2.5 fill-current" />}
              </div>

              {/* Week Card */}
              <div
                onClick={() => onNavigate(`/week/${week.id}`)}
                className={`cursor-pointer rounded-2xl border p-5 sm:p-6 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md ${
                  isDone
                    ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="space-y-3 max-w-2xl">
                  {/* Chips Header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-md border ${clusterStyle}`}>
                      {week.label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {courseData.clusters[week.cluster]?.name}
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      {week.co.map((c) => (
                        <span key={c} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {week.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {week.summary}
                    </p>
                  </div>

                  {/* Topic Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {week.topics.slice(0, 4).map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                    {week.topics.length > 4 && (
                      <span className="text-[11px] text-slate-400 py-0.5">
                        +{week.topics.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Meta Column */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                  <div className="text-xs text-slate-400 text-right space-y-1">
                    <div>
                      {totalSlides > 0 ? (
                        <span>
                          {week.decks.length > 1 ? `${week.decks.length} decks · ` : ''}
                          {totalSlides} slides
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          Revision Checklist
                        </span>
                      )}
                    </div>
                    {week.notes.length > 0 && (
                      <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {week.notes.length} note {week.notes.length === 1 ? 'handout' : 'handouts'}
                      </div>
                    )}
                    {week.labs.length > 0 && (
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {week.labs.length} interactive {week.labs.length === 1 ? 'visualizer' : 'visualizers'}
                      </div>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>Open Module</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
