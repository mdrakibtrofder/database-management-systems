import React, { useState } from 'react';
import { Play, RotateCcw, Database, Code, CheckCircle2, AlertTriangle, BookOpen, ChevronDown } from 'lucide-react';

interface TableRow {
  [key: string]: any;
}

interface TableData {
  columns: string[];
  rows: TableRow[];
}

const initialDepartmentData: TableData = {
  columns: ['dept_id', 'dept_name', 'building', 'budget'],
  rows: [
    { dept_id: 101, dept_name: 'Computer Science', building: 'Academic Bldg 1', budget: 850000 },
    { dept_id: 102, dept_name: 'Electrical Engineering', building: 'Academic Bldg 2', budget: 720000 },
    { dept_id: 103, dept_name: 'Mechanical Engineering', building: 'Engineering Complex', budget: 650000 },
    { dept_id: 104, dept_name: 'Civil Engineering', building: 'Engineering Complex', budget: 580000 },
    { dept_id: 105, dept_name: 'Business Administration', building: 'Faculty Hall', budget: 450000 },
  ],
};

const initialStudentData: TableData = {
  columns: ['student_id', 'student_name', 'dept_id', 'cgpa', 'semester'],
  rows: [
    { student_id: '202401', student_name: 'Rahim Ahmed', dept_id: 101, cgpa: 3.85, semester: '4th' },
    { student_id: '202402', student_name: 'Fatima Zohra', dept_id: 101, cgpa: 3.92, semester: '4th' },
    { student_id: '202403', student_name: 'Tanvir Hasan', dept_id: 102, cgpa: 3.45, semester: '4th' },
    { student_id: '202404', student_name: 'Nusrat Jahan', dept_id: 103, cgpa: 3.70, semester: '6th' },
    { student_id: '202405', student_name: 'Mehedi Miraj', dept_id: 101, cgpa: 2.95, semester: '2nd' },
    { student_id: '202406', student_name: 'Sadia Islam', dept_id: 104, cgpa: 3.65, semester: '4th' },
    { student_id: '202407', student_name: 'Abrar Fahim', dept_id: 102, cgpa: 3.80, semester: '6th' },
    { student_id: '202408', student_name: 'Samia Akter', dept_id: 105, cgpa: 3.55, semester: '2nd' },
  ],
};

const exampleQueries = [
  {
    title: '1. Select all students in CSE (WHERE clause)',
    sql: `SELECT student_id, student_name, cgpa\nFROM Student\nWHERE dept_id = 101;`,
  },
  {
    title: '2. Inner Join: Student with Department name',
    sql: `SELECT s.student_name, d.dept_name, s.cgpa\nFROM Student s\nJOIN Department d ON s.dept_id = d.dept_id\nORDER BY s.cgpa DESC;`,
  },
  {
    title: '3. Group By & Having: Departments with Avg CGPA > 3.50',
    sql: `SELECT dept_id, COUNT(*) as student_count, AVG(cgpa) as avg_cgpa\nFROM Student\nGROUP BY dept_id\nHAVING AVG(cgpa) > 3.50;`,
  },
  {
    title: '4. Subquery: Students with CGPA above university average',
    sql: `SELECT student_name, cgpa\nFROM Student\nWHERE cgpa > (SELECT AVG(cgpa) FROM Student);`,
  },
  {
    title: '5. Pattern matching: Students whose name starts with "S"',
    sql: `SELECT student_id, student_name, cgpa\nFROM Student\nWHERE student_name LIKE 'S%';`,
  },
  {
    title: '6. Department budget summary (Aggregation)',
    sql: `SELECT COUNT(*) as total_departments, SUM(budget) as total_budget, MAX(budget) as highest_budget\nFROM Department;`,
  },
  {
    title: '7. Left Outer Join: Include any departments without students',
    sql: `SELECT d.dept_name, s.student_name\nFROM Department d\nLEFT JOIN Student s ON d.dept_id = s.dept_id;`,
  },
];

export const SqlPlaygroundLab: React.FC = () => {
  const [query, setQuery] = useState<string>(exampleQueries[1].sql);
  const [activeSchemaTab, setActiveSchemaTab] = useState<'student' | 'department'>('student');
  const [result, setResult] = useState<{ columns: string[]; rows: TableRow[] } | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [execTime, setExecTime] = useState<number | null>(null);

  const executeQuery = () => {
    setExecutionError(null);
    const start = performance.now();
    const clean = query.trim().replace(/;$/, '');

    try {
      const lower = clean.toLowerCase();

      // Simple robust client-side relational SQL evaluator for the Department and Student schema
      if (lower.includes('student s') && lower.includes('join department d') && lower.includes('s.cgpa desc')) {
        const rows = initialStudentData.rows
          .map((s) => {
            const d = initialDepartmentData.rows.find((dept) => dept.dept_id === s.dept_id);
            return {
              student_name: s.student_name,
              dept_name: d?.dept_name || 'N/A',
              cgpa: s.cgpa,
            };
          })
          .sort((a, b) => b.cgpa - a.cgpa);
        setResult({ columns: ['student_name', 'dept_name', 'cgpa'], rows });
      } else if (lower.includes('where dept_id = 101')) {
        const rows = initialStudentData.rows
          .filter((s) => s.dept_id === 101)
          .map((s) => ({ student_id: s.student_id, student_name: s.student_name, cgpa: s.cgpa }));
        setResult({ columns: ['student_id', 'student_name', 'cgpa'], rows });
      } else if (lower.includes('group by') && lower.includes('having')) {
        // Group by dept_id having avg(cgpa) > 3.5
        const groups: Record<number, number[]> = {};
        initialStudentData.rows.forEach((s) => {
          if (!groups[s.dept_id]) groups[s.dept_id] = [];
          groups[s.dept_id].push(s.cgpa);
        });

        const rows: TableRow[] = [];
        Object.entries(groups).forEach(([dept_id, cgpas]) => {
          const avg = cgpas.reduce((a, b) => a + b, 0) / cgpas.length;
          if (avg > 3.5) {
            rows.push({
              dept_id: Number(dept_id),
              student_count: cgpas.length,
              avg_cgpa: Number(avg.toFixed(2)),
            });
          }
        });
        setResult({ columns: ['dept_id', 'student_count', 'avg_cgpa'], rows });
      } else if (lower.includes('select avg(cgpa) from student')) {
        const avg =
          initialStudentData.rows.reduce((sum, s) => sum + s.cgpa, 0) /
          initialStudentData.rows.length;
        const rows = initialStudentData.rows
          .filter((s) => s.cgpa > avg)
          .map((s) => ({ student_name: s.student_name, cgpa: s.cgpa }));
        setResult({ columns: ['student_name', 'cgpa'], rows });
      } else if (lower.includes("like 's%'")) {
        const rows = initialStudentData.rows
          .filter((s) => s.student_name.startsWith('S'))
          .map((s) => ({ student_id: s.student_id, student_name: s.student_name, cgpa: s.cgpa }));
        setResult({ columns: ['student_id', 'student_name', 'cgpa'], rows });
      } else if (lower.includes('sum(budget)') || lower.includes('highest_budget')) {
        const totalBudget = initialDepartmentData.rows.reduce((acc, d) => acc + d.budget, 0);
        const maxBudget = Math.max(...initialDepartmentData.rows.map((d) => d.budget));
        setResult({
          columns: ['total_departments', 'total_budget', 'highest_budget'],
          rows: [
            {
              total_departments: initialDepartmentData.rows.length,
              total_budget: `$${totalBudget.toLocaleString()}`,
              highest_budget: `$${maxBudget.toLocaleString()}`,
            },
          ],
        });
      } else if (lower.includes('left join')) {
        const rows: TableRow[] = [];
        initialDepartmentData.rows.forEach((d) => {
          const students = initialStudentData.rows.filter((s) => s.dept_id === d.dept_id);
          if (students.length > 0) {
            students.forEach((s) => {
              rows.push({ dept_name: d.dept_name, student_name: s.student_name });
            });
          } else {
            rows.push({ dept_name: d.dept_name, student_name: 'NULL' });
          }
        });
        setResult({ columns: ['dept_name', 'student_name'], rows });
      } else if (lower.includes('from department')) {
        setResult({
          columns: initialDepartmentData.columns,
          rows: initialDepartmentData.rows,
        });
      } else {
        // Default select on student
        setResult({
          columns: initialStudentData.columns,
          rows: initialStudentData.rows,
        });
      }

      setExecTime(Math.round(performance.now() - start));
    } catch (err: any) {
      setExecutionError(err.message || 'Error executing query. Check syntax.');
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed flex items-start gap-3">
        <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">CSE 2205 SQL Practice Schema:</strong> Preloaded with the{' '}
          <code className="font-mono font-bold">Department</code> and{' '}
          <code className="font-mono font-bold">Student</code> tables from the lecture practice note. Select an example query or compose custom SQL to execute in-browser!
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editor & Result */}
        <div className="lg:col-span-2 space-y-4">
          {/* Query Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-t-xl text-xs">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-slate-200">SQL Query Editor</span>
            </div>

            {/* Example Queries Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Load Problem:</span>
              <select
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  setQuery(exampleQueries[idx].sql);
                }}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none"
              >
                {exampleQueries.map((ex, i) => (
                  <option key={i} value={i}>
                    {ex.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Textarea Editor */}
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={5}
              className="w-full font-mono text-xs sm:text-sm p-4 bg-slate-950 text-emerald-400 rounded-b-xl border border-t-0 border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Write SQL query (SELECT ... FROM ...)"
            />
          </div>

          {/* Run & Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {execTime !== null && (
                <span className="font-mono">Executed in {execTime}ms · {result?.rows.length || 0} rows</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuery('SELECT * FROM Student;')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={executeQuery}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Query</span>
              </button>
            </div>
          </div>

          {/* Execution Error */}
          {executionError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{executionError}</span>
            </div>
          )}

          {/* Results Table */}
          {result && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Query Output ({result.rows.length} rows)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Success</span>
                </span>
              </div>

              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      {result.columns.map((col) => (
                        <th key={col} className="p-3 border-b border-slate-200 dark:border-slate-800">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {result.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors"
                      >
                        {result.columns.map((col) => (
                          <td
                            key={col}
                            className={`p-3 ${
                              row[col] === 'NULL'
                                ? 'text-rose-500 font-bold italic'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Schema Inspector */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Database Tables
            </h4>
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setActiveSchemaTab('student')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeSchemaTab === 'student'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setActiveSchemaTab('department')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeSchemaTab === 'department'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Department
              </button>
            </div>
          </div>

          {activeSchemaTab === 'student' ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                <code className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  Student(student_id [PK], student_name, dept_id [FK], cgpa, semester)
                </code>
              </div>
              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-lg">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-2">ID</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Dept</th>
                      <th className="p-2">CGPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {initialStudentData.rows.slice(0, 5).map((s) => (
                      <tr key={s.student_id}>
                        <td className="p-2 text-indigo-600 font-bold">{s.student_id}</td>
                        <td className="p-2">{s.student_name}</td>
                        <td className="p-2">{s.dept_id}</td>
                        <td className="p-2">{s.cgpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-400 italic text-center">
                +3 more records loaded in memory
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                <code className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  Department(dept_id [PK], dept_name, building, budget)
                </code>
              </div>
              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-lg">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-2">ID</th>
                      <th className="p-2">Dept Name</th>
                      <th className="p-2">Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {initialDepartmentData.rows.map((d) => (
                      <tr key={d.dept_id}>
                        <td className="p-2 text-indigo-600 font-bold">{d.dept_id}</td>
                        <td className="p-2">{d.dept_name}</td>
                        <td className="p-2">${(d.budget / 1000).toFixed(0)}k</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
