import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, ArrowRight, Sparkles, BookOpen, RotateCcw } from 'lucide-react';

interface ConflictingPair {
  step1: string;
  step2: string;
  tFrom: number;
  tTo: number;
  item: string;
}

interface PresetSchedule {
  name: string;
  schedule: string;
  description: string;
  isSerializable: boolean;
}

const presets: PresetSchedule[] = [
  {
    name: 'Problem 1: Serializable Schedule (Practice Note)',
    schedule: 'R1(A) W1(A) R2(A) W2(A) R1(B) W1(B) R2(B) W2(B)',
    description: 'T1 precedes T2 on both A and B. Acyclic precedence graph (T1 → T2).',
    isSerializable: true,
  },
  {
    name: 'Problem 2: Non-Serializable Cycle (Exam Classic)',
    schedule: 'R1(A) W2(A) R2(B) W1(B) Commit1 Commit2',
    description: 'T1 writes A then T2 writes A (T1 → T2), but T2 writes B then T1 writes B (T2 → T1). Cycle T1 ⇄ T2!',
    isSerializable: false,
  },
  {
    name: 'Problem 3: Three Transactions (Transactions Note)',
    schedule: 'R1(X) R2(Y) W1(X) R3(X) W2(Y) W3(X) R2(X)',
    description: 'Complex interleaved schedule with T1, T2, and T3.',
    isSerializable: false,
  },
  {
    name: 'Problem 4: Clean Serial Equivalence (T2 → T1 → T3)',
    schedule: 'R2(A) W2(A) R1(A) W1(A) R3(B) W3(B)',
    description: 'No circular dependencies. Conflict equivalent to serial schedule T2, T1, T3.',
    isSerializable: true,
  },
];

export const PrecedenceGraphLab: React.FC = () => {
  const [scheduleInput, setScheduleInput] = useState<string>(presets[0].schedule);
  const [analyzed, setAnalyzed] = useState<boolean>(true);

  // Parse schedule operations
  // e.g. R1(A) -> type: R, txn: 1, item: A
  const parseOperations = (sched: string) => {
    const tokens = sched.trim().split(/\s+/);
    const ops: { raw: string; type: 'R' | 'W' | 'C'; txn: number; item: string; index: number }[] = [];

    tokens.forEach((tok, idx) => {
      const match = tok.match(/([RWC])(\d+)(?:\(([A-Za-z0-9_]+)\))?/i);
      if (match) {
        ops.push({
          raw: tok,
          type: match[1].toUpperCase() as 'R' | 'W' | 'C',
          txn: parseInt(match[2], 10),
          item: match[3] ? match[3].toUpperCase() : '',
          index: idx,
        });
      }
    });

    return ops;
  };

  const ops = parseOperations(scheduleInput);

  // Find all conflicting pairs
  // Ti conflicts with Tj if: Ti != Tj, same item, and at least one is 'W'
  const findConflicts = () => {
    const conflicts: ConflictingPair[] = [];
    const edgeSet = new Set<string>();

    for (let i = 0; i < ops.length; i++) {
      for (let j = i + 1; j < ops.length; j++) {
        const op1 = ops[i];
        const op2 = ops[j];

        if (
          op1.txn !== op2.txn &&
          op1.item &&
          op2.item &&
          op1.item === op2.item &&
          (op1.type === 'W' || op2.type === 'W')
        ) {
          conflicts.push({
            step1: op1.raw,
            step2: op2.raw,
            tFrom: op1.txn,
            tTo: op2.txn,
            item: op1.item,
          });
          edgeSet.add(`${op1.txn}->${op2.txn}`);
        }
      }
    }

    return { conflicts, edgeSet };
  };

  const { conflicts, edgeSet } = findConflicts();

  // Find unique transactions
  const txns = Array.from(new Set(ops.map((o) => o.txn))).sort((a, b) => a - b);

  // Check for cycles in directed graph
  const detectCycle = () => {
    const adj: Record<number, number[]> = {};
    txns.forEach((t) => (adj[t] = []));
    edgeSet.forEach((e) => {
      const [u, v] = e.split('->').map(Number);
      if (adj[u]) adj[u].push(v);
    });

    const visited: Record<number, boolean> = {};
    const recStack: Record<number, boolean> = {};
    const cycleEdges = new Set<string>();

    const dfs = (node: number): boolean => {
      visited[node] = true;
      recStack[node] = true;

      for (const neighbor of adj[node] || []) {
        if (!visited[neighbor]) {
          if (dfs(neighbor)) {
            cycleEdges.add(`${node}->${neighbor}`);
            return true;
          }
        } else if (recStack[neighbor]) {
          cycleEdges.add(`${node}->${neighbor}`);
          return true;
        }
      }

      recStack[node] = false;
      return false;
    };

    let hasCycle = false;
    for (const t of txns) {
      if (!visited[t]) {
        if (dfs(t)) {
          hasCycle = true;
          break;
        }
      }
    }

    // Compute topological order if acyclic
    let serialOrder: string[] = [];
    if (!hasCycle && txns.length > 0) {
      const inDegree: Record<number, number> = {};
      txns.forEach((t) => (inDegree[t] = 0));
      edgeSet.forEach((e) => {
        const [, v] = e.split('->').map(Number);
        inDegree[v] = (inDegree[v] || 0) + 1;
      });

      const queue = txns.filter((t) => inDegree[t] === 0);
      const order: number[] = [];

      while (queue.length > 0) {
        const u = queue.shift()!;
        order.push(u);
        for (const v of adj[u] || []) {
          inDegree[v]--;
          if (inDegree[v] === 0) {
            queue.push(v);
          }
        }
      }

      if (order.length === txns.length) {
        serialOrder = order.map((t) => `T${t}`);
      }
    }

    return { hasCycle, cycleEdges, serialOrder };
  };

  const { hasCycle, cycleEdges, serialOrder } = detectCycle();

  return (
    <div className="space-y-6">
      {/* Preset Selector */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Preload Scenario from Exam & Practice Notes
          </span>
          <span className="text-xs text-slate-500 font-mono">Format: R1(A) W1(A) R2(A)...</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setScheduleInput(p.schedule);
                setAnalyzed(true);
              }}
              className={`p-2.5 rounded-lg text-left text-xs transition-colors border ${
                scheduleInput === p.schedule
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-medium'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-semibold">{p.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{p.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Input */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Concurrent Schedule Operations:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={scheduleInput}
            onChange={(e) => setScheduleInput(e.target.value)}
            placeholder="e.g. R1(A) W1(A) R2(A) W2(A)"
            className="flex-1 font-mono text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => setAnalyzed(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            Analyze
          </button>
        </div>
      </div>

      {/* Verdict Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          !hasCycle
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {!hasCycle ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <div>
            <div className="text-sm font-bold">
              Conflict Serializable:{' '}
              <span className={!hasCycle ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                {!hasCycle ? 'YES (Acyclic Graph)' : 'NO (Contains Directed Cycle)'}
              </span>
            </div>
            <div className="text-xs opacity-90 mt-0.5">
              {!hasCycle
                ? `Equivalent Serial Execution Order: ${serialOrder.join(' → ')}`
                : 'Circular wait detected among conflicting transactions. Schedule cannot be serialized without anomalies.'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph Visualizer Canvas */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6 text-center">
            Precedence Graph (Nodes = Transactions, Edges = Conflict Precedence)
          </h4>

          {txns.length === 0 ? (
            <p className="text-xs text-slate-400">No valid transaction operations found</p>
          ) : (
            <div className="relative w-full max-w-sm aspect-[4/3] flex items-center justify-around">
              {/* Render Nodes */}
              {txns.map((t, idx) => {
                const total = txns.length;
                const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
                const radius = 90;
                const x = 160 + radius * Math.cos(angle);
                const y = 120 + radius * Math.sin(angle);

                return (
                  <div
                    key={t}
                    style={{ left: `${x}px`, top: `${y}px` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-lg border-2 border-indigo-400 ring-4 ring-indigo-50 dark:ring-indigo-950"
                  >
                    T{t}
                  </div>
                );
              })}

              {/* Edge Descriptions */}
              <div className="absolute inset-x-0 bottom-2 text-center text-xs font-mono text-slate-500">
                Edges: {Array.from(edgeSet).join(', ') || 'No conflicting edges'}
              </div>
            </div>
          )}
        </div>

        {/* Conflicting Pairs Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Conflicting Operations Detected ({conflicts.length})
            </h4>
            <span className="text-[11px] text-slate-500">Diff Txn · Same Item · ≥1 Write</span>
          </div>

          {conflicts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No read-write or write-write conflicts found in schedule.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="p-2">Earlier Op</th>
                    <th className="p-2">Later Op</th>
                    <th className="p-2">Item</th>
                    <th className="p-2">Graph Edge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {conflicts.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2 font-bold text-indigo-600">{c.step1}</td>
                      <td className="p-2 font-bold text-violet-600">{c.step2}</td>
                      <td className="p-2 text-slate-700 dark:text-slate-300">{c.item}</td>
                      <td className="p-2 font-bold text-slate-900 dark:text-slate-100">
                        T{c.tFrom} → T{c.tTo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
