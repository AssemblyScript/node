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
}

export abstract class EventEmitter {
  /** Call this function globally to setup a callback on your EventEmitter type `T`, with callback type `U`, and eventName `event`. */
  public static registerEventCallback<T, U>(event: string): void;
  /** Register a callback event of type `T` with eventName `event`.  Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times. */
  public on<T>(event: string, callback: T): this;
  /** Emit a callback event with the given parameters (up to 10.) */
  public emit<T extends any[]>(...args: T): this;
}