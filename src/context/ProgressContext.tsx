import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SlideBookmark {
  id: string;
  weekId: number;
  weekTitle: string;
  deckTitle: string;
  page: number;
  date: string;
  note?: string;
}

export interface QuizResult {
  weekId: number;
  score: number;
  total: number;
  date: string;
}

interface ProgressContextType {
  completedWeeks: number[];
  toggleWeekCompleted: (weekId: number) => void;
  isWeekCompleted: (weekId: number) => boolean;

  bookmarks: SlideBookmark[];
  addBookmark: (bookmark: Omit<SlideBookmark, 'id' | 'date'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (weekId: number, page: number) => boolean;

  quizScores: Record<number, QuizResult>;
  saveQuizScore: (weekId: number, score: number, total: number) => void;

  lastVisitedWeek: number | null;
  setLastVisitedWeek: (weekId: number) => void;

  resetProgress: () => void;
  progressPercentage: number;
}

const STORAGE_KEY = 'cse2205-progress';

interface SavedState {
  completedWeeks: number[];
  bookmarks: SlideBookmark[];
  quizScores: Record<number, QuizResult>;
  lastVisitedWeek: number | null;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SavedState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return {
      completedWeeks: [],
      bookmarks: [],
      quizScores: {},
      lastVisitedWeek: null,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota issues
    }
  }, [state]);

  const toggleWeekCompleted = (weekId: number) => {
    setState((prev) => {
      const exists = prev.completedWeeks.includes(weekId);
      const next = exists
        ? prev.completedWeeks.filter((id) => id !== weekId)
        : [...prev.completedWeeks, weekId];
      return { ...prev, completedWeeks: next };
    });
  };

  const isWeekCompleted = (weekId: number) => state.completedWeeks.includes(weekId);

  const addBookmark = (bm: Omit<SlideBookmark, 'id' | 'date'>) => {
    const newBm: SlideBookmark = {
      ...bm,
      id: `${bm.weekId}-${bm.page}-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    setState((prev) => ({
      ...prev,
      bookmarks: [newBm, ...prev.bookmarks],
    }));
  };

  const removeBookmark = (id: string) => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.id !== id),
    }));
  };

  const isBookmarked = (weekId: number, page: number) => {
    return state.bookmarks.some((b) => b.weekId === weekId && b.page === page);
  };

  const saveQuizScore = (weekId: number, score: number, total: number) => {
    setState((prev) => {
      const current = prev.quizScores[weekId];
      // Keep best score if previously recorded
      if (!current || score >= current.score) {
        return {
          ...prev,
          quizScores: {
            ...prev.quizScores,
            [weekId]: {
              weekId,
              score,
              total,
              date: new Date().toLocaleDateString(),
            },
          },
        };
      }
      return prev;
    });
  };

  const setLastVisitedWeek = (weekId: number) => {
    setState((prev) => ({ ...prev, lastVisitedWeek: weekId }));
  };

  const resetProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState({
      completedWeeks: [],
      bookmarks: [],
      quizScores: {},
      lastVisitedWeek: null,
    });
  };

  // 13 active weeks with content (Weeks 1 to 14, where 10-11 is combined)
  const totalWeeksCount = 13;
  const progressPercentage = Math.round(
    (state.completedWeeks.length / totalWeeksCount) * 100
  );

  return (
    <ProgressContext.Provider
      value={{
        completedWeeks: state.completedWeeks,
        toggleWeekCompleted,
        isWeekCompleted,
        bookmarks: state.bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        quizScores: state.quizScores,
        saveQuizScore,
        lastVisitedWeek: state.lastVisitedWeek,
        setLastVisitedWeek,
        resetProgress,
        progressPercentage,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
