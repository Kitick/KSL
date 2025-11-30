import { Entity } from "./entity";
import { System } from "./system";

export class World {
	public readonly entities: Entity.Storage = new Entity.Storage();
	public readonly systems: System.Storage = new System.Storage(this.entities.components);

	public get entityCount(): number { return this.entities.entityCount; }
	public get componentCount(): number { return this.entities.componentCount; }
	public get systemCount(): number { return this.systems.systemCount; }
}