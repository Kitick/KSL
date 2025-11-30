import { Graph } from "../structures/graph";
import { PriorityQueue } from "../structures/queue";

function dijkstra<V, E>(
	graph: Graph<V, E>,
	start: V,
	target?: V,
	cost: (edge: E) => number = (edge: E) => edge as number,
): Map<V, number> {
	const distances = new Map<V, number>();
	const previous = new Map<V, V>();
	const queue = new PriorityQueue<[V, number]>((a, b) => a[1] - b[1]);

	distances.set(start, 0);
	queue.enqueue([start, 0]);

	while(!queue.isEmpty()){
		const [current, currentDistance] = queue.dequeue()!;

		if(previous.has(current)){ continue; }

		if(current === target){ break; }

		for(const [neighbor, weight] of graph.neighbors(current)){
			if(previous.has(neighbor)){ continue; }

			const newDistance = currentDistance + cost(weight);
			if(newDistance < (distances.get(neighbor) ?? Infinity)){
				distances.set(neighbor, newDistance);
				queue.enqueue([neighbor, newDistance]);
			}
		}
	}

	return distances;
}