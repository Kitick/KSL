import { Component } from "./component";

export class Entity {
	public readonly name: string;
	public readonly id: number;

	private readonly storage: Storage;

	private constructor(storage: Storage, name: string, id: number) {
		this.storage = storage;
		this.name = name;
		this.id = id;
	}

	private get components(): Component.Storage { return (this.storage as any).components; }

	public addComponent<T extends Component>(type: Component.Type<T>): T {
		return this.components.new(type, this.id);
	}

	public getComponent<T extends Component>(type: Component.Type<T>): T | null {
		return this.components.get(type, this.id);
	}

	public hasComponent<T extends Component>(type: Component.Type<T>): boolean {
		return this.components.has(type, this.id);
	}

	public removeComponent<T extends Component>(type: Component.Type<T>): boolean {
		return this.components.remove(type, this.id);
	}

	public remove(): boolean {
		return this.storage.remove(this);
	}

	public rename(newName: string): boolean {
		return this.storage.rename(this, newName);
	}

	public moveTo(other: Storage): boolean {
		return this.storage.moveTo(this, other);
	}
}

export namespace Entity {
	export class Storage {
		private readonly entities: Entity[] = [];
		private readonly names: Map<string, Entity> = new Map();

		public readonly components: Component.Storage = new Component.Storage();

		public get entityCount(): number { return this.components.entityCount; }
		public get componentCount(): number { return this.components.componentCount; }

		public new(name: string): Entity {
			if (this.names.has(name)) { return this.names.get(name)!; }

			const id = this.components.alloc();

			const entity: Entity = new (Entity as any)(this, name, id);

			this.entities[id] = entity;
			this.names.set(name, entity);

			return entity;
		}

		public get(name: string): Entity {
			return this.names.get(name)!;
		}

		public tryget(name: string): Entity | undefined {
			return this.names.get(name);
		}

		public has(entity: Entity): boolean {
			return this.entities[entity.id] === entity;
		}

		public remove(entity: Entity): boolean {
			if (!this.has(entity)) { return false; }

			const { name, id } = entity;
			(entity as any).storage = null;

			this.names.delete(name);
			this.components.free(id);

			const last = this.entities.at(-1)!;

			(last as any).id = id;
			this.entities[id] = last;
			this.entities.pop();

			return true;
		}

		public rename(entity: Entity, newName: string): boolean {
			if (!this.has(entity) || this.names.has(newName)) { return false; }

			this.names.delete(entity.name);

			this.names.set(newName, entity);
			(entity as any).name = newName;

			return true;
		}

		public moveTo(entity: Entity, other: Storage): boolean {
			return false;
		}
	}
}