export class List<T> {
	private data: Array<T> = [];

	get size(): number { return this.data.length; }

	isEmpty(): boolean { return this.data.length === 0; }

	private checkIndex(index: number): number {
		const length = this.data.length;

		if(index < 0){ index += length; }
		if(index < 0 || index >= length){ throw new RangeError(`Index ${index} is out of bounds`); }

		return index;
	}

	get(index: number): T {
		index = this.checkIndex(index);
		return this.data[index];
	}

	tryGet(index: number): T | undefined {
		try{ return this.get(index); }
		catch { return undefined; }
	}

	insert(item: T, index: number): void {
		index = this.checkIndex(index);
		this.data[index] = item;
	}

	remove(index: number): T | undefined {
		index = this.checkIndex(index);
		return this.data.splice(index, 1)[0];
	}

	add(item: T): number {
		return this.data.push(item) - 1;
	}

	clear(): void {
		this.data = [];
	}

	*[Symbol.iterator](): Iterator<T> {
		for(const item of this.data){
			yield item;
		}
	}
}

import { LinkedNode } from "./node";

const enum Links { Prev, Next }

class ListNode<T> extends LinkedNode<T, Links> {
	constructor(data: T) {
		super(data, 2);
	}

	private insertBetween(prev: ListNode<T> | null, next: ListNode<T> | null): void {
		this.link(prev, Links.Prev);
		this.link(next, Links.Next);

		if(prev){ prev.link(this, Links.Next); }
		if(next){ next.link(this, Links.Prev); }
	}

	insertAfter(node: ListNode<T>): void {
		const next = node.tryget<ListNode<T>>(Links.Next);
		this.insertBetween(node, next);
	}

	insertBefore(node: ListNode<T>): void {
		const prev = node.tryget<ListNode<T>>(Links.Prev);
		this.insertBetween(prev, node);
	}
}

export class LinkedList<T> {
	private head: ListNode<T> | null = null;
	private tail: ListNode<T> | null = null;
	private size: number = 0;

	isEmpty(): boolean { return this.size === 0; }

	private checkIndex(index: number): number {
		if(index < 0){ index += this.size; }
		if(index < 0 || index >= this.size){ throw new RangeError(`Index ${index} is out of bounds`); }

		return index;
	}

	private getNode(index: number): ListNode<T> {
		index = this.checkIndex(index);

		if(index === this.size - 1){ return this.tail!; }

		let current = this.head!;
		for(let i = 0; i < index; i++){
			current = current.get(Links.Next);
		}

		return current;
	}

	get(index: number): T {
		return this.getNode(index).data;
	}

	tryget(index: number): T | undefined {
		try { return this.get(index); }
		catch { return undefined; }
	}

	insert(item: T, index: number = this.size): void {
		const newNode = new ListNode(item);
		this.size++;

		if(index === this.size){
			if(index === 0){ this.head = newNode; }
			else { this.tail = newNode; }
			return;
		}

		index = this.checkIndex(index);
		this.getNode(index).insertBefore(newNode);
	}

	clear(): void {
		this.head = null;
		this.tail = null;
		this.size = 0;
	}
}