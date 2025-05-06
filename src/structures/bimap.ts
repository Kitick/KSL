export class BiMap<K, V> {
	private forward: Map<K, V> = new Map();
	private backward: Map<V, K> = new Map();

	get size(): number { return this.forward.size; }

	set(key: K, value: V): void {
		this.delete(key);
		this.delete(value, true);

		this.forward.set(key, value);
		this.backward.set(value, key);
	}

	get(key: K, reverse?: false): V | undefined;
	get(value: V, reverse: true): K | undefined;

	get(item: K | V, reverse: boolean = false): K | V | undefined {
		if(reverse){ return this.backward.get(item as V); }
		return this.forward.get(item as K);
	}

	has(key: K, reverse?: false): boolean;
	has(value: V, reverse: true): boolean;

	has(item: K | V, reverse: boolean = false): boolean {
		if(reverse){ return this.backward.has(item as V); }
		return this.forward.has(item as K);
	}

	delete(key: K, reverse?: false): boolean;
	delete(value: V, reverse: true): boolean;

	delete(item: K | V, reverse: boolean = false): boolean {
		let key: K | undefined;
		let value: V | undefined;

		if(reverse){ value = item as V; key = this.backward.get(value); }
		else{ key = item as K; value = this.forward.get(key); }

		if(key === undefined || value === undefined){ return false; }

		this.forward.delete(key);
		this.backward.delete(value);

		return true;
	}

	clear(): void {
		this.forward.clear();
		this.backward.clear();
	}
}