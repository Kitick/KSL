type Length<A extends any[]> = A["length"];

export class Vector<N extends number> {
	public static immutable = true;

	private data: number[];

	private constructor(data: number[]) {
		this.data = data;
	}

	static new<A extends number[]>(...data: A): Vector<Length<A>>;
	static new<N extends number>(...data: number[]): Vector<N>;

	static new<A extends number[]>(...data: A): Vector<Length<A>> {
		return new Vector(data);
	}

	copy(): Vector<N> {
		return new Vector([...this.data]);
	}

	static fill<K extends number>(n: K, value: number): Vector<K> {
		return new Vector(new Array(n).fill(value));
	}

	static zero<K extends number>(n: K): Vector<K> {
		return Vector.fill(n, 0);
	}

	get size(): N { return this.data.length as N; }

	private static zipmap<T>(a: T[], b: T[], fn: (a: T, b: T, i: number) => T): T[] {
		const n = Math.max(a.length, b.length);
		const result: T[] = new Array(n);

		for(let i = 0; i < n; i++){
			result[i] = fn(a[i], b[i], i);
		}

		return result;
	}

	private result(data: number[]): Vector<N> {
		if(Vector.immutable){ return new Vector(data); }

		this.data = data;
		return this;
	}

	negate(): Vector<N> {
		return this.result(this.data.map(i => -i));
	}
	inverse(): Vector<N> {
		return this.result(this.data.map(i => 1 / i));
	}
	scale(scalar: number): Vector<N> {
		return this.result(this.data.map(i => i * scalar));
	}

	add(other: Vector<N>): Vector<N> {
		return this.result(Vector.zipmap(this.data, other.data, (i, i2) => i + i2));
	}
	sub(other: Vector<N>): Vector<N> {
		return this.result(Vector.zipmap(this.data, other.data, (i, i2) => i - i2));
	}
	multiply(other: Vector<N>): Vector<N> {
		return this.result(Vector.zipmap(this.data, other.data, (i, i2) => i * i2));
	}
	divide(other: Vector<N>): Vector<N> {
		return this.result(Vector.zipmap(this.data, other.data, (i, i2) => i / i2));
	}

	resize<K extends number>(dim: K): Vector<K> {
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
		if(mag === 0){ return this.result(this.data); }

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

	angleTo(other: Vector<N>): number {
		const dot = this.dot(other);
		const mag = this.magnitude() * other.magnitude();

		if(mag === 0){ return 0; }

		return Math.acos(dot / mag);
	}

	projectOnto(other: Vector<N>): Vector<N> {
		const dot = this.dot(other);
		const mag = other.magnitude();

		if(mag === 0){ return this.copy(); }

		return other.scale(dot / (mag * mag));
	}

	lerp(other: Vector<N>, t: number): Vector<N> {
		return this.add(other.sub(this).scale(t));
	}

	toCart(this: Vector<1>): { x: number };
	toCart(this: Vector<2>): { x: number, y: number };
	toCart(this: Vector<3>): { x: number, y: number, z: number };
	toCart(this: Vector<4>): { x: number, y: number, z: number, w: number };

	toCart(this: Vector<1 | 2 | 3 | 4>): { x: number, y?: number, z?: number, w?: number } {
		const [ x, y, z, w ] = this.data;

		if(this.size === 1){ return { x }; }
		if(this.size === 2){ return { x, y }; }
		if(this.size === 3){ return { x, y, z }; }
		return { x, y, z, w };
	}

	toPolar(this: Vector<2>): { mag: number, theta: number };
	toPolar(this: Vector<3>): { mag: number, theta: number, phi: number };

	toPolar(this: Vector<2 | 3>): { mag: number, theta: number, phi?: number } {
		const [ x, y, z ] = this.data;

		const mag = this.magnitude();
		const theta = Math.atan2(y, x);

		if(this.size === 2){ return { mag, theta }; }

		const phi = Math.atan2(z, Math.sqrt(x * x + y * y));

		return { mag, theta, phi };
	}

	static fromCart(vector: { x: number }): Vector<1>;
	static fromCart(vector: { x: number, y: number }): Vector<2>;
	static fromCart(vector: { x: number, y: number, z: number }): Vector<3>;
	static fromCart(vector: { x: number, y: number, z: number, w: number }): Vector<4>;

	static fromCart(vector: { x: number, y?: number, z?: number, w?: number }): Vector<1 | 2 | 3 | 4> {
		const { x, y, z, w } = vector;

		if(w !== undefined){ return new Vector([x, y!, z!, w]); }
		if(z !== undefined){ return new Vector([x, y!, z]); }
		if(y !== undefined){ return new Vector([x, y]); }
		return new Vector([x]);
	}

	static fromPolar(vector: { mag: number, theta: number }): Vector<2>;
	static fromPolar(vector: { mag: number, theta: number, phi: number }): Vector<3>;

	static fromPolar(vector: { mag: number, theta: number, phi?: number }): Vector<2 | 3> {
		const { mag, theta, phi } = vector;

		let x = mag * Math.cos(theta);
		let y = mag * Math.sin(theta);

		if(phi === undefined){ return new Vector([x, y]); }

		const cosPhi = Math.cos(phi);
		x *= cosPhi;
		y *= cosPhi;

		const z = mag * Math.sin(phi);

		return new Vector([x, y, z]);
	}

	equals(other: Vector<N>, epsilon: number = Number.EPSILON): boolean {
		if(this.size !== other.size){ return false; }

		for(let i = 0, n = this.data.length; i < n; i++){
			if(Math.abs(this.data[i] - other.data[i]) > epsilon){ return false; }
		}
		return true;
	}

	toString(): string {
		return `(${this.data.join(", ")})`;
	}
}