import FS from "fs/promises";
import Path from "path";

export class DataFile<T> {
	private data: Map<string, T> = new Map();
	private path!: string;

	constructor(path: string) { this.filepath = path; }

	get filepath(): string { return this.path; }
	set filepath(path: string) { this.path = Path.resolve(path); }

	private async loadFile(): Promise<Record<string, T>> {
		const raw = await FS.readFile(this.path, "utf-8")
		.catch(error => {
			console.log(`Loading... ${this.path}`);
			if(error.code === "ENOENT"){ return "{}"; }
			throw error;
		});

		console.log(`Loaded ${this.path}`);

		return JSON.parse(raw);
	}

	private async saveFile(data: Record<string, T>): Promise<void> {
		const raw = JSON.stringify(data, undefined, "\t");

		await FS.writeFile(this.path, raw)
		.catch(error => {
			console.log(`Saving... ${this.path}`);
			throw error;
		});

		console.log(`Saved ${this.path}`);
	}

	async refresh(): Promise<void> {
		const obj = await this.loadFile();
		this.data = new Map(Object.entries(obj));
	}

	async commit(): Promise<void> {
		const obj = Object.fromEntries(this.data);
		await this.saveFile(obj);
	}

	keys(): string[] {return Array.from(this.data.keys()); }
	values(): T[] { return Array.from(this.data.values()); }
	entries(): [string, T][] { return Array.from(this.data.entries()); }

	has(id: string): boolean {
		return this.data.has(id);
	}

	load(id: string): T | undefined {
		return this.data.get(id);
	}

	save(id: string, data: T): this {
		this.data.set(id, data);
		return this;
	}

	delete(id: string): this {
		this.data.delete(id);
		return this;
	}

	loadState<T2 extends T>(id: string, target: T2, set: Array<keyof T>): T2 {
		const data = this.load(id);
		if(data === undefined){ throw new Error(`${id} does not exist`); }

		set.forEach(key => {
			target[key] = data![key] as T2[keyof T];
		});

		return target;
	}

	saveState<T2 extends T>(id: string, target: T2, set: Array<keyof T>): this {
		const data = {} as T;

		set.forEach(key => {
			data[key] = target[key];
		});

		return this.save(id, data);
	}
}