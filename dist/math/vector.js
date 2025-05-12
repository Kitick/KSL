export class Vector {
    data;
    constructor(data) {
        this.data = data;
    }
    static new(...data) {
        return new Vector(data);
    }
    copy() {
        return new Vector([...this.data]);
    }
    static zero(n) {
        return new Vector(new Array(n).fill(0));
    }
    get size() { return this.data.length; }
    static bitwise(a, b, fn) {
        const n = Math.max(a.length, b.length);
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = fn(a[i], b[i], i);
        }
        return result;
    }
    negate() {
        const data = Vector.bitwise(this.data, this.data, i => -i);
        return new Vector(data);
    }
    inverse() {
        const data = Vector.bitwise(this.data, this.data, i => 1 / i);
        return new Vector(data);
    }
    scale(scalar) {
        const data = Vector.bitwise(this.data, this.data, i => i * scalar);
        return new Vector(data);
    }
    add(other) {
        const data = Vector.bitwise(this.data, other.data, (i, i2) => i + i2);
        return new Vector(data);
    }
    sub(other) {
        const data = Vector.bitwise(this.data, other.data, (i, i2) => i - i2);
        return new Vector(data);
    }
    mul(other) {
        const data = Vector.bitwise(this.data, other.data, (i, i2) => i * i2);
        return new Vector(data);
    }
    div(other) {
        const data = Vector.bitwise(this.data, other.data, (i, i2) => i / i2);
        return new Vector(data);
    }
    project(dim) {
        const data = new Array(dim);
        for (let i = 0; i < dim; i++) {
            data[i] = this.data[i] ?? 0;
        }
        return new Vector(data);
    }
    magnitude() {
        const sum = this.data.reduce((sum, i) => sum + i * i, 0);
        return Math.sqrt(sum);
    }
    normalize(value = 1) {
        const mag = this.magnitude();
        if (mag === 0) {
            return this.copy();
        }
        return this.scale(value / mag);
    }
    distance(other) {
        let sum = 0;
        for (let i = 0, n = this.data.length; i < n; i++) {
            const diff = this.data[i] - other.data[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }
    cross(other) {
        const [a1, a2, a3] = this.data;
        const [b1, b2, b3] = other.data;
        const z = a1 * b2 - a2 * b1;
        if (this.size === 2) {
            return z;
        }
        const x = a2 * b3 - a3 * b2;
        const y = a3 * b1 - a1 * b3;
        return new Vector([x, y, z]);
    }
    dot(other) {
        let sum = 0;
        for (let i = 0, n = this.data.length; i < n; i++) {
            sum += this.data[i] * other.data[i];
        }
        return sum;
    }
    angle(other) {
        const dot = this.dot(other);
        const mag = this.magnitude() * other.magnitude();
        if (mag === 0) {
            return 0;
        }
        return Math.acos(dot / mag);
    }
    equals(other) {
        for (let i = 0, n = this.data.length; i < n; i++) {
            if (this.data[i] !== other.data[i]) {
                return false;
            }
        }
        return true;
    }
    polar() {
        let [x, y, z] = this.data;
        if (this.size < 3) {
            z = 0;
        }
        if (this.size < 2) {
            y = 0;
        }
        const x2 = x * x;
        const y2 = y * y;
        const z2 = z * z;
        const mag = Math.sqrt(x2 + y2 + z2);
        const theta = Math.atan2(y, x);
        const phi = Math.atan2(z, Math.sqrt(x2 + y2));
        return { mag, theta, phi };
    }
    toString() {
        return this.data.join(", ");
    }
}
