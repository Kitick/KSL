import * as constants from "./constants";

export class Vector {
	private comp = { x: 0, y: 0, z: 0, mag: 0, theta: 0, phi: 0 };

	private dirty: boolean = false;

	constructor();
	constructor(vector: Vector);
	constructor(cart: Vector.Cart);
	constructor(polar: Vector.Polar);

	constructor(input: Vector | Vector.Cart & Vector.Polar = {}) {
		console.log("new Vector", input);
		this.set(input);
	}

	get x(): number { return this.comp.x; }
	get y(): number { return this.comp.y; }
	get z(): number { return this.comp.z; }

	get mag(): number { return this.polar.mag; }
	get theta(): number { return this.polar.theta; }
	get phi(): number { return this.polar.phi; }

	set x(x: number){ this.set({ x }) }
	set y(y: number){ this.set({ y }) }
	set z(z: number){ this.set({ z }) }

	set mag(mag: number){ this.set({ mag }) }
	set theta(theta: number){ this.set({ theta }) }
	set phi(phi: number){ this.set({ phi }) }

	get cart(): { x: number; y: number; z: number } { return { x: this.x, y: this.y, z: this.z }; }
	get polar(): { mag: number; theta: number; phi: number } {
		if(this.dirty){ this.updatePolar(); }
		return { mag: this.comp.mag, theta: this.comp.theta, phi: this.comp.phi };
	}

	clone(): Vector { return new Vector(this); }

	set(other: Vector): this;
	set(cart: Vector.Cart): this;
	set(polar: Vector.Polar): this;

	set(input: Vector | Vector.Cart & Vector.Polar = {}): this {
		if(input instanceof Vector){
			this.comp.x = input.x;
			this.comp.y = input.y;
			this.comp.z = input.z;

			this.dirty = true;
			return this;
		}

		const { x, y, z, mag, theta, phi } = input;

		if(x !== undefined || y !== undefined || z !== undefined){
			if(x !== undefined){ this.comp.x = x; }
			if(y !== undefined){ this.comp.y = y; }
			if(z !== undefined){ this.comp.z = z; }

			this.dirty = true;
		}
		else if(mag !== undefined || theta !== undefined || phi !== undefined){
			if(this.dirty){ this.updatePolar(); }

			if(mag !== undefined){ this.comp.mag = mag; }
			if(theta !== undefined){ this.comp.theta = theta; }
			if(phi !== undefined){ this.comp.phi = phi; }

			this.updateCart();
		}

		return this;
	}

	private updateCart(): void {
		let { mag, theta, phi } = this.comp;

		theta *= constants.DEG_RAD;
		phi *= constants.DEG_RAD;

		this.comp.x = mag * Math.cos(phi) * Math.cos(theta);
		this.comp.y = mag * Math.cos(phi) * Math.sin(theta);
		this.comp.z = mag * Math.sin(phi);

		this.dirty = false;
	}

	private updatePolar(): void {
		const { x, y, z } = this.comp;

		const x2 = x * x; const y2 = y * y; const z2 = z * z;

		this.comp.mag = Math.sqrt(x2 + y2 + z2);
		this.comp.theta = Math.atan2(y, x) * constants.RAD_DEG;
		this.comp.phi = Math.atan2(z, Math.sqrt(x2 + y2)) * constants.RAD_DEG;

		this.dirty = false;
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