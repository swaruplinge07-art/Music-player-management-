import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  ListMusic,
  ArrowLeft,
  ArrowRight,
  Radio,
  Disc3,
  Layers,
  Trash2,
  Upload
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import type { Song } from '../types';

export const PlayerDeck: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isUsingSynth,
    isShuffle,
    isRepeat,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    isFavorite,
    toggleFavorite,
    upNextQueue,
    removeFromQueue,
    clearQueue,
    playSong,
    playlistSongs,
    dsaDll,
    insertCustomAudioTrack,
  } = useMusicPlayer();

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await insertCustomAudioTrack(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentIdx = playlistSongs.findIndex((s) => s.id === currentSong?.id);

  // Peek prev and next nodes from Doubly Linked List in O(1)
  const prevNode = dsaDll.peekPrev();
  const nextNode = dsaDll.peekNext();

  return (
    <div className="w-80 lg:w-96 bg-[#0E1117] border-r border-neutral-800/80 flex flex-col h-full overflow-y-auto p-4 select-none flex-shrink-0">
      {/* Deck Console Title */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800/80 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-neutral-300 font-bold uppercase tracking-wider text-[11px]">
          <Disc3 className={`w-4 h-4 text-[#1DB954] ${isPlaying ? 'animate-spin' : ''}`} />
          Audio Transport Deck
        </span>
        {isUsingSynth ? (
          <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
            Synth Fallback
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
            HTML5 Direct
          </span>
        )}
      </div>

      {/* Insert Custom Audio File Button */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          className="hidden"
          id="player-deck-audio-input"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-[#1DB954]/15 hover:from-emerald-500/25 hover:via-teal-500/25 hover:to-[#1DB954]/25 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white text-xs font-semibold shadow-[0_0_12px_rgba(29,185,84,0.15)] transition-all cursor-pointer group"
          title="Insert your own MP3/WAV file into Doubly LinkedList, Trie, HashMap, Heap, and Graph"
        >
          <div className="flex items-center gap-2">
            <Upload className="w-3.5 h-3.5 text-[#1DB954] group-hover:scale-110 transition-transform" />
            <span>Insert Audio File</span>
          </div>
          <span className="text-[10px] font-mono bg-black/50 text-[#1DB954] px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
            +ALL DSA
          </span>
        </button>
      </div>

      {/* 1. Digital Vinyl / Turntable Visualizer */}
      <div className="relative mb-5 bg-gradient-to-b from-neutral-900 to-black p-5 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
        {/* Vinyl Disc with Rotating Animation */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-neutral-950 border-4 border-neutral-800 shadow-[0_0_25px_rgba(0,0,0,0.8)] flex items-center justify-center">
          {/* Subtle concentric grooves */}
          <div className="absolute inset-2 rounded-full border border-neutral-800/60 pointer-events-none" />
          <div className="absolute inset-5 rounded-full border border-neutral-800/50 pointer-events-none" />
          <div className="absolute inset-8 rounded-full border border-neutral-800/40 pointer-events-none" />

          {/* Album Cover inside spinning disc */}
          {currentSong ? (
            <div
              className={`w-28 h-28 rounded-full overflow-hidden border-2 border-neutral-700 shadow-inner ${
                isPlaying ? 'animate-[spin_12s_linear_infinite]' : ''
              }`}
            >
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-600">
              <Disc3 className="w-10 h-10" />
            </div>
          )}

          {/* Center spindle spindle hole */}
          <div className="absolute w-5 h-5 rounded-full bg-black border-2 border-neutral-700 shadow-md" />
        </div>

        {/* Live Audio Equalizer Bars */}
        {isPlaying && (
          <div className="flex items-center gap-1 mt-4 h-5">
            <span className="w-1 bg-[#1DB954] h-3 animate-pulse rounded-full" />
            <span className="w-1 bg-cyan-400 h-5 animate-bounce rounded-full" />
            <span className="w-1 bg-[#1DB954] h-2 animate-pulse rounded-full" />
            <span className="w-1 bg-emerald-400 h-4 animate-bounce rounded-full" />
            <span className="w-1 bg-[#1DB954] h-3 animate-pulse rounded-full" />
          </div>
        )}
      </div>

      {/* 2. Track Metadata & Favorite */}
      {currentSong && (
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-extrabold text-base text-white truncate leading-snug">
                {currentSong.title}
              </h3>
              <p className="text-xs text-neutral-400 truncate mt-0.5">
                {currentSong.artist} • <span className="text-neutral-500">{currentSong.album}</span>
              </p>
            </div>

            <button
              onClick={() => toggleFavorite(currentSong)}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-neutral-800"
              title={
                isFavorite(currentSong.id)
                  ? 'Remove from Favorites (CustomHashMap O(1))'
                  : 'Add to Favorites (CustomHashMap O(1))'
              }
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite(currentSong.id)
                    ? 'fill-[#1DB954] text-[#1DB954]'
                    : 'text-neutral-400'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-neutral-400">
            <span className="bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              {currentSong.genre}
            </span>
            <span className="bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              {currentSong.tempo} BPM
            </span>
            <span className="bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              {currentSong.playCount.toLocaleString()} plays
            </span>
          </div>
        </div>
      )}

      {/* 3. Transport Controls & Scrub Bar */}
      <div className="bg-black/40 border border-neutral-800/80 rounded-2xl p-4 mb-4">
        {/* Scrub Bar */}
        <div className="mb-3">
          <div className="relative flex items-center group">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer focus:outline-none accent-[#1DB954]"
            />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-[#1DB954] rounded-l-lg pointer-events-none group-hover:bg-[#1ed760]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-1.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between px-2 mb-3">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isShuffle ? 'text-[#1DB954]' : 'text-neutral-500 hover:text-white'
            }`}
            title="Toggle Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2 text-neutral-300 hover:text-white hover:scale-110 transition-transform cursor-pointer"
            title="Previous Node (DLL getPrev() O(1))"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-[0_0_15px_rgba(29,185,84,0.4)] hover:scale-105 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-neutral-300 hover:text-white hover:scale-110 transition-transform cursor-pointer"
            title="Next Node (Queue.dequeue() or DLL getNext() O(1))"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isRepeat ? 'text-[#1DB954]' : 'text-neutral-500 hover:text-white'
            }`}
            title="Toggle Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/60">
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
          />
        </div>
      </div>

      {/* 4. Live Doubly Linked List Pointer HUD */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 mb-4 shadow">
        <div className="flex items-center justify-between text-[11px] font-mono mb-2">
          <span className="flex items-center gap-1.5 text-[#1DB954] font-bold">
            <Layers className="w-3.5 h-3.5" />
            DLL Node Pointers
          </span>
          <span className="text-neutral-400 text-[10px]">
            Node {currentIdx >= 0 ? currentIdx + 1 : '—'} / {playlistSongs.length} (O(1))
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          {/* Previous Pointer Button */}
          <button
            onClick={prevTrack}
            disabled={!prevNode}
            className="p-2 bg-black/50 hover:bg-neutral-800 rounded-xl border border-neutral-800 text-left transition-colors cursor-pointer disabled:opacity-30 group"
          >
            <div className="text-neutral-500 flex items-center gap-1 mb-1">
              <ArrowLeft className="w-3 h-3 text-[#1DB954]" />
              <span>prev pointer</span>
            </div>
            <div className="text-white truncate font-medium group-hover:text-[#1DB954]">
              {prevNode ? prevNode.data.title : 'null (Head)'}
            </div>
          </button>

          {/* Next Pointer Button */}
          <button
            onClick={nextTrack}
            disabled={!nextNode}
            className="p-2 bg-black/50 hover:bg-neutral-800 rounded-xl border border-neutral-800 text-left transition-colors cursor-pointer disabled:opacity-30 group"
          >
            <div className="text-neutral-500 flex items-center justify-between mb-1">
              <span>next pointer</span>
              <ArrowRight className="w-3 h-3 text-[#1DB954]" />
            </div>
            <div className="text-white truncate font-medium group-hover:text-[#1DB954]">
              {nextNode ? nextNode.data.title : 'null (Tail)'}
            </div>
          </button>
        </div>
      </div>

      {/* 5. Inline Up Next FIFO Queue Buffer */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 flex-1 min-h-[140px] flex flex-col shadow">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <ListMusic className="w-3.5 h-3.5" />
            Up Next Queue ({upNextQueue.length})
          </span>
          {upNextQueue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-[10px] text-red-400 hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 max-h-48 pr-1">
          {upNextQueue.length > 0 ? (
            upNextQueue.map((song: Song, index: number) => {
              const isFront = index === 0;

              return (
                <div
                  key={`q-deck-${song.id}-${index}`}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                    isFront
                      ? 'bg-cyan-950/60 border-cyan-500/50'
                      : 'bg-black/40 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <span className="font-mono text-[9px] text-cyan-400 bg-cyan-950 px-1 rounded flex-shrink-0">
                      {isFront ? 'FRONT' : `#${index + 1}`}
                    </span>
                    <span className="text-white truncate font-medium">{song.title}</span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        removeFromQueue(song.id);
                        playSong(song);
                      }}
                      className="p-1 rounded bg-[#1DB954] text-black hover:scale-105 transition-transform cursor-pointer"
                      title="Play Now (Dequeues item)"
                    >
                      <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                    </button>
                    <button
                      onClick={() => removeFromQueue(song.id)}
                      className="p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-neutral-500 font-mono text-[11px]">
              FIFO Queue Buffer Empty
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
