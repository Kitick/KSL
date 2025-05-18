"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class DataFile {
    data = new Map();
    path;
    constructor(path) { this.filepath = path; }
    get filepath() { return this.path; }
    set filepath(path) { this.path = path_1.default.resolve(path); }
    async loadFile() {
        const raw = await promises_1.default.readFile(this.path, "utf-8")
            .catch(error => {
            console.log(`Loading... ${this.path}`);
            if (error.code === "ENOENT") {
                return "{}";
            }
            throw error;
        });
        console.log(`Loaded ${this.path}`);
        return JSON.parse(raw);
    }
    async saveFile(data) {
        const raw = JSON.stringify(data, undefined, "\t");
        await promises_1.default.writeFile(this.path, raw)
            .catch(error => {
            console.log(`Saving... ${this.path}`);
            throw error;
        });
        console.log(`Saved ${this.path}`);
    }
    async refresh() {
        const obj = await this.loadFile();
        this.data = new Map(Object.entries(obj));
    }
    async commit() {
        const obj = Object.fromEntries(this.data);
        await this.saveFile(obj);
    }
    keys() { return Array.from(this.data.keys()); }
    values() { return Array.from(this.data.values()); }
    entries() { return Array.from(this.data.entries()); }
    has(id) {
        return this.data.has(id);
    }
    load(id) {
        return this.data.get(id);
    }
    save(id, data) {
        this.data.set(id, data);
        return this;
    }
    delete(id) {
        this.data.delete(id);
        return this;
    }
    loadState(id, target, set) {
        const data = this.load(id);
        if (data === undefined) {
            throw new Error(`${id} does not exist`);
        }
        set.forEach(key => {
            target[key] = data[key];
        });
        return target;
    }
    saveState(id, target, set) {
        const data = {};
        set.forEach(key => {
            data[key] = target[key];
        });
        return this.save(id, data);
    }
}
exports.DataFile = DataFile;
