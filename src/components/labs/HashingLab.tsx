import React, { useState } from 'react';
import { Hash, Plus, RotateCcw, Sparkles } from 'lucide-react';

export const HashingLab: React.FC = () => {
  const [mode, setMode] = useState<'static' | 'extendable'>('extendable');
  const [globalDepth, setGlobalDepth] = useState<number>(2);
  const [inputVal, setInputVal] = useState<string>('27');

  // Extendable hashing buckets with local depths
  const [buckets, setBuckets] = useState<
    { id: string; localDepth: number; keys: number[] }[]
  >([
    { id: 'b0', localDepth: 2, keys: [4, 12] }, // binary ends in 00
    { id: 'b1', localDepth: 2, keys: [5, 13] }, // binary ends in 01
    { id: 'b2', localDepth: 2, keys: [6, 14] }, // binary ends in 10
    { id: 'b3', localDepth: 2, keys: [7, 15] }, // binary ends in 11
  ]);

  const [caption, setCaption] = useState<string>(
    'Extendable Hashing initialized with Global Depth D = 2. Directory points to 4 buckets.'
  );

  const handleInsert = () => {
    const key = parseInt(inputVal, 10);
    if (isNaN(key)) return;

    const bucketIdx = key % Math.pow(2, globalDepth);
    const targetBucket = buckets[bucketIdx];

    if (!targetBucket) {
      setCaption(`Error finding directory pointer for key ${key}.`);
      return;
    }

    if (targetBucket.keys.includes(key)) {
      setCaption(`Key ${key} already exists in bucket ${targetBucket.id}.`);
      return;
    }

    if (targetBucket.keys.length < 3) {
      // Bucket has space
      targetBucket.keys.push(key);
      setBuckets([...buckets]);
      setCaption(
        `Key ${key} hashed to bucket ${targetBucket.id} (Binary ${key.toString(2)}). Space available (Capacity 3).`
      );
    } else {
      // Bucket overflow! Check local depth vs global depth
      if (targetBucket.localDepth === globalDepth) {
        // Double directory
        const newD = globalDepth + 1;
        setGlobalDepth(newD);
        targetBucket.keys.push(key);
        setBuckets([...buckets]);
        setCaption(
          `BUCKET OVERFLOW in ${targetBucket.id}! Local depth d = ${targetBucket.localDepth} equals Global depth D. Directory doubled to D = ${newD} (Size ${Math.pow(2, newD)} entries)!`
        );
      } else {
        targetBucket.localDepth += 1;
        targetBucket.keys.push(key);
        setBuckets([...buckets]);
        setCaption(
          `BUCKET SPLIT! Local depth incremented to ${targetBucket.localDepth}. Directory does not double since local depth was strictly less than global depth D = ${globalDepth}.`
        );
      }
    }

    setInputVal('');
  };

  const resetHashing = () => {
    setGlobalDepth(2);
    setBuckets([
      { id: 'b0', localDepth: 2, keys: [4, 12] },
      { id: 'b1', localDepth: 2, keys: [5, 13] },
      { id: 'b2', localDepth: 2, keys: [6, 14] },
      { id: 'b3', localDepth: 2, keys: [7, 15] },
    ]);
    setCaption('Reset extendable hashing directory and buckets.');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Hashing Architecture:
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setMode('extendable')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'extendable'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Extendable Dynamic Hashing
            </button>
            <button
              onClick={() => setMode('static')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'static'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Static Hashing & Chaining
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Key to hash"
            className="w-24 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono bg-transparent"
          />
          <button
            onClick={handleInsert}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert Key</span>
          </button>
          <button
            onClick={resetHashing}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Caption banner */}
      <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs text-teal-950 dark:text-teal-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
        <span>{caption}</span>
      </div>

      {/* Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Directory (Left) */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Directory Table
            </span>
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Global Depth D = {globalDepth}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {Array.from({ length: Math.pow(2, globalDepth) }, (_, idx) => {
              const bin = idx.toString(2).padStart(globalDepth, '0');
              const targetBucket = buckets[idx % buckets.length];

              return (
                <div
                  key={idx}
                  className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between border border-slate-100 dark:border-slate-800"
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100">[{bin}]</span>
                  <span className="text-slate-500 text-[11px]">↳ Points to {targetBucket?.id}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buckets (Right 2 Cols) */}
        <div className="md:col-span-2 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Hash Buckets (Max 3 keys per bucket)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {buckets.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 font-mono"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold text-xs font-sans text-slate-900 dark:text-slate-100">
                    Bucket {b.id}
                  </span>
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                    Local Depth d = {b.localDepth}
                  </span>
                </div>

                <div className="flex gap-2">
                  {b.keys.map((k) => (
                    <span
                      key={k}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                    >
                      {k}
                    </span>
                  ))}
                  {b.keys.length === 0 && (
                    <span className="text-xs text-slate-400 italic">Empty bucket</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
