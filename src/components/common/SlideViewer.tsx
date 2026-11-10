import React, { useEffect, useRef, useState } from 'react';
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
  AlertCircle,
  UploadCloud,
} from 'lucide-react';
import { SlideDeck } from '../../types';
import { useProgress } from '../../context/ProgressContext';

interface SlideViewerProps {
  deck: SlideDeck;
  weekId: number;
  weekTitle: string;
  initialPage?: number;
}

// Parse a slide XML string and extract text paragraphs
const parseSlideXml = (xml: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  // PowerPoint text runs are in <a:t> elements inside <a:p> paragraphs
  // We extract paragraphs, each paragraph may have multiple text runs
  const paragraphs: string[] = [];
  const pElements = doc.getElementsByTagName('a:p');

  for (let i = 0; i < pElements.length; i++) {
    const p = pElements[i];
    const tElements = p.getElementsByTagName('a:t');
    let text = '';
    for (let j = 0; j < tElements.length; j++) {
      text += tElements[j].textContent || '';
    }
    const trimmed = text.trim();
    if (trimmed) {
      paragraphs.push(trimmed);
    }
  }

  return paragraphs;
};

// Sort slide files numerically: slide1.xml, slide2.xml, ..., slide10.xml
const sortSlideFiles = (a: string, b: string): number => {
  const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || '0', 10);
  const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || '0', 10);
  return numA - numB;
};

export const SlideViewer: React.FC<SlideViewerProps> = ({
  deck,
  weekId,
  weekTitle,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Rendering state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [customPdfUrl, setCustomPdfUrl] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Parsed PPTX slide content: array of slides, each slide is an array of text paragraphs
  const [pptSlides, setPptSlides] = useState<string[][]>([]);
  const [actualTotalPages, setActualTotalPages] = useState<number>(deck.slides);

  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { isBookmarked, addBookmark, removeBookmark, bookmarks } = useProgress();

  const totalPages = actualTotalPages || deck.slides;
  const isPageBookmarked = isBookmarked(weekId, currentPage);

  // ── Load presentation: try PPTX (JSZip parse) first, then PDF (PDF.js) ──
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setLoadError(false);
    setPdfDoc(null);
    setPptSlides([]);
    setActualTotalPages(deck.slides);

    const pdfTarget = customPdfUrl || deck.pdf;
    const pptxTarget = deck.pptx;

    // Try PPTX: parse with JSZip to extract slide text content
    const tryPptx = async (): Promise<boolean> => {
      // @ts-ignore - JSZip loaded via CDN
      const JSZip = (window as any).JSZip;
      if (!JSZip) return false;

      try {
        const response = await fetch(pptxTarget);
        if (!response.ok) return false;
        const arrayBuffer = await response.arrayBuffer();

        const zip = await JSZip.loadAsync(arrayBuffer);

        // Find all slide XML files
        const slideFiles = Object.keys(zip.files)
          .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
          .sort(sortSlideFiles);

        if (slideFiles.length === 0) return false;

        // Parse each slide's text content
        const slides: string[][] = [];
        for (const file of slideFiles) {
          const content = await zip.file(file).async('string');
          const paragraphs = parseSlideXml(content);
          slides.push(paragraphs);
        }

        if (isCancelled) return false;

        setPptSlides(slides);
        setActualTotalPages(slides.length || deck.slides);
        return true;
      } catch {
        return false;
      }
    };

    // Fallback to PDF via PDF.js
    const tryPdf = async (): Promise<boolean> => {
      // @ts-ignore
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) return false;

      try {
        const loadingTask = pdfjsLib.getDocument({
          url: pdfTarget,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
        });
        const doc = await loadingTask.promise;
        if (isCancelled) return false;
        setPdfDoc(doc);
        setActualTotalPages(doc.numPages);
        return true;
      } catch {
        return false;
      }
    };

    const load = async () => {
      const pptxOk = await tryPptx();
      if (isCancelled) return;
      if (pptxOk) {
        setIsLoading(false);
        return;
      }

      const pdfOk = await tryPdf();
      if (isCancelled) return;
      if (pdfOk) {
        setIsLoading(false);
        return;
      }

      setLoadError(true);
      setIsLoading(false);
    };

    load();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.pdf, deck.pptx, customPdfUrl]);

  // ── Render PDF page onto canvas (PDF.js) ──
  useEffect(() => {
    if (!pdfDoc || !pdfCanvasRef.current) return;

    let renderTask: any = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = pdfCanvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 1.4 * zoom });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch {
        // ignore canceled render
      }
    };

    renderPage();

    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, currentPage, zoom]);

  // ── Keyboard navigation ──
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

  // ── Reset to first page when deck changes ──
  useEffect(() => {
    setCurrentPage(1);
  }, [deck.id]);

  const toggleBookmark = () => {
    if (isPageBookmarked) {
      const existing = bookmarks.find((b) => b.weekId === weekId && b.page === currentPage);
      if (existing) removeBookmark(existing.id);
    } else {
      addBookmark({ weekId, weekTitle, deckTitle: deck.title, page: currentPage });
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

  const getSectionTitle = (page: number) => {
    const secCount = deck.sections.length;
    if (secCount === 0) return 'Slide Content';
    const index = Math.min(secCount - 1, Math.floor(((page - 1) / totalPages) * secCount));
    return deck.sections[index];
  };

  const isPptx = pptSlides.length > 0;
  const isPdf = !isPptx && !!pdfDoc;
  const hasRenderable = isPptx || isPdf;

  // Current slide's parsed text paragraphs
  const currentSlideParagraphs = pptSlides[currentPage - 1] || [];

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
          {deck.pdf && (
            <a
              href={deck.pdf}
              download
              className="inline-flex items-center gap-1 px-2.5 py-1 text-indigo-300 hover:text-white bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-800/60 rounded transition-colors"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-950 overflow-auto min-h-[420px] sm:min-h-[500px]">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 text-slate-400 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm">Loading slide presentation...</p>
          </div>
        )}

        {/* PPTX content: parsed text slides rendered as styled slides */}
        {!isLoading && isPptx && (
          <div
            className="relative w-full max-w-4xl aspect-[16/9] bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 flex flex-col overflow-hidden transition-all"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            {/* Slide Header */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4 border-b border-slate-100 pb-3">
              <span className="font-semibold text-indigo-600">
                CSE 2205 · {weekTitle}
              </span>
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                Slide {currentPage} of {totalPages}
              </span>
            </div>

            {/* Slide Title (first paragraph) */}
            {currentSlideParagraphs.length > 0 && (
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mb-4 line-clamp-2">
                {currentSlideParagraphs[0]}
              </h2>
            )}

            {/* Slide Body (remaining paragraphs) */}
            <div className="flex-1 overflow-auto space-y-2.5 pr-1">
              {currentSlideParagraphs.slice(1).map((para, idx) => (
                <p
                  key={idx}
                  className="text-sm sm:text-base leading-relaxed text-slate-700"
                >
                  {para}
                </p>
              ))}
              {currentSlideParagraphs.length === 0 && (
                <p className="text-sm text-slate-400 italic">
                  (This slide contains images or shapes without text.)
                </p>
              )}
            </div>

            {/* Slide Footer */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Dept. of Computer Science &amp; Engineering · BAUST</span>
              <span>{deck.title}</span>
            </div>
          </div>
        )}

        {/* PDF Canvas (PDF.js) */}
        {!isLoading && isPdf && (
          <div className="shadow-2xl rounded-lg overflow-hidden bg-white max-w-full">
            <canvas ref={pdfCanvasRef} className="max-w-full h-auto block" />
          </div>
        )}

        {/* Fallback: structured interactive slide preview */}
        {!isLoading && !hasRenderable && (
          <div
            className="relative w-full max-w-4xl aspect-[16/9] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl p-6 sm:p-12 flex flex-col justify-between border border-slate-200 dark:border-slate-800 transition-all"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                  <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    {loadError
                      ? 'Could not load the presentation file. Download the PPTX below or load a local PDF.'
                      : `Interactive slide preview: ${deck.pdf.split('/').pop()}`}
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

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Department of Computer Science &amp; Engineering · BAUST</span>
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
