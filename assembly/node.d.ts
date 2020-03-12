declare class Buffer extends Uint8Array {
  /** This method allocates a new Buffer of indicated size. All of the data is zeroed. */
  static alloc(size: i32): Buffer;
  /** This method allocates a new Buffer of indicated size. This is unsafe because the data is not zeroed. */
  static allocUnsafe(size: i32): Buffer;
  /** This method asserts a value is a Buffer object via `value instanceof Buffer`. */
  static isBuffer<T>(value: T): bool;
  /** Reads a signed integer at the designated offset. */
  readInt8(offset?: i32): i8;
  /** Reads an unsigned integer at the designated offset. */
  readUInt8(offset?: i32): u8;
  /** Writes an inputted value to the buffer, at the desired offset. */
  writeInt8(value:i8, offset?:i32): i32;
  /** Writes an inputted u8 value to the buffer, at the desired offset. */
  writeUInt8(value:u8, offset?:i32): i32;
  /** Reads a signed 16-bit integer, stored in Little Endian format at the designated offset. */
  readInt16LE(offset?: i32): i16;
  /** Reads a signed 16-bit integer, stored in Big Endian format at the designated offset. */
  readInt16BE(offset?: i32): i16;
  /** Reads an unsigned 16-bit integer, stored in Little Endian format at the designated offset. */
  readUInt16LE(offset?: i32): u16;
  /** Reads an unsigned 16-bit integer, stored in Big Endian format at the designated offset. */
  readUInt16BE(offset?: i32): u16;
  /** Writes an inputted 16-bit integer at the designated offset, stored in Little Endian format */
  writeInt16LE(value: i16, offset?: i32): i32;
  /** Writes an inputted 16-bit integer at the designated offset, stored in Big Endian format */
  writeInt16BE(value: i16, offset?: i32): i32;
  /** Writes an inputted unsigned 16-bit integer at the designated offset, stored in Little Endian format */
  writeUInt16LE(value: u16, offset?: i32): i32;
  /** Writes an inputted unsigned 16-bit integer at the designated offset, stored in Big Endian format */
  writeUInt16BE(value: u16, offset?: i32): i32;
  /** Reads a signed 32-bit integer, stored in Little Endian format at the designated offset. */
  readInt32LE(offset?: i32): i32;
  /** Reads a signed 32-bit integer, stored in Big Endian format at the designated offset. */
  readInt32BE(offset?: i32): i32;
  /** Reads an unsigned 32-bit integer, stored in Little Endian format at the designated offset. */
  readUInt32LE(offset?: i32): u32;
  /** Reads an unsigned 32-bit integer, stored in Big Endian format at the designated offset. */
  readUInt32BE(offset?: i32): u32;
  /** Writes an inputted 32-bit integer at the designated offset, stored in Little Endian format */
  writeInt32LE(value: i32, offset?: i32): i32;
  /** Writes an inputted 32-bit integer at the designated offset, stored in Big Endian format */
  writeInt32BE(value: i32, offset?: i32): i32;
  /** Writes an inputted unsigned 32-bit integer at the designated offset, stored in Little Endian format */
  writeUInt32LE(value: u32, offset?: i32): i32;
  /** Writes an inputted unsigned 32-bit integer at the designated offset, stored in Big Endian format */
  writeUInt32BE(value: u32, offset?: i32): i32;
  /** Reads a signed 32-bit float, stored in Little Endian format at the designated offset. */
  readFloatLE(offset?: i32): f32;
  /** Reads a signed 32-bit float, stored in Big Endian format at the designated offset. */
  readFloatBE(offset?: i32): f32;
  /** Writes an inputted 32-bit float at the designated offset, stored in Little Endian format */
  writeFloatLE(value: f32, offset?: i32): i32;
  /** Writes an inputted 32-bit float at the designated offset, stored in Big Endian format */
  writeFloatBE(value: f32, offset?: i32): i32;
  /** Reads a signed 64-bit integer, stored in Little Endian format at the designated offset. */
  readBigInt64LE(offset?: i32): i64;
  /** Reads a signed 64-bit integer, stored in Big Endian format at the designated offset. */
  readBigInt64BE(offset?: i32): i64;
  /** Reads an unsigned 64-bit integer, stored in Little Endian format at the designated offset. */
  readBigUInt64LE(offset?: i32): u64;
  /** Reads an unsigned 64-bit integer, stored in Big Endian format at the designated offset. */
  readBigUInt64BE(offset?: i32): u64;
  /** Writes an inputted 64-bit integer at the designated offset, stored in Little Endian format */
  writeBigInt64LE(value: i64, offset?: i32): i32;
  /** Writes an inputted 64-bit integer at the designated offset, stored in Big Endian format */
  writeBigInt64BE(value: i64, offset?: i32): i32;
  /** Writes an inputted unsigned 64-bit integer at the designated offset, stored in Little Endian format */
  writeBigUInt64LE(value: u64, offset?: i32): i32;
  /** Writes an inputted unsigned 64-bit integer at the designated offset, stored in Big Endian format */
  writeBigUInt64BE(value: u64, offset?: i32): i32;
  /** Reads a signed 64-bit double, stored in Little Endian format at the designated offset. */
  readDoubleLE(offset?: i32): f64;
  /** Reads a signed 64-bit double, stored in Big Endian format at the designated offset. */
  readDoubleBE(offset?: i32): f64;
  /** Writes an inputted 64-bit double at the designated offset, stored in Little Endian format */
  writeDoubleLE(value: f64, offset?: i32): i32;
  /** Writes an inputted 64-bit double at the designated offset, stored in Big Endian format */
  writeDoubleBE(value: f64, offset?: i32): i32;
  /** Swaps every group of two bytes in a Buffer in-place */
  swap16(): Buffer;
  /** Swaps every group of four bytes in a Buffer in-place */
  swap32(): Buffer;
  /** Swaps every group of eight bytes in a Buffer in-place */
  swap64(): Buffer;
}

declare namespace Buffer {
  /** The HEX encoding and decoding namespace. */
  export namespace HEX {
    /** Creates an ArrayBuffer from a given string that is encoded in the hex format. */
    export function encode(str: string): ArrayBuffer;
    /** Creates a string from a given ArrayBuffer that is decoded into hex format. */
    export function decode(buffer: ArrayBuffer): string;
    /** Decodes a chunk of memory to a utf16le encoded string in hex format. */
    export function decodeUnsafe(ptr: usize, byteLength: i32): string;
  }
  /** The ASCII encoding and decoding namespace. */
  export namespace ASCII {
    /** Creates an ArrayBuffer from a given string that is encoded in the ASCII format. */
    export function encode(str: string): ArrayBuffer;
    /** Creates a string from a given ArrayBuffer that is decoded into ASCII format. */
    export function decode(buffer: ArrayBuffer): string;
    /** Decodes a chunk of memory to a utf16le encoded string in ASCII format. */
    export function decodeUnsafe(ptr: usize, byteLength: i32): string;
  }
}
