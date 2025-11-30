export abstract class Component {
	public enabled: boolean = true;
}

export namespace Component {
	export type Type<T extends Component = Component> = new () => T;
	export type List<T extends Component = Component> = Array<T | null>;

	export class Storage {
		private readonly components: Map<Type, List> = new Map();
		private entities: number = 0;

		public get entityCount(): number { return this.entities; }
		public get componentCount(): number { return this.components.size; }
		public get list(): Type[] { return Array.from(this.components.keys()); }

		private init<T extends Component>(type: Type<T>): List<T> {
			const components = new Array(this.entities).fill(null) as List<T>;
			this.components.set(type, components);
			return components;
		}

		private save<T extends Component>(type: Type<T>, id: number, component: T | null): boolean {
			if (id < 0 || id >= this.entities) { return false; }
			this.load(type)[id] = component;
			return true;
		}

		private load<T extends Component>(type: Type<T>): List<T> {
			const components = this.components.get(type) as List<T> | undefined;
			if (components === undefined) { return this.init(type); }
			return components;
		}

		public alloc(): number {
			for (const components of this.components.values()) {
				components.push(null);
			}
			return this.entities++;
		}

		public free(id: number): boolean {
			if (id < 0 || id >= this.entities) { return false; }

			for (const components of this.components.values()) {
				components[id] = components.at(-1)!;
				components.pop();
			}

			this.entities--;
			return true;
		}

		public new<T extends Component>(type: Type<T>, id: number): T {
			const component = new type();
			this.save(type, id, component);
			return component;
		}

		public get<T extends Component>(type: Type<T>): List<T>;
		public get<T extends Component>(type: Type<T>, id: number): T | null;

		public get<T extends Component>(type: Type<T>, id?: number): List<T> | T | null {
			const components = this.load(type);
			if (id === undefined) { return components; }
			return components[id];
		}

		public has<T extends Component>(type: Type<T>, id?: number): boolean {
			const hasList = this.components.has(type);

			if (id === undefined) { return hasList; }
			if (!hasList) { return false; }

			return this.load(type)[id] !== null;
		}

		public remove<T extends Component>(type: Type<T>, id?: number): boolean {
			if (id !== undefined) { return this.save(type, id, null); }
			return this.components.delete(type);
		}

		public removeEmpty(): number {
			let count = 0;
			for (const [type, components] of this.components.entries()) {
				if (components.every(component => component === null)) {
					this.components.delete(type);
					count++;
				}
			}
			return count;
		}

		public clear(): void {
			this.components.clear();
		}
	}
}