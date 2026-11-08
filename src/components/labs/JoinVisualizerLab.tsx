import React, { useState } from 'react';
import { Layers, Check, Sparkles, Code } from 'lucide-react';

type JoinType = 'inner' | 'left' | 'right' | 'full';

interface StudentTuple {
  id: number;
  name: string;
  dept_id: number | null;
}

interface DeptTuple {
  dept_id: number;
  dept_name: string;
  building: string;
}

const tableR: StudentTuple[] = [
  { id: 1, name: 'Rahim', dept_id: 101 },
  { id: 2, name: 'Fatima', dept_id: 102 },
  { id: 3, name: 'Tanvir', dept_id: 101 },
  { id: 4, name: 'Sadia', dept_id: 104 }, // Dept 104 exists
  { id: 5, name: 'Kamal', dept_id: 999 }, // Dept 999 DOES NOT exist in S
];

const tableS: DeptTuple[] = [
  { dept_id: 101, dept_name: 'CSE', building: 'Bldg 1' },
  { dept_id: 102, dept_name: 'EEE', building: 'Bldg 2' },
  { dept_id: 103, dept_name: 'ME', building: 'Bldg 3' }, // No student in ME
  { dept_id: 104, dept_name: 'CE', building: 'Bldg 4' },
];

export const JoinVisualizerLab: React.FC = () => {
  const [joinType, setJoinType] = useState<JoinType>('inner');

  // Compute join result
  const computeJoin = () => {
    const results: { id: any; name: any; r_dept: any; s_dept: any; dept_name: any; building: any; isNullPadded: boolean }[] = [];

    if (joinType === 'inner') {
      tableR.forEach((r) => {
        const s = tableS.find((dept) => dept.dept_id === r.dept_id);
        if (s) {
          results.push({
            id: r.id,
            name: r.name,
            r_dept: r.dept_id,
            s_dept: s.dept_id,
            dept_name: s.dept_name,
            building: s.building,
            isNullPadded: false,
          });
        }
      });
    } else if (joinType === 'left') {
      tableR.forEach((r) => {
        const s = tableS.find((dept) => dept.dept_id === r.dept_id);
        if (s) {
          results.push({
            id: r.id,
            name: r.name,
            r_dept: r.dept_id,
            s_dept: s.dept_id,
            dept_name: s.dept_name,
            building: s.building,
            isNullPadded: false,
          });
        } else {
          results.push({
            id: r.id,
            name: r.name,
            r_dept: r.dept_id,
            s_dept: 'NULL',
            dept_name: 'NULL',
            building: 'NULL',
            isNullPadded: true,
          });
        }
      });
    } else if (joinType === 'right') {
      tableS.forEach((s) => {
        const matchingR = tableR.filter((r) => r.dept_id === s.dept_id);
        if (matchingR.length > 0) {
          matchingR.forEach((r) => {
            results.push({
              id: r.id,
              name: r.name,
              r_dept: r.dept_id,
              s_dept: s.dept_id,
              dept_name: s.dept_name,
              building: s.building,
              isNullPadded: false,
            });
          });
        } else {
          results.push({
            id: 'NULL',
            name: 'NULL',
            r_dept: 'NULL',
            s_dept: s.dept_id,
            dept_name: s.dept_name,
            building: s.building,
            isNullPadded: true,
          });
        }
      });
    } else if (joinType === 'full') {
      // All from left join
      const matchedSIds = new Set<number>();
      tableR.forEach((r) => {
        const s = tableS.find((dept) => dept.dept_id === r.dept_id);
        if (s) {
          matchedSIds.add(s.dept_id);
          results.push({
            id: r.id,
            name: r.name,
            r_dept: r.dept_id,
            s_dept: s.dept_id,
            dept_name: s.dept_name,
            building: s.building,
            isNullPadded: false,
          });
        } else {
          results.push({
            id: r.id,
            name: r.name,
            r_dept: r.dept_id,
            s_dept: 'NULL',
            dept_name: 'NULL',
            building: 'NULL',
            isNullPadded: true,
          });
        }
      });

      // Unmatched right rows
      tableS.forEach((s) => {
        if (!matchedSIds.has(s.dept_id)) {
          results.push({
            id: 'NULL',
            name: 'NULL',
            r_dept: 'NULL',
            s_dept: s.dept_id,
            dept_name: s.dept_name,
            building: s.building,
            isNullPadded: true,
          });
        }
      });
    }

    return results;
  };

  const results = computeJoin();

  const getSql = () => {
    switch (joinType) {
      case 'inner':
        return `SELECT R.id, R.name, S.dept_name, S.building\nFROM Student R\nINNER JOIN Department S ON R.dept_id = S.dept_id;`;
      case 'left':
        return `SELECT R.id, R.name, S.dept_name, S.building\nFROM Student R\nLEFT OUTER JOIN Department S ON R.dept_id = S.dept_id;`;
      case 'right':
        return `SELECT R.id, R.name, S.dept_name, S.building\nFROM Student R\nRIGHT OUTER JOIN Department S ON R.dept_id = S.dept_id;`;
      case 'full':
        return `SELECT R.id, R.name, S.dept_name, S.building\nFROM Student R\nFULL OUTER JOIN Department S ON R.dept_id = S.dept_id;`;
    }
  };

  const getExplanation = () => {
    switch (joinType) {
      case 'inner':
        return 'INNER JOIN (⋈): Returns only tuples where there is a matching dept_id in both Student and Department. Kamal (dept 999) and ME (no students) are both excluded.';
      case 'left':
        return 'LEFT OUTER JOIN (⟕): Preserves all students from the left relation. Kamal (dept 999) has no matching department, so its department attributes are illuminated with NULL.';
      case 'right':
        return 'RIGHT OUTER JOIN (⟖): Preserves all departments from the right relation. Mechanical Engineering (ME) has no enrolled students, so student attributes are padded with NULL.';
      case 'full':
        return 'FULL OUTER JOIN (⟗): Preserves all tuples from both relations. Unmatched student (Kamal) and unmatched department (ME) are both retained with glowing NULL values.';
    }
  };

  return (
    <div className="space-y-6">
      {/* Join Type Selector */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Join Operation:
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {(
              [
                { id: 'inner', label: 'INNER JOIN (⋈)' },
                { id: 'left', label: 'LEFT OUTER (⟕)' },
                { id: 'right', label: 'RIGHT OUTER (⟖)' },
                { id: 'full', label: 'FULL OUTER (⟗)' },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                onClick={() => setJoinType(btn.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  joinType === btn.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Result Count: {results.length} rows
        </span>
      </div>

      {/* Concept Explanation Banner */}
      <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{getExplanation()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venn Diagram Visualizer */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col items-center justify-center min-h-[280px]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Venn Diagram Representation
          </h4>

          <div className="relative w-64 h-40">
            {/* Left Circle (Student) */}
            <div
              className={`absolute left-4 top-4 w-32 h-32 rounded-full border-2 transition-all flex items-center justify-start pl-4 text-xs font-bold ${
                joinType === 'left' || joinType === 'full'
                  ? 'bg-indigo-500/30 border-indigo-600 text-indigo-900 dark:text-indigo-200'
                  : 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-500'
              }`}
            >
              R: Student
            </div>

            {/* Right Circle (Department) */}
            <div
              className={`absolute right-4 top-4 w-32 h-32 rounded-full border-2 transition-all flex items-center justify-end pr-4 text-xs font-bold ${
                joinType === 'right' || joinType === 'full'
                  ? 'bg-violet-500/30 border-violet-600 text-violet-900 dark:text-violet-200'
                  : 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-500'
              }`}
            >
              S: Dept
            </div>

            {/* Intersection Overlay */}
            <div
              className={`absolute left-20 top-8 w-24 h-24 rounded-full transition-all flex items-center justify-center text-[10px] font-bold ${
                joinType === 'inner' || joinType === 'left' || joinType === 'right' || joinType === 'full'
                  ? 'bg-emerald-500/40 text-emerald-900 dark:text-emerald-200 border border-emerald-500'
                  : ''
              }`}
            >
              R ∩ S
            </div>
          </div>

          {/* SQL snippet */}
          <div className="w-full mt-4 p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800">
            <pre className="whitespace-pre-wrap">{getSql()}</pre>
          </div>
        </div>

        {/* Joined Result Table */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                Joined Result Table (R ⋈ S)
              </span>
              <span className="text-[11px] text-slate-500">
                Glowing red cells = NULL-padded tuples
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                  <tr>
                    <th className="p-3">R.ID</th>
                    <th className="p-3">R.Name</th>
                    <th className="p-3">R.DeptID</th>
                    <th className="p-3">S.DeptName</th>
                    <th className="p-3">S.Building</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {results.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={
                        row.isNullPadded
                          ? 'bg-rose-50/60 dark:bg-rose-950/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }
                    >
                      <td className="p-3">{row.id}</td>
                      <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                        {row.name}
                      </td>
                      <td className="p-3">{row.r_dept}</td>
                      <td
                        className={`p-3 ${
                          row.dept_name === 'NULL'
                            ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-100/50 dark:bg-rose-900/30 rounded'
                            : 'text-indigo-600 font-semibold'
                        }`}
                      >
                        {row.dept_name}
                      </td>
                      <td
                        className={`p-3 ${
                          row.building === 'NULL' ? 'text-rose-600 font-bold' : ''
                        }`}
                      >
                        {row.building}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
            Note: Kamal (ID 5) has dept 999 which doesn&apos;t exist in Department. Department 103 (ME) has no students.
          </div>
        </div>
      </div>
    </div>
  );
};
