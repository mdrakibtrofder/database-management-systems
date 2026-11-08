import React, { useState } from 'react';
import { ArrowRight, RotateCcw, ShieldAlert, CheckCircle2, Play, Sparkles } from 'lucide-react';

export const WaitForGraphLab: React.FC = () => {
  const [scheme, setScheme] = useState<'wait-die' | 'wound-wait'>('wait-die');
  const [step, setStep] = useState<number>(0);

  // Steps:
  // 0: Initial state (T1 holds A, T2 holds B)
  // 1: T1 requests B (Held by T2). T1 must wait for T2 (Edge T1 -> T2 added)
  // 2: T2 requests A (Held by T1). DEADLOCK CYCLE (T2 -> T1 added, forming T1 <-> T2)
  // 3: Deadlock resolution via Victim Abort

  interface StepInfo {
    title: string;
    caption: string;
    edges: string[];
    deadlock: boolean;
    resolved?: boolean;
  }

  const stepsInfo: StepInfo[] = [
    {
      title: 'Initial Locks: T1 holds Lock(A), T2 holds Lock(B)',
      caption: 'Both transactions are executing concurrently. Timestamp(T1) = 10 (Older), Timestamp(T2) = 20 (Younger). No conflict yet.',
      edges: [],
      deadlock: false,
    },
    {
      title: 'Step 1: T1 requests Exclusive Lock on item B',
      caption: 'T2 currently holds Lock(B). Under both schemes, older T1 is allowed to wait for younger T2. Directed edge T1 → T2 added to the Wait-For Graph.',
      edges: ['T1 -> T2'],
      deadlock: false,
    },
    {
      title: 'Step 2: T2 requests Exclusive Lock on item A',
      caption: 'T1 currently holds Lock(A). Directed edge T2 → T1 added! A directed cycle (T1 ⇄ T2) forms in the Wait-For Graph: DEADLOCK DETECTED!',
      edges: ['T1 -> T2', 'T2 -> T1'],
      deadlock: true,
    },
    {
      title: 'Step 3: Deadlock Resolution & Victim Rollback',
      caption:
        scheme === 'wait-die'
          ? 'Wait-Die Scheme: Younger transaction T2 requested lock from older T1. Rule: "Younger Dies". T2 is immediately aborted and rolled back. Lock(B) is released, allowing T1 to complete!'
          : 'Wound-Wait Scheme: When older T1 requested lock from younger T2 in Step 1, T1 preemptively "Wounded" T2, aborting it immediately. T2 is restarted with original timestamp.',
      edges: [],
      deadlock: false,
      resolved: true,
    },
  ];

  const current = stepsInfo[step];

  return (
    <div className="space-y-6">
      {/* Scheme selector bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Deadlock Prevention Protocol:
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => {
                setScheme('wait-die');
                setStep(0);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                scheme === 'wait-die'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Wait-Die (Non-Preemptive)
            </button>
            <button
              onClick={() => {
                setScheme('wound-wait');
                setStep(0);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                scheme === 'wound-wait'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Wound-Wait (Preemptive)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep((s) => Math.min(stepsInfo.length - 1, s + 1))}
            disabled={step === stepsInfo.length - 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-lg shadow-sm transition-colors"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setStep(0)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Detail Card */}
      <div
        className={`p-5 rounded-2xl border ${
          current.deadlock
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-100'
            : current.resolved
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900 text-emerald-950 dark:text-emerald-100'
            : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-indigo-950 dark:text-indigo-100'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
          {current.deadlock ? (
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-600" />
          )}
          <span>{current.title}</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed">{current.caption}</p>
      </div>

      {/* Graph Visualizer Stage */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center justify-center min-h-[260px]">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8">
          Dynamic Wait-For Graph (WFG)
        </h4>

        <div className="relative w-80 h-32 flex items-center justify-between px-8">
          {/* Node T1 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-lg border-2 border-indigo-400">
              T1
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Older (TS=10)</span>
          </div>

          {/* Edges */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
            {/* T1 -> T2 */}
            <div
              className={`w-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                current.edges.includes('T1 -> T2')
                  ? 'text-amber-500 opacity-100'
                  : 'text-slate-300 dark:text-slate-800 opacity-30'
              }`}
            >
              <span>Waits for Lock(B) ────────►</span>
            </div>

            {/* T2 -> T1 */}
            <div
              className={`w-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                current.edges.includes('T2 -> T1')
                  ? 'text-rose-500 opacity-100 font-extrabold animate-pulse'
                  : 'text-slate-300 dark:text-slate-800 opacity-30'
              }`}
            >
              <span>◄──────── Waits for Lock(A)</span>
            </div>
          </div>

          {/* Node T2 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div
              className={`w-16 h-16 rounded-full font-bold text-base flex items-center justify-center shadow-lg border-2 transition-all ${
                current.resolved
                  ? 'bg-slate-400 text-white border-slate-500 line-through'
                  : current.deadlock
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-violet-600 text-white border-violet-400'
              }`}
            >
              T2
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Younger (TS=20)</span>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-500 font-mono text-center">
          {current.deadlock
            ? '⚠️ DIRECTED CYCLE DETECTED: Deadlock exists between T1 and T2'
            : current.edges.length > 0
            ? 'Edge T1 → T2 present: T1 blocked waiting for T2 to release Lock(B)'
            : 'No circular wait dependencies in the graph.'}
        </div>
      </div>

      {/* Protocol Summary Rule Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
          <div className="font-bold text-indigo-600 dark:text-indigo-400">
            Wait-Die Protocol (Non-Preemptive)
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            • <strong>Older requests from Younger:</strong> Older is allowed to WAIT.<br />
            • <strong>Younger requests from Older:</strong> Younger is killed (DIES).
          </p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
          <div className="font-bold text-violet-600 dark:text-violet-400">
            Wound-Wait Protocol (Preemptive)
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            • <strong>Older requests from Younger:</strong> Older WOUNDS (preempts/aborts) Younger.<br />
            • <strong>Younger requests from Older:</strong> Younger is allowed to WAIT.
          </p>
        </div>
      </div>
    </div>
  );
};
