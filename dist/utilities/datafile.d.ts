export declare class DataFile<T> {
    private data;
    private path;
    constructor(path: string);
    get filepath(): string;
    set filepath(path: string);
    private loadFile;
    private saveFile;
    refresh(): Promise<void>;
    commit(): Promise<void>;
    keys(): string[];
    values(): T[];
    entries(): [string, T][];
    has(id: string): boolean;
    load(id: string): T | undefined;
    save(id: string, data: T): this;
    delete(id: string): this;
    loadState<T2 extends T>(id: string, target: T2, set: Array<keyof T>): T2;
    saveState<T2 extends T>(id: string, target: T2, set: Array<keyof T>): this;
}
