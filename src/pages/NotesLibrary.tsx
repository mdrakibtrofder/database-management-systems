import React, { useEffect, useRef, useState } from 'react';
import {
  FileText,
  Download,
  Search,
  ExternalLink,
  Eye,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { courseData } from '../data/course';
import { CourseNote } from '../types';

interface NotesLibraryProps {
  onNavigate: (path: string) => void;
}

export const NotesLibrary: React.FC<NotesLibraryProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [activeModalNote, setActiveModalNote] = useState<CourseNote | null>(null);

  // PDF viewer state
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [hasPdfError, setHasPdfError] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(courseData.notes.flatMap((n) => n.tags)));

  const filteredNotes = courseData.notes.filter((note) => {
    const matchesQuery =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'ALL' || note.tags.includes(selectedTag);

    return matchesQuery && matchesTag;
  });

  // Load PDF when a note is opened
  useEffect(() => {
    if (!activeModalNote) return;

    let isCancelled = false;
    setIsLoadingPdf(true);
    setHasPdfError(false);
    setCurrentPage(1);
    setPdfDoc(null);

    // @ts-ignore
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) {
      setHasPdfError(true);
      setIsLoadingPdf(false);
      return;
    }

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: activeModalNote.file,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setIsLoadingPdf(false);
          setHasPdfError(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setPdfDoc(null);
          setHasPdfError(true);
          setIsLoadingPdf(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [activeModalNote]);

  // Render current page onto canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
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

  // Keyboard navigation inside the modal
  useEffect(() => {
    if (!activeModalNote) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((p) => Math.min(totalPages, p + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((p) => Math.max(1, p - 1));
      } else if (e.key === 'Escape') {
        setActiveModalNote(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalNote, totalPages]);

  const closeModal = () => {
    setActiveModalNote(null);
    setPdfDoc(null);
  };

  return (
    <div className="space-y-10 py-6 sm:py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Course Repository
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Notes & Handouts Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Access all {courseData.notes.length} official course lecture notes, ER teaching guides with 10 worked scenarios, SQL practice sheets, and previous years&apos; final exams. View in-browser or download as PDF.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or tags..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Tags:</span>
        <button
          onClick={() => setSelectedTag('ALL')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            selectedTag === 'ALL'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All ({courseData.notes.length})
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedTag === tag
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Meta row */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <FileText className="w-4 h-4" />
                  <span>PDF Document</span>
                </span>
                <span className="font-mono text-[11px]">{note.pages} pages · {note.size}</span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {note.title}
              </h3>

              {/* Scanned Badge (for the large 29MB scan) */}
              {note.isScanned && (
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300">
                  Scanned note · compressed view shown · download full quality
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {note.description}
              </p>

              {/* Weeks and Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {note.weeks.map((wId) => (
                  <button
                    key={wId}
                    onClick={() => onNavigate(`/week/${wId}`)}
                    className="text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded hover:underline"
                  >
                    Week {wId}
                  </button>
                ))}
                {note.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setActiveModalNote(note)}
                className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Eye className="w-4 h-4" />
                <span>View in Browser</span>
              </button>

              <div className="flex items-center gap-3">
                <a
                  href={note.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open</span>
                </a>
                <a
                  href={note.file}
                  download={note.fileName}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note Preview Modal with PDF rendering */}
      {activeModalNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-5xl max-h-[95vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                  {activeModalNote.title}
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                  {activeModalNote.fileName} · {activeModalNote.pages} pages · {activeModalNote.size}
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <a
                  href={activeModalNote.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open</span>
                </a>
                <a
                  href={activeModalNote.file}
                  download={activeModalNote.fileName}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={closeModal}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PDF Toolbar */}
            {pdfDoc && (
              <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[11px] text-slate-500 w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: PDF Canvas */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950 flex items-start justify-center">
              {isLoadingPdf && (
                <div className="flex flex-col items-center gap-3 text-slate-400 animate-pulse py-20">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-sm">Loading document...</p>
                </div>
              )}

              {!isLoadingPdf && hasPdfError && (
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">
                      Could not load PDF preview
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      The PDF file may be too large or PDF.js failed to load. You can still open or download it.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <a
                      href={activeModalNote.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in New Tab</span>
                    </a>
                    <a
                      href={activeModalNote.file}
                      download={activeModalNote.fileName}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              )}

              {!isLoadingPdf && !hasPdfError && pdfDoc && (
                <div className="shadow-2xl rounded-lg overflow-hidden bg-white max-w-full">
                  <canvas ref={canvasRef} className="max-w-full h-auto block" />
                </div>
              )}
            </div>

            {/* Footer hint */}
            {pdfDoc && (
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center shrink-0">
                Use ← / → arrow keys to flip pages · Esc to close
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
