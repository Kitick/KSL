import * as constants from "./constants";

const enum Axis { X, Y, Z, R, T, P }

export class Vector {
	private comp: Array<number> = [ 0, 0, 0, 0, 0, 0 ];

	private dirty: boolean = false;

	constructor();
	constructor(vector: Vector);
	constructor(cart: Vector.Cart);
	constructor(polar: Vector.Polar);

	constructor(input: Vector | Vector.Cart & Vector.Polar = {}) {
		if(input instanceof Vector){
			this.setCart(input.x, input.y, input.z);
			return this;
		}

		this.set(input);
	}

	private getCart(): Array<number> { return this.comp.slice(0, 3); }

	private getPolar(): Array<number> {
		if(this.dirty){ this.updatePolar(); }
		return this.comp.slice(3, 6);
	}

	private setCart(x: number, y: number, z: number): void {
		this.comp[Axis.X] = x;
		this.comp[Axis.Y] = y;
		this.comp[Axis.Z] = z;

		this.dirty = true;
	}

	private setPolar(mag: number, theta: number, phi: number): void {
		this.comp[Axis.R] = mag;
		this.comp[Axis.T] = theta;
		this.comp[Axis.P] = phi;

		this.updateCart();
	}

	get x(): number { return this.comp[Axis.X]; }
	get y(): number { return this.comp[Axis.Y]; }
	get z(): number { return this.comp[Axis.Z]; }

	set x(x: number){ this.comp[Axis.X] = x; }
	set y(y: number){ this.comp[Axis.Y] = y; }
	set z(z: number){ this.comp[Axis.Z] = z; }

	get mag(): number { return this.getPolar()[Axis.R]; }
	get theta(): number { return this.getPolar()[Axis.T]; }
	get phi(): number { return this.getPolar()[Axis.P]; }

	set mag(mag: number){ this.setPolar(mag, this.theta, this.phi); }
	set theta(theta: number){ this.setPolar(this.mag, theta, this.phi); }
	set phi(phi: number){ this.setPolar(this.mag, this.theta, phi); }

	get cart(): { x: number; y: number; z: number } {
		const [ x, y, z ] = this.getCart();
		return { x, y, z };
	}

	get polar(): { mag: number; theta: number; phi: number } {
		const [ mag, theta, phi ] = this.getPolar();
		return { mag, theta, phi };
	}

	clone(): Vector { return new Vector(this); }

	set(cart: Vector.Cart): this;
	set(polar: Vector.Polar): this;

	set(input: Vector.Cart & Vector.Polar = {}): this {
		const { x, y, z, mag, theta, phi } = input;

		if(x !== undefined || y !== undefined || z !== undefined){
			if(x !== undefined){ this.x = x; }
			if(y !== undefined){ this.y = y; }
			if(z !== undefined){ this.z = z; }

			this.dirty = true;
		}
		else if(mag !== undefined || theta !== undefined || phi !== undefined){
			if(this.dirty){ this.updatePolar(); }

			if(mag !== undefined){ this.comp[Axis.R] = mag; }
			if(theta !== undefined){ this.comp[Axis.T] = theta; }
			if(phi !== undefined){ this.comp[Axis.P] = phi; }

			this.updateCart();
		}

		return this;
	}

	private updateCart(): void {
		let [ mag, theta, phi ] = this.getPolar();

		theta *= constants.DEG_RAD;
		phi *= constants.DEG_RAD;

		const x = mag * Math.cos(phi) * Math.cos(theta);
		const y = mag * Math.cos(phi) * Math.sin(theta);
		const z = mag * Math.sin(phi);

		this.setCart(x, y, z);
		this.dirty = false;
	}

	private updatePolar(): void {
		const [ x, y, z ] = this.getCart();

		const x2 = x * x; const y2 = y * y; const z2 = z * z;

		const mag = Math.sqrt(x2 + y2 + z2);
		const theta = Math.atan2(y, x) * constants.RAD_DEG;
		const phi = Math.atan2(z, Math.sqrt(x2 + y2)) * constants.RAD_DEG;

		this.setPolar(mag, theta, phi);
	}

	inverse(): this { return this.set({ x: 1 / this.x, y: 1 / this.y, z: 1 / this.z }); }

	add(other: Vector): this { return this.set({ x: this.x + other.x, y: this.y + other.y, z: this.z + other.z }); }
	sub(other: Vector): this { return this.set({ x: this.x - other.x, y: this.y - other.y, z: this.z - other.z }); }

	mul(other: Vector): this { return this.set({ x: this.x * other.x, y: this.y * other.y, z: this.z * other.z }); }
	div(other: Vector): this { return this.set({ x: this.x / other.x, y: this.y / other.y, z: this.z / other.z }); }

	scale(scalar: number): this { return this.set({ x: this.x * scalar, y: this.y * scalar, z: this.z * scalar }); }

	normalize(): this {
		const mag = this.mag;
		if(mag === 0){ return this; }

		return this.scale(1 / mag);
	}

	cross(other: Vector): Vector {
		return new Vector().set({
			x: this.y * other.z - this.z * other.y,
			y: this.z * other.x - this.x * other.z,
			z: this.x * other.y - this.y * other.x,
		});
	}

	dot(other: Vector): number {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	angle(other: Vector): number {
		const dot = this.dot(other);
		const mag = this.mag * other.mag;

		if(mag === 0){ return 0; }

		return Math.acos(dot / mag) * constants.RAD_DEG;
	}

	distance(other: Vector): number {
		const dx = this.x - other.x;
		const dy = this.y - other.y;
		const dz = this.z - other.z;

		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	equals(other: Vector): boolean {
		return this.x === other.x && this.y === other.y && this.z === other.z;
	}

	toString(): string { return `(${this.x}, ${this.y}, ${this.z})`; }
}

export namespace Vector {
	export type Cart = { x?: number; y?: number; z?: number };
	export type Polar = { mag?: number; theta?: number; phi?: number };
}