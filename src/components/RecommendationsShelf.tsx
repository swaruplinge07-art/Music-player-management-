import React from 'react';
import { Network, Play, Plus, Compass, GitBranch, ArrowRight } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import type { BfsRecommendation } from '../types';

export const RecommendationsShelf: React.FC = () => {
  const {
    recommendedSongs,
    currentSong,
    playSong,
    enqueueSong,
    setIsGraphModalOpen,
  } = useMusicPlayer();

  if (recommendedSongs.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Recommended For You
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              Graph BFS (Depth ≤ 2)
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Traversed from <span className="text-white font-medium">"{currentSong?.title}"</span> via weighted similarity edges (Genre, Tempo BPM, Era).
          </p>
        </div>

        <button
          onClick={() => setIsGraphModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-cyan-300 hover:text-cyan-200 text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Network className="w-4 h-4 text-cyan-400" />
          <span>Show Song Relationship Graph</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recommended Track Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendedSongs.slice(0, 4).map((rec: BfsRecommendation) => {
          const { song, depth, reasons, score } = rec;

          return (
            <div
              key={song.id}
              className="group bg-neutral-900/60 hover:bg-neutral-800/80 p-3.5 rounded-xl border border-neutral-800/80 hover:border-neutral-700 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* BFS Depth Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      depth === 1
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                        : 'bg-purple-950/80 text-purple-300 border-purple-800'
                    }`}
                  >
                    {depth === 1 ? 'Direct Neighbor (1-Hop)' : '2-Hop Neighbor'}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Weight: {score}
                  </span>
                </div>

                {/* Cover and Play button */}
                <div className="relative mb-3 aspect-video rounded-lg overflow-hidden bg-neutral-800 shadow">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => playSong(song)}
                      className="w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      title="Play song"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                    <button
                      onClick={() => enqueueSong(song)}
                      className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 hover:scale-110 transition-transform cursor-pointer"
                      title="Add to Up Next"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Track Details */}
                <h3 className="font-semibold text-sm text-white truncate group-hover:text-[#1DB954] transition-colors">
                  {song.title}
                </h3>
                <p className="text-xs text-neutral-400 truncate mb-2">{song.artist}</p>
              </div>

              {/* Edge connection reasons tag */}
              <div className="mt-2 pt-2 border-t border-neutral-800/80">
                <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 flex-wrap">
                  <span className="text-neutral-500">Connected by:</span>
                  <span className="bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                    {reasons[0] || song.genre}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
