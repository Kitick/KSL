type Callback<T> = (data: T) => void;

export class EventManager<Events extends Record<string, unknown>> {
	private callbacks: Map<keyof Events, Array<Callback<unknown>>> = new Map();

	private get<K extends keyof Events>(name: K): Array<Callback<Events[K]>> {
		const callbacks = this.callbacks.get(name) ?? [];

		if(callbacks.length === 0){ this.callbacks.set(name, callbacks); }

		return callbacks;
	}

	has<K extends keyof Events>(name: K): boolean {
		return this.callbacks.has(name);
	}

	count<K extends keyof Events>(name: K): number {
		return this.callbacks.get(name)?.length ?? 0;
	}

	on<K extends keyof Events>(name: K, callback: Callback<Events[K]>): () => boolean {
		this.get(name).push(callback);
		return () => this.off(name, callback);
	}

	once<K extends keyof Events>(name: K, callback: Callback<Events[K]>): () => boolean {
		const wrapper = (data: Events[K]) => {
			this.off(name, wrapper);
			callback(data);
		}

		return this.on(name, wrapper);
	}

	off<K extends keyof Events>(name: K, callback: Callback<Events[K]>): boolean {
		if(!this.callbacks.has(name)){ return false; }

		const callbacks = this.get(name);
		const index = callbacks.indexOf(callback);

		if(index === -1){ return false; }

		callbacks.splice(index, 1);

		if(callbacks.length === 0){ this.callbacks.delete(name); }

		return true;
	}

	offAll<K extends keyof Events>(name: K): boolean {
		return this.callbacks.delete(name);
	}

	clear(): void {
		this.callbacks.clear();
	}

	emit<K extends keyof Events>(name: K, data: Events[K]): number {
		if(!this.callbacks.has(name)){ return 0; }

		const callbacks = this.get(name);

		for(const callback of callbacks){ callback(data); }

		return callbacks.length;
	}
}