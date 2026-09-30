# 🎵 Rhythm Box — Algorithmic Audio Workstation & DSA Showcase

[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Rhythm Box** is a state-of-the-art dark-themed audio workstation and music streaming application built with React 19, TypeScript, and Tailwind CSS. Beyond offering music playback and library management, **every core feature is powered by custom, zero-dependency Data Structures & Algorithms (DSA) classes** written entirely from scratch without native array method shortcuts.

---

## 🚀 Key Features

- **Algorithmic Audio Console**: Dual-column studio workstation layout with rotating vinyl disc visualizer, live audio spectrum equalizer bars, and real-time pointer HUDs.
- **Offline & Local Audio Support**: Pre-bundled with 12 local high-fidelity tracks (`/audio/song-X.mp3`) with zero CORS restrictions or external network dependencies.
- **Interactive Audio Ingestion**: Upload and insert your own local MP3, WAV, FLAC, or OGG audio files directly into the player. The app dynamically parses metadata, generates zero-latency browser blob URLs, and propagates the new song across all 8 custom DSA structures in real-time.
- **Live DSA Visualizer & Architecture Matrix**: Live visual telemetry modal displaying active linked-list pointers, queue buffer state, undo stack history, Trie lookup latency, and asymptotic complexity guides.

---

## 🧠 Custom Data Structures & Algorithms Engine

Every player action maps to custom TypeScript DSA implementations located in [`src/dsa/`](src/dsa/):

| Concept | Custom Class | Operations & Implementation Details | Time Complexity | Space Complexity | UI Feature Link |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Doubly Linked List** | `DoublyLinkedList<T>`, `SongNode<T>` | Bidirectional pointers (`prev`, `next`), `append`, `prepend`, `insertAt`, `remove`, `getNext`, `getPrev` | $\mathcal{O}(1)$ next/prev traversal | $\mathcal{O}(N)$ | Instant transport deck navigation & DLL pointer telemetry HUD |
| **Queue (FIFO)** | `Queue<T>`, `QueueNode<T>` | Singly-linked pointer queue with head/tail pointers (`enqueue`, `dequeue`, `peek`, `clear`) | $\mathcal{O}(1)$ push / pop | $\mathcal{O}(Q)$ | "Up Next" FIFO buffer played automatically when current track ends |
| **Stack (LIFO)** | `Stack<T>`, `StackNode<T>` | Dynamic pointer stack with `push`, `pop`, `peek`, `clear` | $\mathcal{O}(1)$ push / pop | $\mathcal{O}(S)$ | **Playback History** stack & **LIFO Undo Engine** (reverts playlist deletions and sorts) |
| **Trie (Prefix Tree)** | `Trie`, `TrieNode` | N-ary character tree indexing titles, artists, and keywords with iterative prefix collection | $\mathcal{O}(k)$ lookup ($k$ = prefix length) | $\mathcal{O}(\Sigma \cdot k)$ | Real-time search bar with sub-millisecond autocomplete and lookup timer |
| **Hash Map** | `CustomHashMap<K, V>` | Hash table using `djb2` hash algorithm with separate chaining collision resolution and dynamic rehashing | $\mathcal{O}(1)$ avg lookup / insert / delete | $\mathcal{O}(N)$ | Favorite toggle and instantaneous song metadata lookups by unique ID |
| **Max-Heap (Priority Queue)** | `MaxHeap` | Binary heap maintaining the max-heap invariant keyed by track `playCount` (`heapifyUp`, `heapifyDown`, `getTopK`) | $\mathcal{O}(\log N)$ insert / update, $\mathcal{O}(K \log N)$ top-K | $\mathcal{O}(N)$ | Dynamic **"Top 5 Charts"** leaderboard updated in real-time on every play |
| **Sorting Algorithms** | Standalone algorithms | **Quick Sort** (Lomuto partition by Title) & **Merge Sort** (divide-and-conquer by Duration) | $\mathcal{O}(N \log N)$ comparisons | $\mathcal{O}(N)$ | Interactive table sort controls with telemetry badge showing comparisons & execution time |
| **Graph & BFS** | `Graph` (Adjacency List) | Undirected weighted graph connecting songs by genre overlap and tempo similarity; BFS traversal up to 2 hops | $\mathcal{O}(V + E)$ BFS traversal | $\mathcal{O}(V + E)$ | **"Recommended For You"** engine & interactive SVG Sonic Graph canvas modal |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: Dual-mode HTML5 Audio with Web Audio API Oscillator Synthesizer fallback
- **Bundler**: [Vite 8](https://vitejs.dev/)

---

## 📦 Project Structure

```
├── public/
│   ├── audio/              # Pre-bundled local audio MP3 tracks (song-1.mp3 to song-12.mp3)
│   └── favicon.svg         # Custom isometric 3D Rhythm Box logo
├── src/
│   ├── components/         # Workstation UI components
│   │   ├── DsaInspectorModal.tsx    # Live telemetry and complexity matrix modal
│   │   ├── DsaToast.tsx             # Floating notification showing asymptotic metrics
│   │   ├── GraphCanvasView.tsx      # Interactive SVG song relationship graph
│   │   ├── HeapLeaderboardView.tsx  # MaxHeap visualizer & Top 5 Charts
│   │   ├── PlayerDeck.tsx           # Vinyl turntable, transport controls, DLL pointer HUD, FIFO queue
│   │   ├── PlaylistTable.tsx        # Doubly Linked List table with QuickSort/MergeSort & Undo
│   │   ├── RhythmBoxLogo.tsx        # Custom isometric 3D vector logo
│   │   ├── TrieTerminalView.tsx     # Trie search engine with lookup latency
│   │   └── WorkstationHeader.tsx    # Studio tabs, sorting controls, and quick audio upload
│   ├── context/
│   │   └── MusicPlayerContext.tsx   # React Context connecting all 8 DSA structures to UI state
│   ├── data/
│   │   └── mockSongs.ts             # Initial song library and complexity reference definitions
│   ├── dsa/                         # Pure, zero-dependency custom DSA classes
│   │   ├── CustomHashMap.ts         # djb2 hash map with separate chaining
│   │   ├── DoublyLinkedList.ts      # Bidirectional linked list with active pointer
│   │   ├── Graph.ts                 # Adjacency list graph with BFS traversal
│   │   ├── MaxHeap.ts               # Binary max-heap priority queue
│   │   ├── Queue.ts                 # Singly-linked FIFO queue
│   │   ├── SortingAlgorithms.ts     # In-place QuickSort & recursive MergeSort
│   │   ├── Stack.ts                 # LIFO stack
│   │   └── Trie.ts                  # Prefix tree autocomplete
│   ├── services/
│   │   └── audioEngine.ts           # HTML5 audio playback and Web Audio synth fallback
│   ├── types/
│   │   └── index.ts                 # Unified TypeScript interfaces
│   ├── App.tsx                      # Main workstation layout
│   └── main.tsx                     # Entry point
├── package.json
└── vite.config.ts
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm or yarn

### Installation

```bash
# 1. Clone the repository
git clone git@github.com:swaruplinge07-art/Music-player-management-.git

# 2. Navigate to project root
cd Music-player-management-

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to start exploring!

### Production Build

```bash
npm run build
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

- <kbd>Space</kbd> : Toggle Play / Pause
- <kbd>N</kbd> : Next Track via Doubly Linked List ($\mathcal{O}(1)$)
- <kbd>P</kbd> : Previous Track via Doubly Linked List ($\mathcal{O}(1)$)
- <kbd>M</kbd> : Toggle Mute / Unmute
- <kbd>D</kbd> : Open / Close DSA Live Inspector

---

## 📄 License

This project is licensed under the MIT License.
