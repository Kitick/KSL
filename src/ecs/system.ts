import { Component } from "./component";

export abstract class System {
	private storage!: Component.Storage;

	private init(storage: Component.Storage): void {
		this.storage = storage;
	}

	public enabled: boolean = true;

	public get entityCount(): number { return this.storage.entityCount; }

	public use<T extends Component>(component: Component.Type<T>): Component.List<T> {
		return this.storage.get(component);
	}

	public abstract update(dt: number): void;
}

export namespace System {
	export type Type<T extends System = System> = new () => T;

	export class Storage {
		private readonly systems: Map<Type, System> = new Map();
		public readonly components: Component.Storage;

		public get systemCount(): number { return this.systems.size; }

		public constructor(components: Component.Storage) {
			this.components = components;
		}

		public new<T extends System>(type: Type<T>): T {
			if (this.systems.has(type)) { return this.systems.get(type) as T; }

			const system = new type();
			(system as any).init(this.components);

			this.systems.set(type, system);

			return system;
		}

		public get<T extends System>(type: Type<T>): T {
			return this.systems.get(type) as T;
		}

		public tryget<T extends System>(type: Type<T>): T | undefined {
			return this.systems.get(type) as T | undefined;
		}

		public has<T extends System>(type: Type<T>): boolean {
			return this.systems.has(type);
		}

		public remove<T extends System>(type: Type<T>): boolean {
			return this.systems.delete(type);
		}

		public update(dt: number): void {
			for (const system of this.systems.values()) {
				if (system.enabled) { system.update(dt); }
			}
		}

		public profile(dt: number): Record<string, number> {
			const timings: Record<string, number> = {};

			for (const system of this.systems.values()) {
				if (!system.enabled) { continue; }

				const start = performance.now();
				system.update(dt);
				const end = performance.now();

				timings[system.constructor.name] = Number((end - start).toFixed(1));
			}

			return timings;
		}
	}
}