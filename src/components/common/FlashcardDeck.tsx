import React, { useState, useEffect } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { Flashcard } from '../../types';

interface FlashcardDeckProps {
  cards: Flashcard[];
  weekTitle: string;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards, weekTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleFlip = () => {
    setIsFlipped((f) => !f);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
          <Layers className="w-4 h-4" />
          <span>Active Recall Flashcards</span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Card {currentIndex + 1} of {cards.length}
        </span>
      </div>

      {/* The 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="cursor-pointer relative w-full min-h-[220px] sm:min-h-[240px] rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800/80 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between select-none hover:shadow-md transition-all group"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {isFlipped ? 'Definition / Answer' : 'Term / Question'}
          </span>
          <div className="flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click to flip</span>
          </div>
        </div>

        <div className="my-auto py-4 text-center">
          {isFlipped ? (
            <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line animate-fadeIn">
              {card.back}
            </p>
          ) : (
            <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight animate-fadeIn">
              {card.front}
            </h4>
          )}
        </div>

        <div className="text-center text-[11px] text-slate-400">
          CSE 2205 · {weekTitle}
        </div>
      </div>

      {/* Deck Controls */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleFlip}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {isFlipped ? 'Show Front' : 'Flip to Reveal'}
        </button>

        <button
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
