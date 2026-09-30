import type { Song } from '../types';

/**
 * Trie (Prefix Tree) implementation for Instant Autocomplete & Search.
 * Guarantees O(k) prefix lookups where k = query length.
 */

export class TrieNode {
  public children: Map<string, TrieNode>;
  public isEndOfWord: boolean;
  public songs: Song[]; // Songs ending or matching at this exact node

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.songs = [];
  }
}

export class Trie {
  public root: TrieNode;
  private _wordCount: number = 0;

  constructor() {
    this.root = new TrieNode();
    this._wordCount = 0;
  }

  /**
   * Insert a word or phrase into the Trie associated with a song.
   * Time Complexity: O(L) where L is the length of the string.
   */
  public insert(word: string, song: Song): void {
    if (!word || word.trim().length === 0) return;

    const normalized = word.toLowerCase().trim();
    let current = this.root;

    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }

    current.isEndOfWord = true;
    // Avoid duplicate song entries in the same node
    let alreadyExists = false;
    for (let i = 0; i < current.songs.length; i++) {
      if (current.songs[i].id === song.id) {
        alreadyExists = true;
        break;
      }
    }
    if (!alreadyExists) {
      current.songs.push(song);
    }
    this._wordCount++;
  }

  /**
   * Index all searchable tokens of a song (title, artist, album, words).
   */
  public indexSong(song: Song): void {
    // Index full title
    this.insert(song.title, song);
    // Index full artist
    this.insert(song.artist, song);
    // Index full album
    this.insert(song.album, song);

    // Index individual words within title
    const titleWords = song.title.split(/\s+/);
    for (let i = 0; i < titleWords.length; i++) {
      const cleanWord = titleWords[i].replace(/[^a-zA-Z0-9]/g, '');
      if (cleanWord.length > 1) {
        this.insert(cleanWord, song);
      }
    }

    // Index individual words within artist
    const artistWords = song.artist.split(/\s+/);
    for (let i = 0; i < artistWords.length; i++) {
      const cleanWord = artistWords[i].replace(/[^a-zA-Z0-9]/g, '');
      if (cleanWord.length > 1) {
        this.insert(cleanWord, song);
      }
    }
  }

  /**
   * Step down the Trie matching character-by-character.
   * Time Complexity: O(k) where k = prefix.length.
   */
  public searchPrefix(prefix: string): TrieNode | null {
    if (!prefix) return this.root;

    const normalized = prefix.toLowerCase().trim();
    let current = this.root;

    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      if (!current.children.has(char)) {
        return null;
      }
      current = current.children.get(char)!;
    }

    return current;
  }

  /**
   * Recursively collect all songs with the given prefix node using DFS.
   */
  public collectAllWithPrefix(node: TrieNode | null, collectedSongMap: Map<string, Song>): void {
    if (node === null) return;

    // Collect songs at current node
    for (let i = 0; i < node.songs.length; i++) {
      const s = node.songs[i];
      if (!collectedSongMap.has(s.id)) {
        collectedSongMap.set(s.id, s);
      }
    }

    // Traverse children nodes
    for (const [, childNode] of node.children) {
      this.collectAllWithPrefix(childNode, collectedSongMap);
    }
  }

  /**
   * High-level query method returning unique matching songs in O(k + M) time.
   */
  public query(prefix: string): { songs: Song[]; lookupTimeMs: number; prefixFound: boolean } {
    const start = performance.now();
    const cleanPrefix = prefix.toLowerCase().trim();

    if (!cleanPrefix) {
      return { songs: [], lookupTimeMs: 0, prefixFound: false };
    }

    const prefixNode = this.searchPrefix(cleanPrefix);
    if (!prefixNode) {
      const end = performance.now();
      return { songs: [], lookupTimeMs: Math.max(0.01, end - start), prefixFound: false };
    }

    const collectedMap = new Map<string, Song>();
    this.collectAllWithPrefix(prefixNode, collectedMap);

    const result: Song[] = [];
    for (const song of collectedMap.values()) {
      result.push(song);
    }

    const end = performance.now();
    return {
      songs: result,
      lookupTimeMs: Math.max(0.01, end - start),
      prefixFound: true,
    };
  }

  /**
   * Generates a visualization tree for the UI inspector.
   */
  public getVisualTree(prefix: string = '', _maxNodes: number = 18): any {
    const buildSubtree = (node: TrieNode, char: string, currentPath: string, depth: number): any => {
      const isTarget = currentPath === prefix.toLowerCase();
      const childrenArr: any[] = [];

      let count = 0;
      for (const [ch, child] of node.children) {
        if (count < 4 && depth < 3) {
          childrenArr.push(buildSubtree(child, ch, currentPath + ch, depth + 1));
          count++;
        }
      }

      return {
        char: char || 'ROOT',
        isEndOfWord: node.isEndOfWord,
        path: currentPath,
        isTarget,
        songCount: node.songs.length,
        children: childrenArr,
      };
    };

    return buildSubtree(this.root, '', '', 0);
  }

  public clear(): void {
    this.root = new TrieNode();
    this._wordCount = 0;
  }
}
