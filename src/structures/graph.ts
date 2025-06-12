export class Graph<V, E> {
	private nodes: Map<V, Map<V, E>> = new Map();

	constructor(vertices?: Iterable<V>) {
		if(vertices !== undefined){
			for(const vertex of vertices){
				this.addVertex(vertex);
			}
		}
	}

	*vertices(): Iterable<V> {
		for(const vertex of this.nodes.keys()){
			yield vertex;
		}
	}

	*neighbors(vertex: V): Iterable<[V, E]> {
		const edges = this.nodes.get(vertex);
		if(edges === undefined){ return; }

		for(const [neighbor, edge] of edges.entries()){
			yield [neighbor, edge];
		}
	}

	*edges(): Iterable<[V, V, E]> {
		for(const [from, edges] of this.nodes.entries()){
			for(const [to, edge] of edges.entries()){
				yield [from, to, edge];
			}
		}
	}

	getVertices(): Set<V> {
		return new Set(this.nodes.keys());
	}

	getVertexCount(): number { return this.nodes.size; }

	getEdgeCount(): number {
		let count = 0;
		for(const edges of this.nodes.values()){
			count += edges.size;
		}
		return count;
	}

	addVertex(vertex: V): boolean {
		if(this.nodes.has(vertex)){ return false; }

		this.nodes.set(vertex, new Map());

		return true;
	}

	hasVertex(vertex: V): boolean {
		return this.nodes.has(vertex);
	}

	removeVertex(vertex: V): boolean {
		if(!this.nodes.has(vertex)){ return false; }

		this.nodes.delete(vertex);

		for(const edges of this.nodes.values()){
			edges.delete(vertex);
		}

		return true;
	}

	addEdge(from: V, to: V, edge: E, bidirectional: boolean = false): boolean {
		if(this.hasEdge(from, to)){ return false; }
		if(bidirectional && this.hasEdge(to, from)){ return false; }

		this.setEdge(from, to, edge, bidirectional);

		return true;
	}

	setEdge(from: V, to: V, edge: E, bidirectional: boolean = false): void {
		this.addVertex(from);
		this.addVertex(to);

		this.nodes.get(from)!.set(to, edge);

		if(bidirectional){
			this.nodes.get(to)!.set(from, edge);
		}
	}

	getEdge(from: V, to: V): E | undefined {
		const edges = this.nodes.get(from);
		if(edges === undefined){ return undefined; }

		return edges.get(to);
	}

	hasEdge(from: V, to: V): boolean {
		return this.nodes.get(from)?.has(to) ?? false;
	}

	isBidirectional(from: V, to: V): boolean {
		return this.hasEdge(from, to) && this.hasEdge(to, from);
	}

	removeEdge(from: V, to: V, bidirectional: boolean = false): boolean {
		let removed = this.nodes.get(from)?.delete(to) ?? false;

		if(bidirectional){
			removed ||= this.nodes.get(to)?.delete(from) ?? false;
		}

		return removed;
	}

	getInDegree(vertex: V): number {
		let inDegree = 0;
		for(const edges of this.nodes.values()){
			if(edges.has(vertex)){
				inDegree++;
			}
		}
		return inDegree;
	}

	getOutDegree(vertex: V): number {
		return this.nodes.get(vertex)?.size ?? 0;
	}

	isEmpty(): boolean {
		return this.nodes.size === 0;
	}

	clear(): void {
		this.nodes.clear();
	}
}