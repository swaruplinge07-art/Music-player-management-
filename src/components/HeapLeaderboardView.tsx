import React from 'react';
import { TrendingUp, Play, Flame, ArrowUpDown, Award } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import type { Song } from '../types';

export const HeapLeaderboardView: React.FC = () => {
  const { topCharts, playSong, dsaHeap } = useMusicPlayer();
  const rawHeapArray = dsaHeap.getRawArray();

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'from-amber-500/20 to-yellow-600/10 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
      case 1:
        return 'from-slate-400/20 to-neutral-600/10 border-slate-300 text-slate-200';
      case 2:
        return 'from-amber-700/20 to-orange-900/10 border-amber-600 text-amber-300';
      default:
        return 'from-neutral-900 to-black border-neutral-800 text-neutral-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#12161F] border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-950/80 border border-amber-700 text-amber-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Max-Heap Priority Queue Leaderboard
              </h2>
              <span className="text-xs font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                O(log N) Insert & Extract
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Maintains the binary heap invariant: <code>parent.playCount ≥ child.playCount</code>. Root node at index 0 always holds the #1 globally played track.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-neutral-400 bg-black/40 px-3 py-2 rounded-xl border border-neutral-800">
          Root Value:{' '}
          <strong className="text-amber-400">
            {rawHeapArray[0]?.playCount.toLocaleString() ?? 0} plays
          </strong>
        </div>
      </div>

      {/* Top 5 Podium Cards */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Top 5 Leaderboard (Heap Root to Top 5 Extracted)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {topCharts.map((song: Song, index: number) => (
            <div
              key={song.id}
              className={`p-4 rounded-2xl border bg-gradient-to-b flex flex-col justify-between group transition-all hover:scale-102 ${getRankStyle(
                index
              )}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center font-mono font-extrabold text-sm text-white">
                    #{index + 1}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-amber-400 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    {song.playCount.toLocaleString()}
                  </span>
                </div>

                <div className="aspect-square rounded-xl overflow-hidden mb-3 relative bg-neutral-950 shadow">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() => playSong(song)}
                    className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                </div>

                <h4 className="font-bold text-sm text-white truncate group-hover:text-[#1DB954] transition-colors">
                  {song.title}
                </h4>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{song.artist}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                <span>{song.genre}</span>
                <span>{song.tempo} BPM</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heap Memory Layout & Parent-Child Arithmetic */}
      <div className="bg-[#12161F] border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#1DB954]" />
            Sequential Memory Array Layout (Index Arithmetic)
          </h3>
          <span className="text-[10px] font-mono text-neutral-400">
            Parent: ⌊(i - 1) / 2⌋ | Left Child: 2i + 1 | Right Child: 2i + 2
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-2.5 min-w-max">
            {rawHeapArray.map((song, i) => {
              const isRoot = i === 0;

              return (
                <div
                  key={`heap-mem-${song.id}`}
                  className={`p-3 rounded-xl border text-center w-40 ${
                    isRoot
                      ? 'bg-amber-950/70 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-black/50 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                    <span className="font-bold text-white">Index [{i}]</span>
                    {isRoot ? (
                      <span className="bg-amber-400 text-black px-1 rounded font-extrabold text-[9px]">
                        ROOT
                      </span>
                    ) : (
                      <span>P: {Math.floor((i - 1) / 2)}</span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-white truncate">{song.title}</div>
                  <div className="text-[11px] font-mono text-emerald-400 font-bold mt-1">
                    {song.playCount.toLocaleString()} plays
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
