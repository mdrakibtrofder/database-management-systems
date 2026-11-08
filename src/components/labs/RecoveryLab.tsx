import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, RotateCcw, ShieldAlert, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface LogEntry {
  lsn: number;
  text: string;
  type: 'start' | 'update' | 'commit' | 'checkpoint' | 'crash' | 'clr';
  txn?: string;
  item?: string;
  oldVal?: number;
  newVal?: number;
}

const initialLog: LogEntry[] = [
  { lsn: 1, text: '<T1 start>', type: 'start', txn: 'T1' },
  { lsn: 2, text: '<T1, A, 100, 200>', type: 'update', txn: 'T1', item: 'A', oldVal: 100, newVal: 200 },
  { lsn: 3, text: '<T2 start>', type: 'start', txn: 'T2' },
  { lsn: 4, text: '<T1, B, 50, 75>', type: 'update', txn: 'T1', item: 'B', oldVal: 50, newVal: 75 },
  { lsn: 5, text: '<T1 commit>', type: 'commit', txn: 'T1' },
  { lsn: 6, text: '<CHECKPOINT {T2}>', type: 'checkpoint' },
  { lsn: 7, text: '<T3 start>', type: 'start', txn: 'T3' },
  { lsn: 8, text: '<T2, C, 20, 40>', type: 'update', txn: 'T2', item: 'C', oldVal: 20, newVal: 40 },
  { lsn: 9, text: '<T3, A, 200, 350>', type: 'update', txn: 'T3', item: 'A', oldVal: 200, newVal: 350 },
  { lsn: 10, text: '*** SYSTEM CRASH / POWER LOSS ***', type: 'crash' },
];

export const RecoveryLab: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<number>(0);

  // Phases:
  // 0: Initial Crash State
  // 1: Analysis Pass (Identify Winners & Losers)
  // 2: Redo Pass (Repeat History Forward)
  // 3: Undo Pass (Roll Back Losers Backward)
  // 4: Final Consistent State

  const phaseDetails = [
    {
      title: 'Phase 0: Post-Crash Raw Memory State',
      caption: 'The system crashed unexpectedly at LSN 10. Memory buffers are lost. Only non-volatile disk tables and the persistent log remain.',
      activeLsns: [10],
      winners: ['T1 (Committed at LSN 5)'],
      losers: ['T2 (Uncommitted)', 'T3 (Uncommitted)'],
      diskValues: { A: 350, B: 75, C: 40 },
    },
    {
      title: 'Phase 1: Analysis Pass (Scans Forward from Checkpoint)',
      caption: 'Analysis pass scans from the checkpoint at LSN 6 to crash point. It determines: T1 is already COMMITTED (Winner); T2 and T3 were ACTIVE with no commit record (Losers to be rolled back).',
      activeLsns: [6, 7, 8, 9, 10],
      winners: ['T1'],
      losers: ['T2', 'T3'],
      diskValues: { A: 350, B: 75, C: 40 },
    },
    {
      title: 'Phase 2: Redo Pass (Repeat History Forward)',
      caption: 'Redo pass scans forward from the earliest dirty page to bring the database to the exact state before crash: redoes T2 (C = 40) and T3 (A = 350). Redo ensures durability of all committed data.',
      activeLsns: [2, 4, 8, 9],
      winners: ['T1 (Preserved)'],
      losers: ['T2 (Pending undo)', 'T3 (Pending undo)'],
      diskValues: { A: 350, B: 75, C: 40 },
    },
    {
      title: 'Phase 3: Undo Pass (Scans Backward Rolling Back Losers)',
      caption: 'Undo pass scans backward from the crash point: 1. Rolls back T3 update on A: sets A back to 200. 2. Rolls back T2 update on C: sets C back to 20. Compensation Log Records (CLRs) are written.',
      activeLsns: [9, 8],
      winners: ['T1 (Committed)'],
      losers: ['T2 (Aborted & Undone)', 'T3 (Aborted & Undone)'],
      diskValues: { A: 200, B: 75, C: 20 },
    },
    {
      title: 'Phase 4: Recovery Complete (Database Consistent)',
      caption: 'Database restored to a completely consistent ACID state. Committed transactions (T1) preserved: A=200, B=75. Uncommitted changes (T2, T3) completely erased: C=20.',
      activeLsns: [],
      winners: ['T1'],
      losers: [],
      diskValues: { A: 200, B: 75, C: 20 },
    },
  ];

  const phase = phaseDetails[currentPhase];

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          {['0. Crash State', '1. Analysis Pass', '2. Redo Pass', '3. Undo Pass', '4. Complete'].map(
            (label, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPhase(idx)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  currentPhase === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPhase((p) => Math.max(0, p - 1))}
            disabled={currentPhase === 0}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPhase((p) => Math.min(phaseDetails.length - 1, p + 1))}
            disabled={currentPhase === phaseDetails.length - 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPhase(0)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors ml-1"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Phase Banner */}
      <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{phase.title}</span>
        </div>
        <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-100 leading-relaxed">
          {phase.caption}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: WAL Log Strip */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              Write-Ahead Log (WAL) Records on Disk
            </span>
            <span className="text-slate-500 font-mono text-[11px]">LSN 1 to 10</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
            {initialLog.map((entry) => {
              const isActive = phase.activeLsns.includes(entry.lsn);

              let badgeColor = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
              if (entry.type === 'commit')
                badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
              if (entry.type === 'checkpoint')
                badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300';
              if (entry.type === 'crash')
                badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 font-bold';

              return (
                <div
                  key={entry.lsn}
                  className={`px-4 py-2.5 flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px] w-6">#{entry.lsn}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {entry.text}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${badgeColor}`}>
                    {entry.type.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Disk Values & Transaction State */}
        <div className="space-y-4">
          {/* Live Disk Data Items */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Database Table Disk Values
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              {Object.entries(phase.diskValues).map(([item, val]) => (
                <div
                  key={item}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="text-xs text-slate-400">Item {item}</div>
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Winner / Loser Classification */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recovery Transaction Classification
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Winners (REDO):
                </span>
                <div className="mt-1 font-mono text-slate-700 dark:text-slate-300">
                  {phase.winners.join(', ') || 'None'}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  Losers (UNDO):
                </span>
                <div className="mt-1 font-mono text-slate-700 dark:text-slate-300">
                  {phase.losers.join(', ') || 'None (All undone)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
