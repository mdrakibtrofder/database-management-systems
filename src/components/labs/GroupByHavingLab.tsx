import React, { useState } from 'react';
import { Layers, Filter, CheckCircle2, RotateCcw } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  dept: string;
  salary: number;
}

const employees: Employee[] = [
  { id: 1, name: 'Rahim', dept: 'Engineering', salary: 75000 },
  { id: 2, name: 'Fatima', dept: 'Engineering', salary: 82000 },
  { id: 3, name: 'Tanvir', dept: 'Marketing', salary: 48000 },
  { id: 4, name: 'Nusrat', dept: 'Engineering', salary: 90000 },
  { id: 5, name: 'Kamal', dept: 'Marketing', salary: 52000 },
  { id: 6, name: 'Mehedi', dept: 'HR', salary: 45000 },
];

export const GroupByHavingLab: React.FC = () => {
  const [filterThreshold, setFilterThreshold] = useState<number>(60000);
  const [stage, setStage] = useState<'raw' | 'grouped' | 'having'>('grouped');

  // Groups
  const grouped: Record<string, Employee[]> = {};
  employees.forEach((emp) => {
    if (!grouped[emp.dept]) grouped[emp.dept] = [];
    grouped[emp.dept].push(emp);
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setStage('raw')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              stage === 'raw' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            1. Raw Relational Tuples
          </button>
          <button
            onClick={() => setStage('grouped')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              stage === 'grouped' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            2. Partition by GROUP BY (dept)
          </button>
          <button
            onClick={() => setStage('having')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              stage === 'having' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            3. Filter Groups with HAVING
          </button>
        </div>

        {stage === 'having' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              HAVING AVG(salary) &gt;
            </span>
            <input
              type="range"
              min={40000}
              max={85000}
              step={5000}
              value={filterThreshold}
              onChange={(e) => setFilterThreshold(Number(e.target.value))}
              className="w-28 cursor-pointer"
            />
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              ${filterThreshold.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* SQL formulation preview */}
      <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800">
        <code>
          SELECT dept, COUNT(*) as emp_count, AVG(salary) as avg_sal{'\n'}
          FROM Employee{'\n'}
          GROUP BY dept{stage === 'having' ? `\nHAVING AVG(salary) > ${filterThreshold};` : ';'}
        </code>
      </div>

      {/* Group Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([deptName, members]) => {
          const avgSalary = members.reduce((sum, m) => sum + m.salary, 0) / members.length;
          const passesHaving = avgSalary > filterThreshold;
          const isDimmed = stage === 'having' && !passesHaving;

          return (
            <div
              key={deptName}
              className={`rounded-2xl border p-5 shadow-sm transition-all ${
                isDimmed
                  ? 'opacity-30 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {deptName}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  {members.length} members
                </span>
              </div>

              {/* Members */}
              <div className="space-y-1.5 font-mono text-xs mb-4">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-slate-700 dark:text-slate-300"
                  >
                    <span>{m.name}</span>
                    <span>${m.salary.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Group summary aggregate */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-500">AVG(salary):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  ${Math.round(avgSalary).toLocaleString()}
                </span>
              </div>

              {stage === 'having' && (
                <div
                  className={`mt-3 py-1 rounded text-center text-[11px] font-bold ${
                    passesHaving
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                  }`}
                >
                  {passesHaving ? '✓ Retained by HAVING' : '✗ Filtered Out by HAVING'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
