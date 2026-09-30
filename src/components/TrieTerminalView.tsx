import React, { useState } from 'react';
import { TreePine, Search, Play, Plus, Zap, X } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const TrieTerminalView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLookupTime,
    playSong,
    enqueueSong,
    playlistSongs,
    dsaTrie,
  } = useMusicPlayer();

  const [testPrefix, setTestPrefix] = useState('bin');
  const trieVisualTree = dsaTrie.getVisualTree(testPrefix);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#12161F] border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-[#1DB954] mb-1">
          <TreePine className="w-4 h-4" />
          <span>TRIE PREFIX SEARCH TERMINAL • O(k) LOOKUP</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">
          Instant Prefix Tree Autocomplete
        </h2>
        <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed mb-5">
          Unlike linear table scans (O(N)), our custom Trie indexes song titles, artists, and keywords into a character tree. Search complexity depends strictly on the typed query length k, providing sub-millisecond lookups.
        </p>

        {/* Big Search Input */}
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Type any prefix to query the Trie index (e.g. 'bin', 'algo', 'rec')..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setTestPrefix(e.target.value);
            }}
            className="w-full bg-black/60 text-white placeholder-neutral-500 text-sm pl-12 pr-28 py-3.5 rounded-xl border border-neutral-700/80 focus:border-[#1DB954] focus:outline-none transition-all shadow-inner"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-14 top-3.5 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <span className="absolute right-3.5 top-3 font-mono text-[10px] text-[#1DB954] bg-[#1DB954]/10 px-2 py-1 rounded border border-[#1DB954]/30 pointer-events-none">
            O(k)
          </span>
        </div>
      </div>

      {/* Genre Clusters */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-3">
          Explore by Sound Clusters
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Lo-Fi Chill', color: 'from-amber-600 to-orange-700', query: 'lo-fi' },
            { name: 'Synthwave', color: 'from-purple-600 to-pink-700', query: 'synth' },
            { name: 'Electronic', color: 'from-blue-600 to-cyan-700', query: 'depth' },
            { name: 'Ambient Neo-Classical', color: 'from-emerald-600 to-teal-800', query: 'ambient' },
          ].map((g, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(g.query);
                setTestPrefix(g.query);
              }}
              className={`h-22 rounded-xl p-4 bg-gradient-to-br ${g.color} text-left flex flex-col justify-between font-bold text-white shadow-lg hover:scale-102 transition-transform cursor-pointer`}
            >
              <span className="text-sm">{g.name}</span>
              <span className="text-[10px] font-mono opacity-80">Prefix: "{g.query}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Trie Tree Branch Inspection */}
      <div className="bg-[#12161F] border border-neutral-800 rounded-2xl p-5 shadow-xl font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#1DB954]" />
            <span className="text-white font-bold">Trie Tree Nodes Traversal</span>
          </div>
          <div className="text-neutral-400">
            Current Path: <strong className="text-[#1DB954]">"{testPrefix || 'root'}"</strong> • Query Time:{' '}
            <span className="text-emerald-400">{searchLookupTime} ms</span>
          </div>
        </div>

        {/* Tree Branch Visualizer */}
        <div className="bg-black/50 p-4 rounded-xl border border-neutral-800/80 overflow-x-auto">
          <div className="text-neutral-400 font-bold mb-2">ROOT [TrieNode]</div>
          {trieVisualTree && (
            <div className="space-y-2 pl-4 border-l border-neutral-800">
              {trieVisualTree.children.map((child: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center font-bold text-[#1DB954]">
                      {child.char}
                    </span>
                    <span className="text-neutral-300">path: "{child.path}"</span>
                    {child.isEndOfWord && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">
                        matches ({child.songCount} songs)
                      </span>
                    )}
                  </div>

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
                              word end ({gChild.songCount} songs)
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
      </div>

      {/* Results / Catalog Section */}
      <div className="bg-[#12161F] border border-neutral-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <span className="font-bold text-white text-sm">
            {searchQuery
              ? `Trie Matches for "${searchQuery}" (${searchResults.length})`
              : `All Indexed Songs (${playlistSongs.length})`}
          </span>
          {searchQuery && (
            <span className="text-xs font-mono text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded border border-[#1DB954]/30">
              Resolved in {searchLookupTime} ms
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(searchQuery ? searchResults : playlistSongs).map((song) => (
            <div
              key={song.id}
              className="p-3 bg-black/40 hover:bg-neutral-800/60 rounded-xl border border-neutral-800 flex items-center justify-between gap-3 group transition-colors"
            >
              <div className="flex items-center gap-3 truncate min-w-0">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="truncate min-w-0">
                  <div
                    onClick={() => playSong(song)}
                    className="text-sm font-semibold text-white group-hover:text-[#1DB954] truncate cursor-pointer"
                  >
                    {song.title}
                  </div>
                  <div className="text-xs text-neutral-400 truncate">
                    {song.artist} • <span className="font-mono text-neutral-500">{song.genre}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => enqueueSong(song)}
                  className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Add to FIFO Queue"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => playSong(song)}
                  className="p-2 rounded-lg bg-[#1DB954] text-black hover:scale-105 transition-transform cursor-pointer shadow"
                  title="Play Now"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
