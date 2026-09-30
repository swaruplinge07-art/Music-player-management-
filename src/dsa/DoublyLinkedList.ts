/**
 * Custom Doubly Linked List implementation for Playlist Navigation.
 * Provides O(1) Next/Previous pointer transitions without array scanning.
 */

export class SongNode<T> {
  public data: T;
  public id: string;
  public prev: SongNode<T> | null = null;
  public next: SongNode<T> | null = null;

  constructor(data: T, id: string) {
    this.data = data;
    this.id = id;
  }
}

export class DoublyLinkedList<T> {
  public head: SongNode<T> | null = null;
  public tail: SongNode<T> | null = null;
  public current: SongNode<T> | null = null;
  private _size: number = 0;

  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this._size = 0;
  }

  /**
   * Append a node to the tail of the list in O(1) time.
   */
  public append(item: T, id: string): SongNode<T> {
    const newNode = new SongNode(item, id);

    if (this.head === null || this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
      if (this.current === null) {
        this.current = newNode;
      }
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    this._size++;
    return newNode;
  }

  /**
   * Prepend a node to the head of the list in O(1) time.
   */
  public prepend(item: T, id: string): SongNode<T> {
    const newNode = new SongNode(item, id);

    if (this.head === null || this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this._size++;
    return newNode;
  }

  /**
   * Insert at a specific index by traversing pointer links.
   */
  public insertAt(index: number, item: T, id: string): boolean {
    if (index < 0 || index > this._size) return false;

    if (index === 0) {
      this.prepend(item, id);
      return true;
    }
    if (index === this._size) {
      this.append(item, id);
      return true;
    }

    let currNode = this.head;
    let currIdx = 0;
    while (currNode !== null && currIdx < index) {
      currNode = currNode.next;
      currIdx++;
    }

    if (!currNode) return false;

    const newNode = new SongNode(item, id);
    const prevNode = currNode.prev;

    if (prevNode) {
      prevNode.next = newNode;
      newNode.prev = prevNode;
    }
    newNode.next = currNode;
    currNode.prev = newNode;

    this._size++;
    return true;
  }

  /**
   * Remove a node by songId, rewiring prev and next pointers in O(1) once located.
   */
  public remove(id: string): SongNode<T> | null {
    let curr = this.head;

    while (curr !== null) {
      if (curr.id === id) {
        // If current active node is being removed, advance or retreat
        if (this.current === curr) {
          this.current = curr.next !== null ? curr.next : curr.prev;
        }

        if (curr.prev !== null) {
          curr.prev.next = curr.next;
        } else {
          // curr was head
          this.head = curr.next;
        }

        if (curr.next !== null) {
          curr.next.prev = curr.prev;
        } else {
          // curr was tail
          this.tail = curr.prev;
        }

        curr.prev = null;
        curr.next = null;
        this._size--;
        return curr;
      }
      curr = curr.next;
    }

    return null;
  }

  /**
   * Find a node by id by walking forward through the chain.
   */
  public findNode(id: string): SongNode<T> | null {
    let curr = this.head;
    while (curr !== null) {
      if (curr.id === id) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }

  /**
   * Explicitly set the active playing node.
   */
  public setCurrent(id: string): SongNode<T> | null {
    const node = this.findNode(id);
    if (node !== null) {
      this.current = node;
    }
    return node;
  }

  /**
   * O(1) traversal to the next node.
   * If at tail, wrap around to head for continuous playlist playback.
   */
  public getNext(): SongNode<T> | null {
    if (this.current === null) {
      this.current = this.head;
      return this.current;
    }

    if (this.current.next !== null) {
      this.current = this.current.next;
    } else {
      // Loop to beginning
      this.current = this.head;
    }
    return this.current;
  }

  /**
   * O(1) traversal to the previous node.
   * If at head, wrap around to tail.
   */
  public getPrev(): SongNode<T> | null {
    if (this.current === null) {
      this.current = this.tail;
      return this.current;
    }

    if (this.current.prev !== null) {
      this.current = this.current.prev;
    } else {
      // Loop to end
      this.current = this.tail;
    }
    return this.current;
  }

  public peekNext(): SongNode<T> | null {
    if (this.current === null) return this.head;
    return this.current.next !== null ? this.current.next : this.head;
  }

  public peekPrev(): SongNode<T> | null {
    if (this.current === null) return this.tail;
    return this.current.prev !== null ? this.current.prev : this.tail;
  }

  public size(): number {
    return this._size;
  }

  public isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Convert list to array by manual traversal without shortcuts.
   */
  public toArray(): T[] {
    const result: T[] = [];
    let curr = this.head;
    while (curr !== null) {
      result.push(curr.data);
      curr = curr.next;
    }
    return result;
  }

  /**
   * Replaces list items from an array.
   */
  public fromArray(items: T[], idExtractor: (item: T) => string): void {
    this.clear();
    for (let i = 0; i < items.length; i++) {
      this.append(items[i], idExtractor(items[i]));
    }
  }

  public clear(): void {
    this.head = null;
    this.tail = null;
    this.current = null;
    this._size = 0;
  }

  /**
   * Visualizer helper returning nodes with structural pointer metadata.
   */
  public getNodesInfo(): {
    id: string;
    isCurrent: boolean;
    isHead: boolean;
    isTail: boolean;
    prevId: string | null;
    nextId: string | null;
    data: T;
  }[] {
    const list: {
      id: string;
      isCurrent: boolean;
      isHead: boolean;
      isTail: boolean;
      prevId: string | null;
      nextId: string | null;
      data: T;
    }[] = [];

    let curr = this.head;
    while (curr !== null) {
      list.push({
        id: curr.id,
        isCurrent: this.current !== null && this.current.id === curr.id,
        isHead: this.head !== null && this.head.id === curr.id,
        isTail: this.tail !== null && this.tail.id === curr.id,
        prevId: curr.prev ? curr.prev.id : null,
        nextId: curr.next ? curr.next.id : null,
        data: curr.data,
      });
      curr = curr.next;
    }
    return list;
  }
}
