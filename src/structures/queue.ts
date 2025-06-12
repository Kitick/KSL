export class Queue<T> {
	protected data: Array<T> = [];

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

export class PriorityQueue<T> extends Queue<T> {
	private comparator: (a: T, b: T) => number;

	constructor(comparator: (a: T, b: T) => number) {
		super();
		this.comparator = comparator;
	}

	enqueue(item: T): number {
		this.data.push(item);
		this.data.sort(this.comparator);
		return this.data.length;
	}
}