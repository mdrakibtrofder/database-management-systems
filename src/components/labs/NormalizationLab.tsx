import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, AlertTriangle, Layers, Split } from 'lucide-react';

interface NormalizationStage {
  step: number;
  name: string;
  badge: string;
  title: string;
  problem: string;
  violatingFD?: string;
  solution: string;
  tables: {
    name: string;
    pk: string;
    columns: string[];
    sample: Record<string, any>[];
  }[];
  losslessCheck?: string;
}

const stages: NormalizationStage[] = [
  {
    step: 0,
    name: '0NF (Unnormalized Relation)',
    badge: 'Raw Spreadsheet',
    title: 'One Massive University Table with Multi-Valued Attributes',
    problem: 'Attributes contain comma-separated arrays and nested repeating groups (e.g., multiple courses taken by one student in a single cell).',
    solution: 'Violates 1NF atomic domain requirement. Cannot uniquely index individual courses.',
    tables: [
      {
        name: 'Student_Course_Raw',
        pk: 'None (Unnormalized)',
        columns: ['StudentID', 'StudentName', 'CoursesTaken', 'Instructors'],
        sample: [
          { StudentID: '101', StudentName: 'Rahim', CoursesTaken: 'CSE2205, CSE2201', Instructors: 'Trofder, Khan' },
          { StudentID: '102', StudentName: 'Fatima', CoursesTaken: 'CSE2205, MATH2203', Instructors: 'Trofder, Rahman' },
        ],
      },
    ],
  },
  {
    step: 1,
    name: '1NF (First Normal Form)',
    badge: 'Atomic Domains',
    title: 'Enforcing Atomic Values & Composite Primary Key',
    problem: 'Multi-valued courses flattened into individual rows. Composite Primary Key is established as (StudentID, CourseID).',
    solution: 'Every cell contains strictly atomic values. However, redundant student names and course titles create major update and deletion anomalies!',
    tables: [
      {
        name: 'Registration_1NF',
        pk: '(StudentID, CourseID)',
        columns: ['StudentID', 'StudentName', 'CourseID', 'CourseTitle', 'InstructorID', 'InstructorName', 'Grade'],
        sample: [
          { StudentID: '101', StudentName: 'Rahim', CourseID: 'CSE2205', CourseTitle: 'DBMS', InstructorID: 'INS01', InstructorName: 'Trofder', Grade: 'A' },
          { StudentID: '101', StudentName: 'Rahim', CourseID: 'CSE2201', CourseTitle: 'Algorithms', InstructorID: 'INS02', InstructorName: 'Khan', Grade: 'A+' },
          { StudentID: '102', StudentName: 'Fatima', CourseID: 'CSE2205', CourseTitle: 'DBMS', InstructorID: 'INS01', InstructorName: 'Trofder', Grade: 'A+' },
        ],
      },
    ],
  },
  {
    step: 2,
    name: '2NF (Second Normal Form)',
    badge: 'Eliminate Partial Dependencies',
    title: 'Splitting Partial Key Dependencies',
    problem: 'Partial Dependencies detected! Non-prime attribute StudentName depends only on StudentID, not the entire composite key (StudentID, CourseID). Similarly, CourseTitle depends only on CourseID.',
    violatingFD: 'StudentID → StudentName  AND  CourseID → CourseTitle, InstructorID',
    solution: 'Decomposed into 3 distinct tables. Every non-prime attribute now depends on the ENTIRE candidate key of its respective table.',
    tables: [
      {
        name: 'Student',
        pk: 'StudentID',
        columns: ['StudentID', 'StudentName'],
        sample: [
          { StudentID: '101', StudentName: 'Rahim' },
          { StudentID: '102', StudentName: 'Fatima' },
        ],
      },
      {
        name: 'Course',
        pk: 'CourseID',
        columns: ['CourseID', 'CourseTitle', 'InstructorID', 'InstructorName'],
        sample: [
          { CourseID: 'CSE2205', CourseTitle: 'DBMS', InstructorID: 'INS01', InstructorName: 'Trofder' },
          { CourseID: 'CSE2201', CourseTitle: 'Algorithms', InstructorID: 'INS02', InstructorName: 'Khan' },
        ],
      },
      {
        name: 'Enrollment',
        pk: '(StudentID, CourseID)',
        columns: ['StudentID', 'CourseID', 'Grade'],
        sample: [
          { StudentID: '101', CourseID: 'CSE2205', Grade: 'A' },
          { StudentID: '101', CourseID: 'CSE2201', Grade: 'A+' },
          { StudentID: '102', CourseID: 'CSE2205', Grade: 'A+' },
        ],
      },
    ],
  },
  {
    step: 3,
    name: '3NF (Third Normal Form)',
    badge: 'Eliminate Transitive Dependencies',
    title: 'Removing Transitive Dependency via Non-Key Determinant',
    problem: 'In the Course table, CourseID determines InstructorID, and InstructorID determines InstructorName. This is a Transitive Dependency (CourseID → InstructorName via InstructorID)!',
    violatingFD: 'InstructorID → InstructorName (InstructorID is neither a superkey of Course nor is InstructorName prime)',
    solution: 'Isolate Instructor attributes into their own relation. Now every non-trivial FD X → Y has X as a superkey or Y as prime.',
    tables: [
      {
        name: 'Student',
        pk: 'StudentID',
        columns: ['StudentID', 'StudentName'],
        sample: [{ StudentID: '101', StudentName: 'Rahim' }, { StudentID: '102', StudentName: 'Fatima' }],
      },
      {
        name: 'Course',
        pk: 'CourseID',
        columns: ['CourseID', 'CourseTitle', 'InstructorID [FK]'],
        sample: [{ CourseID: 'CSE2205', CourseTitle: 'DBMS', InstructorID: 'INS01' }, { CourseID: 'CSE2201', CourseTitle: 'Algorithms', InstructorID: 'INS02' }],
      },
      {
        name: 'Instructor',
        pk: 'InstructorID',
        columns: ['InstructorID', 'InstructorName'],
        sample: [{ InstructorID: 'INS01', InstructorName: 'Trofder' }, { InstructorID: 'INS02', InstructorName: 'Khan' }],
      },
      {
        name: 'Enrollment',
        pk: '(StudentID, CourseID)',
        columns: ['StudentID', 'CourseID', 'Grade'],
        sample: [{ StudentID: '101', CourseID: 'CSE2205', Grade: 'A' }],
      },
    ],
  },
  {
    step: 4,
    name: 'BCNF (Boyce-Codd Normal Form)',
    badge: 'Every Determinant is a Superkey',
    title: 'Strict Superkey Compliance & Lossless Verification',
    problem: 'Examined all determinants across all relations. Every single left-hand side determinant is strictly a superkey of its relation.',
    solution: 'Zero anomalies remain. Updates to instructor names occur in exactly one row. Deletions of student enrollments never delete courses.',
    losslessCheck: 'Lossless Join Verified: Student ∩ Enrollment = {StudentID} (Primary Key of Student). Course ∩ Enrollment = {CourseID} (Primary Key of Course). Natural join guarantees zero spurious tuples!',
    tables: [
      {
        name: 'Student',
        pk: 'StudentID (Superkey ✓)',
        columns: ['StudentID', 'StudentName'],
        sample: [{ StudentID: '101', StudentName: 'Rahim' }],
      },
      {
        name: 'Course',
        pk: 'CourseID (Superkey ✓)',
        columns: ['CourseID', 'CourseTitle', 'InstructorID'],
        sample: [{ CourseID: 'CSE2205', CourseTitle: 'DBMS', InstructorID: 'INS01' }],
      },
      {
        name: 'Instructor',
        pk: 'InstructorID (Superkey ✓)',
        columns: ['InstructorID', 'InstructorName'],
        sample: [{ InstructorID: 'INS01', InstructorName: 'Trofder' }],
      },
      {
        name: 'Enrollment',
        pk: '(StudentID, CourseID) (Superkey ✓)',
        columns: ['StudentID', 'CourseID', 'Grade'],
        sample: [{ StudentID: '101', CourseID: 'CSE2205', Grade: 'A' }],
      },
    ],
  },
];

export const NormalizationLab: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const stage = stages[currentStep];

  return (
    <div className="space-y-6">
      {/* Step Navigator Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Step Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
          {stages.map((st) => (
            <button
              key={st.step}
              onClick={() => setCurrentStep(st.step)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                currentStep === st.step
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {st.step === 0 ? '0NF Raw' : `${st.step}NF`}
            </button>
          ))}
        </div>

        {/* Step controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 transition-colors"
            title="Previous Normal Form"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-500">
            Step {currentStep + 1} of {stages.length}
          </span>
          <button
            onClick={() => setCurrentStep((s) => Math.min(stages.length - 1, s + 1))}
            disabled={currentStep === stages.length - 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 transition-colors"
            title="Next Normal Form"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentStep(0)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors ml-1"
            title="Reset to 0NF"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage Detail Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50/50 dark:from-violet-950/30 dark:to-indigo-950/20 border border-violet-200 dark:border-violet-900/60 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>{stage.name} · {stage.badge}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
          {stage.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {stage.problem}
        </p>

        {stage.violatingFD && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 font-mono">
            <span className="font-bold">Violating Dependency:</span> {stage.violatingFD}
          </div>
        )}

        <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
          ✓ {stage.solution}
        </div>

        {stage.losslessCheck && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 inline mr-1.5 text-emerald-600" />
            <span className="font-semibold">{stage.losslessCheck}</span>
          </div>
        )}
      </div>

      {/* Resulting Decomposed Tables */}
      <div className="space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Decomposed Relational Tables at this stage ({stage.tables.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stage.tables.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
            >
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100">{t.name}</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-[11px]">
                  PK: {t.pk}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-500 font-semibold">
                    <tr>
                      {t.columns.map((c) => (
                        <th key={c} className="p-2.5">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                    {t.sample.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        {t.columns.map((col) => (
                          <td key={col} className="p-2.5 text-slate-800 dark:text-slate-200">
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
