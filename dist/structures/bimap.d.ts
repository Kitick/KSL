export declare class BiMap<K, V> {
    private forward;
    private backward;
    get size(): number;
    set(key: K, value: V): void;
    get(key: K, reverse?: false): V | undefined;
    get(value: V, reverse: true): K | undefined;
    has(key: K, reverse?: false): boolean;
    has(value: V, reverse: true): boolean;
    delete(key: K, reverse?: false): boolean;
    delete(value: V, reverse: true): boolean;
    clear(): void;
}
