import * as constants from "./constants";
export class Vector {
    comp = { x: 0, y: 0, z: 0, mag: 0, theta: 0, phi: 0 };
    dirty = false;
    constructor(input = {}) {
        console.log("new Vector", input);
        this.set(input);
    }
    get x() { return this.comp.x; }
    get y() { return this.comp.y; }
    get z() { return this.comp.z; }
    get mag() { return this.polar.mag; }
    get theta() { return this.polar.theta; }
    get phi() { return this.polar.phi; }
    set x(x) { this.set({ x }); }
    set y(y) { this.set({ y }); }
    set z(z) { this.set({ z }); }
    set mag(mag) { this.set({ mag }); }
    set theta(theta) { this.set({ theta }); }
    set phi(phi) { this.set({ phi }); }
    get cart() { return { x: this.x, y: this.y, z: this.z }; }
    get polar() {
        if (this.dirty) {
            this.updatePolar();
        }
        return { mag: this.comp.mag, theta: this.comp.theta, phi: this.comp.phi };
    }
    clone() { return new Vector(this); }
    set(input = {}) {
        if (input instanceof Vector) {
            this.comp.x = input.x;
            this.comp.y = input.y;
            this.comp.z = input.z;
            this.dirty = true;
            return this;
        }
        const { x, y, z, mag, theta, phi } = input;
        if (x !== undefined || y !== undefined || z !== undefined) {
            if (x !== undefined) {
                this.comp.x = x;
            }
            if (y !== undefined) {
                this.comp.y = y;
            }
            if (z !== undefined) {
                this.comp.z = z;
            }
            this.dirty = true;
        }
        else if (mag !== undefined || theta !== undefined || phi !== undefined) {
            if (this.dirty) {
                this.updatePolar();
            }
            if (mag !== undefined) {
                this.comp.mag = mag;
            }
            if (theta !== undefined) {
                this.comp.theta = theta;
            }
            if (phi !== undefined) {
                this.comp.phi = phi;
            }
            this.updateCart();
        }
        return this;
    }
    updateCart() {
        let { mag, theta, phi } = this.comp;
        theta *= constants.DEG_RAD;
        phi *= constants.DEG_RAD;
        this.comp.x = mag * Math.cos(phi) * Math.cos(theta);
        this.comp.y = mag * Math.cos(phi) * Math.sin(theta);
        this.comp.z = mag * Math.sin(phi);
        this.dirty = false;
    }
    updatePolar() {
        const { x, y, z } = this.comp;
        const x2 = x * x;
        const y2 = y * y;
        const z2 = z * z;
        this.comp.mag = Math.sqrt(x2 + y2 + z2);
        this.comp.theta = Math.atan2(y, x) * constants.RAD_DEG;
        this.comp.phi = Math.atan2(z, Math.sqrt(x2 + y2)) * constants.RAD_DEG;
        this.dirty = false;
    }
    inverse() { return this.set({ x: 1 / this.x, y: 1 / this.y, z: 1 / this.z }); }
    add(other) { return this.set({ x: this.x + other.x, y: this.y + other.y, z: this.z + other.z }); }
    sub(other) { return this.set({ x: this.x - other.x, y: this.y - other.y, z: this.z - other.z }); }
    mul(other) { return this.set({ x: this.x * other.x, y: this.y * other.y, z: this.z * other.z }); }
    div(other) { return this.set({ x: this.x / other.x, y: this.y / other.y, z: this.z / other.z }); }
    scale(scalar) { return this.set({ x: this.x * scalar, y: this.y * scalar, z: this.z * scalar }); }
    normalize() {
        const mag = this.mag;
        if (mag === 0) {
            return this;
        }
        return this.scale(1 / mag);
    }
    cross(other) {
        return new Vector().set({
            x: this.y * other.z - this.z * other.y,
            y: this.z * other.x - this.x * other.z,
            z: this.x * other.y - this.y * other.x,
        });
    }
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    angle(other) {
        const dot = this.dot(other);
        const mag = this.mag * other.mag;
        if (mag === 0) {
            return 0;
        }
        return Math.acos(dot / mag) * constants.RAD_DEG;
    }
    distance(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }
    toString() { return `(${this.x}, ${this.y}, ${this.z})`; }
}
