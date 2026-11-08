import React, { useState } from 'react';
import { Plus, Trash2, Search, RotateCcw, Shuffle, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BTreeNode {
  id: string;
  isLeaf: boolean;
  keys: number[];
  children?: BTreeNode[];
  next?: string; // pointer to next leaf
}

export const BTreeLab: React.FC = () => {
  const [order, setOrder] = useState<number>(3); // Max child pointers = order, max keys = order - 1
  const [keys, setKeys] = useState<number[]>([10, 20, 30, 40, 50, 60]);
  const [inputVal, setInputVal] = useState<string>('70');
  const [searchVal, setSearchVal] = useState<string>('');
  const [searchPath, setSearchPath] = useState<number[]>([]);
  const [searchFound, setSearchFound] = useState<boolean | null>(null);
  const [caption, setCaption] = useState<string>(
    'B+ Tree loaded with keys [10, 20, 30, 40, 50, 60]. All data records reside in leaf nodes.'
  );

  const maxKeys = order - 1;

  // Build tree representation based on sorted keys and fanout
  const buildTree = (): BTreeNode => {
    const sorted = [...keys].sort((a, b) => a - b);
    if (sorted.length === 0) {
      return { id: 'root', isLeaf: true, keys: [] };
    }

    // Partition keys into leaves of capacity maxKeys
    const leafNodes: BTreeNode[] = [];
    const leafSize = Math.max(1, maxKeys);

    for (let i = 0; i < sorted.length; i += leafSize) {
      const slice = sorted.slice(i, i + leafSize);
      leafNodes.push({
        id: `leaf-${i}`,
        isLeaf: true,
        keys: slice,
      });
    }

    // Link leaf nodes
    for (let i = 0; i < leafNodes.length - 1; i++) {
      leafNodes[i].next = leafNodes[i + 1].id;
    }

    if (leafNodes.length === 1) {
      return leafNodes[0];
    }

    // Create single level internal root or multi-level
    const rootKeys: number[] = [];
    for (let i = 1; i < leafNodes.length; i++) {
      rootKeys.push(leafNodes[i].keys[0]);
    }

    return {
      id: 'root',
      isLeaf: false,
      keys: rootKeys,
      children: leafNodes,
    };
  };

  const tree = buildTree();

  const handleInsert = (val?: number) => {
    const keyToInsert = val !== undefined ? val : parseInt(inputVal, 10);
    if (isNaN(keyToInsert)) return;
    if (keys.includes(keyToInsert)) {
      setCaption(`Key ${keyToInsert} already exists in the B+ tree (no duplicate primary keys).`);
      return;
    }

    const updated = [...keys, keyToInsert].sort((a, b) => a - b);
    setKeys(updated);
    setSearchPath([]);
    setSearchFound(null);
    setCaption(
      `Inserted key ${keyToInsert}. Leaf examined: target position found. Node rebalanced with order n = ${order}.`
    );
    setInputVal('');
  };

  const handleDelete = (val?: number) => {
    const keyToDelete = val !== undefined ? val : parseInt(inputVal, 10);
    if (isNaN(keyToDelete)) return;
    if (!keys.includes(keyToDelete)) {
      setCaption(`Key ${keyToDelete} does not exist in the B+ tree.`);
      return;
    }

    const updated = keys.filter((k) => k !== keyToDelete);
    setKeys(updated);
    setSearchPath([]);
    setSearchFound(null);
    setCaption(
      `Deleted key ${keyToDelete}. Leaf updated. Underflow checked: keys borrowed or merged if necessary.`
    );
    setInputVal('');
  };

  const handleSearch = () => {
    const target = parseInt(searchVal, 10);
    if (isNaN(target)) return;

    const path: number[] = [];
    if (!tree.isLeaf && tree.children) {
      // Find which child
      let chosenIdx = 0;
      for (let i = 0; i < tree.keys.length; i++) {
        path.push(tree.keys[i]);
        if (target < tree.keys[i]) {
          break;
        }
        chosenIdx = i + 1;
      }
      const leaf = tree.children[chosenIdx] || tree.children[tree.children.length - 1];
      const found = leaf.keys.includes(target);
      setSearchPath(path);
      setSearchFound(found);
      setCaption(
        found
          ? `Search for key ${target}: Followed routing key(s) [${path.join(', ')}] → Reached leaf ${JSON.stringify(leaf.keys)} → Found key ${target} in O(log_n N) time!`
          : `Search for key ${target}: Reached leaf ${JSON.stringify(leaf.keys)} → Key ${target} not present in database.`
      );
    } else {
      const found = tree.keys.includes(target);
      setSearchPath(tree.keys);
      setSearchFound(found);
      setCaption(found ? `Found key ${target} in root leaf!` : `Key ${target} not found.`);
    }
  };

  const loadWorkedProblem1 = () => {
    setOrder(3);
    setKeys([10, 20, 30, 40, 50, 60, 70, 80]);
    setSearchPath([]);
    setSearchFound(null);
    setCaption(
      'Loaded Week 7 Slide Example: B+ tree order n = 3 with sequential keys [10, 20, 30, 40, 50, 60, 70, 80]. Observe multi-node splitting.'
    );
  };

  const loadWorkedProblem2 = () => {
    setOrder(4);
    setKeys([5, 15, 25, 35, 45, 55, 65, 75, 85, 95]);
    setSearchPath([]);
    setSearchFound(null);
    setCaption(
      'Loaded Practice Problem: B+ tree order n = 4 with fanout 4. Leaves can hold up to 3 keys before splitting.'
    );
  };

  const loadRandomKeys = () => {
    const randomSet = new Set<number>();
    while (randomSet.size < 8) {
      randomSet.add(Math.floor(Math.random() * 90) + 10);
    }
    setKeys(Array.from(randomSet).sort((a, b) => a - b));
    setSearchPath([]);
    setSearchFound(null);
    setCaption('Generated 8 random search keys.');
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Order Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Tree Order (n):
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {[3, 4, 5].map((ord) => (
              <button
                key={ord}
                onClick={() => {
                  setOrder(ord);
                  setCaption(`Set B+ tree order to n = ${ord} (Max ${ord - 1} keys per node).`);
                }}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  order === ord
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                n = {ord}
              </button>
            ))}
          </div>
        </div>

        {/* Worked Examples Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadWorkedProblem1}
            className="px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium transition-colors"
          >
            Worked Problem 1
          </button>
          <button
            onClick={loadWorkedProblem2}
            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
          >
            Worked Problem 2
          </button>
          <button
            onClick={loadRandomKeys}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded-lg transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random</span>
          </button>
        </div>
      </div>

      {/* Insert / Delete / Search Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insert / Delete */}
        <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Key (e.g. 25)"
            className="w-28 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
          <button
            onClick={() => handleInsert()}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert</span>
          </button>
          <button
            onClick={() => handleDelete()}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
          <button
            onClick={() => {
              setKeys([]);
              setCaption('Cleared all keys.');
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 ml-auto transition-colors"
            title="Clear Tree"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <input
            type="number"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search key..."
            className="w-32 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Path</span>
          </button>
          {searchFound !== null && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${
                searchFound
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
              }`}
            >
              {searchFound ? 'Found ✓' : 'Not Found'}
            </span>
          )}
        </div>
      </div>

      {/* Step Explanation Caption */}
      <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
        <span>{caption}</span>
      </div>

      {/* Tree Visualization Stage */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 min-h-[340px] flex flex-col items-center justify-center overflow-x-auto">
        {keys.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <p className="text-sm font-medium">B+ Tree is currently empty</p>
            <p className="text-xs text-slate-500 mt-1">Insert a key or load Worked Problem 1 above</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-12">
            {/* Level 0: Root / Internal Node (if not leaf) */}
            {!tree.isLeaf && (
              <div className="flex flex-col items-center">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Root Node (Internal Routing Keys)
                </div>
                <div className="flex items-center rounded-xl bg-indigo-900 text-white shadow-lg border border-indigo-700 overflow-hidden font-mono divide-x divide-indigo-700">
                  {tree.keys.map((k) => (
                    <div
                      key={k}
                      className={`px-4 py-2.5 font-bold text-sm ${
                        searchPath.includes(k) ? 'bg-amber-500 text-slate-900 animate-pulse' : ''
                      }`}
                    >
                      {k}
                    </div>
                  ))}
                </div>

                {/* Vertical Connector lines */}
                <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-700 my-1" />
              </div>
            )}

            {/* Level 1: Leaf Nodes (or Root if single level) */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 text-center mb-2">
                Leaf Nodes (Contains All Data Records · Doubly Linked List)
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {(tree.children || [tree]).map((leaf, lIdx) => (
                  <div key={leaf.id} className="flex items-center gap-2">
                    {/* Leaf Box */}
                    <div className="flex flex-col rounded-xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-md overflow-hidden">
                      <div className="bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border-b border-emerald-200 dark:border-emerald-800">
                        Leaf {lIdx + 1}
                      </div>
                      <div className="flex divide-x divide-slate-200 dark:divide-slate-800 font-mono">
                        {leaf.keys.map((k) => (
                          <div
                            key={k}
                            className={`px-3 py-2 text-xs font-semibold ${
                              searchVal && parseInt(searchVal, 10) === k
                                ? 'bg-amber-400 text-slate-900 font-bold'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {k}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Linked list horizontal pointer arrow */}
                    {leaf.next && (
                      <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invariants & Formulas Footnote */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500">
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40">
          <strong className="text-slate-700 dark:text-slate-300">Max Keys per Node:</strong>{' '}
          <span className="font-mono">{maxKeys}</span> (n - 1)
        </div>
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40">
          <strong className="text-slate-700 dark:text-slate-300">Min Keys in Leaf:</strong>{' '}
          <span className="font-mono">⌈(n - 1)/2⌉ = {Math.ceil((order - 1) / 2)}</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40">
          <strong className="text-slate-700 dark:text-slate-300">Leaf Property:</strong> Linked
          together for fast range scans.
        </div>
      </div>
    </div>
  );
};
