import React, { useState } from 'react';
import {
  X,
  Binary,
  Layers,
  ListMusic,
  RotateCcw,
  TreePine,
  Hash,
  Network,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ArrowUpDown,
  Cpu
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { DSA_REFERENCE_GUIDE } from '../data/mockSongs';

export const DsaInspectorModal: React.FC = () => {
  const {
    isDsaInspectorOpen,
    setIsDsaInspectorOpen,
    dsaInspectorTab,
    setDsaInspectorTab,
    currentSong,
    playlistSongs,
    upNextQueue,
    undoStack,
    historyStack,
    dsaDll,
    dsaHashMap,
    dsaHeap,
    dsaTrie,
    dsaGraph,
    playSong,
  } = useMusicPlayer();

  const [trieInspectQuery, setTrieInspectQuery] = useState('bin');

  if (!isDsaInspectorOpen) return null;

  const dllNodes = dsaDll.getNodesInfo();
  const bucketMetrics = dsaHashMap.getBucketMetrics();
  const heapArray = dsaHeap.getRawArray();
  const trieVisualTree = dsaTrie.getVisualTree(trieInspectQuery);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-neutral-700/80 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 md:px-6 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954] rounded-xl shadow-[0_0_12px_rgba(29,185,84,0.2)]">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg tracking-tight">
                  DSA Live Inspector & Telemetry
                </h3>
                <span className="text-xs font-mono text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping" />
                  Reactive Engine
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Real-time visual state of all custom data structures powering this music player.
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => setDsaInspectorTab('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                dsaInspectorTab === 'live'
                  ? 'bg-[#1DB954] text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Live State (DLL, Queue, Stack, Heap)</span>
            </button>

            <button
              onClick={() => setDsaInspectorTab('trie')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                dsaInspectorTab === 'trie'
                  ? 'bg-[#1DB954] text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>Trie (Prefix Tree)</span>
            </button>

            <button
              onClick={() => setDsaInspectorTab('hashmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                dsaInspectorTab === 'hashmap'
                  ? 'bg-[#1DB954] text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Custom Hash Map</span>
            </button>

            <button
              onClick={() => setDsaInspectorTab('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                dsaInspectorTab === 'graph'
                  ? 'bg-[#1DB954] text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Graph Adjacency</span>
            </button>

            <button
              onClick={() => setDsaInspectorTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                dsaInspectorTab === 'guide'
                  ? 'bg-[#1DB954] text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Complexity Guide</span>
            </button>
          </div>

          <button
            onClick={() => setIsDsaInspectorOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-950">
          {/* TAB 1: LIVE STATE (DLL, Queue, Stack, Heap) */}
          {dsaInspectorTab === 'live' && (
            <div className="space-y-8">
              {/* 1. DOUBLY LINKED LIST VISUALIZER */}
              <div className="bg-[#181818] border border-neutral-800 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#1DB954]" />
                    <h4 className="text-base font-bold text-white">
                      Active Doubly Linked List (Playlist Navigation)
                    </h4>
                    <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/30 px-2 py-0.5 rounded">
                      O(1) Next / Prev Traversal
                    </span>
                  </div>
                  <div className="text-xs font-mono text-neutral-400">
                    Total Nodes: <span className="text-white font-bold">{dllNodes.length}</span> | Active ID:{' '}
                    <span className="text-[#1DB954] font-bold">{currentSong?.id}</span>
                  </div>
                </div>

                {/* Horizontal Scrollable Node Chain */}
                <div className="overflow-x-auto pb-4 pt-2">
                  <div className="flex items-center gap-3 min-w-max px-2">
                    {dllNodes.map((node, idx) => {
                      const isCurrent = node.id === currentSong?.id;

                      return (
                        <React.Fragment key={node.id}>
                          {/* Node Box */}
                          <div
                            onClick={() => playSong(node.data)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer w-48 text-left ${
                              isCurrent
                                ? 'bg-emerald-950/80 border-[#1DB954] shadow-[0_0_18px_rgba(29,185,84,0.4)] scale-105'
                                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-600'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                              <span className="text-neutral-500">[{idx}]</span>
                              {node.isHead && (
                                <span className="px-1.5 py-0.2 bg-blue-900/80 text-blue-200 border border-blue-700 rounded font-bold">
                                  HEAD
                                </span>
                              )}
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 bg-[#1DB954] text-black rounded font-extrabold flex items-center gap-0.5">
                                  CURRENT 🎵
                                </span>
                              )}
                              {node.isTail && (
                                <span className="px-1.5 py-0.2 bg-amber-900/80 text-amber-200 border border-amber-700 rounded font-bold">
                                  TAIL
                                </span>
                              )}
                            </div>

                            <div className="text-xs font-semibold text-white truncate">
                              {node.data.title}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate mb-2">
                              {node.data.artist}
                            </div>

                            {/* Pointer Inspection Metadata */}
                            <div className="border-t border-neutral-800 pt-1.5 text-[9px] font-mono text-neutral-400 space-y-0.5">
                              <div className="truncate">
                                prev: <span className="text-neutral-300">{node.prevId || 'null'}</span>
                              </div>
                              <div className="truncate">
                                next: <span className="text-neutral-300">{node.nextId || 'null'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Bidirectional Pointers Between Nodes */}
                          {idx < dllNodes.length - 1 && (
                            <div className="flex flex-col items-center justify-center text-[#1DB954] px-1">
                              <div className="flex items-center font-mono text-xs font-bold gap-0.5">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span className="text-[9px] text-neutral-500">pointers</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. QUEUE & STACKS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* UP NEXT QUEUE (FIFO) */}
                <div className="bg-[#181818] border border-neutral-800 rounded-2xl p-5 shadow-lg flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ListMusic className="w-4 h-4 text-[#1DB954]" />
                      <h4 className="text-sm font-bold text-white">Up Next (Queue)</h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded border border-[#1DB954]/30">
                      FIFO Buffer • O(1)
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 mb-3">
                    Tracks are dequeued from Front to Rear before resuming normal playlist.
                  </p>

                  <div className="flex-1 space-y-2 overflow-y-auto max-h-56 pr-1">
                    {upNextQueue.length > 0 ? (
                      upNextQueue.map((song, i) => (
                        <div
                          key={`q-${song.id}-${i}`}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                            i === 0
                              ? 'bg-emerald-950/60 border-[#1DB954]/60'
                              : 'bg-neutral-900 border-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-[10px] text-neutral-500">
                              {i === 0 ? 'FRONT' : i === upNextQueue.length - 1 ? 'REAR' : `#${i + 1}`}
                            </span>
                            <span className="text-white font-medium truncate">{song.title}</span>
                          </div>
                          <span className="font-mono text-[10px] text-neutral-400">{song.duration}s</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-neutral-600 font-mono text-xs border border-dashed border-neutral-800 rounded-lg">
                        Queue is empty (size = 0)
                      </div>
                    )}
                  </div>
                </div>

                {/* UNDO STACK (LIFO) */}
                <div className="bg-[#181818] border border-neutral-800 rounded-2xl p-5 shadow-lg flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">Undo Stack</h4>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      LIFO Actions • O(1)
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 mb-3">
                    Playlist mutations push inverse commands. Popping reinstates state.
                  </p>

                  <div className="flex-1 space-y-2 overflow-y-auto max-h-56 pr-1">
                    {undoStack.length > 0 ? (
                      undoStack.map((action, i) => (
                        <div
                          key={`undo-${i}`}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                            i === 0
                              ? 'bg-amber-950/60 border-amber-500/60'
                              : 'bg-neutral-900 border-neutral-800'
                          }`}
                        >
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              {i === 0 && (
                                <span className="font-mono text-[9px] bg-amber-500 text-black px-1 rounded font-bold">
                                  TOP
                                </span>
                              )}
                              <span className="text-white font-medium truncate">
                                {action.description}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-neutral-500">
                              {action.type}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-neutral-600 font-mono text-xs border border-dashed border-neutral-800 rounded-lg">
                        Stack is empty (size = 0)
                      </div>
                    )}
                  </div>
                </div>

                {/* PLAYBACK HISTORY STACK (LIFO) */}
                <div className="bg-[#181818] border border-neutral-800 rounded-2xl p-5 shadow-lg flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-bold text-white">Playback History Stack</h4>
                    </div>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      LIFO Traversal • O(1)
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 mb-3">
                    Previously played songs pushed chronologically to enable back-tracking.
                  </p>

                  <div className="flex-1 space-y-2 overflow-y-auto max-h-56 pr-1">
                    {historyStack.length > 0 ? (
                      historyStack.map((song, i) => (
                        <div
                          key={`hist-${song.id}-${i}`}
                          className="p-2 rounded-lg border border-neutral-800 bg-neutral-900 text-xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 truncate">
                            {i === 0 && (
                              <span className="font-mono text-[9px] bg-purple-500 text-black px-1 rounded font-bold">
                                TOP
                              </span>
                            )}
                            <span className="text-white truncate">{song.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500">{song.artist}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-neutral-600 font-mono text-xs border border-dashed border-neutral-800 rounded-lg">
                        History stack empty (size = 0)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. MAX-HEAP PRIORITY QUEUE INSPECTOR */}
              <div className="bg-[#181818] border border-neutral-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-5 h-5 text-amber-400" />
                    <h4 className="text-base font-bold text-white">
                      Max-Heap Priority Queue (Top Charts Engine)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    O(log N) Sift-Up / Sift-Down
                  </span>
                </div>

                <p className="text-xs text-neutral-400 mb-4">
                  Binary heap array where parent index <code>⌊(i - 1) / 2⌋</code> preserves the invariant <code>parent.playCount ≥ child.playCount</code>. Root node at index 0 always has highest play count.
                </p>

                {/* Heap Array Indices Visualizer */}
                <div className="overflow-x-auto pb-2">
                  <div className="flex items-center gap-2 min-w-max">
                    {heapArray.map((song, idx) => {
                      const isRoot = idx === 0;

                      return (
                        <div
                          key={`heap-${song.id}`}
                          className={`p-2.5 rounded-xl border text-center w-36 ${
                            isRoot
                              ? 'bg-amber-950/80 border-amber-400 text-amber-200'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                          }`}
                        >
                          <div className="text-[9px] font-mono text-neutral-500 mb-1 flex items-center justify-between">
                            <span>[{idx}]</span>
                            {isRoot && <span className="font-bold text-amber-400">ROOT</span>}
                            <span>P: {idx > 0 ? Math.floor((idx - 1) / 2) : '-'}</span>
                          </div>
                          <div className="text-xs font-semibold text-white truncate">{song.title}</div>
                          <div className="text-[11px] font-mono text-emerald-400 mt-1">
                            {song.playCount.toLocaleString()} plays
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRIE PREFIX TREE */}
          {dsaInspectorTab === 'trie' && (
            <div className="space-y-6">
              <div className="bg-[#181818] border border-neutral-800 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <TreePine className="w-5 h-5 text-[#1DB954]" />
                      Trie Prefix Search Tree Visualizer
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Search scales in strictly <span className="text-[#1DB954] font-mono">O(k)</span> time where k is prefix length, independent of library size.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-400">Test Prefix:</span>
                    <input
                      type="text"
                      value={trieInspectQuery}
                      onChange={(e) => setTrieInspectQuery(e.target.value)}
                      placeholder="Type prefix..."
                      className="bg-neutral-900 border border-neutral-700 px-3 py-1 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>

                {/* Interactive Trie Tree Representation */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 overflow-x-auto font-mono text-xs">
                  <div className="text-neutral-400 text-xs mb-3">
                    Active Query: <strong className="text-[#1DB954]">"{trieInspectQuery}"</strong> • Query Time:{' '}
                    <span className="text-emerald-400">
                      {dsaTrie.query(trieInspectQuery).lookupTimeMs} ms
                    </span>
                  </div>

                  {/* Render Visual Tree Branches */}
                  <div className="p-3 bg-neutral-900/60 rounded-lg">
                    <div className="text-neutral-400 font-bold mb-2">Trie Root Node</div>
                    {trieVisualTree && (
                      <div className="space-y-2 pl-4 border-l border-neutral-800">
                        {trieVisualTree.children.map((child: any, idx: number) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center font-bold text-[#1DB954]">
                                {child.char}
                              </span>
                              <span className="text-neutral-400">path: "{child.path}"</span>
                              {child.isEndOfWord && (
                                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">
                                  isEndOfWord ({child.songCount} songs)
                                </span>
                              )}
                            </div>

                            {/* Grandchildren */}
                            {child.children.length > 0 && (
                              <div className="pl-6 space-y-1 border-l border-neutral-800/80 my-1">
                                {child.children.map((gChild: any, gIdx: number) => (
                                  <div key={gIdx} className="flex items-center gap-2 text-xs">
                                    <span className="w-5 h-5 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
                                      {gChild.char}
                                    </span>
                                    <span className="text-neutral-500">"{gChild.path}"</span>
                                    {gChild.isEndOfWord && (
                                      <span className="text-[10px] text-emerald-400">
                                        matches ({gChild.songCount} songs)
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Matched Songs via Trie DFS */}
                  <div className="mt-4 pt-3 border-t border-neutral-800">
                    <div className="text-xs text-neutral-300 font-semibold mb-2">
                      Matching Songs collected via DFS:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {dsaTrie.query(trieInspectQuery).songs.map((s) => (
                        <div
                          key={s.id}
                          className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between text-xs"
                        >
                          <span className="text-white font-medium">{s.title}</span>
                          <span className="text-neutral-500">{s.artist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM HASH MAP */}
          {dsaInspectorTab === 'hashmap' && (
            <div className="space-y-6">
              <div className="bg-[#181818] border border-neutral-800 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Hash className="w-5 h-5 text-[#1DB954]" />
                      Custom Hash Map Inspector (Favorites & Lookup)
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Separate chaining collision resolution with polynomial rolling hash (djb2).
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                    <div>
                      Capacity: <span className="text-white font-bold">{bucketMetrics.capacity}</span>
                    </div>
                    <div>
                      Size: <span className="text-[#1DB954] font-bold">{bucketMetrics.size}</span>
                    </div>
                    <div>
                      Load Factor:{' '}
                      <span className="text-amber-400 font-bold">{bucketMetrics.loadFactor}</span>
                    </div>
                    <div>
                      Collisions:{' '}
                      <span className="text-cyan-400 font-bold">{bucketMetrics.collisionCount}</span>
                    </div>
                  </div>
                </div>

                {/* Hash Buckets Table */}
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {bucketMetrics.buckets.map((b) => {
                      const hasEntries = b.chainLength > 0;
                      const hasCollision = b.chainLength > 1;

                      return (
                        <div
                          key={`b-${b.index}`}
                          className={`p-2.5 rounded-xl border font-mono text-xs ${
                            hasCollision
                              ? 'bg-purple-950/60 border-purple-500/60 text-purple-200'
                              : hasEntries
                              ? 'bg-emerald-950/60 border-[#1DB954]/60 text-emerald-200'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span>Bucket [{b.index}]</span>
                            <span className="font-bold">len: {b.chainLength}</span>
                          </div>
                          <div className="space-y-0.5 text-[10px]">
                            {b.keys.length > 0 ? (
                              b.keys.map((k) => (
                                <div key={k} className="text-white truncate bg-black/40 px-1 py-0.5 rounded">
                                  "{k}"
                                </div>
                              ))
                            ) : (
                              <div className="text-neutral-600">empty</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GRAPH ADJACENCY */}
          {dsaInspectorTab === 'graph' && (
            <div className="space-y-6">
              <div className="bg-[#181818] border border-neutral-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Network className="w-5 h-5 text-cyan-400" />
                      Music Similarity Graph Adjacency List
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Adjacency List where each vertex maps to neighbors with edge weights (Genre: 3, BPM: 2, Era: 1).
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    BFS Search • O(V + E)
                  </span>
                </div>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  {playlistSongs.map((song) => {
                    const recs = dsaGraph.bfs(song.id, 2);

                    return (
                      <div
                        key={`adj-${song.id}`}
                        className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono"
                      >
                        <div className="flex items-center justify-between text-white font-semibold mb-2">
                          <span className="text-[#1DB954]">
                            Vertex: {song.title} ({song.genre}, {song.tempo} BPM)
                          </span>
                          <span className="text-neutral-400 text-[10px]">
                            Connected Neighbors: {recs.length}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {recs.slice(0, 5).map((r, i) => (
                            <span
                              key={i}
                              className={`px-2 py-1 rounded text-[10px] border ${
                                r.depth === 1
                                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                                  : 'bg-purple-950 text-purple-300 border-purple-800'
                              }`}
                            >
                              {r.song.title} (Depth {r.depth})
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DSA REFERENCE GUIDE */}
          {dsaInspectorTab === 'guide' && (
            <div className="space-y-6">
              <div className="bg-[#181818] border border-neutral-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-400" />
                      DSA Architectural Reference Guide & Complexity Matrix
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Cheat sheet mapping Rhythm Box player features to custom data structures, asymptotic complexities, and real-world system rationale.
                    </p>
                  </div>
                </div>

                {/* Complexity Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono text-neutral-300">
                    <thead className="text-[11px] uppercase tracking-wider text-neutral-500 bg-neutral-900/80 border-b border-neutral-800">
                      <tr>
                        <th className="py-3 px-3">Feature</th>
                        <th className="py-3 px-3">Data Structure</th>
                        <th className="py-3 px-3 text-[#1DB954]">Time Complexity</th>
                        <th className="py-3 px-3 text-cyan-400">Space</th>
                        <th className="py-3 px-3">Key Operations</th>
                        <th className="py-3 px-3">Engineering Rationale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/40">
                      {DSA_REFERENCE_GUIDE.map((row, idx) => (
                        <tr key={idx} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3 px-3 font-semibold text-white">{row.feature}</td>
                          <td className="py-3 px-3 text-amber-300">{row.dataStructure}</td>
                          <td className="py-3 px-3 font-bold text-[#1DB954]">{row.timeComplexity}</td>
                          <td className="py-3 px-3 text-cyan-300">{row.spaceComplexity}</td>
                          <td className="py-3 px-3 text-neutral-400 text-[11px]">{row.operations}</td>
                          <td className="py-3 px-3 text-neutral-300 text-[11px] leading-relaxed">
                            {row.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
