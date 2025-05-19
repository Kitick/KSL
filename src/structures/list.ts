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

	get(index: number): T | undefined {
		index = this.checkIndex(index);
		return this.data[index];
	}

	set(index: number, item: T): void {
		index = this.checkIndex(index);
		this.data[index] = item;
	}

	del(index: number): T | undefined {
		index = this.checkIndex(index);
		return this.data.splice(index, 1)[0];
	}

	add(item: T): number {
		return this.data.push(item) - 1;
	}
}