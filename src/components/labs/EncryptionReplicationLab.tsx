import React, { useState } from 'react';
import { Lock, Unlock, Server, HardDrive, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';

export const EncryptionReplicationLab: React.FC = () => {
  const [tab, setTab] = useState<'security' | 'replication'>('security');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(true);
  const [lagMs, setLagMs] = useState<number>(45);
  const [lastCommittedId, setLastCommittedId] = useState<number>(104);
  const [replicaId, setReplicaId] = useState<number>(104);

  const simulateNewWrite = () => {
    const nextId = lastCommittedId + 1;
    setLastCommittedId(nextId);
    // Simulate replication lag
    setTimeout(() => {
      setReplicaId(nextId);
    }, lagMs * 15);
  };

  const sampleRows = [
    { id: 101, name: 'Rahim Ahmed', salaryPlain: '$75,000', salaryEnc: 'U2FsdGVkX19x7...a84Z' },
    { id: 102, name: 'Fatima Zohra', salaryPlain: '$82,000', salaryEnc: 'U2FsdGVkX1+v9...q10B' },
    { id: 103, name: 'Tanvir Hasan', salaryPlain: '$68,000', salaryEnc: 'U2FsdGVkX1/b3...w42K' },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setTab('security')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              tab === 'security'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            1. Transparent Data Encryption (At-Rest)
          </button>
          <button
            onClick={() => setTab('replication')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              tab === 'replication'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            2. Primary-Replica Read Scaling Topology
          </button>
        </div>

        {tab === 'security' ? (
          <button
            onClick={() => setIsEncrypted(!isEncrypted)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          >
            {isEncrypted ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isEncrypted ? 'Decrypt Column View' : 'Encrypt Column (AES-256)'}</span>
          </button>
        ) : (
          <button
            onClick={simulateNewWrite}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <span>Execute INSERT on Primary</span>
          </button>
        )}
      </div>

      {tab === 'security' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Simulating Column-Level Transparent Data Encryption (TDE). Unauthorized storage access sees encrypted ciphertext only.
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">
                    Salary Column ({isEncrypted ? 'AES-256 Ciphertext' : 'Plaintext View'})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {sampleRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">{r.id}</td>
                    <td className="p-3 font-sans font-medium text-slate-900 dark:text-slate-100">
                      {r.name}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          isEncrypted
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 font-bold'
                            : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 font-semibold'
                        }`}
                      >
                        {isEncrypted ? r.salaryEnc : r.salaryPlain}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Primary Node */}
            <div className="p-6 rounded-2xl border-2 border-indigo-600 bg-white dark:bg-slate-900 shadow-md text-center space-y-2">
              <Server className="w-8 h-8 mx-auto text-indigo-600" />
              <div className="text-xs uppercase font-bold text-slate-400">Primary Node</div>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                Write Master (INSERT / UPDATE)
              </div>
              <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 pt-2">
                Latest LSN: #{lastCommittedId}
              </div>
            </div>

            {/* Asynchronous Link */}
            <div className="flex flex-col items-center justify-center gap-1 text-center font-mono text-xs text-slate-500">
              <div className="flex items-center gap-2 font-bold text-indigo-600">
                <span>Async WAL Sync</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-400">
                Simulated Lag: {lagMs} ms
              </span>
            </div>

            {/* Read Replica */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center space-y-2">
              <HardDrive className="w-8 h-8 mx-auto text-teal-600" />
              <div className="text-xs uppercase font-bold text-slate-400">Read Replica 1</div>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                Read-Only (SELECT Queries)
              </div>
              <div
                className={`text-xs font-mono font-bold pt-2 ${
                  replicaId === lastCommittedId
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-500 animate-pulse'
                }`}
              >
                {replicaId === lastCommittedId
                  ? `Synced to LSN: #${replicaId} ✓`
                  : `Syncing LSN #${replicaId}... (Eventual Consistency)`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
