import React, { useMemo, useState } from 'react';
import {
  Download,
  Search,
  Eye,
  Presentation,
  X,
  FileText,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { courseData } from '../data/course';
import { SlideDeck, Week } from '../types';
import { SlideViewer } from '../components/common/SlideViewer';

interface SlidesLibraryProps {
  onNavigate: (path: string) => void;
}

interface SlideDeckWithWeek extends SlideDeck {
  week: Week;
}

// Cluster color → gradient pair for card headers
const clusterGradients: Record<string, string> = {
  indigo: 'from-indigo-700 to-indigo-900',
  violet: 'from-violet-700 to-violet-900',
  blue: 'from-blue-700 to-blue-900',
  teal: 'from-teal-700 to-teal-900',
  amber: 'from-amber-600 to-amber-800',
  rose: 'from-rose-700 to-rose-900',
  slate: 'from-slate-700 to-slate-900',
};

const clusterBadgeColors: Record<string, string> = {
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  teal: 'bg-teal-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-500',
};

export const SlidesLibrary: React.FC<SlidesLibraryProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [activeDeck, setActiveDeck] = useState<SlideDeckWithWeek | null>(null);

  // Flatten all decks across weeks
  const allDecks: SlideDeckWithWeek[] = useMemo(() => {
    return courseData.weeks.flatMap((week) =>
      week.decks.map((deck) => ({ ...deck, week }))
    );
  }, []);

  const clusters = Object.values(courseData.clusters);

  const filteredDecks = allDecks.filter((deck) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      deck.title.toLowerCase().includes(q) ||
      deck.week.title.toLowerCase().includes(q) ||
      deck.week.label.toLowerCase().includes(q) ||
      deck.sections.some((s) => s.toLowerCase().includes(q));

    const clusterId = deck.week.cluster;
    const matchesCluster =
      selectedCluster === 'ALL' || clusterId === selectedCluster;

    return matchesQuery && matchesCluster;
  });

  const totalSlides = allDecks.reduce((sum, d) => sum + d.slides, 0);

  return (
    <div className="space-y-10 py-6 sm:py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Course Repository
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Lecture Slides Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {allDecks.length} slide decks · {totalSlides} total slides covering the complete CSE 2205 curriculum. View interactively in-browser or download the original PPTX files.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search slides or topics..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Cluster Filters */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Clusters:</span>
        <button
          onClick={() => setSelectedCluster('ALL')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            selectedCluster === 'ALL'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All ({allDecks.length})
        </button>
        {clusters.map((cluster) => {
          const count = allDecks.filter((d) => d.week.cluster === cluster.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cluster.id}
              onClick={() => setSelectedCluster(cluster.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedCluster === cluster.id
                  ? 'text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              style={
                selectedCluster === cluster.id
                  ? { backgroundColor: cluster.hex }
                  : undefined
              }
            >
              {cluster.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks.map((deck) => {
          const gradient = clusterGradients[deck.week.color] || clusterGradients.slate;
          const badgeColor = clusterBadgeColors[deck.week.color] || clusterBadgeColors.slate;

          return (
            <div
              key={`${deck.week.id}-${deck.id}`}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden group"
            >
              {/* Card Header: gradient banner */}
              <div
                className={`relative h-40 bg-gradient-to-br ${gradient} p-5 flex flex-col justify-between overflow-hidden`}
              >
                {/* Week badge */}
                <div className="flex items-start justify-between">
                  <span
                    className={`${badgeColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm`}
                  >
                    {deck.week.label}
                  </span>

                  {/* Circular logo placeholder */}
                  <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/20">
                    <Presentation className="w-6 h-6 text-white/90" />
                  </div>
                </div>

                {/* Title overlay */}
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                    CSE 2205 · {courseData.code}
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight line-clamp-2">
                    {deck.title}
                  </h3>
                </div>

                {/* View slides hover overlay */}
                <button
                  onClick={() => setActiveDeck(deck)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg font-semibold text-sm shadow-lg">
                    <Eye className="w-4 h-4" />
                    View slides
                  </span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {deck.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {deck.week.summary}
                  </p>

                  {/* Meta: slide count */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Layers className="w-3.5 h-3.5" />
                    <span className="font-mono">{deck.slides} slides</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <a
                    href={deck.pptx}
                    download
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PPTX · {deck.size}</span>
                  </a>

                  <button
                    onClick={() => setActiveDeck(deck)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="View slides in-browser"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View</span>
                  </button>

                  <button
                    onClick={() => onNavigate(`/week/${deck.week.id}`)}
                    className="inline-flex items-center justify-center px-2.5 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Open week page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDecks.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold">No slides match your search.</p>
          <p className="text-xs mt-1">Try a different keyword or clear the filters.</p>
        </div>
      )}

      {/* Interactive Slide Viewer Modal */}
      {activeDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-6xl max-h-[95vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 bg-slate-900 border border-slate-700 rounded-t-2xl">
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-white truncate">
                  {activeDeck.title}
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {activeDeck.week.label} · {activeDeck.week.title}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeDeck.pptx}
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PPTX</span>
                </a>
                <button
                  onClick={() => setActiveDeck(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slide viewer */}
            <div className="flex-1 overflow-hidden rounded-b-2xl">
              <SlideViewer
                deck={activeDeck}
                weekId={activeDeck.week.id}
                weekTitle={activeDeck.week.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
