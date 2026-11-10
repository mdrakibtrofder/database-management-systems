import React, { useState } from 'react';
import { Sparkles, ArrowRight, Filter, Database, Search } from 'lucide-react';
import { labsList } from '../data/course';

interface LabsGalleryProps {
  onNavigate: (path: string) => void;
}

export const LabsGallery: React.FC<LabsGalleryProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = Array.from(new Set(labsList.map((l) => l.category)));

  const filteredLabs = labsList.filter((lab) => {
    const matchesCategory = selectedCategory === 'ALL' || lab.category === selectedCategory;
    const matchesSearch =
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Interactive Simulations
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            20 Interactive DBMS Visualizations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Hands-on visualizers for the most challenging DBMS mechanisms: B+ tree rebalancing, schedule serializability, normalization, and recovery.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 20 visualizations..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Category:</span>
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All ({labsList.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => (
          <div
            key={lab.id}
            onClick={() => onNavigate(`/lab/${lab.id}`)}
            className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {lab.weekLabel}
                </span>
                <span className="text-[11px] text-slate-400">{lab.category}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {lab.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                {lab.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                {lab.difficulty}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Launch Simulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
