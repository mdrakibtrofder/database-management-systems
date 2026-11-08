import React, { useState } from 'react';
import { ArrowRight, Database, Sparkles, Table2, Layers, CheckCircle2 } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  description: string;
  entities: {
    name: string;
    type: 'strong' | 'weak';
    attributes: string[];
    pk: string;
  }[];
  relationships: {
    name: string;
    type: '1:1' | '1:N' | 'M:N';
    between: [string, string];
    junctionRequired: boolean;
  }[];
  relationalTables: {
    tableName: string;
    pk: string;
    fks: string[];
    columns: string[];
    type: 'Entity Table' | 'Junction Table' | 'Weak Entity Table';
  }[];
}

const scenarios: Scenario[] = [
  {
    id: 'library',
    name: '1. Library Management System (ER Note Scenario)',
    description: 'Members borrow Books. A Member can borrow many Books over time, and a Book can be borrowed by many Members (M:N Relationship).',
    entities: [
      { name: 'Member', type: 'strong', pk: 'member_id', attributes: ['member_id', 'name', 'phone', 'join_date'] },
      { name: 'Book', type: 'strong', pk: 'isbn', attributes: ['isbn', 'title', 'author', 'copies_available'] },
    ],
    relationships: [
      { name: 'Borrows', type: 'M:N', between: ['Member', 'Book'], junctionRequired: true },
    ],
    relationalTables: [
      { tableName: 'Member', pk: 'member_id', fks: [], columns: ['member_id [PK]', 'name', 'phone', 'join_date'], type: 'Entity Table' },
      { tableName: 'Book', pk: 'isbn', fks: [], columns: ['isbn [PK]', 'title', 'author', 'copies_available'], type: 'Entity Table' },
      {
        tableName: 'Loan_Record (Junction Table)',
        pk: '(member_id, isbn, borrow_date)',
        fks: ['member_id references Member(member_id)', 'isbn references Book(isbn)'],
        columns: ['member_id [PK, FK]', 'isbn [PK, FK]', 'borrow_date [PK]', 'due_date', 'return_date'],
        type: 'Junction Table',
      },
    ],
  },
  {
    id: 'hospital',
    name: '2. Hospital Patient & Doctor Scenario',
    description: 'Doctors treat Patients. Each treatment has a date, diagnosis, and prescription.',
    entities: [
      { name: 'Doctor', type: 'strong', pk: 'doctor_id', attributes: ['doctor_id', 'doctor_name', 'specialty'] },
      { name: 'Patient', type: 'strong', pk: 'patient_id', attributes: ['patient_id', 'patient_name', 'dob', 'blood_group'] },
    ],
    relationships: [
      { name: 'Treats', type: 'M:N', between: ['Doctor', 'Patient'], junctionRequired: true },
    ],
    relationalTables: [
      { tableName: 'Doctor', pk: 'doctor_id', fks: [], columns: ['doctor_id [PK]', 'doctor_name', 'specialty'], type: 'Entity Table' },
      { tableName: 'Patient', pk: 'patient_id', fks: [], columns: ['patient_id [PK]', 'patient_name', 'dob', 'blood_group'], type: 'Entity Table' },
      {
        tableName: 'Treatment (Junction Table)',
        pk: '(doctor_id, patient_id, treatment_date)',
        fks: ['doctor_id references Doctor', 'patient_id references Patient'],
        columns: ['doctor_id [PK, FK]', 'patient_id [PK, FK]', 'treatment_date [PK]', 'diagnosis', 'prescription'],
        type: 'Junction Table',
      },
    ],
  },
  {
    id: 'university',
    name: '3. University Department & Instructor (1:N)',
    description: 'A Department employs many Instructors, but each Instructor belongs to exactly one Department (1:N Relationship).',
    entities: [
      { name: 'Department', type: 'strong', pk: 'dept_id', attributes: ['dept_id', 'dept_name', 'building'] },
      { name: 'Instructor', type: 'strong', pk: 'instructor_id', attributes: ['instructor_id', 'name', 'salary'] },
    ],
    relationships: [
      { name: 'Employs', type: '1:N', between: ['Department', 'Instructor'], junctionRequired: false },
    ],
    relationalTables: [
      { tableName: 'Department', pk: 'dept_id', fks: [], columns: ['dept_id [PK]', 'dept_name', 'building'], type: 'Entity Table' },
      {
        tableName: 'Instructor',
        pk: 'instructor_id',
        fks: ['dept_id references Department(dept_id)'],
        columns: ['instructor_id [PK]', 'name', 'salary', 'dept_id [FK]'],
        type: 'Entity Table',
      },
    ],
  },
  {
    id: 'company',
    name: '4. Employee & Dependent (Weak Entity Scenario)',
    description: 'Dependent is a WEAK entity set that has no independent primary key. It depends on Employee for existence.',
    entities: [
      { name: 'Employee', type: 'strong', pk: 'emp_id', attributes: ['emp_id', 'emp_name', 'salary'] },
      { name: 'Dependent', type: 'weak', pk: '(emp_id, dep_name)', attributes: ['dep_name (partial key)', 'relationship', 'birth_date'] },
    ],
    relationships: [
      { name: 'Has_Dependent', type: '1:N', between: ['Employee', 'Dependent'], junctionRequired: false },
    ],
    relationalTables: [
      { tableName: 'Employee', pk: 'emp_id', fks: [], columns: ['emp_id [PK]', 'emp_name', 'salary'], type: 'Entity Table' },
      {
        tableName: 'Dependent (Weak Entity Table)',
        pk: '(emp_id, dep_name)',
        fks: ['emp_id references Employee(emp_id) ON DELETE CASCADE'],
        columns: ['emp_id [PK, FK]', 'dep_name [PK (Discriminator)]', 'relationship', 'birth_date'],
        type: 'Weak Entity Table',
      },
    ],
  },
];

export const ErMapperLab: React.FC = () => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(0);
  const [isMapped, setIsMapped] = useState<boolean>(true);

  const scenario = scenarios[selectedScenarioIdx];

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Worked Scenario from ER Guide
          </span>
          <button
            onClick={() => setIsMapped(!isMapped)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isMapped ? 'Show ER Diagram Only' : 'Map to Relational Schema'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {scenarios.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIdx(idx);
                setIsMapped(true);
              }}
              className={`p-2.5 rounded-lg text-left text-xs transition-colors border ${
                selectedScenarioIdx === idx
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-medium'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-semibold line-clamp-1">{sc.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ER Visual Diagram Box */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center min-h-[220px] space-y-6">
        <div className="text-xs text-slate-500 max-w-md text-center leading-relaxed">
          {scenario.description}
        </div>

        {/* Chen Notation Flow */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {/* Entity 1 */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`px-5 py-3 rounded-lg border-2 font-bold text-xs shadow-sm ${
                scenario.entities[0].type === 'weak'
                  ? 'border-double border-4 border-indigo-600 bg-white dark:bg-slate-900'
                  : 'border-indigo-600 bg-white dark:bg-slate-900 text-indigo-950 dark:text-indigo-200'
              }`}
            >
              {scenario.entities[0].name}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              PK: {scenario.entities[0].pk}
            </div>
          </div>

          {/* Relationship Diamond */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-400/20 border-2 border-amber-500 rotate-45 flex items-center justify-center shadow-xs">
              <span className="-rotate-45 text-[10px] font-bold text-amber-900 dark:text-amber-200">
                {scenario.relationships[0].name}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 mt-2 font-mono">
              [{scenario.relationships[0].type}]
            </span>
          </div>

          {/* Entity 2 */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`px-5 py-3 rounded-lg border-2 font-bold text-xs shadow-sm ${
                scenario.entities[1].type === 'weak'
                  ? 'border-double border-4 border-violet-600 bg-white dark:bg-slate-900'
                  : 'border-violet-600 bg-white dark:bg-slate-900 text-violet-950 dark:text-violet-200'
              }`}
            >
              {scenario.entities[1].name}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              PK: {scenario.entities[1].pk}
            </div>
          </div>
        </div>
      </div>

      {/* Mapped Relational Tables */}
      {isMapped && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Mapped Relational Tables ({scenario.relationalTables.length})
            </h4>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correctly Normalized Schema</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenario.relationalTables.map((tbl) => (
              <div
                key={tbl.tableName}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {tbl.tableName}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tbl.type}
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  {tbl.columns.map((col) => (
                    <div
                      key={col}
                      className={`p-1.5 rounded flex items-center justify-between ${
                        col.includes('[PK')
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{col}</span>
                    </div>
                  ))}
                </div>

                {tbl.fks.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Foreign Keys:
                    </span>
                    {tbl.fks.map((fk, idx) => (
                      <p key={idx} className="font-mono text-indigo-600 dark:text-indigo-400">
                        ↳ {fk}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
