/**
 * Custom Queue (FIFO Buffer) implementation using internal linked nodes.
 * Used for the "Up Next" queue buffer.
 * Guarantees O(1) enqueue and O(1) dequeue operations.
 */

class QueueNode<T> {
  public value: T;
  public next: QueueNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class Queue<T> {
  private front: QueueNode<T> | null = null;
  private rear: QueueNode<T> | null = null;
  private _size: number = 0;

  constructor() {
    this.front = null;
    this.rear = null;
    this._size = 0;
  }

  /**
   * Enqueue element to the rear of the queue in O(1) time.
   */
  public enqueue(item: T): void {
    const newNode = new QueueNode(item);

    if (this.rear === null) {
      this.front = newNode;
      this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }

    this._size++;
  }

  /**
   * Dequeue element from the front in O(1) time.
   */
  public dequeue(): T | null {
    if (this.front === null) {
      return null;
    }

    const removedNode = this.front;
    this.front = this.front.next;

    if (this.front === null) {
      this.rear = null;
    }

    this._size--;
    return removedNode.value;
  }

  /**
   * Peek front element without removal in O(1) time.
   */
  public peek(): T | null {
    if (this.front === null) return null;
    return this.front.value;
  }

  public isEmpty(): boolean {
    return this._size === 0;
  }

  public size(): number {
    return this._size;
  }

  /**
   * Convert queue to array in FIFO order (Front -> Rear).
   */
  public toArray(): T[] {
    const arr: T[] = [];
    let curr = this.front;
    while (curr !== null) {
      arr.push(curr.value);
      curr = curr.next;
    }
    return arr;
  }

  /**
   * Remove a specific item matching predicate (e.g. user removes track from queue drawer).
   */
  public remove(predicate: (item: T) => boolean): boolean {
    if (this.front === null) return false;

    // Check front
    if (predicate(this.front.value)) {
      this.dequeue();
      return true;
    }

    let prev = this.front;
    let curr = this.front.next;

    while (curr !== null) {
      if (predicate(curr.value)) {
        prev.next = curr.next;
        if (curr === this.rear) {
          this.rear = prev;
        }
        this._size--;
        return true;
      }
      prev = curr;
      curr = curr.next;
    }

    return false;
  }

  public clear(): void {
    this.front = null;
    this.rear = null;
    this._size = 0;
  }
}
