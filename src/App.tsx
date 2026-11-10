import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { useHashRouter } from './hooks/useHashRouter';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { BookmarksDrawer } from './components/common/BookmarksDrawer';
import { Home } from './pages/Home';
import { Roadmap } from './pages/Roadmap';
import { WeekDetail } from './pages/WeekDetail';
import { NotesLibrary } from './pages/NotesLibrary';
import { SlidesLibrary } from './pages/SlidesLibrary';
import { LabsGallery } from './pages/LabsGallery';
import { LabView } from './pages/LabView';
import { Glossary } from './pages/Glossary';

function AppContent() {
  const { route, navigate } = useHashRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);

  // Global Ctrl/Cmd + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCurrentPage = () => {
    const { path, params, queryParams } = route;

    if (path === '/' || path === '') {
      return <Home onNavigate={navigate} />;
    }

    if (path === '/weeks') {
      return <Roadmap onNavigate={navigate} />;
    }

    if (path.startsWith('/week/')) {
      const weekId = parseInt(params.id || '1', 10);
      const initialPage = queryParams.page ? parseInt(queryParams.page, 10) : 1;
      return <WeekDetail weekId={weekId} initialPage={initialPage} onNavigate={navigate} />;
    }

    if (path === '/slides') {
      return <SlidesLibrary onNavigate={navigate} />;
    }

    if (path === '/notes') {
      return <NotesLibrary onNavigate={navigate} />;
    }

    if (path === '/labs') {
      return <LabsGallery onNavigate={navigate} />;
    }

    if (path.startsWith('/lab/')) {
      const labId = params.id || 'sql-playground';
      return <LabView labId={labId} onNavigate={navigate} />;
    }

    if (path === '/glossary') {
      return <Glossary onNavigate={navigate} />;
    }

    // Default fallback to Home
    return <Home onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        currentPath={route.path}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenBookmarks={() => setBookmarksOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {renderCurrentPage()}
      </main>

      <Footer onNavigate={navigate} />

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
      />

      <BookmarksDrawer
        isOpen={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <AppContent />
      </ProgressProvider>
    </ThemeProvider>
  );
}
