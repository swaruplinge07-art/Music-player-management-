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
  Binary,
  Radio
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const PlayerBar: React.FC = () => {
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
    isQueueDrawerOpen,
    setIsQueueDrawerOpen,
    setIsDsaInspectorOpen,
    playlistSongs,
  } = useMusicPlayer();

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentIdx = playlistSongs.findIndex((s) => s.id === currentSong?.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="h-22 bg-[#181818] border-t border-neutral-800 px-4 md:px-6 flex items-center justify-between z-40 select-none">
      {/* Left: Track Thumbnail, Title, Artist, Heart, DLL indicator */}
      <div className="flex items-center gap-3 w-1/4 min-w-[200px]">
        {currentSong ? (
          <>
            <div className="relative group">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-14 h-14 rounded-md object-cover shadow-lg"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-white truncate hover:underline cursor-pointer">
                  {currentSong.title}
                </span>
              </div>
              <div className="text-xs text-neutral-400 truncate hover:text-white cursor-pointer">
                {currentSong.artist}
              </div>
              <div className="text-[10px] font-mono text-[#1DB954] flex items-center gap-1 mt-0.5">
                <span>DLL Node {currentIdx >= 0 ? currentIdx + 1 : '—'} / {playlistSongs.length}</span>
              </div>
            </div>

            <button
              onClick={() => toggleFavorite(currentSong)}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
              title={
                isFavorite(currentSong.id)
                  ? 'Favorited (CustomHashMap O(1))'
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
          </>
        ) : (
          <div className="text-xs text-neutral-500 font-mono">No track selected</div>
        )}
      </div>

      {/* Center: Controls & Scrub Bar */}
      <div className="flex flex-col items-center gap-2 max-w-xl w-2/4">
        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full hover:scale-105 transition-all cursor-pointer ${
              isShuffle ? 'text-[#1DB954]' : 'text-neutral-400 hover:text-white'
            }`}
            title="Toggle Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={prevTrack}
            className="p-1.5 text-neutral-300 hover:text-white hover:scale-110 transition-transform cursor-pointer"
            title="Previous Track (DoublyLinkedList.getPrev() O(1))"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-9 h-9 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-1.5 text-neutral-300 hover:text-white hover:scale-110 transition-transform cursor-pointer"
            title="Next Track (Queue.dequeue() or DoublyLinkedList.getNext() O(1))"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-full hover:scale-105 transition-all cursor-pointer ${
              isRepeat ? 'text-[#1DB954]' : 'text-neutral-400 hover:text-white'
            }`}
            title="Toggle Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Scrub Bar */}
        <div className="w-full flex items-center gap-2.5">
          <span className="text-[11px] font-mono text-neutral-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <div className="relative flex-1 group flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer focus:outline-none accent-[#1DB954]"
            />
            {/* Custom filled progress track under slider */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1DB954] rounded-l-lg pointer-events-none group-hover:bg-[#1ed760]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[11px] font-mono text-neutral-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Audio Backend, Volume, Queue Drawer, DSA Inspector */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
        {/* Audio engine fallback indicator */}
        {isUsingSynth ? (
          <span
            className="hidden lg:flex items-center gap-1 font-mono text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800"
            title="Web Audio API Synthesizer fallback active (Zero network audio dependency)"
          >
            <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
            WebAudio Synth
          </span>
        ) : (
          <span
            className="hidden lg:flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/80"
            title="HTML5 Audio streaming sample MP3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
            HTML5 MP3
          </span>
        )}

        {/* Volume Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 md:w-20 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
          />
        </div>

        {/* "Up Next" Queue Drawer Toggle */}
        <button
          onClick={() => setIsQueueDrawerOpen(!isQueueDrawerOpen)}
          className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
            isQueueDrawerOpen
              ? 'bg-neutral-700 text-[#1DB954]'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
          title="Open Up Next Queue (FIFO Buffer)"
        >
          <ListMusic className="w-4 h-4" />
          {upNextQueue.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1DB954] text-black font-mono font-bold text-[9px] rounded-full flex items-center justify-center shadow">
              {upNextQueue.length}
            </span>
          )}
        </button>

        {/* "DSA Inspector" Toggle */}
        <button
          onClick={() => setIsDsaInspectorOpen(true)}
          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[#1DB954] border border-[#1DB954]/40 hover:border-[#1DB954] transition-all cursor-pointer shadow-sm"
          title="Open Live DSA Inspector"
        >
          <Binary className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
