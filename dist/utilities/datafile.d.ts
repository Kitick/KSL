export declare class DataFile<T> {
    private data;
    private path;
    log: boolean;
    constructor(path: string);
    get filepath(): string;
    set filepath(path: string);
    private loadFile;
    private saveFile;
    refresh(): Promise<void>;
    commit(): Promise<void>;
    keys(): Array<string>;
    values(): Array<T>;
    entries(): Array<[string, T]>;
    has(id: string): boolean;
    load(id: string): T | undefined;
    save(id: string, data: T): this;
    delete(id: string): this;
    loadState<O extends T>(id: string, target: O, set: Array<keyof T>): O;
    saveState<O extends T>(id: string, target: O, set: Array<keyof T>): this;
}
