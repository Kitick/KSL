import { Graph } from "../structures/graph"

function traversal<V, E>(
    graph: Graph<V, E>,
    start: V,
    visit: (vertex: V) => void,
    next: (nodes: V[]) => V | undefined,
): void {
    const visited: Set<V> = new Set();
    const nodes: V[] = [start];

    while(nodes.length > 0){
        const node = next(nodes)!;

		if(visited.has(node)){ continue; }

        visited.add(node);
        visit(node);

        for(const neighbor of graph.neighbors(node)){
			if(visited.has(neighbor[0])){ continue; }

			nodes.push(neighbor[0]);
        }
    }
}

export function breadthFirstSearch<V, E>(graph: Graph<V, E>, start: V, visit: (vertex: V) => void): void {
    traversal(graph, start, visit, nodes => nodes.shift());
}

export function depthFirstSearch<V, E>(graph: Graph<V, E>, start: V, visit: (vertex: V) => void): void {
    traversal(graph, start, visit, nodes => nodes.pop());
}