import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../../types';
import { useProgress } from '../../context/ProgressContext';

interface QuizModalProps {
  weekId: number;
  weekTitle: string;
  questions: QuizQuestion[];
}

export const QuizModal: React.FC<QuizModalProps> = ({
  weekId,
  weekTitle,
  questions,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { quizScores, saveQuizScore } = useProgress();

  const currentSaved = quizScores[weekId];

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setIsSubmitted(true);
    saveQuizScore(weekId, score, questions.length);

    if (score >= questions.length - 1) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const score = isSubmitted ? calculateScore() : 0;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>5-Question Conceptual Check</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Check Yourself: {weekTitle}
          </h3>
        </div>

        {currentSaved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <Award className="w-4 h-4" />
            <span>Best: {currentSaved.score} / {currentSaved.total} ({Math.round((currentSaved.score / currentSaved.total) * 100)}%)</span>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="mt-6 space-y-8">
        {questions.map((question, qIdx) => {
          const userChoice = selectedAnswers[qIdx];
          const isCorrect = userChoice === question.answer;

          return (
            <div key={question.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                  {question.q}
                </p>
              </div>

              {/* Options */}
              <div className="pl-9 space-y-2">
                {question.options.map((option, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  let optionStyle =
                    'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';

                  if (isSelected && !isSubmitted) {
                    optionStyle =
                      'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-600';
                  }

                  if (isSubmitted) {
                    if (optIdx === question.answer) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-medium ring-1 ring-emerald-500';
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 line-through';
                    } else {
                      optionStyle = 'opacity-60 border-slate-200 dark:border-slate-800';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && optIdx === question.answer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown when submitted) */}
              {isSubmitted && (
                <div className="ml-9 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="text-emerald-600 dark:text-emerald-400">✓ Correct</span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400">✗ Incorrect</span>
                    )}
                    <span>— Concept Explanation:</span>
                  </div>
                  <p className="leading-relaxed">{question.explain}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Footer Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {isSubmitted ? (
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              You scored <span className="text-indigo-600 dark:text-indigo-400">{score}</span> out of{' '}
              {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              {answeredCount} of {questions.length} questions answered
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isSubmitted ? (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm"
            >
              <span>Submit Answers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
