import { Brand } from "ts-brand";

export type Unit<T extends string> = Brand<number, T>;

export type DEG = Unit<"DEG">;
export type RAD = Unit<"RAD">;

export const toDEG = (rad: RAD): DEG => rad * (180 / Math.PI) as DEG;
export const toRAD = (deg: DEG): RAD => deg * (Math.PI / 180) as RAD;