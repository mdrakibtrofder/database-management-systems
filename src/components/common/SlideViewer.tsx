import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Bookmark,
  Download,
  FileText,
  UploadCloud,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { SlideDeck } from '../../types';
import { useProgress } from '../../context/ProgressContext';

interface SlideViewerProps {
  deck: SlideDeck;
  weekId: number;
  weekTitle: string;
  initialPage?: number;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  deck,
  weekId,
  weekTitle,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [customPdfUrl, setCustomPdfUrl] = useState<string | null>(null);
  const [hasPdfJsError, setHasPdfJsError] = useState<boolean>(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [actualTotalPages, setActualTotalPages] = useState<number>(deck.slides);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isBookmarked, addBookmark, removeBookmark, bookmarks } = useProgress();

  const totalPages = pdfDoc ? actualTotalPages : deck.slides;
  const isPageBookmarked = isBookmarked(weekId, currentPage);

  // Load PDF with PDF.js if available
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingPdf(true);
    setHasPdfJsError(false);

    const pdfTarget = customPdfUrl || deck.pdf;

    const loadPdf = async () => {
      // @ts-ignore
      const pdfjsLib = window.pdfjsLib;
      if (!pdfjsLib) {
        setHasPdfJsError(true);
        setIsLoadingPdf(false);
        return;
      }

      try {
        const loadingTask = pdfjsLib.getDocument({
          url: pdfTarget,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setActualTotalPages(doc.numPages);
          setIsLoadingPdf(false);
          setHasPdfJsError(false);
        }
      } catch (err) {
        // PDF not yet attached in folder - gracefully fallback to interactive slide generator
        if (!isCancelled) {
          setPdfDoc(null);
          setHasPdfJsError(true);
          setIsLoadingPdf(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [deck.pdf, customPdfUrl]);

  // Render current page onto canvas if pdfDoc exists
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 1.5 * zoom });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        // ignore canceled render
      }
    };

    renderPage();

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, zoom]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((p) => Math.min(totalPages, p + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((p) => Math.max(1, p - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]);

  const toggleBookmark = () => {
    if (isPageBookmarked) {
      const existing = bookmarks.find((b) => b.weekId === weekId && b.page === currentPage);
      if (existing) removeBookmark(existing.id);
    } else {
      addBookmark({
        weekId,
        weekTitle,
        deckTitle: deck.title,
        page: currentPage,
      });
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setCustomPdfUrl(url);
      setCurrentPage(1);
    }
  };

  // Content for the interactive slide preview when PDF hasn't been placed on disk yet
  const getSectionTitle = (page: number) => {
    const secCount = deck.sections.length;
    if (secCount === 0) return 'Slide Content';
    const index = Math.min(secCount - 1, Math.floor(((page - 1) / totalPages) * secCount));
    return deck.sections[index];
  };

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white overflow-hidden shadow-xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-4 flex flex-col' : ''
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
            {deck.title}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 font-mono">
            {currentPage} / {totalPages}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom */}
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 w-9 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              isPageBookmarked
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isPageBookmarked ? 'Remove Bookmark' : 'Bookmark this Slide'}
          >
            <Bookmark className={`w-4 h-4 ${isPageBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Presentation Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Downloads */}
          <a
            href={deck.pptx}
            download
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            title="Download original PPTX"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PPTX</span>
          </a>
          <a
            href={deck.pdf}
            download
            className="inline-flex items-center gap-1 px-2.5 py-1 text-indigo-300 hover:text-white bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-800/60 rounded transition-colors"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </a>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-950 overflow-auto min-h-[420px] sm:min-h-[500px]">
        {isLoadingPdf && (
          <div className="flex flex-col items-center gap-3 text-slate-400 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm">Loading slide presentation...</p>
          </div>
        )}

        {/* Real PDF Canvas (rendered if PDF file is found) */}
        {!isLoadingPdf && pdfDoc && (
          <div className="shadow-2xl rounded-lg overflow-hidden bg-white max-w-full">
            <canvas ref={canvasRef} className="max-w-full h-auto block" />
          </div>
        )}

        {/* Interactive Structured Slide Preview Deck (rendered when PDF is pending upload) */}
        {!isLoadingPdf && !pdfDoc && (
          <div
            className="relative w-full max-w-4xl aspect-[16/9] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl p-6 sm:p-12 flex flex-col justify-between border border-slate-200 dark:border-slate-800 transition-all"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  CSE 2205 · {weekTitle}
                </span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Slide {currentPage} of {totalPages}
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {getSectionTitle(currentPage)}
              </h2>
            </div>

            {/* Slide Body */}
            <div className="my-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Topic Section: {getSectionTitle(currentPage)}
                </p>
                <p>
                  This slide covers essential conceptual foundations and architectural mechanisms for{' '}
                  <strong className="text-indigo-600 dark:text-indigo-400">{deck.title}</strong> as taught by Md. Rakib Trofder at BAUST.
                </p>
              </div>

              {/* Notice that slide file will be attached */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                  <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Pending PDF upload: <code className="font-mono">{deck.pdf.replace('/assets/', '')}</code>
                  </span>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors shadow-xs">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Load Local PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Slide Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Department of Computer Science & Engineering · BAUST</span>
              <span>Use ← Left / Right → keys to flip slides</span>
            </div>
          </div>
        )}

        {/* Side Floating Navigation Buttons */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold shrink-0 mr-1">
          Slides
        </span>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
          const isActive = num === currentPage;
          return (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`shrink-0 w-8 h-8 rounded-md font-mono text-xs flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400 shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
};
