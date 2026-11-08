import React, { useState } from 'react';
import { TrendingUp, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

const tiers = [
  {
    level: 1,
    title: 'Descriptive Analytics',
    question: 'What happened?',
    color: 'from-blue-500 to-indigo-600',
    description: 'Summarizes historical data using standard SQL aggregations, reporting dashboards, and BI charts.',
    exampleQuery: `SELECT strftime('%Y-%m', sale_date) as month, SUM(amount) as monthly_revenue\nFROM Transactions\nGROUP BY month;`,
    insight: 'Reveals past trends (e.g., Summer 2025 semester enrollments dropped by 8% in Civil Engineering).',
  },
  {
    level: 2,
    title: 'Diagnostic Analytics',
    question: 'Why did it happen?',
    color: 'from-indigo-600 to-violet-600',
    description: 'Drills down into anomalies through correlation queries, root-cause multi-dimensional OLAP slicing, and cohort analysis.',
    exampleQuery: `SELECT d.dept_name, c.prerequisite_failure_rate, COUNT(*) as dropouts\nFROM Student_Drops s\nJOIN Course c ON s.course_id = c.course_id\nGROUP BY d.dept_name;`,
    insight: 'Isolates causation (e.g., A difficult prerequisite course had a 42% failure rate, driving downstream dropouts).',
  },
  {
    level: 3,
    title: 'Predictive Analytics',
    question: 'What will happen next?',
    color: 'from-violet-600 to-purple-600',
    description: 'Forecasts future trends using machine learning models, statistical regressions, and probabilistic time-series forecasting.',
    exampleQuery: `SELECT student_id, ML.PREDICT(MODEL CourseRiskModel, (SELECT * FROM Student_Features WHERE student_id = 202401));`,
    insight: 'Predicts future probabilities (e.g., Student has an 86% probability of scoring A or A+ in Advanced Database Systems).',
  },
  {
    level: 4,
    title: 'Prescriptive Analytics',
    question: 'How can we achieve the best outcome?',
    color: 'from-purple-600 to-rose-600',
    description: 'Recommends optimized specific actions and autonomous decisions using linear programming, reinforcement learning, and automated triggers.',
    exampleQuery: `CALL RecommendClassScheduleOptimization(\n  target_term => 'Summer 2026',\n  max_classroom_capacity => 60,\n  objective => 'MINIMIZE_EXAM_CLASHES'\n);`,
    insight: 'Provides concrete action plan (e.g., Adjust schedule to Thursday 10:50 AM to eliminate 100% of student exam conflicts).',
  },
];

export const AnalyticsLadderLab: React.FC = () => {
  const [activeTier, setActiveTier] = useState<number>(0);
  const current = tiers[activeTier];

  return (
    <div className="space-y-6">
      {/* Staircase Step selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tiers.map((t, idx) => (
          <button
            key={t.level}
            onClick={() => setActiveTier(idx)}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTier === idx
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Tier {t.level}
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
              {t.title}
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
              &ldquo;{t.question}&rdquo;
            </div>
          </button>
        ))}
      </div>

      {/* Main Tier Breakdown Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div>
          <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400">
            Tier {current.level} Maturity
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {current.title} · &ldquo;{current.question}&rdquo;
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Example Query */}
        <div className="space-y-1.5 font-mono text-xs">
          <span className="font-sans font-bold text-slate-700 dark:text-slate-300">
            Representative Query Formulation:
          </span>
          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 overflow-x-auto">
            {current.exampleQuery}
          </pre>
        </div>

        {/* Insight */}
        <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200">
          <strong className="font-semibold">Business / Academic Value:</strong> {current.insight}
        </div>
      </div>
    </div>
  );
};
