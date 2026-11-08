import React, { useState } from 'react';
import { HardDrive, AlertTriangle, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';

type RaidLevel = '0' | '1' | '5';

export const RaidLab: React.FC = () => {
  const [level, setLevel] = useState<RaidLevel>('5');
  const [failedDisk, setFailedDisk] = useState<number | null>(null);

  const toggleDiskFail = (diskIdx: number) => {
    if (failedDisk === diskIdx) {
      setFailedDisk(null);
    } else {
      setFailedDisk(diskIdx);
    }
  };

  // Disk layout for 4 disks
  const getDiskLayout = () => {
    if (level === '0') {
      return [
        { name: 'Disk 0', blocks: ['Block 0', 'Block 4', 'Block 8'] },
        { name: 'Disk 1', blocks: ['Block 1', 'Block 5', 'Block 9'] },
        { name: 'Disk 2', blocks: ['Block 2', 'Block 6', 'Block 10'] },
        { name: 'Disk 3', blocks: ['Block 3', 'Block 7', 'Block 11'] },
      ];
    } else if (level === '1') {
      return [
        { name: 'Disk 0 (Primary)', blocks: ['Block 0', 'Block 1', 'Block 2'] },
        { name: 'Disk 1 (Mirror 0)', blocks: ['Block 0', 'Block 1', 'Block 2'] },
        { name: 'Disk 2 (Primary)', blocks: ['Block 3', 'Block 4', 'Block 5'] },
        { name: 'Disk 3 (Mirror 2)', blocks: ['Block 3', 'Block 4', 'Block 5'] },
      ];
    } else {
      // RAID 5 with distributed parity across 4 disks
      return [
        { name: 'Disk 0', blocks: ['D0', 'D3', 'D6', 'P(9..11)'] },
        { name: 'Disk 1', blocks: ['D1', 'D4', 'P(6..8)', 'D9'] },
        { name: 'Disk 2', blocks: ['D2', 'P(3..5)', 'D7', 'D10'] },
        { name: 'Disk 3', blocks: ['P(0..2)', 'D5', 'D8', 'D11'] },
      ];
    }
  };

  const disks = getDiskLayout();

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            RAID Architecture:
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {(['0', '1', '5'] as RaidLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setLevel(lvl);
                  setFailedDisk(null);
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  level === lvl
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                RAID {lvl}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setFailedDisk(null)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore All Disks</span>
        </button>
      </div>

      {/* Status Alert Banner */}
      {failedDisk !== null ? (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            level === '0'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-200'
          }`}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm">
              Disk {failedDisk} Failed!
            </div>
            <div className="text-xs mt-1 leading-relaxed">
              {level === '0' && (
                <span>
                  <strong>CATASTROPHIC DATA LOSS:</strong> RAID 0 has zero parity. Losing Disk {failedDisk} destroys 25% of all striped file blocks permanently.
                </span>
              )}
              {level === '1' && (
                <span>
                  <strong>OPERATIONAL (Tolerated):</strong> Mirrored disk pair maintains an exact replica. No data is lost.
                </span>
              )}
              {level === '5' && (
                <span>
                  <strong>DATA RECONSTRUCTION VIA XOR:</strong> Missing block values on Disk {failedDisk} are reconstructed on-the-fly via bitwise XOR of the remaining 3 disks (<code className="font-mono">D_missing = D_surviving_1 ⊕ D_surviving_2 ⊕ Parity</code>).
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>All 4 disks are healthy and operational. Click on any disk below to simulate hardware failure.</span>
          </div>
        </div>
      )}

      {/* Disks Array Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {disks.map((d, idx) => {
          const isDead = failedDisk === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border p-4 shadow-sm transition-all flex flex-col justify-between ${
                isDead
                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 ring-2 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <HardDrive
                      className={`w-5 h-5 ${isDead ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}
                    />
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {d.name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isDead
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {isDead ? 'OFFLINE' : 'ONLINE'}
                  </span>
                </div>

                {/* Blocks */}
                <div className="space-y-1.5 font-mono text-xs">
                  {d.blocks.map((blk, bIdx) => (
                    <div
                      key={bIdx}
                      className={`p-2 rounded text-center border font-semibold ${
                        isDead
                          ? 'border-rose-200 bg-rose-100/50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 line-through'
                          : blk.startsWith('P')
                          ? 'border-violet-200 bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                          : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {blk}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toggleDiskFail(idx)}
                className={`mt-4 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isDead
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60'
                }`}
              >
                {isDead ? 'Replace / Rebuild Disk' : 'Simulate Disk Crash'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-slate-400">Storage Efficiency</div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
            {level === '0' ? '100% (4 Disks)' : level === '1' ? '50% (2 Disks)' : '75% ((N-1)/N)'}
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-slate-400">Fault Tolerance</div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {level === '0' ? '0 Disks' : level === '1' ? '1 Disk per pair' : '1 Disk'}
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-slate-400">Read Throughput</div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {level === '0' ? 'Very High (4x)' : level === '1' ? 'High (2x)' : 'High (3x)'}
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-slate-400">Write Penalty</div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {level === '0' ? 'None' : level === '1' ? '2x Writes' : '4 I/O Reads & Writes (Parity)'}
          </div>
        </div>
      </div>
    </div>
  );
};
