import React, { useRef, useState, useEffect } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Network,
  Binary,
  X,
  Play,
  Plus,
  Zap
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import type { Song } from '../types';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateSearch: () => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome, onNavigateSearch, activeView }) => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLookupTime,
    playSong,
    enqueueSong,
    setIsDsaInspectorOpen,
    setIsGraphModalOpen,
    setDsaInspectorTab,
  } = useMusicPlayer();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSong = (song: Song) => {
    playSong(song);
    setIsDropdownOpen(false);
  };

  return (
    <header className="h-16 bg-[#121212]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 border-b border-neutral-800/40">
      {/* Left: Navigation Arrows */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          disabled={activeView === 'home'}
          className="w-8 h-8 rounded-full bg-black/60 hover:bg-neutral-800 flex items-center justify-center text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Back to Home"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          disabled
          className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-neutral-500 opacity-40 cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Center: When in Search View show active input; on other pages show clean launcher button */}
      {activeView === 'search' ? (
        <div ref={searchContainerRef} className="relative flex-1 max-w-xl lg:max-w-2xl mx-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search by title, artist, or album... (Trie O(k))"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setIsDropdownOpen(true);
              }}
              className="w-full bg-neutral-800 hover:bg-neutral-750 focus:bg-neutral-800 text-white placeholder-neutral-400 text-sm pl-10 pr-20 py-2 rounded-full border border-transparent focus:border-[#1DB954] focus:outline-none transition-all shadow-inner"
            />

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsDropdownOpen(false);
                }}
                className="absolute right-12 text-neutral-400 hover:text-white cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="absolute right-3 font-mono text-[10px] text-[#1DB954] bg-[#1DB954]/10 px-1.5 py-0.5 rounded border border-[#1DB954]/30 pointer-events-none">
              O(k)
            </span>
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl overflow-hidden z-50">
              {/* Header with Trie search metrics */}
              <div className="px-3.5 py-2 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#1DB954]" />
                  Trie Prefix Search
                </span>
                <span className="text-[#1DB954]">
                  {searchResults.length} matches in {searchLookupTime} ms
                </span>
              </div>

              {/* Results list */}
              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800/40">
                {searchResults.length > 0 ? (
                  searchResults.map((song) => (
                    <div
                      key={song.id}
                      className="p-2.5 hover:bg-neutral-800 flex items-center justify-between gap-3 group transition-colors cursor-pointer"
                      onClick={() => handleSelectSong(song)}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                        <div className="truncate text-left">
                          <div className="text-sm font-medium text-white truncate group-hover:text-[#1DB954] transition-colors">
                            {song.title}
                          </div>
                          <div className="text-xs text-neutral-400 truncate">
                            {song.artist} • <span className="text-neutral-500">{song.genre}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            enqueueSong(song);
                          }}
                          className="p-1.5 rounded-full hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                          title="Add to Up Next Queue"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSelectSong(song)}
                          className="p-2 rounded-full bg-[#1DB954] text-black hover:scale-105 transition-transform shadow-md"
                          title="Play Now"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    No songs matching prefix "{searchQuery}" in Trie index.
                  </div>
                )}
              </div>

              <div className="px-3 py-1.5 bg-neutral-950/80 text-[10px] text-neutral-500 font-mono text-center">
                Press Enter or click to play • Queries Trie in O(k) steps
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 max-w-xl mx-4 flex items-center">
          <button
            onClick={onNavigateSearch}
            className="flex items-center gap-2.5 px-4 py-2 bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full border border-neutral-700/50 hover:border-neutral-600 transition-all cursor-pointer text-xs group"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#1DB954] transition-colors" />
            <span>Search songs, artists, genres...</span>
            <span className="text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-1.5 py-0.5 rounded border border-[#1DB954]/30 ml-2">
              Trie O(k)
            </span>
          </button>
        </div>
      )}

      {/* Right: Quick Action Buttons & Profile */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsGraphModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-cyan-400 text-xs font-semibold border border-neutral-700/60 transition-all cursor-pointer"
          title="Open Song Relationship Graph"
        >
          <Network className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Graph (BFS)</span>
        </button>

        <button
          onClick={() => {
            setDsaInspectorTab('live');
            setIsDsaInspectorOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1DB954]/20 hover:bg-[#1DB954]/30 text-[#1DB954] border border-[#1DB954]/40 hover:border-[#1DB954] text-xs font-semibold shadow-[0_0_12px_rgba(29,185,84,0.2)] transition-all cursor-pointer"
          title="Open Live DSA Inspector"
        >
          <Binary className="w-3.5 h-3.5" />
          <span>DSA Inspector</span>
        </button>

        {/* Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-black font-bold text-xs shadow-md">
            DSA
          </div>
        </div>
      </div>
    </header>
  );
};
