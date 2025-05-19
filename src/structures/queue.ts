export class Queue<T> {
	private data: Array<T> = [];

	get size(): number { return this.data.length; }

	isEmpty(): boolean { return this.data.length === 0; }

	enqueue(item: T): number {
		return this.data.push(item);
	}

	dequeue(): T | undefined {
		return this.data.shift();
	}

	peek(): T | undefined {
		return this.data[0];
	}
}