import React, { useState } from 'react';
import { Database, Compass, Layers, CheckCircle2, HelpCircle } from 'lucide-react';

interface DbProfile {
  id: string;
  name: string;
  category: string;
  model: string;
  strengths: string[];
  bestFor: string;
  queryLanguage: string;
  scores: {
    acid: number;
    scale: number;
    analytics: number;
    flexibility: number;
    timeSeries: number;
  };
}

const dbProfiles: DbProfile[] = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'Relational (RDBMS)',
    model: 'Row-oriented Relational Tables',
    strengths: ['Full ACID compliance', 'Complex SQL joins', 'Secondary indices', 'Extensible types'],
    bestFor: 'E-commerce transactions, financial ledgers, core university databases.',
    queryLanguage: 'Standard ANSI SQL',
    scores: { acid: 10, scale: 6, analytics: 6, flexibility: 5, timeSeries: 4 },
  },
  {
    id: 'mongo',
    name: 'MongoDB',
    category: 'Document NoSQL',
    model: 'Hierarchical BSON Documents',
    strengths: ['Dynamic flexible schema', 'Horizontal sharding', 'Fast single-document reads/writes'],
    bestFor: 'Content management, catalog items with varied attributes, rapid prototyping.',
    queryLanguage: 'MQL (JSON query syntax)',
    scores: { acid: 6, scale: 9, analytics: 5, flexibility: 10, timeSeries: 5 },
  },
  {
    id: 'bigquery',
    name: 'Google BigQuery',
    category: 'Cloud Data Warehouse (OLAP)',
    model: 'Columnar Contiguous Storage',
    strengths: ['Scans billions of rows in seconds', 'Serverless scaling', 'High compression'],
    bestFor: 'Business intelligence dashboards, historical enterprise reporting, big data analytics.',
    queryLanguage: 'Standard SQL for Analytics',
    scores: { acid: 5, scale: 10, analytics: 10, flexibility: 6, timeSeries: 6 },
  },
  {
    id: 'influx',
    name: 'InfluxDB',
    category: 'Time-Series Database (TSDB)',
    model: 'Timestamped Measurements & Tags',
    strengths: ['Massive ingest rate for timestamps', 'Automated downsampling', 'Time-range queries'],
    bestFor: 'IoT sensor readings, server CPU metrics, stock ticker price logs.',
    queryLanguage: 'InfluxQL / Flux',
    scores: { acid: 5, scale: 8, analytics: 7, flexibility: 4, timeSeries: 10 },
  },
];

const useCaseQuestions = [
  {
    q: 'You are building a banking application where every balance debit must strictly succeed or abort without inconsistency.',
    best: 'postgres',
    reason: 'PostgreSQL provides strict ACID isolation and transactional guarantees needed for financial accounting.',
  },
  {
    q: 'You need to store 10,000 sensor temperatures emitted every second from factory machines with 30-day retention policies.',
    best: 'influx',
    reason: 'InfluxDB is tailored for timestamped telemetry, continuous downsampling, and automated retention cleanup.',
  },
  {
    q: 'Your company wants to analyze 500 million historical retail purchases to calculate quarterly revenue trends per region.',
    best: 'bigquery',
    reason: 'Google BigQuery columnar storage executes analytical aggregate scans across massive tables in seconds.',
  },
];

export const DbCompassLab: React.FC = () => {
  const [selectedDb, setSelectedDb] = useState<string>('postgres');
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [userChoice, setUserChoice] = useState<string | null>(null);

  const db = dbProfiles.find((d) => d.id === selectedDb)!;
  const currentQuiz = useCaseQuestions[quizIdx];

  return (
    <div className="space-y-6">
      {/* DB Switcher */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Database Archetype:
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {dbProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedDb(p.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedDb === p.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Category: {db.category}
        </span>
      </div>

      {/* Main Profile & Capability Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              {db.category}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {db.name}
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Storage Model: {db.model}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Core Strengths:
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              {db.strengths.map((s, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Best Real-World Fit:
            </span>
            <p className="text-slate-600 dark:text-slate-300">{db.bestFor}</p>
          </div>
        </div>

        {/* 5-Axis Score Breakdown */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workload Capability Profile (Out of 10)
          </h4>

          <div className="space-y-3 text-xs">
            {Object.entries(db.scores).map(([axis, score]) => (
              <div key={axis} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="capitalize text-slate-700 dark:text-slate-300">
                    {axis === 'acid' ? 'ACID Consistency' : axis === 'timeSeries' ? 'Time-Series Streaming' : axis}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {score} / 10
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${score * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Which Database For This Use Case Quiz */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50/40 dark:from-indigo-950/30 dark:to-purple-950/20 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Architectural Advisory Challenge: Case {quizIdx + 1} of {useCaseQuestions.length}</span>
        </div>

        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {currentQuiz.q}
        </p>

        <div className="flex flex-wrap gap-2">
          {dbProfiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setUserChoice(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                userChoice === p.id
                  ? p.id === currentQuiz.best
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                    : 'bg-rose-600 text-white border-rose-600 font-bold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {userChoice && (
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {userChoice === currentQuiz.best ? '✓ Perfect Match!' : '✗ Suboptimal Architecture:'}
            </span>
            <p className="text-slate-600 dark:text-slate-300">{currentQuiz.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
};
