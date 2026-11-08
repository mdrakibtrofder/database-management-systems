import React, { useState } from 'react';
import { Key, Play, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface FD {
  lhs: string;
  rhs: string;
}

const sampleProblems = [
  {
    name: 'Problem 1: Classic Candidate Key (Exam High-Yield)',
    relation: 'A, B, C, D, E',
    fds: 'A -> B, BC -> D, D -> E',
    candidateKey: 'AC',
    explanation: '(AC)+ determines all 5 attributes: A determines B; with B and C we get D; D determines E. Thus (AC)+ = {A, B, C, D, E}.',
  },
  {
    name: 'Problem 2: Multiple Candidate Keys',
    relation: 'A, B, C, D',
    fds: 'A -> B, B -> C, C -> D, D -> A',
    candidateKey: 'A, B, C, D (4 Candidate Keys)',
    explanation: 'Due to the circular dependency cycle, each individual single attribute (A)+, (B)+, (C)+, (D)+ derives all 4 attributes.',
  },
  {
    name: 'Problem 3: Relational Schema from Lecture Note',
    relation: 'EmpID, DeptID, ProjectID, Hours',
    fds: 'EmpID -> DeptID, EmpID, ProjectID -> Hours',
    candidateKey: '(EmpID, ProjectID)',
    explanation: 'EmpID alone determines DeptID, but ProjectID is necessary to determine Hours. Thus {EmpID, ProjectID} is the minimal candidate key.',
  },
];

export const KeysFinderLab: React.FC = () => {
  const [relationInput, setRelationInput] = useState<string>('A, B, C, D, E');
  const [fdsInput, setFdsInput] = useState<string>('A -> B, BC -> D, D -> E');
  const [targetAttr, setTargetAttr] = useState<string>('AC');
  const [closureResult, setClosureResult] = useState<{ closure: string[]; steps: string[] } | null>({
    closure: ['A', 'B', 'C', 'D', 'E'],
    steps: [
      'Initialize Closure X+ = { A, C }',
      'Apply FD A → B: Added B → X+ = { A, B, C }',
      'Apply FD BC → D: Added D → X+ = { A, B, C, D }',
      'Apply FD D → E: Added E → X+ = { A, B, C, D, E }',
      'Result: X+ contains all relation attributes → {A, C} is a SUPERKEY!',
    ],
  });

  const parseFds = (str: string): FD[] => {
    return str
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [lhs, rhs] = part.split('->').map((s) => s.trim().toUpperCase());
        return { lhs: lhs || '', rhs: rhs || '' };
      })
      .filter((fd) => fd.lhs && fd.rhs);
  };

  const calculateClosure = () => {
    const fds = parseFds(fdsInput);
    const startAttrs = new Set(
      targetAttr
        .toUpperCase()
        .replace(/[^A-Z0-9_]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
    );

    const steps: string[] = [`Initialize Closure X+ = { ${Array.from(startAttrs).join(', ')} }`];
    let changed = true;

    while (changed) {
      changed = false;
      for (const fd of fds) {
        // Check if LHS is subset of startAttrs
        const lhsAttrs = fd.lhs.split('').filter((c) => c.match(/[A-Z0-9_]/));
        const lhsSatisfied = lhsAttrs.every((ch) => startAttrs.has(ch));

        if (lhsSatisfied) {
          const rhsAttrs = fd.rhs.split('').filter((c) => c.match(/[A-Z0-9_]/));
          for (const rh of rhsAttrs) {
            if (!startAttrs.has(rh)) {
              startAttrs.add(rh);
              steps.push(`Apply FD ${fd.lhs} → ${fd.rhs}: Added ${rh} → X+ = { ${Array.from(startAttrs).join(', ')} }`);
              changed = true;
            }
          }
        }
      }
    }

    const relAttrs = new Set(
      relationInput
        .toUpperCase()
        .replace(/[^A-Z0-9_]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
    );

    const isSuperkey = Array.from(relAttrs).every((a) => startAttrs.has(a));
    if (isSuperkey) {
      steps.push(`Result: X+ contains all attributes of R → {${Array.from(targetAttr).join(', ')}} is a SUPERKEY!`);
    } else {
      steps.push(`Result: X+ is {${Array.from(startAttrs).join(', ')}} (Does not derive all attributes).`);
    }

    setClosureResult({
      closure: Array.from(startAttrs).sort(),
      steps,
    });
  };

  return (
    <div className="space-y-6">
      {/* Preset Problem Picker */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Load Solved Problem from Lecture Notes
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {sampleProblems.map((prob, idx) => (
            <button
              key={idx}
              onClick={() => {
                setRelationInput(prob.relation);
                setFdsInput(prob.fds);
                setTargetAttr(prob.candidateKey.split(' ')[0].replace(/[^A-Z]/g, ''));
                calculateClosure();
              }}
              className="p-3 rounded-lg text-left text-xs border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/40 transition-colors"
            >
              <div className="font-bold text-slate-900 dark:text-slate-100">{prob.name}</div>
              <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                CK: {prob.candidateKey}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Relation Schema R(Attributes):
          </label>
          <input
            type="text"
            value={relationInput}
            onChange={(e) => setRelationInput(e.target.value)}
            className="w-full font-mono text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Functional Dependencies (FDs):
          </label>
          <input
            type="text"
            value={fdsInput}
            onChange={(e) => setFdsInput(e.target.value)}
            placeholder="A -> B, BC -> D"
            className="w-full font-mono text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Test Attribute Closure (X+):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={targetAttr}
              onChange={(e) => setTargetAttr(e.target.value)}
              placeholder="e.g. AC"
              className="flex-1 font-mono text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
            <button
              onClick={calculateClosure}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Compute (X+)
            </button>
          </div>
        </div>
      </div>

      {/* Step by step closure evaluation */}
      {closureResult && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Attribute Closure ({targetAttr.toUpperCase()})+ Result:
              </span>
            </div>
            <span className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg">
              ({targetAttr.toUpperCase()})+ = &#123; {closureResult.closure.join(', ')} &#125;
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="text-slate-400 font-sans uppercase font-bold text-[10px]">
              Step-by-Step Inference Process:
            </div>
            {closureResult.steps.map((st, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg border ${
                  st.includes('SUPERKEY')
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200 font-bold'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                ↳ {st}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
