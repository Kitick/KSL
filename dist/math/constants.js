"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRAD = exports.toDEG = void 0;
const toDEG = (rad) => rad * (180 / Math.PI);
exports.toDEG = toDEG;
const toRAD = (deg) => deg * (Math.PI / 180);
exports.toRAD = toRAD;
