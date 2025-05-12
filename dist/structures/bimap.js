"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiMap = void 0;
class BiMap {
    forward = new Map();
    backward = new Map();
    get size() { return this.forward.size; }
    set(key, value) {
        this.delete(key);
        this.delete(value, true);
        this.forward.set(key, value);
        this.backward.set(value, key);
    }
    get(item, reverse = false) {
        if (reverse) {
            return this.backward.get(item);
        }
        return this.forward.get(item);
    }
    has(item, reverse = false) {
        if (reverse) {
            return this.backward.has(item);
        }
        return this.forward.has(item);
    }
    delete(item, reverse = false) {
        let key;
        let value;
        if (reverse) {
            value = item;
            key = this.backward.get(value);
        }
        else {
            key = item;
            value = this.forward.get(key);
        }
        if (key === undefined || value === undefined) {
            return false;
        }
        this.forward.delete(key);
        this.backward.delete(value);
        return true;
    }
    clear() {
        this.forward.clear();
        this.backward.clear();
    }
}
exports.BiMap = BiMap;
