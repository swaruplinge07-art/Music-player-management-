import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Song, SortAlgorithm, SortMetrics, UndoAction, BfsRecommendation } from '../types';
import { DoublyLinkedList } from '../dsa/DoublyLinkedList';
import { Queue } from '../dsa/Queue';
import { Stack } from '../dsa/Stack';
import { Trie } from '../dsa/Trie';
import { CustomHashMap } from '../dsa/CustomHashMap';
import { MaxHeap } from '../dsa/MaxHeap';
import { Graph } from '../dsa/Graph';
import { quickSortPlaylist, mergeSortPlaylist } from '../dsa/SortingAlgorithms';
import { INITIAL_SONGS } from '../data/mockSongs';
import { AudioEngine } from '../services/audioEngine';

interface MusicPlayerContextType {
  // Songs and Playlist
  playlistSongs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isUsingSynth: boolean;
  isShuffle: boolean;
  isRepeat: boolean;

  // Player controls
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;

  // Queue actions
  upNextQueue: Song[];
  enqueueSong: (song: Song) => void;
  dequeueSong: () => Song | null;
  clearQueue: () => void;
  removeFromQueue: (songId: string) => void;

  // Favorites (Hash Map)
  isFavorite: (songId: string) => boolean;
  toggleFavorite: (song: Song) => void;
  favoritesCount: number;
  favoritesVersion: number;

  // Stack & Undo actions
  historyStack: Song[];
  undoStack: UndoAction[];
  undoLastAction: () => void;
  deleteSongFromPlaylist: (songId: string) => void;
  insertCustomAudioTrack: (file: File) => Promise<Song>;

  // Sorting
  currentSort: SortAlgorithm;
  sortMetrics: SortMetrics | null;
  applySort: (algo: SortAlgorithm) => void;

  // Top Charts & Recommendations
  topCharts: Song[];
  recommendedSongs: BfsRecommendation[];

  // Search & Trie
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Song[];
  searchLookupTime: number;

  // Modals & Panels
  isDsaInspectorOpen: boolean;
  setIsDsaInspectorOpen: (open: boolean) => void;
  dsaInspectorTab: 'live' | 'trie' | 'hashmap' | 'graph' | 'guide';
  setDsaInspectorTab: (tab: 'live' | 'trie' | 'hashmap' | 'graph' | 'guide') => void;
  isQueueDrawerOpen: boolean;
  setIsQueueDrawerOpen: (open: boolean) => void;
  isGraphModalOpen: boolean;
  setIsGraphModalOpen: (open: boolean) => void;

  // DSA Raw References for Live Visualizer
  dsaDll: DoublyLinkedList<Song>;
  dsaQueue: Queue<Song>;
  dsaUndoStack: Stack<UndoAction>;
  dsaHistoryStack: Stack<Song>;
  dsaTrie: Trie;
  dsaHashMap: CustomHashMap<boolean>;
  dsaHeap: MaxHeap;
  dsaGraph: Graph;

  // Live Toast for DSA operations
  dsaToast: { title: string; detail: string; complexity: string; time: number } | null;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent DSA Class Instances
  const dllRef = useRef<DoublyLinkedList<Song>>(new DoublyLinkedList<Song>());
  const queueRef = useRef<Queue<Song>>(new Queue<Song>());
  const undoStackRef = useRef<Stack<UndoAction>>(new Stack<UndoAction>());
  const historyStackRef = useRef<Stack<Song>>(new Stack<Song>());
  const trieRef = useRef<Trie>(new Trie());
  const favoritesMapRef = useRef<CustomHashMap<boolean>>(new CustomHashMap<boolean>(23));
  const songMetaMapRef = useRef<CustomHashMap<Song>>(new CustomHashMap<Song>(23));
  const heapRef = useRef<MaxHeap>(new MaxHeap());
  const graphRef = useRef<Graph>(new Graph());
  const audioEngineRef = useRef<AudioEngine | null>(null);

  // React state mirrors for rendering
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>(INITIAL_SONGS);
  const [currentSong, setCurrentSong] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_SONGS[0].duration);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isUsingSynth, setIsUsingSynth] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // Queue & Stack snapshots for re-renders
  const [upNextQueue, setUpNextQueue] = useState<Song[]>([]);
  const [undoStackList, setUndoStackList] = useState<UndoAction[]>([]);
  const [historyStackList, setHistoryStackList] = useState<Song[]>([]);
  const [favoritesVersion, setFavoritesVersion] = useState<number>(0);

  // Sort & Top Charts & Recommendations
  const [currentSort, setCurrentSort] = useState<SortAlgorithm>('default');
  const [sortMetrics, setSortMetrics] = useState<SortMetrics | null>(null);
  const [topCharts, setTopCharts] = useState<Song[]>([]);
  const [recommendedSongs, setRecommendedSongs] = useState<BfsRecommendation[]>([]);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchLookupTime, setSearchLookupTime] = useState<number>(0);

  // Modals
  const [isDsaInspectorOpen, setIsDsaInspectorOpen] = useState<boolean>(false);
  const [dsaInspectorTab, setDsaInspectorTab] = useState<'live' | 'trie' | 'hashmap' | 'graph' | 'guide'>('live');
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState<boolean>(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState<boolean>(false);

  // Toast
  const [dsaToast, setDsaToast] = useState<{ title: string; detail: string; complexity: string; time: number } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showDsaToast = (title: string, detail: string, complexity: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setDsaToast({ title, detail, complexity, time: Date.now() });
    toastTimeoutRef.current = window.setTimeout(() => {
      setDsaToast(null);
    }, 4000);
  };

  // Initialize DSA structures on first mount
  useEffect(() => {
    const dll = dllRef.current;
    const trie = trieRef.current;
    const metaMap = songMetaMapRef.current;
    const heap = heapRef.current;
    const graph = graphRef.current;

    // 1. Initialize Doubly Linked List
    dll.fromArray(INITIAL_SONGS, (s) => s.id);
    dll.setCurrent(INITIAL_SONGS[0].id);

    // 2. Initialize Trie and Hash Maps
    for (let i = 0; i < INITIAL_SONGS.length; i++) {
      const s = INITIAL_SONGS[i];
      trie.indexSong(s);
      metaMap.put(s.id, s);
    }

    // Pre-populate some favorites for showcase
    favoritesMapRef.current.put(INITIAL_SONGS[0].id, true);
    favoritesMapRef.current.put(INITIAL_SONGS[2].id, true);
    favoritesMapRef.current.put(INITIAL_SONGS[4].id, true);
    setFavoritesVersion((v) => v + 1);

    // 3. Initialize MaxHeap for Top 5 Charts
    heap.rebuildHeap(INITIAL_SONGS);
    setTopCharts(heap.getTopK(5));

    // 4. Initialize Music Graph and BFS
    graph.buildMusicGraph(INITIAL_SONGS);
    const initialRecs = graph.bfs(INITIAL_SONGS[0].id, 2);
    setRecommendedSongs(initialRecs);

    // 5. Initialize AudioEngine
    const engine = new AudioEngine();
    engine.setListener({
      onTimeUpdate: (time, dur) => {
        setCurrentTime(time);
        setDuration(dur);
      },
      onEnded: () => {
        handleTrackEnded();
      },
      onError: (err) => {
        console.warn('AudioEngine error:', err);
      },
      onPlayStateChange: (playing) => {
        setIsPlaying(playing);
      },
      onFallbackActive: (synthActive) => {
        setIsUsingSynth(synthActive);
      },
    });

    audioEngineRef.current = engine;
    engine.loadTrack(INITIAL_SONGS[0].audioUrl, INITIAL_SONGS[0].duration);

    return () => {
      engine.pause();
    };
  }, []);

  // Handle track ended: Check Up Next Queue (FIFO) first, then DLL
  const handleTrackEnded = () => {
    if (isRepeat && currentSong) {
      audioEngineRef.current?.seek(0);
      audioEngineRef.current?.play();
      return;
    }

    const queue = queueRef.current;
    if (!queue.isEmpty()) {
      const nextSong = queue.dequeue();
      setUpNextQueue(queue.toArray());
      if (nextSong) {
        showDsaToast(
          'Queue.dequeue()',
          `Pulled "${nextSong.title}" from FIFO Up Next queue.`,
          'O(1)'
        );
        playSong(nextSong, false);
        return;
      }
    }

    // Default to Doubly Linked List next
    nextTrack();
  };

  // Play a song
  const playSong = (song: Song, pushToHistory: boolean = true) => {
    if (currentSong && pushToHistory && currentSong.id !== song.id) {
      historyStackRef.current.push(currentSong);
      setHistoryStackList(historyStackRef.current.toArray());
    }

    // Update DLL active pointer
    const dll = dllRef.current;
    dll.setCurrent(song.id);

    // Increment play count & update Max-Heap
    const updatedCount = song.playCount + 1;
    song.playCount = updatedCount;
    heapRef.current.updateSongPlayCount(song.id, updatedCount);
    setTopCharts(heapRef.current.getTopK(5));

    // Update Graph BFS recommendations
    const recs = graphRef.current.bfs(song.id, 2);
    setRecommendedSongs(recs);

    setCurrentSong(song);
    setDuration(song.duration);
    setCurrentTime(0);

    showDsaToast(
      'DoublyLinkedList.setCurrent() & MaxHeap.update()',
      `Active node set to "${song.title}". Sift-up triggered on Max-Heap.`,
      'O(1) DLL / O(log N) Heap'
    );

    audioEngineRef.current?.loadTrack(song.audioUrl, song.duration);
    audioEngineRef.current?.play();
  };

  const togglePlayPause = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioEngineRef.current?.pause();
    } else {
      audioEngineRef.current?.play();
    }
  };

  // Traverse Next via Doubly Linked List in O(1)
  const nextTrack = () => {
    const queue = queueRef.current;
    if (!queue.isEmpty()) {
      const queuedSong = queue.dequeue();
      setUpNextQueue(queue.toArray());
      if (queuedSong) {
        showDsaToast(
          'Queue.dequeue()',
          `Playing next from FIFO Queue: "${queuedSong.title}"`,
          'O(1)'
        );
        playSong(queuedSong);
        return;
      }
    }

    const dll = dllRef.current;
    if (dll.isEmpty()) return;

    if (isShuffle) {
      // Pick random node from playlist
      const songs = dll.toArray();
      const randomIdx = Math.floor(Math.random() * songs.length);
      playSong(songs[randomIdx]);
      return;
    }

    const nextNode = dll.getNext();
    if (nextNode) {
      showDsaToast(
        'DoublyLinkedList.getNext()',
        `Navigated via current.next pointer to "${nextNode.data.title}"`,
        'O(1)'
      );
      playSong(nextNode.data);
    }
  };

  // Traverse Previous via Doubly Linked List in O(1)
  const prevTrack = () => {
    // If audio has played > 3 seconds, reset to beginning of current track like Spotify
    if (currentTime > 3) {
      audioEngineRef.current?.seek(0);
      return;
    }

    const dll = dllRef.current;
    if (dll.isEmpty()) return;

    const prevNode = dll.getPrev();
    if (prevNode) {
      showDsaToast(
        'DoublyLinkedList.getPrev()',
        `Navigated via current.prev pointer to "${prevNode.data.title}"`,
        'O(1)'
      );
      playSong(prevNode.data);
    }
  };

  const seek = (seconds: number) => {
    audioEngineRef.current?.seek(seconds);
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    audioEngineRef.current?.setVolume(val);
  };

  const toggleMute = () => {
    const muted = audioEngineRef.current?.toggleMute() ?? false;
    setIsMuted(muted);
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setIsRepeat(!isRepeat);

  // Queue actions
  const enqueueSong = (song: Song) => {
    queueRef.current.enqueue(song);
    setUpNextQueue(queueRef.current.toArray());
    showDsaToast(
      'Queue.enqueue()',
      `Appended "${song.title}" to rear of FIFO Queue.`,
      'O(1)'
    );
  };

  const dequeueSong = (): Song | null => {
    const item = queueRef.current.dequeue();
    setUpNextQueue(queueRef.current.toArray());
    return item;
  };

  const clearQueue = () => {
    queueRef.current.clear();
    setUpNextQueue([]);
    showDsaToast('Queue.clear()', 'Cleared Up Next FIFO Buffer.', 'O(1)');
  };

  const removeFromQueue = (songId: string) => {
    queueRef.current.remove((s) => s.id === songId);
    setUpNextQueue(queueRef.current.toArray());
  };

  // Favorites (Custom Hash Map)
  const isFavorite = (songId: string): boolean => {
    return !!favoritesMapRef.current.get(songId);
  };

  const toggleFavorite = (song: Song) => {
    const map = favoritesMapRef.current;
    const currentStatus = !!map.get(song.id);
    const newStatus = !currentStatus;

    if (newStatus) {
      map.put(song.id, true);
    } else {
      map.remove(song.id);
    }

    setFavoritesVersion((v) => v + 1);
    showDsaToast(
      `CustomHashMap.${newStatus ? 'put' : 'remove'}()`,
      `${newStatus ? 'Favorited' : 'Unfavorited'} "${song.title}". Hash bucket computed via djb2.`,
      'O(1) avg'
    );
  };

  // Delete song from playlist with Undo Stack push
  const deleteSongFromPlaylist = (songId: string) => {
    const dll = dllRef.current;
    const songsArray = dll.toArray();
    let index = -1;
    let targetSong: Song | null = null;

    for (let i = 0; i < songsArray.length; i++) {
      if (songsArray[i].id === songId) {
        index = i;
        targetSong = songsArray[i];
        break;
      }
    }

    if (!targetSong || index === -1) return;

    // Remove from DLL in O(1) once node located
    dll.remove(songId);
    const updatedSongs = dll.toArray();
    setPlaylistSongs(updatedSongs);

    // Push inverse action onto Undo Stack
    const action: UndoAction = {
      type: 'DELETE_SONG',
      description: `Delete "${targetSong.title}" from playlist`,
      payload: { song: targetSong, index },
      timestamp: Date.now(),
    };
    undoStackRef.current.push(action);
    setUndoStackList(undoStackRef.current.toArray());

    showDsaToast(
      'Stack.push(UndoAction) & DoublyLinkedList.remove()',
      `Removed "${targetSong.title}" from DLL. Pushed undo command to Undo Stack.`,
      'O(1) Push / O(N) Search + O(1) Rewire'
    );
  };

  // Undo Last Action
  const undoLastAction = () => {
    const stack = undoStackRef.current;
    if (stack.isEmpty()) return;

    const action = stack.pop();
    setUndoStackList(stack.toArray());

    if (!action) return;

    if (action.type === 'DELETE_SONG' && action.payload.song && action.payload.index !== undefined) {
      const { song, index } = action.payload;
      const dll = dllRef.current;
      dll.insertAt(index, song, song.id);
      setPlaylistSongs(dll.toArray());

      showDsaToast(
        'Stack.pop() -> Undo Delete',
        `Restored "${song.title}" back at index ${index} in DoublyLinkedList.`,
        'O(1) Pop + O(k) Insert'
      );
    } else if (action.type === 'SORT_PLAYLIST' && action.payload.previousOrder) {
      const prevOrder = action.payload.previousOrder;
      dllRef.current.fromArray(prevOrder, (s) => s.id);
      setPlaylistSongs(prevOrder);
      setCurrentSort('default');
      setSortMetrics(null);

      showDsaToast(
        'Stack.pop() -> Undo Sort',
        'Reverted playlist order to previous arrangement.',
        'O(1) Pop + O(N) Reload'
      );
    }
  };

  // Insert a custom local audio track into all 8 DSA structures
  const insertCustomAudioTrack = async (file: File): Promise<Song> => {
    // 1. Create a local object URL for instant, native zero-latency browser audio playback
    const objectUrl = URL.createObjectURL(file);

    // 2. Extract clean title and artist from filename
    const rawName = file.name.replace(/\.[^/.]+$/, '');
    let title = rawName;
    let artist = 'Local Audio';
    if (rawName.includes(' - ')) {
      const parts = rawName.split(' - ');
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    }

    // 3. Detect actual duration using an audio element
    let trackDuration = 180;
    try {
      const tempAudio = new Audio(objectUrl);
      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          if (tempAudio.duration && isFinite(tempAudio.duration)) {
            trackDuration = Math.round(tempAudio.duration);
          }
          resolve();
        };
        tempAudio.addEventListener('loadedmetadata', onLoaded);
        tempAudio.addEventListener('error', () => resolve());
        setTimeout(resolve, 1500);
      });
    } catch (e) {
      console.warn('Could not read audio duration', e);
    }

    // 4. Construct Song object
    const newSong: Song = {
      id: `track-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      artist,
      album: 'Imported Library',
      duration: trackDuration,
      playCount: 1,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      audioUrl: objectUrl,
      genre: 'Custom Audio',
      tempo: 120,
      year: new Date().getFullYear(),
    };

    // 5. Append to Doubly Linked List in O(1)
    dllRef.current.append(newSong, newSong.id);
    const updatedSongs = dllRef.current.toArray();
    setPlaylistSongs(updatedSongs);

    // 6. Insert into Trie in O(k) for search & autocomplete
    trieRef.current.indexSong(newSong);

    // 7. Insert into CustomHashMap in O(1)
    songMetaMapRef.current.put(newSong.id, newSong);

    // 8. Insert into MaxHeap in O(log N)
    heapRef.current.insert(newSong);
    setTopCharts(heapRef.current.getTopK(5));

    // 9. Add vertex and edges in Graph
    graphRef.current.addVertex(newSong);
    if (currentSong) {
      graphRef.current.addEdge(
        newSong.id,
        currentSong.id,
        85,
        'Custom audio track similarity'
      );
    }
    const recs = graphRef.current.bfs(newSong.id, 2);
    setRecommendedSongs(recs);

    // 10. Play track immediately!
    playSong(newSong);

    showDsaToast(
      'New Audio Track Inserted Across All 8 DSA Structures',
      `"${newSong.title}" inserted into DLL O(1), Trie O(k), HashMap O(1), Heap O(log N) & Graph!`,
      'O(1) DLL / O(k) Trie / O(log N) Heap'
    );

    return newSong;
  };

  // Sorting
  const applySort = (algo: SortAlgorithm) => {
    if (algo === 'default') {
      dllRef.current.fromArray(INITIAL_SONGS, (s) => s.id);
      setPlaylistSongs(INITIAL_SONGS);
      setCurrentSort('default');
      setSortMetrics(null);
      return;
    }

    const currentSongs = dllRef.current.toArray();

    // Push undo action before sorting
    const action: UndoAction = {
      type: 'SORT_PLAYLIST',
      description: `Sort playlist via ${algo === 'quicksort' ? 'Quick Sort' : 'Merge Sort'}`,
      payload: { previousOrder: [...currentSongs] },
      timestamp: Date.now(),
    };
    undoStackRef.current.push(action);
    setUndoStackList(undoStackRef.current.toArray());

    if (algo === 'quicksort') {
      const result = quickSortPlaylist(currentSongs);
      dllRef.current.fromArray(result.sortedSongs, (s) => s.id);
      setPlaylistSongs(result.sortedSongs);
      setCurrentSort('quicksort');
      setSortMetrics(result.metrics);

      showDsaToast(
        'QuickSort(Playlist)',
        `Sorted ${result.sortedSongs.length} songs alphabetically by title. Partitioned recursively.`,
        'O(N log N)'
      );
    } else if (algo === 'mergesort') {
      const result = mergeSortPlaylist(currentSongs);
      dllRef.current.fromArray(result.sortedSongs, (s) => s.id);
      setPlaylistSongs(result.sortedSongs);
      setCurrentSort('mergesort');
      setSortMetrics(result.metrics);

      showDsaToast(
        'MergeSort(Playlist)',
        `Sorted ${result.sortedSongs.length} songs numerically by duration. Split & merged stably.`,
        'O(N log N)'
      );
    }
  };

  // Search query with Trie
  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setSearchLookupTime(0);
      return;
    }

    const { songs, lookupTimeMs } = trieRef.current.query(query);
    setSearchResults(songs);
    setSearchLookupTime(lookupTimeMs);
  };

  // Keyboard shortcuts (Space, Arrow keys, N, P, D, M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        nextTrack();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        prevTrack();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setIsDsaInspectorOpen((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        seek(currentTime + 5);
      } else if (e.key === 'ArrowLeft') {
        seek(currentTime - 5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, isPlaying, currentSong, isShuffle, isRepeat]);

  return (
    <MusicPlayerContext.Provider
      value={{
        playlistSongs,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isUsingSynth,
        isShuffle,
        isRepeat,

        playSong,
        togglePlayPause,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,

        upNextQueue,
        enqueueSong,
        dequeueSong,
        clearQueue,
        removeFromQueue,

        isFavorite,
        toggleFavorite,
        favoritesCount: favoritesMapRef.current.size(),
        favoritesVersion,

        historyStack: historyStackList,
        undoStack: undoStackList,
        undoLastAction,
        deleteSongFromPlaylist,
        insertCustomAudioTrack,

        currentSort,
        sortMetrics,
        applySort,

        topCharts,
        recommendedSongs,

        searchQuery,
        setSearchQuery: handleSetSearchQuery,
        searchResults,
        searchLookupTime,

        isDsaInspectorOpen,
        setIsDsaInspectorOpen,
        dsaInspectorTab,
        setDsaInspectorTab,
        isQueueDrawerOpen,
        setIsQueueDrawerOpen,
        isGraphModalOpen,
        setIsGraphModalOpen,

        dsaDll: dllRef.current,
        dsaQueue: queueRef.current,
        dsaUndoStack: undoStackRef.current,
        dsaHistoryStack: historyStackRef.current,
        dsaTrie: trieRef.current,
        dsaHashMap: favoritesMapRef.current,
        dsaHeap: heapRef.current,
        dsaGraph: graphRef.current,

        dsaToast,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
