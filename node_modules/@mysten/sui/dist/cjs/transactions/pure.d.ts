import type { SerializedBcs } from '@mysten/bcs';
import type { Argument } from './data/internal.js';
export declare function createPure<T>(makePure: (value: SerializedBcs<any, any> | Uint8Array) => T): {
    <T_1 extends PureTypeName>(type: T_1 extends PureTypeName ? ValidPureTypeName<T_1> : T_1, value: ShapeFromPureTypeName<T_1>): T_1;
    (value: SerializedBcs<any, any> | Uint8Array): T;
    u8(value: number): T;
    u16(value: number): T;
    u32(value: number): T;
    u64(value: bigint | number | string): T;
    u128(value: bigint | number | string): T;
    u256(value: bigint | number | string): T;
    bool(value: boolean): T;
    string(value: string): T;
    address(value: string): T;
    id: (value: string) => T;
    vector<Type extends PureTypeName>(type: T extends PureTypeName ? ValidPureTypeName<Type> : Type, value: Iterable<ShapeFromPureTypeName<Type>> & {
        length: number;
    }): T;
    option<Type extends PureTypeName>(type: T extends PureTypeName ? ValidPureTypeName<Type> : Type, value: ShapeFromPureTypeName<Type> | null | undefined): T;
};
export type BasePureType = 'u8' | 'u16' | 'u32' | 'u64' | 'u128' | 'u256' | 'bool' | 'id' | 'string' | 'address';
export type PureTypeName = BasePureType | `vector<${string}>` | `option<${string}>`;
export type ValidPureTypeName<T extends string> = T extends BasePureType ? PureTypeName : T extends `vector<${infer U}>` ? ValidPureTypeName<U> : T extends `option<${infer U}>` ? ValidPureTypeName<U> : PureTypeValidationError<T>;
type ShapeFromPureTypeName<T extends PureTypeName> = T extends BasePureType ? Parameters<ReturnType<typeof createPure<Argument>>[T]>[0] : T extends `vector<${infer U extends PureTypeName}>` ? ShapeFromPureTypeName<U>[] : T extends `option<${infer U extends PureTypeName}>` ? ShapeFromPureTypeName<U> | null : never;
type PureTypeValidationError<T extends string> = T & {
    error: `Invalid Pure type name: ${T}`;
};
export {};
