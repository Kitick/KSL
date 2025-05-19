export class Stack<T> {
	private data: Array<T> = [];

	get size(): number { return this.data.length; }

	isEmpty(): boolean { return this.data.length === 0; }

	push(item: T): number {
		return this.data.push(item);
	}

	pop(): T | undefined {
		return this.data.pop();
	}

	peek(): T | undefined {
		return this.data[this.data.length - 1];
	}
}