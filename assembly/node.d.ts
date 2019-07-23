declare class Buffer extends Uint8Array {
  /** This method allocates a new Buffer of indicated size. All of the data is zeroed. */
  static alloc(size: i32): Buffer;
  /** This method allocates a new Buffer of indicated size. This is unsafe because the data is not zeroed. */
  static allocUnsafe(size: i32): Buffer;
  /** This method asserts a value is a Buffer object via `value instanceof Buffer`. */
  static isBuffer<T>(value: T): bool;
  /** Reads an unsigned integer at the designated offset. */
  readUInt8(offset?: i32): u8;
  /** Writes an inputted u8 value to the buffer, at the desired offset. */
  writeUInt8(value:u8, offset?:i32): i32;
  /** Writes an inputted value to the buffer, at the desired offset. */
  writeInt8(value:i8, offset?:i32): i32;
  /** Reads a signed integer at the designated offset. */
  readInt8(offset?: i32): i8;
  /** Inspect a buffer. */
  inspect(): string;
}

declare module "buffer" {
  /**
   * The maximum number of bytes to inspect on a buffer.
   *
   * @example
   * import { INSPECT_MAX_BYTES } from "buffer";
   * // @ts-ignore: This is treated like a global
   * INSPECT_MAX_BYTES = <i32>10;
   */
  export var INSPECT_MAX_BYTES: i32;

  // To export the buffer, we must obtain the `typeof Buffer`
  const BuffType: typeof Buffer;
  export { BuffType as Buffer };
}
