import React, { useState } from 'react';
import { ArrowRight, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const LostUpdateLab: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  // Problem 1 from Practice Note:
  // Initial: A = 1000, B = 2000
  // T1: Transfer $100 from A to B (A = A - 100, B = B + 100)
  // T2: 10% interest applied to Account A (A = A * 1.1)

  const steps = [
    {
      action: 'Initial State',
      t1Mem: '-',
      t2Mem: '-',
      dbA: 1000,
      dbB: 2000,
      desc: 'Database initial values on disk: Account A = $1000, Account B = $2000.',
    },
    {
      action: 'T1 reads A',
      t1Mem: 'A = 1000',
      t2Mem: '-',
      dbA: 1000,
      dbB: 2000,
      desc: 'Transaction T1 reads Account A ($1000) into its private local memory buffer.',
    },
    {
      action: 'T2 reads A (Dirty Interleaving!)',
      t1Mem: 'A = 1000',
      t2Mem: 'A = 1000',
      dbA: 1000,
      dbB: 2000,
      desc: 'Before T1 writes, Transaction T2 reads the original value of Account A ($1000). Both transactions now have identical local copies.',
    },
    {
      action: 'T1 computes A = A - 100 and writes to DB',
      t1Mem: 'A = 900',
      t2Mem: 'A = 1000 (Stale!)',
      dbA: 900,
      dbB: 2000,
      desc: 'T1 writes updated A = $900 to database. Notice: T2 still holds stale local value A = $1000!',
    },
    {
      action: 'T2 computes A = A * 1.1 and writes to DB (OVERWRITE!)',
      t1Mem: 'A = 900 (Lost!)',
      t2Mem: 'A = 1100',
      dbA: 1100,
      dbB: 2000,
      desc: 'T2 calculates 1000 * 1.1 = $1100 and WRITES TO DISK. T1’s debit of $100 was COMPLETELY OVERWRITTEN AND LOST!',
    },
  ];

  const curr = steps[step];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Practice Note Problem 1 Scenario
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Lost Update Anomaly: Bank Transfer vs. 10% Interest
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={step === steps.length - 1}
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

      {/* Step description banner */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3 ${
          step === 4
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-100'
            : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-indigo-950 dark:text-indigo-100'
        }`}
      >
        {step === 4 ? (
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        )}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider">
            Step {step} of 4: {curr.action}
          </div>
          <p className="text-xs sm:text-sm mt-0.5 leading-relaxed">{curr.desc}</p>
        </div>
      </div>

      {/* Side-by-side memory state */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* T1 Local Buffer */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 font-mono text-center">
          <div className="text-xs uppercase font-bold text-slate-400 font-sans">
            T1 Private Memory
          </div>
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {curr.t1Mem}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Transfer: Debit $100 from A
          </div>
        </div>

        {/* Database Disk Value */}
        <div
          className={`p-5 rounded-2xl border shadow-sm space-y-2 font-mono text-center transition-all ${
            step === 4
              ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 ring-4 ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="text-xs uppercase font-bold text-slate-400 font-sans">
            Physical Database (Disk)
          </div>
          <div
            className={`text-2xl font-black ${
              step === 4 ? 'text-rose-600 animate-pulse' : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            A = ${curr.dbA}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            {step === 4
              ? 'CORRUPTED! Correct serial value is $990 or $1000'
              : 'Item Account A'}
          </div>
        </div>

        {/* T2 Local Buffer */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 font-mono text-center">
          <div className="text-xs uppercase font-bold text-slate-400 font-sans">
            T2 Private Memory
          </div>
          <div className="text-lg font-bold text-violet-600 dark:text-violet-400">
            {curr.t2Mem}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Interest: Add 10% to A
          </div>
        </div>
      </div>

      {/* Comparison against Serial Execution */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <div className="font-bold text-slate-900 dark:text-slate-100">
          Theoretical Serial Equivalence Check:
        </div>
        <p>
          • <strong>Serial Schedule (T1 then T2):</strong> A = 1000 - 100 = 900 → A = 900 * 1.1 ={' '}
          <strong className="text-emerald-600">$990</strong>.<br />
          • <strong>Serial Schedule (T2 then T1):</strong> A = 1000 * 1.1 = 1100 → A = 1100 - 100 ={' '}
          <strong className="text-emerald-600">$1000</strong>.<br />
          • <strong>Uncontrolled Interleaving Result:</strong> Discarded T1 completely, resulting in{' '}
          <strong className="text-rose-600">$1100</strong> (Lost Update Anomaly).
        </p>
      </div>
    </div>
  );
};
