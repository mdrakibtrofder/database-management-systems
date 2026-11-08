import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, Check, X, Layers, Clock } from 'lucide-react';

export const TwoPhaseLockingLab: React.FC = () => {
  const [protocol, setProtocol] = useState<'basic' | 'strict' | 'rigorous'>('strict');

  const isolationMatrix = [
    {
      level: 'Read Uncommitted',
      dirtyRead: 'Allowed (Yes)',
      nonRepeatable: 'Allowed (Yes)',
      phantom: 'Allowed (Yes)',
    },
    {
      level: 'Read Committed',
      dirtyRead: 'Prevented (No)',
      nonRepeatable: 'Allowed (Yes)',
      phantom: 'Allowed (Yes)',
    },
    {
      level: 'Repeatable Read',
      dirtyRead: 'Prevented (No)',
      nonRepeatable: 'Prevented (No)',
      phantom: 'Allowed (Yes)',
    },
    {
      level: 'Serializable (Strict 2PL)',
      dirtyRead: 'Prevented (No)',
      nonRepeatable: 'Prevented (No)',
      phantom: 'Prevented (No)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Protocol Selector */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            2PL Variant:
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {(
              [
                { id: 'basic', label: 'Basic 2PL' },
                { id: 'strict', label: 'Strict 2PL (Standard)' },
                { id: 'rigorous', label: 'Rigorous 2PL' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setProtocol(item.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  protocol === item.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
          Conflict Serializability: Guaranteed ✓
        </span>
      </div>

      {/* Visual Timeline of Phases */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Transaction Lock Timeline (Phase Growth & Shrinkage)
        </h4>

        <div className="relative pt-6 pb-2">
          {/* Phase labels */}
          <div className="grid grid-cols-2 text-center text-xs font-bold mb-2">
            <span className="text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Phase 1: Growing Phase (Acquiring Locks Only)</span>
            </span>
            <span className="text-violet-600 dark:text-violet-400 flex items-center justify-center gap-1">
              <Unlock className="w-3.5 h-3.5" />
              <span>Phase 2: Shrinking Phase (Releasing Locks)</span>
            </span>
          </div>

          {/* Bar representation */}
          <div className="h-6 w-full rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden p-1 gap-1">
            <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-l-full flex items-center justify-center text-[10px] font-bold text-white tracking-wider">
              GROWING PHASE
            </div>
            <div className="h-full w-1/2 bg-gradient-to-r from-violet-500 to-violet-600 rounded-r-full flex items-center justify-center text-[10px] font-bold text-white tracking-wider">
              SHRINKING PHASE
            </div>
          </div>

          {/* Lock Point marker */}
          <div className="text-center mt-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 font-mono">
              ▲ Lock Point (Peak where all required locks are acquired)
            </span>
          </div>
        </div>

        {/* Protocol rule description */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
          {protocol === 'basic' && (
            <p>
              <strong>Basic 2PL:</strong> A transaction may acquire locks during Phase 1. Once it releases its first lock, it enters Phase 2 and cannot obtain any new locks. (Guarantees serializability, but vulnerable to cascading aborts).
            </p>
          )}
          {protocol === 'strict' && (
            <p>
              <strong>Strict 2PL:</strong> Most widely used commercial DBMS protocol. Requires all <strong>Exclusive (X/Write) locks</strong> to be held until transaction COMMIT or ROLLBACK. Completely prevents dirty reads and cascading aborts!
            </p>
          )}
          {protocol === 'rigorous' && (
            <p>
              <strong>Rigorous 2PL:</strong> Strict protocol that holds <strong>ALL locks (both Shared S and Exclusive X)</strong> until COMMIT or ROLLBACK. Transactions can be serialized in the exact order in which they commit.
            </p>
          )}
        </div>
      </div>

      {/* SQL Isolation Levels vs Anomalies Matrix */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 dark:text-slate-100">
            ANSI SQL Isolation Levels vs. Concurrency Anomalies
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Exam High-Yield Table</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold uppercase">
              <tr>
                <th className="p-3">Isolation Level</th>
                <th className="p-3">Dirty Read (P1)</th>
                <th className="p-3">Non-Repeatable Read (P2)</th>
                <th className="p-3">Phantom Read (P3)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
              {isolationMatrix.map((row) => (
                <tr key={row.level} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold font-sans text-slate-900 dark:text-slate-100">
                    {row.level}
                  </td>
                  <td
                    className={`p-3 ${
                      row.dirtyRead.startsWith('Allowed')
                        ? 'text-rose-600 font-bold'
                        : 'text-emerald-600 font-semibold'
                    }`}
                  >
                    {row.dirtyRead}
                  </td>
                  <td
                    className={`p-3 ${
                      row.nonRepeatable.startsWith('Allowed')
                        ? 'text-rose-600 font-bold'
                        : 'text-emerald-600 font-semibold'
                    }`}
                  >
                    {row.nonRepeatable}
                  </td>
                  <td
                    className={`p-3 ${
                      row.phantom.startsWith('Allowed')
                        ? 'text-rose-600 font-bold'
                        : 'text-emerald-600 font-semibold'
                    }`}
                  >
                    {row.phantom}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
