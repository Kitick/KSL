import * as Unit from "./constants";
type Length<A extends Array<any>> = A["length"];
export declare class Vector<N extends number> {
    private data;
    private constructor();
    static new<A extends Array<number>>(...data: A): Vector<Length<A>>;
    static new<N extends number>(...data: Array<number>): Vector<N>;
    copy(): Vector<N>;
    static zero<N extends number>(n: N): Vector<N>;
    get size(): N;
    private static bitwise;
    negate(): Vector<N>;
    inverse(): Vector<N>;
    scale(scalar: number): Vector<N>;
    add(other: Vector<N>): Vector<N>;
    sub(other: Vector<N>): Vector<N>;
    mul(other: Vector<N>): Vector<N>;
    div(other: Vector<N>): Vector<N>;
    project<N extends number>(dim: N): Vector<N>;
    magnitude(): number;
    normalize(value?: number): Vector<N>;
    distance(other: Vector<N>): number;
    cross(this: Vector<3>, other: Vector<3>): Vector<3>;
    cross(this: Vector<2>, other: Vector<2>): number;
    dot(other: Vector<N>): number;
    angle(other: Vector<N>): Unit.RAD;
    equals(other: Vector<N>): boolean;
    polar(this: Vector<1 | 2 | 3>): {
        mag: number;
        theta: Unit.RAD;
        phi: Unit.RAD;
    };
    toString(): string;
}
export {};
