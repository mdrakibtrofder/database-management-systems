import React, { useState } from 'react';
import { Database, Monitor, Server, HardDrive, ArrowDown, ArrowUp, Layers, CheckCircle2 } from 'lucide-react';

export const AnsiSparcLab: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<'external' | 'conceptual' | 'internal'>('conceptual');
  const [activeMode, setActiveMode] = useState<'ansi' | '3tier'>('ansi');
  const [isSimulatingRequest, setIsSimulatingRequest] = useState<boolean>(false);

  const triggerFlow = () => {
    setIsSimulatingRequest(true);
    setTimeout(() => setIsSimulatingRequest(false), 2200);
  };

  return (
    <div className="space-y-6">
      {/* Mode Switch */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Architecture Perspective:
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveMode('ansi')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeMode === 'ansi'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              ANSI-SPARC 3-Level Model
            </button>
            <button
              onClick={() => setActiveMode('3tier')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeMode === '3tier'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              3-Tier Client-Server Architecture
            </button>
          </div>
        </div>

        <button
          onClick={triggerFlow}
          disabled={isSimulatingRequest}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
        >
          <span>Simulate Query Request Flow</span>
        </button>
      </div>

      {activeMode === 'ansi' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* External Level */}
          <div
            onClick={() => setSelectedLayer('external')}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              selectedLayer === 'external'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Monitor className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase font-bold text-slate-400 mb-1">Level 1</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              External Level (User Views)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Describes how individual users or departments view data. Multiple tailored views hide irrelevant or confidential columns (e.g., student view vs. registrar view).
            </p>
          </div>

          {/* Conceptual Level */}
          <div
            onClick={() => setSelectedLayer('conceptual')}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              selectedLayer === 'conceptual'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase font-bold text-slate-400 mb-1">Level 2</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Conceptual Level (Logical Schema)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Describes WHAT data is stored for the entire organization and relationships among data (entities, constraints, types). Managed by the DBA.
            </p>
          </div>

          {/* Internal Level */}
          <div
            onClick={() => setSelectedLayer('internal')}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              selectedLayer === 'internal'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase font-bold text-slate-400 mb-1">Level 3</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Internal Level (Physical Storage)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Describes HOW data is physically organized on disks (file layouts, slotted pages, B+ tree indices, hashing buckets, compression).
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Client */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Monitor className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
              Tier 1: Presentation Layer
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Student web browser / mobile app interface. Renders HTML/CSS/React UI and captures user input without any direct database access.
            </p>
          </div>

          {/* Tier 2: Application Server */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Server className="w-8 h-8 text-violet-600 mb-3" />
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
              Tier 2: Business Logic Server
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Application server (Node.js/Express, Spring Boot). Validates student credentials, enforces course prerequisites, and prepares parameterized SQL queries.
            </p>
          </div>

          {/* Tier 3: Database Server */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Database className="w-8 h-8 text-teal-600 mb-3" />
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
              Tier 3: Database Server
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              DBMS engine (PostgreSQL, Oracle, MySQL). Executes query optimization, concurrency control, transaction WAL logging, and disk block I/O.
            </p>
          </div>
        </div>
      )}

      {/* Data Independence Explanation Card */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs sm:text-sm space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Understanding Data Independence in Practice:</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-semibold text-indigo-600 dark:text-indigo-400">
              1. Logical Data Independence
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Capacity to alter the conceptual schema (e.g. adding a new optional column <code className="font-mono">middle_name</code> or splitting a table) without rewriting existing external views or client programs.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="font-semibold text-teal-600 dark:text-teal-400">
              2. Physical Data Independence
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Capacity to modify internal physical storage (e.g. creating a new B+ tree index on <code className="font-mono">student_id</code> or migrating from HDD to NVMe SSD) without changing the conceptual schema or SQL queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
