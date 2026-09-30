import React from 'react';
import {
  Play,
  Pause,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Heart
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const HeroBanner: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    applySort,
    undoLastAction,
    undoStack,
    sortMetrics,
    currentSort,
    isFavorite,
    toggleFavorite,
    dsaDll,
  } = useMusicPlayer();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const featured = currentSong || dsaDll.head?.data;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-900/60 via-neutral-900/80 to-[#121212] border border-neutral-800 p-6 md:p-8 mb-8 shadow-2xl">
      {/* Background ambient radial glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#1DB954]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RHYTHM BOX • DSA MUSIC LABORATORY</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()}, Engineer
            </h1>
          </div>

          {/* Undo Action Button */}
          {undoStack.length > 0 && (
            <button
              onClick={undoLastAction}
              className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-semibold shadow-lg transition-all hover:scale-105 cursor-pointer"
              title="Undo last playlist mutation (Pop from LIFO Undo Stack)"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Undo Last Action</span>
              <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-[10px]">
                Stack: {undoStack.length}
              </span>
            </button>
          )}
        </div>

        {/* Featured Content & Algorithm Triggers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left 2 Cols: Featured Track Card */}
          {featured && (
            <div className="lg:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-4 backdrop-blur-sm">
              <div className="relative group flex-shrink-0">
                <img
                  src={featured.coverUrl}
                  alt={featured.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-2xl group-hover:scale-102 transition-transform"
                />
                <button
                  onClick={togglePlayPause}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl opacity-90 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] mb-1">
                  <span className="px-2 py-0.5 bg-[#1DB954]/15 rounded-md border border-[#1DB954]/30">
                    Active DoublyLinkedList Node
                  </span>
                  <span className="text-neutral-400">• {featured.tempo} BPM</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                  {featured.title}
                </h2>
                <p className="text-sm text-neutral-300 truncate mb-2">
                  {featured.artist} • <span className="text-neutral-400">{featured.album}</span>
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                  <span className="font-mono bg-neutral-800 px-2 py-1 rounded">
                    Plays: {featured.playCount.toLocaleString()}
                  </span>
                  <span className="font-mono bg-neutral-800 px-2 py-1 rounded">
                    Genre: {featured.genre}
                  </span>
                  <button
                    onClick={() => toggleFavorite(featured)}
                    className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite(featured.id)
                          ? 'fill-[#1DB954] text-[#1DB954]'
                          : 'text-neutral-400'
                      }`}
                    />
                    <span>{isFavorite(featured.id) ? 'Favorited' : 'Favorite'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right Col: Instant Sorting Algorithms Box */}
          <div className="bg-black/50 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                <span className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#1DB954]" />
                  Sorting Benchmarks
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  O(N log N)
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                Execute in-memory sorting algorithms without native array shortcuts.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => applySort('quicksort')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentSort === 'quicksort'
                    ? 'bg-[#1DB954] text-black font-bold shadow-[0_0_12px_rgba(29,185,84,0.4)]'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                }`}
              >
                <span>QuickSort (Title A-Z)</span>
                <span className="font-mono text-[10px] opacity-80">Partitioning</span>
              </button>

              <button
                onClick={() => applySort('mergesort')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentSort === 'mergesort'
                    ? 'bg-[#1DB954] text-black font-bold shadow-[0_0_12px_rgba(29,185,84,0.4)]'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                }`}
              >
                <span>MergeSort (Duration)</span>
                <span className="font-mono text-[10px] opacity-80">Divide & Merge</span>
              </button>

              {currentSort !== 'default' && (
                <button
                  onClick={() => applySort('default')}
                  className="w-full text-center py-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Reset Original Sequence
                </button>
              )}
            </div>

            {/* Live sort badge if applied */}
            {sortMetrics && (
              <div className="mt-3 pt-3 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                <span className="text-[#1DB954]">{sortMetrics.comparisons} comparisons</span>
                <span>{sortMetrics.executionTimeMs} ms</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
