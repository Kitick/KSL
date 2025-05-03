export type Vector3 = { x: number, y: number, z: number };

export function Vector3Add(v1: Vector3, v2: Vector3): Vector3 {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y,
		z: v1.z + v2.z,
	};
}