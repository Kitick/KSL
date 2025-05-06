export declare class Vector {
    private comp;
    private dirty;
    constructor();
    constructor(vector: Vector);
    constructor(cart: Vector.Cart);
    constructor(polar: Vector.Polar);
    get x(): number;
    get y(): number;
    get z(): number;
    get mag(): number;
    get theta(): number;
    get phi(): number;
    set x(x: number);
    set y(y: number);
    set z(z: number);
    set mag(mag: number);
    set theta(theta: number);
    set phi(phi: number);
    get cart(): {
        x: number;
        y: number;
        z: number;
    };
    get polar(): {
        mag: number;
        theta: number;
        phi: number;
    };
    clone(): Vector;
    set(other: Vector): this;
    set(cart: Vector.Cart): this;
    set(polar: Vector.Polar): this;
    private updateCart;
    private updatePolar;
    inverse(): this;
    add(other: Vector): this;
    sub(other: Vector): this;
    mul(other: Vector): this;
    div(other: Vector): this;
    scale(scalar: number): this;
    normalize(): this;
    cross(other: Vector): Vector;
    dot(other: Vector): number;
    angle(other: Vector): number;
    distance(other: Vector): number;
    equals(other: Vector): boolean;
    toString(): string;
}
export declare namespace Vector {
    type Cart = {
        x?: number;
        y?: number;
        z?: number;
    };
    type Polar = {
        mag?: number;
        theta?: number;
        phi?: number;
    };
}
