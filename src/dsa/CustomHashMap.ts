/**
 * Custom Hash Map with separate chaining collision resolution and polynomial rolling hash.
 * Provides O(1) average lookup, insertion, and deletion.
 * Includes bucket inspection metrics for educational visualization.
 */

class HashEntry<V> {
  public key: string;
  public value: V;
  public next: HashEntry<V> | null = null;

  constructor(key: string, value: V) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

export class CustomHashMap<V> {
  private buckets: (HashEntry<V> | null)[];
  private capacity: number;
  private _size: number = 0;
  private readonly maxLoadFactor: number = 0.75;

  constructor(initialCapacity: number = 19) {
    this.capacity = initialCapacity;
    this.buckets = new Array(this.capacity).fill(null);
    this._size = 0;
  }

  /**
   * Polynomial rolling hash function (djb2 variant).
   * Generates a deterministic bucket index in O(L) where L = key length.
   */
  public hash(key: string): number {
    let hashVal = 5381;
    for (let i = 0; i < key.length; i++) {
      hashVal = (hashVal * 33) ^ key.charCodeAt(i);
    }
    // Ensure non-negative integer within capacity
    return Math.abs(hashVal) % this.capacity;
  }

  /**
   * Insert or update key-value pair in O(1) average time.
   */
  public put(key: string, value: V): void {
    const index = this.hash(key);
    let head = this.buckets[index];

    // Check if key already exists in the chain
    let curr = head;
    while (curr !== null) {
      if (curr.key === key) {
        curr.value = value;
        return;
      }
      curr = curr.next;
    }

    // Insert new entry at the head of the chain (O(1))
    const newEntry = new HashEntry(key, value);
    newEntry.next = head;
    this.buckets[index] = newEntry;
    this._size++;

    // Resize if load factor exceeds threshold
    if (this._size / this.capacity > this.maxLoadFactor) {
      this.resize(this.capacity * 2 + 1);
    }
  }

  /**
   * Retrieve value by key in O(1) average time.
   */
  public get(key: string): V | undefined {
    const index = this.hash(key);
    let curr = this.buckets[index];

    while (curr !== null) {
      if (curr.key === key) {
        return curr.value;
      }
      curr = curr.next;
    }

    return undefined;
  }

  /**
   * Check if key exists in O(1) average time.
   */
  public has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Remove key from map in O(1) average time.
   */
  public remove(key: string): boolean {
    const index = this.hash(key);
    let curr = this.buckets[index];
    let prev: HashEntry<V> | null = null;

    while (curr !== null) {
      if (curr.key === key) {
        if (prev === null) {
          this.buckets[index] = curr.next;
        } else {
          prev.next = curr.next;
        }
        this._size--;
        return true;
      }
      prev = curr;
      curr = curr.next;
    }

    return false;
  }

  public size(): number {
    return this._size;
  }

  public entries(): [string, V][] {
    const result: [string, V][] = [];
    for (let i = 0; i < this.capacity; i++) {
      let curr = this.buckets[i];
      while (curr !== null) {
        result.push([curr.key, curr.value]);
        curr = curr.next;
      }
    }
    return result;
  }

  public keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < this.capacity; i++) {
      let curr = this.buckets[i];
      while (curr !== null) {
        result.push(curr.key);
        curr = curr.next;
      }
    }
    return result;
  }

  public values(): V[] {
    const result: V[] = [];
    for (let i = 0; i < this.capacity; i++) {
      let curr = this.buckets[i];
      while (curr !== null) {
        result.push(curr.value);
        curr = curr.next;
      }
    }
    return result;
  }

  public clear(): void {
    this.buckets = new Array(this.capacity).fill(null);
    this._size = 0;
  }

  /**
   * Internal resize and rehash function.
   */
  private resize(newCapacity: number): void {
    const oldBuckets = this.buckets;
    this.capacity = newCapacity;
    this.buckets = new Array(newCapacity).fill(null);
    this._size = 0;

    for (let i = 0; i < oldBuckets.length; i++) {
      let curr = oldBuckets[i];
      while (curr !== null) {
        this.put(curr.key, curr.value);
        curr = curr.next;
      }
    }
  }

  /**
   * Inspection metadata for live DSA visualizer tab.
   */
  public getBucketMetrics(): {
    capacity: number;
    size: number;
    loadFactor: number;
    collisionCount: number;
    buckets: { index: number; chainLength: number; keys: string[] }[];
  } {
    let collisions = 0;
    const bucketDetails: { index: number; chainLength: number; keys: string[] }[] = [];

    for (let i = 0; i < this.capacity; i++) {
      let length = 0;
      const keys: string[] = [];
      let curr = this.buckets[i];

      while (curr !== null) {
        length++;
        keys.push(curr.key);
        curr = curr.next;
      }

      if (length > 1) {
        collisions += length - 1;
      }

      bucketDetails.push({ index: i, chainLength: length, keys });
    }

    return {
      capacity: this.capacity,
      size: this._size,
      loadFactor: Number((this._size / this.capacity).toFixed(2)),
      collisionCount: collisions,
      buckets: bucketDetails,
    };
  }
}
