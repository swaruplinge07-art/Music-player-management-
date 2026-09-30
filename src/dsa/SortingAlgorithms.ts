import type { Song, SortMetrics } from '../types';

/**
 * Custom Sorting Algorithms for Spotify DSA Playlist.
 * Implements Quick Sort (Title Alphabetical) and Merge Sort (Duration Numerical).
 * Does not use native Array.prototype.sort.
 * Tracks comparison count, swaps/merges, and runtime execution metrics.
 */

export interface SortResult {
  sortedSongs: Song[];
  metrics: SortMetrics;
}

/**
 * Quick Sort implementation for sorting songs alphabetically by Title.
 * Average Time Complexity: O(N log N), Worst: O(N^2)
 * Space Complexity: O(log N) recursion stack
 */
export function quickSortPlaylist(songs: Song[]): SortResult {
  const startTime = performance.now();
  const arr: Song[] = [];
  for (let i = 0; i < songs.length; i++) {
    arr.push({ ...songs[i] });
  }

  let comparisons = 0;
  let swaps = 0;

  function swap(i: number, j: number) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    swaps++;
  }

  function partition(low: number, high: number): number {
    const pivot = arr[high].title.toLowerCase();
    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      if (arr[j].title.toLowerCase().localeCompare(pivot) < 0) {
        i++;
        swap(i, j);
      }
    }

    swap(i + 1, high);
    return i + 1;
  }

  function quickSortInternal(low: number, high: number): void {
    if (low < high) {
      const pi = partition(low, high);
      quickSortInternal(low, pi - 1);
      quickSortInternal(pi + 1, high);
    }
  }

  if (arr.length > 1) {
    quickSortInternal(0, arr.length - 1);
  }

  const endTime = performance.now();

  return {
    sortedSongs: arr,
    metrics: {
      algorithm: 'Quick Sort (Alphabetical by Title)',
      timeComplexity: 'O(N log N) avg / O(N²) worst',
      comparisons,
      swapsOrMerges: swaps,
      executionTimeMs: Number((endTime - startTime).toFixed(3)),
    },
  };
}

/**
 * Merge Sort implementation for sorting songs numerically by Duration.
 * Time Complexity: O(N log N) guaranteed
 * Space Complexity: O(N) auxiliary array
 */
export function mergeSortPlaylist(songs: Song[]): SortResult {
  const startTime = performance.now();
  const arr: Song[] = [];
  for (let i = 0; i < songs.length; i++) {
    arr.push({ ...songs[i] });
  }

  let comparisons = 0;
  let merges = 0;

  function merge(left: Song[], right: Song[]): Song[] {
    const merged: Song[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i].duration <= right[j].duration) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
      }
      merges++;
    }

    while (i < left.length) {
      merged.push(left[i]);
      i++;
      merges++;
    }

    while (j < right.length) {
      merged.push(right[j]);
      j++;
      merges++;
    }

    return merged;
  }

  function mergeSortInternal(items: Song[]): Song[] {
    if (items.length <= 1) {
      return items;
    }

    const mid = Math.floor(items.length / 2);
    const leftPart: Song[] = [];
    const rightPart: Song[] = [];

    for (let i = 0; i < mid; i++) {
      leftPart.push(items[i]);
    }
    for (let i = mid; i < items.length; i++) {
      rightPart.push(items[i]);
    }

    const sortedLeft = mergeSortInternal(leftPart);
    const sortedRight = mergeSortInternal(rightPart);

    return merge(sortedLeft, sortedRight);
  }

  const sortedSongs = mergeSortInternal(arr);
  const endTime = performance.now();

  return {
    sortedSongs,
    metrics: {
      algorithm: 'Merge Sort (Numerical by Duration)',
      timeComplexity: 'O(N log N) guaranteed',
      comparisons,
      swapsOrMerges: merges,
      executionTimeMs: Number((endTime - startTime).toFixed(3)),
    },
  };
}
