import React, { useState } from 'react';
import { ArrowRight, RotateCcw, AlertOctagon, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

type TxnState = 'ACTIVE' | 'PARTIALLY_COMMITTED' | 'COMMITTED' | 'FAILED' | 'ABORTED';

export const AcidStatesLab: React.FC = () => {
  const [state, setState] = useState<TxnState>('ACTIVE');
  const [accountA, setAccountA] = useState<number>(1000);
  const [accountB, setAccountB] = useState<number>(2000);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [log, setLog] = useState<string[]>([
    'T1 started: Transfer $500 from Account A ($1000) to Account B ($2000)',
  ]);

  const resetTxn = () => {
    setState('ACTIVE');
    setAccountA(1000);
    setAccountB(2000);
    setStepIdx(0);
    setLog(['T1 restarted in ACTIVE state. Initial balances: A = $1000, B = $2000']);
  };

  const executeNextStep = () => {
    if (state === 'COMMITTED' || state === 'ABORTED') return;

    if (stepIdx === 0) {
      // Step 1: Debit A
      setAccountA(500);
      setStepIdx(1);
      setLog((prev) => [
        ...prev,
        'Read(A) → A = A - 500 → Write(A): Account A debited to $500 (in memory buffer)',
      ]);
    } else if (stepIdx === 1) {
      // Step 2: Credit B
      setAccountB(2500);
      setStepIdx(2);
      setState('PARTIALLY_COMMITTED');
      setLog((prev) => [
        ...prev,
        'Read(B) → B = B + 500 → Write(B): Account B credited to $2500. Entered PARTIALLY COMMITTED state!',
      ]);
    } else if (stepIdx === 2) {
      // Step 3: Commit
      setState('COMMITTED');
      setStepIdx(3);
      setLog((prev) => [
        ...prev,
        'COMMIT executed. All changes flushed to WAL log on disk. Transaction successfully COMMITTED (Durability guaranteed)!',
      ]);
    }
  };

  const triggerFailure = () => {
    if (state === 'COMMITTED' || state === 'ABORTED') return;
    setState('FAILED');
    setLog((prev) => [
      ...prev,
      'HARDWARE / NETWORK FAILURE INDUCED! System entered FAILED state.',
    ]);
  };

  const executeRollback = () => {
    if (state !== 'FAILED') return;
    setAccountA(1000);
    setAccountB(2000);
    setState('ABORTED');
    setLog((prev) => [
      ...prev,
      'ROLLBACK executed: Database restored to initial values A=$1000, B=$2000. Entered ABORTED state (Atomicity preserved)!',
    ]);
  };

  const totalMoney = accountA + accountB;

  return (
    <div className="space-y-6">
      {/* State Machine Diagram Stage */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6 text-center">
          Transaction Lifecycle State Machine
        </h4>

        <div className="w-full max-w-xl flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
          {/* Active */}
          <div
            className={`px-4 py-2.5 rounded-xl border-2 transition-all ${
              state === 'ACTIVE'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-4 ring-blue-100 dark:ring-blue-950'
                : 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:border-slate-700'
            }`}
          >
            ACTIVE
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400" />

          {/* Partially Committed */}
          <div
            className={`px-4 py-2.5 rounded-xl border-2 transition-all ${
              state === 'PARTIALLY_COMMITTED'
                ? 'bg-amber-500 text-white border-amber-300 shadow-md ring-4 ring-amber-100 dark:ring-amber-950'
                : 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:border-slate-700'
            }`}
          >
            PARTIALLY COMMITTED
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400" />

          {/* Committed */}
          <div
            className={`px-4 py-2.5 rounded-xl border-2 transition-all ${
              state === 'COMMITTED'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950'
                : 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:border-slate-700'
            }`}
          >
            COMMITTED ✓
          </div>
        </div>

        {/* Failed & Aborted Lower Branch */}
        <div className="w-full max-w-md flex items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
          {/* Failed */}
          <div
            className={`px-4 py-2 rounded-xl border-2 transition-all ${
              state === 'FAILED'
                ? 'bg-rose-600 text-white border-rose-400 shadow-md ring-4 ring-rose-100 dark:ring-rose-950'
                : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
            }`}
          >
            FAILED
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400" />

          {/* Aborted */}
          <div
            className={`px-4 py-2 rounded-xl border-2 transition-all ${
              state === 'ABORTED'
                ? 'bg-slate-900 text-white border-slate-700 shadow-md ring-4 ring-slate-200 dark:ring-slate-800'
                : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
            }`}
          >
            ABORTED (Rolled Back)
          </div>
        </div>
      </div>

      {/* Bank Account Balances & Action Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balances */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Bank Account Balances
            </h4>
            <span
              className={`text-xs font-bold ${
                totalMoney === 3000 ? 'text-emerald-600' : 'text-rose-600 font-mono animate-pulse'
              }`}
            >
              Invariant A + B = ${totalMoney} {totalMoney === 3000 ? '✓ Consistent' : '✗ Violating!'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono">
              <div className="text-xs text-slate-400">Account A</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                ${accountA}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono">
              <div className="text-xs text-slate-400">Account B</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                ${accountB}
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={executeNextStep}
              disabled={state === 'COMMITTED' || state === 'FAILED' || state === 'ABORTED'}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-lg shadow-sm transition-colors"
            >
              <span>Next Operation ({stepIdx === 0 ? 'Debit A' : stepIdx === 1 ? 'Credit B' : 'Commit'})</span>
            </button>

            <button
              onClick={triggerFailure}
              disabled={state === 'COMMITTED' || state === 'FAILED' || state === 'ABORTED'}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 rounded-lg disabled:opacity-40 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Crash</span>
            </button>

            {state === 'FAILED' && (
              <button
                onClick={executeRollback}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg shadow-sm transition-colors"
              >
                <span>Execute ROLLBACK</span>
              </button>
            )}

            <button
              onClick={resetTxn}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg ml-auto transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Execution Activity Log */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Transaction Event Log
            </h4>
            <div className="space-y-1.5 text-xs font-mono max-h-48 overflow-y-auto">
              {log.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
                >
                  ↳ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Atomicity ensures either both updates commit or neither persists.
          </div>
        </div>
      </div>
    </div>
  );
};
