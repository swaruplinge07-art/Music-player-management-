import React from 'react';
import { Play, Pause, Flame, TrendingUp, Plus, Heart } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import type { Song } from '../types';

export const TopChartsShelf: React.FC = () => {
  const {
    topCharts,
    currentSong,
    isPlaying,
    playSong,
    enqueueSong,
    isFavorite,
    toggleFavorite,
    setDsaInspectorTab,
    setIsDsaInspectorOpen,
  } = useMusicPlayer();

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-amber-400 text-black border-amber-300 font-extrabold shadow-[0_0_10px_rgba(251,191,36,0.5)]';
      case 1:
        return 'bg-slate-300 text-black border-slate-200 font-bold';
      case 2:
        return 'bg-amber-700 text-amber-100 border-amber-600 font-bold';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700 font-semibold';
    }
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1DB954]" />
              Top Charts
            </h2>
            <span className="text-xs font-mono text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/30 px-2 py-0.5 rounded-full">
              Max-Heap Priority Queue
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Top 5 songs ranked dynamically by playCount. Heap root updates via sift-up when songs play.
          </p>
        </div>

        <button
          onClick={() => {
            setDsaInspectorTab('live');
            setIsDsaInspectorOpen(true);
          }}
          className="text-xs text-[#1DB954] hover:underline font-mono cursor-pointer"
        >
          View Heap Tree →
        </button>
      </div>

      {/* Grid of Top 5 Songs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {topCharts.map((song: Song, index: number) => {
          const isCurrentActive = currentSong?.id === song.id;

          return (
            <div
              key={song.id}
              className={`group relative bg-neutral-900/60 hover:bg-neutral-800/80 p-3.5 rounded-xl border transition-all duration-200 ${
                isCurrentActive
                  ? 'border-[#1DB954]/80 shadow-[0_0_15px_rgba(29,185,84,0.25)]'
                  : 'border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              {/* Rank Position Badge */}
              <div
                className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs border ${getRankBadge(
                  index
                )}`}
              >
                #{index + 1}
              </div>

              {/* Cover Art with Hover Play Button */}
              <div className="relative mb-3 aspect-square rounded-lg overflow-hidden bg-neutral-800 shadow-md">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => playSong(song)}
                    className="w-11 h-11 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    title="Play track"
                  >
                    {isCurrentActive && isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => enqueueSong(song)}
                    className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 hover:scale-110 transition-transform cursor-pointer"
                    title="Add to Up Next Queue"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Track Info */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-white truncate group-hover:text-[#1DB954] transition-colors">
                  {song.title}
                </h3>
                <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[11px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Flame className="w-3 h-3 fill-current" />
                    {song.playCount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => toggleFavorite(song)}
                    className="cursor-pointer"
                    title={isFavorite(song.id) ? 'Remove Favorite' : 'Add to Favorites'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        isFavorite(song.id)
                          ? 'fill-[#1DB954] text-[#1DB954]'
                          : 'text-neutral-500 hover:text-white'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
