type Length<A extends Array<any>> = A["length"];

export class Vector<N extends number> {
	private data: Array<number>;

	private constructor(data: Array<number>) {
		this.data = data;
	}

	static new<A extends Array<number>>(...data: A): Vector<Length<A>>;
	static new<N extends number>(...data: Array<number>): Vector<N>;

	static new<A extends Array<number>>(...data: A): Vector<Length<A>> {
		return new Vector(data);
	}

	copy(): Vector<N> {
		return new Vector([...this.data]);
	}

	static zero<N extends number>(n: N): Vector<N> {
		return new Vector(new Array(n).fill(0));
	}

	get size(): N { return this.data.length as N; }

	private static bitwise<T>(a: Array<T>, b: Array<T>, fn: (a: T, b: T, i: number) => T): Array<T> {
		const n = Math.max(a.length, b.length);
		const result: T[] = new Array(n);

		for(let i = 0; i < n; i++){
			result[i] = fn(a[i], b[i], i);
		}

		return result;
	}

	negate(): Vector<N> {
		const data = Vector.bitwise(this.data, this.data, i => -i);
		return new Vector(data);
	}

	inverse(): Vector<N> {
		const data = Vector.bitwise(this.data, this.data, i => 1 / i);
		return new Vector(data);
	}

	scale(scalar: number): Vector<N> {
		const data = Vector.bitwise(this.data, this.data, i => i * scalar);
		return new Vector(data);
	}

	add(other: Vector<N>): Vector<N> {
		const data = Vector.bitwise(this.data, other.data, (i, i2) => i + i2);
		return new Vector(data);
	}

	sub(other: Vector<N>): Vector<N> {
		const data = Vector.bitwise(this.data, other.data, (i, i2) => i - i2);
		return new Vector(data);
	}

	mul(other: Vector<N>): Vector<N> {
		const data = Vector.bitwise(this.data, other.data, (i, i2) => i * i2);
		return new Vector(data);
	}

	div(other: Vector<N>): Vector<N> {
		const data = Vector.bitwise(this.data, other.data, (i, i2) => i / i2);
		return new Vector(data);
	}

	project<N extends number>(dim: N): Vector<N> {
		const data = new Array(dim);

		for(let i = 0; i < dim; i++){
			data[i] = this.data[i] ?? 0;
		}

		return new Vector(data);
	}

	magnitude(): number {
		const sum = this.data.reduce((sum, i) => sum + i * i, 0);
		return Math.sqrt(sum);
	}

	normalize(value: number = 1): Vector<N> {
		const mag = this.magnitude();
		if(mag === 0){ return this.copy(); }

		return this.scale(value / mag);
	}

	distance(other: Vector<N>): number {
		let sum = 0;
		for(let i = 0, n = this.data.length; i < n; i++){
			const diff = this.data[i] - other.data[i];
			sum += diff * diff;
		}

		return Math.sqrt(sum);
	}

	cross(this: Vector<3>, other: Vector<3>): Vector<3>;
	cross(this: Vector<2>, other: Vector<2>): number;

	cross(this: Vector<2 | 3>, other: Vector<2 | 3>): Vector<3> | number {
		const [a1, a2, a3] = this.data;
		const [b1, b2, b3] = other.data;

		const z = a1 * b2 - a2 * b1;
		if(this.size === 2){ return z; }

		const x = a2 * b3 - a3 * b2;
		const y = a3 * b1 - a1 * b3;

		return new Vector([x, y, z]);
	}

	dot(other: Vector<N>): number {
		let sum = 0;
		for(let i = 0, n = this.data.length; i < n; i++){
			sum += this.data[i] * other.data[i];
		}

		return sum;
	}

	angle(other: Vector<N>): number {
		const dot = this.dot(other);
		const mag = this.magnitude() * other.magnitude();

		if(mag === 0){ return 0; }

		return Math.acos(dot / mag);
	}

	equals(other: Vector<N>): boolean {
		for(let i = 0, n = this.data.length; i < n; i++){
			if(this.data[i] !== other.data[i]){ return false; }
		}

		return true;
	}

	polar(this: Vector<1 | 2 | 3>): {mag: number, theta: number, phi: number} {
		let [ x, y, z ] = this.data;

		if(this.size < 3){ z = 0; }
		if(this.size < 2){ y = 0; }

		const x2 = x * x; const y2 = y * y; const z2 = z * z;

		const mag = Math.sqrt(x2 + y2 + z2);
		const theta = Math.atan2(y, x);
		const phi = Math.atan2(z, Math.sqrt(x2 + y2));

		return { mag, theta, phi };
	}

	toString(): string {
		return this.data.join(", ");
	}
}