import type { Song } from '../types';

/**
 * Custom Max-Heap (Priority Queue) keyed by song playCount.
 * Used for the dynamic "Top 5 Charts" shelf.
 * Supports O(log N) insert/extract and O(N) Floyd heapify.
 */

export class MaxHeap {
  private heap: Song[];

  constructor() {
    this.heap = [];
  }

  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private leftChild(index: number): number {
    return 2 * index + 1;
  }

  private rightChild(index: number): number {
    return 2 * index + 2;
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  /**
   * Sift-up to restore heap property after insertion.
   * Time Complexity: O(log N).
   */
  private siftUp(index: number): void {
    let curr = index;
    while (curr > 0) {
      const p = this.parent(curr);
      if (this.heap[curr].playCount > this.heap[p].playCount) {
        this.swap(curr, p);
        curr = p;
      } else {
        break;
      }
    }
  }

  /**
   * Sift-down to restore heap property after extractMax.
   * Time Complexity: O(log N).
   */
  private siftDown(index: number, heapLength: number = this.heap.length): void {
    let curr = index;

    while (this.leftChild(curr) < heapLength) {
      let maxChildIdx = this.leftChild(curr);
      const rightIdx = this.rightChild(curr);

      if (
        rightIdx < heapLength &&
        this.heap[rightIdx].playCount > this.heap[maxChildIdx].playCount
      ) {
        maxChildIdx = rightIdx;
      }

      if (this.heap[curr].playCount < this.heap[maxChildIdx].playCount) {
        this.swap(curr, maxChildIdx);
        curr = maxChildIdx;
      } else {
        break;
      }
    }
  }

  /**
   * Insert a song into the heap.
   * Time Complexity: O(log N).
   */
  public insert(song: Song): void {
    this.heap.push({ ...song });
    this.siftUp(this.heap.length - 1);
  }

  /**
   * Extract the song with the highest playCount.
   * Time Complexity: O(log N).
   */
  public extractMax(): Song | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop() || null;

    const max = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.siftDown(0);
    return max;
  }

  /**
   * Peek at current max without extraction in O(1) time.
   */
  public peekMax(): Song | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  /**
   * Floyd's bottom-up heapify in O(N) time.
   */
  public rebuildHeap(songs: Song[]): void {
    this.heap = [];
    for (let i = 0; i < songs.length; i++) {
      this.heap.push({ ...songs[i] });
    }

    const startIdx = Math.floor(this.heap.length / 2) - 1;
    for (let i = startIdx; i >= 0; i--) {
      this.siftDown(i);
    }
  }

  /**
   * Update play count for a song and restore heap property.
   */
  public updateSongPlayCount(songId: string, newCount: number): void {
    for (let i = 0; i < this.heap.length; i++) {
      if (this.heap[i].id === songId) {
        const oldCount = this.heap[i].playCount;
        this.heap[i].playCount = newCount;
        if (newCount > oldCount) {
          this.siftUp(i);
        } else {
          this.siftDown(i);
        }
        return;
      }
    }
  }

  /**
   * Extract top K elements without mutating the primary heap.
   * Time Complexity: O(K log N).
   */
  public getTopK(k: number): Song[] {
    const tempHeap = new MaxHeap();
    tempHeap.rebuildHeap(this.heap);

    const result: Song[] = [];
    const limit = Math.min(k, tempHeap.size());

    for (let i = 0; i < limit; i++) {
      const top = tempHeap.extractMax();
      if (top !== null) {
        result.push(top);
      }
    }

    return result;
  }

  public size(): number {
    return this.heap.length;
  }

  public getRawArray(): Song[] {
    return this.heap.map((s) => ({ ...s }));
  }

  /**
   * Returns a hierarchical tree representation for the DSA inspector.
   */
  public getTreeRepresentation(): any {
    if (this.heap.length === 0) return null;

    const buildNode = (idx: number): any => {
      if (idx >= this.heap.length) return null;
      const song = this.heap[idx];
      return {
        id: song.id,
        title: song.title,
        playCount: song.playCount,
        index: idx,
        left: buildNode(2 * idx + 1),
        right: buildNode(2 * idx + 2),
      };
    };

    return buildNode(0);
  }
}
