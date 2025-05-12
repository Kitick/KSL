import { Brand } from "ts-brand";
export type Unit<T extends string> = Brand<number, T>;
export type DEG = Unit<"DEG">;
export type RAD = Unit<"RAD">;
export declare const toDEG: (rad: RAD) => DEG;
export declare const toRAD: (deg: DEG) => RAD;
