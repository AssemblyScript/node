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
}

declare namespace Buffer {
  export namespace HEX {
    /** Creates an ArrayBuffer from a given string that is encoded in the hex format. */
    export function encode(str: string): ArrayBuffer;
    /** Creates a string from a given ArrayBuffer that is decoded into hex format. */
    export function decode(buffer: ArrayBuffer): string;
    /** Decodes a chunk of memory to a utf16le encoded string in hex format. */
    export function decodeUnsafe(ptr: usize, byteLength: i32): string;
  }
}
