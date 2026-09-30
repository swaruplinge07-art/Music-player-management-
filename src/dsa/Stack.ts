/**
 * Custom Stack (LIFO) implementation using pointer-linked nodes.
 * Used for:
 * 1. Playback History Stack (tracking tracks played)
 * 2. Undo Stack (reverting deletions, sort states, and library edits)
 */

class StackNode<T> {
  public value: T;
  public next: StackNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class Stack<T> {
  private topNode: StackNode<T> | null = null;
  private _size: number = 0;

  constructor() {
    this.topNode = null;
    this._size = 0;
  }

  /**
   * Push an item onto the top of the stack in O(1) time.
   */
  public push(item: T): void {
    const newNode = new StackNode(item);
    newNode.next = this.topNode;
    this.topNode = newNode;
    this._size++;
  }

  /**
   * Pop an item from the top of the stack in O(1) time.
   */
  public pop(): T | null {
    if (this.topNode === null) {
      return null;
    }

    const popped = this.topNode.value;
    this.topNode = this.topNode.next;
    this._size--;
    return popped;
  }

  /**
   * Peek at the top item without removing it in O(1) time.
   */
  public peek(): T | null {
    if (this.topNode === null) return null;
    return this.topNode.value;
  }

  public isEmpty(): boolean {
    return this._size === 0;
  }

  public size(): number {
    return this._size;
  }

  /**
   * Returns items from Top to Bottom.
   */
  public toArray(): T[] {
    const arr: T[] = [];
    let curr = this.topNode;
    while (curr !== null) {
      arr.push(curr.value);
      curr = curr.next;
    }
    return arr;
  }

  public clear(): void {
    this.topNode = null;
    this._size = 0;
  }
}
