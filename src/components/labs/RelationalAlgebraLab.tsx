import React, { useState } from 'react';
import { ArrowRight, Code, Sparkles } from 'lucide-react';

type Operator = 'sigma' | 'pi' | 'cross' | 'join' | 'union' | 'diff';

export const RelationalAlgebraLab: React.FC = () => {
  const [op, setOp] = useState<Operator>('join');

  const relationA = [
    { sid: 1, name: 'Rahim', dept: 'CSE' },
    { sid: 2, name: 'Fatima', dept: 'EEE' },
    { sid: 3, name: 'Tanvir', dept: 'CSE' },
  ];

  const relationB = [
    { dept: 'CSE', head: 'Trofder' },
    { dept: 'EEE', head: 'Rahman' },
    { dept: 'ME', head: 'Khan' },
  ];

  const getResult = () => {
    switch (op) {
      case 'sigma':
        // σ_{dept='CSE'}(A)
        return {
          formula: 'σ_{dept = "CSE"}(Student)',
          sql: `SELECT * FROM Student WHERE dept = 'CSE';`,
          columns: ['sid', 'name', 'dept'],
          rows: relationA.filter((r) => r.dept === 'CSE'),
          desc: 'Selection (σ): Horizontal filter extracting only rows where dept is "CSE".',
        };
      case 'pi':
        // π_{name, dept}(A)
        return {
          formula: 'π_{name, dept}(Student)',
          sql: `SELECT DISTINCT name, dept FROM Student;`,
          columns: ['name', 'dept'],
          rows: relationA.map((r) => ({ name: r.name, dept: r.dept })),
          desc: 'Projection (π): Vertical filter extracting specified columns and eliminating duplicates.',
        };
      case 'join':
        // A ⋈ B
        return {
          formula: 'Student ⋈ Department',
          sql: `SELECT s.sid, s.name, s.dept, d.head\nFROM Student s\nNATURAL JOIN Department d;`,
          columns: ['sid', 'name', 'dept', 'head'],
          rows: [
            { sid: 1, name: 'Rahim', dept: 'CSE', head: 'Trofder' },
            { sid: 2, name: 'Fatima', dept: 'EEE', head: 'Rahman' },
            { sid: 3, name: 'Tanvir', dept: 'CSE', head: 'Trofder' },
          ],
          desc: 'Natural Join (⋈): Combines tuples on common attribute (dept). Matches merged into 1 row.',
        };
      case 'cross':
        return {
          formula: 'Student × Department',
          sql: `SELECT * FROM Student CROSS JOIN Department;`,
          columns: ['sid', 'name', 's_dept', 'd_dept', 'head'],
          rows: [
            { sid: 1, name: 'Rahim', s_dept: 'CSE', d_dept: 'CSE', head: 'Trofder' },
            { sid: 1, name: 'Rahim', s_dept: 'CSE', d_dept: 'EEE', head: 'Rahman' },
            { sid: 2, name: 'Fatima', s_dept: 'EEE', d_dept: 'CSE', head: 'Trofder' },
          ],
          desc: 'Cartesian Product (×): Generates all combinations of tuples (size = |R| × |S|).',
        };
      case 'union':
        return {
          formula: 'R ∪ S',
          sql: `SELECT * FROM R UNION SELECT * FROM S;`,
          columns: ['item_id', 'title'],
          rows: [
            { item_id: 'CS101', title: 'Intro CS' },
            { item_id: 'CS202', title: 'Data Structures' },
            { item_id: 'CS303', title: 'DBMS' },
          ],
          desc: 'Set Union (∪): Combines tuples from both relations. Requires Union Compatibility.',
        };
      case 'diff':
        return {
          formula: 'R − S',
          sql: `SELECT * FROM R EXCEPT SELECT * FROM S;`,
          columns: ['item_id', 'title'],
          rows: [{ item_id: 'CS101', title: 'Intro CS' }],
          desc: 'Set Difference (−): Tuples that are in R but not in S.',
        };
    }
  };

  const res = getResult();

  return (
    <div className="space-y-6">
      {/* Operator Buttons */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Algebraic Operator:
          </span>
          <div className="flex flex-wrap items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono">
            {[
              { id: 'sigma', label: 'Selection (σ)' },
              { id: 'pi', label: 'Projection (π)' },
              { id: 'join', label: 'Natural Join (⋈)' },
              { id: 'cross', label: 'Cartesian Product (×)' },
              { id: 'union', label: 'Union (∪)' },
              { id: 'diff', label: 'Difference (−)' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setOp(btn.id as Operator)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  op === btn.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg">
          {res.formula}
        </div>
      </div>

      {/* Description */}
      <div className="p-4 rounded-xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900 text-xs sm:text-sm text-violet-950 dark:text-violet-200 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{res.desc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Output Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
            Relational Result Relation ({res.rows.length} tuples)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                <tr>
                  {res.columns.map((c) => (
                    <th key={c} className="p-3">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {res.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {res.columns.map((col) => (
                      <td key={col} className="p-3 text-slate-800 dark:text-slate-200">
                        {String((row as any)[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Equivalent SQL */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white shadow-sm flex flex-col justify-between font-mono">
          <div>
            <div className="text-xs uppercase font-bold text-slate-400 mb-2 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Equivalent Declarative SQL Formulation</span>
            </div>
            <pre className="text-xs sm:text-sm text-emerald-400 bg-slate-900/80 p-4 rounded-lg border border-slate-800 overflow-x-auto">
              {res.sql}
            </pre>
          </div>
          <div className="text-[11px] text-slate-400 mt-4">
            Relational algebra is procedural (how to evaluate); SQL is declarative (what to evaluate).
          </div>
        </div>
      </div>
    </div>
  );
};
