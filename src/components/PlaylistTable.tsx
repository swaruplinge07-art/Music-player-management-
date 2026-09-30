import React from 'react';
import {
  Play,
  Pause,
  Heart,
  Plus,
  Trash2,
  Clock3,
  ArrowUpDown,
  RotateCcw,
  Layers,
  Upload
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import type { Song, SortAlgorithm } from '../types';

export const PlaylistTable: React.FC = () => {
  const {
    playlistSongs,
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
    enqueueSong,
    isFavorite,
    toggleFavorite,
    deleteSongFromPlaylist,
    applySort,
    currentSort,
    sortMetrics,
    undoStack,
    undoLastAction,
    insertCustomAudioTrack,
  } = useMusicPlayer();

  const tableFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleTableAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await insertCustomAudioTrack(file);
      if (tableFileInputRef.current) {
        tableFileInputRef.current.value = '';
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#181818]/60 border border-neutral-800/80 rounded-2xl p-5 mb-12 shadow-xl backdrop-blur-sm">
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1DB954]" />
            Playlist Traversal Table
          </h2>
          <span className="text-xs text-neutral-400">
            Backed by <span className="text-[#1DB954] font-mono">DoublyLinkedList</span> nodes with bidirectional pointers.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Insert Audio Track Button */}
          <input
            ref={tableFileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleTableAudioUpload}
            className="hidden"
            id="table-audio-input"
          />
          <button
            onClick={() => tableFileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1DB954]/15 hover:bg-[#1DB954]/25 border border-[#1DB954]/40 hover:border-[#1DB954] text-[#1DB954] rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Upload and insert a local audio track into DoublyLinkedList, Trie, HashMap, Heap, and Graph"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Insert Track</span>
          </button>

          {/* Undo Action Button */}
          {undoStack.length > 0 && (
            <button
              onClick={undoLastAction}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              title="Undo last playlist mutation (Pop from LIFO Undo Stack)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo Last Action</span>
              <span className="font-mono bg-amber-500/20 px-1 py-0.5 rounded text-[10px]">
                {undoStack.length}
              </span>
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-700/80">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs text-neutral-400 font-mono">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => applySort(e.target.value as SortAlgorithm)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="default" className="bg-neutral-900 text-white">Default DLL Order</option>
              <option value="quicksort" className="bg-neutral-900 text-white">QuickSort (Title A-Z)</option>
              <option value="mergesort" className="bg-neutral-900 text-white">MergeSort (Duration)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Algorithm Execution Badge */}
      {sortMetrics && (
        <div className="mb-4 p-3 bg-neutral-900/90 border border-emerald-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
            <span className="text-white font-semibold">{sortMetrics.algorithm}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              {sortMetrics.timeComplexity}
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>
              Comparisons: <strong className="text-white">{sortMetrics.comparisons}</strong>
            </span>
            <span>
              Swaps/Merges: <strong className="text-white">{sortMetrics.swapsOrMerges}</strong>
            </span>
            <span>
              Elapsed: <strong className="text-[#1DB954]">{sortMetrics.executionTimeMs} ms</strong>
            </span>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800">
            <tr>
              <th className="py-3 px-3 w-12 text-center">#</th>
              <th className="py-3 px-3">Title</th>
              <th className="py-3 px-3 hidden md:table-cell">Artist</th>
              <th className="py-3 px-3 hidden lg:table-cell">Album</th>
              <th className="py-3 px-3 hidden sm:table-cell text-right">Plays</th>
              <th className="py-3 px-3 text-right">
                <Clock3 className="w-4 h-4 ml-auto" />
              </th>
              <th className="py-3 px-3 text-center w-36">Actions (DSA)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/40">
            {playlistSongs.map((song: Song, index: number) => {
              const isCurrentActive = currentSong?.id === song.id;

              return (
                <tr
                  key={song.id}
                  className={`group transition-colors ${
                    isCurrentActive
                      ? 'bg-neutral-800/80 text-white'
                      : 'hover:bg-neutral-800/40 text-neutral-300'
                  }`}
                >
                  {/* # / Active Play Indicator */}
                  <td className="py-3 px-3 text-center font-mono text-xs">
                    {isCurrentActive ? (
                      <div className="flex items-center justify-center gap-0.5 h-4">
                        {isPlaying ? (
                          <>
                            <span className="w-1 bg-[#1DB954] h-3 animate-pulse rounded-full" />
                            <span className="w-1 bg-[#1DB954] h-4 animate-bounce rounded-full" />
                            <span className="w-1 bg-[#1DB954] h-2 animate-pulse rounded-full" />
                          </>
                        ) : (
                          <span className="text-[#1DB954] font-bold">▶</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-neutral-500 group-hover:hidden">
                        {index + 1}
                      </span>
                    )}
                    <button
                      onClick={() => (isCurrentActive ? togglePlayPause() : playSong(song))}
                      className="hidden group-hover:flex items-center justify-center text-white hover:text-[#1DB954] mx-auto cursor-pointer"
                      title={isCurrentActive && isPlaying ? 'Pause' : 'Play'}
                    >
                      {isCurrentActive && isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </td>

                  {/* Title & Thumbnail */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover shadow flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div
                          className={`font-semibold truncate cursor-pointer hover:underline ${
                            isCurrentActive ? 'text-[#1DB954]' : 'text-white'
                          }`}
                          onClick={() => playSong(song)}
                        >
                          {song.title}
                        </div>
                        <div className="text-xs text-neutral-400 truncate md:hidden">
                          {song.artist}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Artist */}
                  <td className="py-3 px-3 hidden md:table-cell text-neutral-300 truncate">
                    {song.artist}
                  </td>

                  {/* Album */}
                  <td className="py-3 px-3 hidden lg:table-cell text-neutral-400 truncate">
                    {song.album}
                  </td>

                  {/* Plays */}
                  <td className="py-3 px-3 hidden sm:table-cell text-right font-mono text-xs text-neutral-400">
                    {song.playCount.toLocaleString()}
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-3 text-right font-mono text-xs text-neutral-400">
                    {formatDuration(song.duration)}
                  </td>

                  {/* Actions Column */}
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-center gap-2">
                      {/* Play/Pause */}
                      <button
                        onClick={() => (isCurrentActive ? togglePlayPause() : playSong(song))}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                          isCurrentActive
                            ? 'bg-[#1DB954] text-black shadow'
                            : 'hover:bg-neutral-700 text-neutral-400 hover:text-white'
                        }`}
                        title={isCurrentActive && isPlaying ? 'Pause' : 'Play'}
                      >
                        {isCurrentActive && isPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Favorite (Hash Map O(1)) */}
                      <button
                        onClick={() => toggleFavorite(song)}
                        className="p-1.5 rounded-full hover:bg-neutral-700 transition-colors cursor-pointer"
                        title={
                          isFavorite(song.id)
                            ? 'Remove from Favorites (CustomHashMap.remove O(1))'
                            : 'Add to Favorites (CustomHashMap.put O(1))'
                        }
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isFavorite(song.id)
                              ? 'fill-[#1DB954] text-[#1DB954]'
                              : 'text-neutral-500 hover:text-white'
                          }`}
                        />
                      </button>

                      {/* Add to Queue (Queue O(1)) */}
                      <button
                        onClick={() => enqueueSong(song)}
                        className="p-1.5 rounded-full hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Add to Up Next (Queue.enqueue O(1))"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {/* Delete from Playlist (UndoStack push) */}
                      <button
                        onClick={() => deleteSongFromPlaylist(song.id)}
                        className="p-1.5 rounded-full hover:bg-red-950/80 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete track from DLL (Pushes undo command to Stack)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
