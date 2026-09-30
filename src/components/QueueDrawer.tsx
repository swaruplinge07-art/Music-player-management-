import React from 'react';
import { X, Play, Trash2, ListMusic, ArrowDown, Zap } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import type { Song } from '../types';

export const QueueDrawer: React.FC = () => {
  const {
    isQueueDrawerOpen,
    setIsQueueDrawerOpen,
    upNextQueue,
    clearQueue,
    removeFromQueue,
    playSong,
    currentSong,
  } = useMusicPlayer();

  if (!isQueueDrawerOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-[#121212]/95 backdrop-blur-xl border-l border-neutral-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-[#1DB954]" />
          <div>
            <h3 className="font-bold text-white text-base">Up Next Queue</h3>
            <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/30 px-1.5 py-0.5 rounded">
              FIFO Buffer • O(1)
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsQueueDrawerOpen(false)}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Currently Playing Track Review */}
      {currentSong && (
        <div className="p-4 bg-neutral-900/60 border-b border-neutral-800/80">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
            Currently Playing
          </div>
          <div className="flex items-center gap-3">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-12 h-12 rounded object-cover shadow"
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[#1DB954] truncate">
                {currentSong.title}
              </div>
              <div className="text-xs text-neutral-400 truncate">{currentSong.artist}</div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
            <ArrowDown className="w-3.5 h-3.5 text-[#1DB954]" />
            FIFO Drainage Sequence ({upNextQueue.length})
          </span>
          {upNextQueue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-[11px] text-red-400 hover:underline font-mono cursor-pointer"
            >
              Clear Queue
            </button>
          )}
        </div>

        {upNextQueue.length > 0 ? (
          upNextQueue.map((song: Song, index: number) => {
            const isFront = index === 0;
            const isRear = index === upNextQueue.length - 1;

            return (
              <div
                key={`${song.id}-${index}`}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                  isFront
                    ? 'bg-emerald-950/40 border-[#1DB954]/50'
                    : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-[10px] text-neutral-500 w-4 text-center">
                      {index + 1}
                    </span>
                    {isFront && (
                      <span className="text-[8px] font-mono font-bold text-[#1DB954] bg-[#1DB954]/10 px-1 rounded">
                        FRONT
                      </span>
                    )}
                    {isRear && !isFront && (
                      <span className="text-[8px] font-mono text-neutral-400 bg-neutral-800 px-1 rounded">
                        REAR
                      </span>
                    )}
                  </div>

                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover shadow flex-shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate group-hover:text-[#1DB954]">
                      {song.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">{song.artist}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      removeFromQueue(song.id);
                      playSong(song);
                    }}
                    className="p-1.5 rounded-full bg-[#1DB954] text-black hover:scale-105 transition-transform cursor-pointer"
                    title="Play Now (Dequeues item)"
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </button>

                  <button
                    onClick={() => removeFromQueue(song.id)}
                    className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 px-4 border border-dashed border-neutral-800 rounded-xl">
            <ListMusic className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-medium">Your queue is empty</p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Click the <strong className="text-white">+</strong> icon on any song row to enqueue tracks in O(1) time.
            </p>
          </div>
        )}
      </div>

      {/* Educational Footer */}
      <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[#1DB954]">
          <Zap className="w-3 h-3" />
          Queue Enqueue/Dequeue: O(1)
        </span>
        <span>FIFO Principle</span>
      </div>
    </div>
  );
};
