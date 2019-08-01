import { BLOCK_MAXSIZE } from "rt/common";
import { E_INVALIDLENGTH, E_INDEXOUTOFRANGE } from "util/error";
import { Uint8Array } from "typedarray";

export class Buffer extends Uint8Array {
  constructor(size: i32) {
    super(size);
  }

  public static alloc(size: i32): Buffer {
    return new Buffer(size);
  }

  @unsafe public static allocUnsafe(size: i32): Buffer {
    // Node throws an error if size is less than 0
    if (u32(size) > BLOCK_MAXSIZE) throw new RangeError(E_INVALIDLENGTH);
    let buffer = __alloc(size, idof<ArrayBuffer>());
    // This retains the pointer to the result Buffer.
    let result = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>()));
    result.data = changetype<ArrayBuffer>(buffer);
    result.dataStart = changetype<usize>(buffer);
    result.dataLength = size;
    return result;
  }

  public static isBuffer<T>(value: T): bool {
    return value instanceof Buffer;
  }

  readInt8(offset: i32 = 0): i8 {
    if(i32(offset < 0) | i32(<u32>offset >= this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i8>(this.dataStart + <usize>offset);
  }

  readUInt8(offset: i32 = 0): u8 {
    if(i32(offset < 0) | i32(<u32>offset >= this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u8>(this.dataStart + <usize>offset);
  }

  writeInt8(value: i8, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset >= this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i8>(this.dataStart + offset, value);
    return offset + 1;
  }

  writeUInt8(value: u8, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset >= this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u8>(this.dataStart + offset, value);
    return offset + 1;
  }

  readInt16LE(offset: i32 = 0): i16 {
    if(i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i16>(this.dataStart + <usize>offset);
  }

  readInt16BE(offset: i32 = 0): i16 {
    if(i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap<i16>(load<i16>(this.dataStart + <usize>offset));
  }

  readUInt16LE(offset: i32 = 0): u16 {
    if(i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u16>(this.dataStart + <usize>offset);
  }

  readUInt16BE(offset: i32 = 0): u16 {
    if(i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap<u16>(load<u16>(this.dataStart + <usize>offset));
  }

  writeInt16LE(value: i16, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i16>(this.dataStart + offset, value);
    return offset + 2;
  }

  writeInt16BE(value: i16, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i16>(this.dataStart + offset, bswap<i16>(value));
    return offset + 2;
  }

  writeUInt16LE(value: u16, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u16>(this.dataStart + offset, value);
    return offset + 2;
  }

  writeUInt16BE(value: u16, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u16>(this.dataStart + offset, bswap<u16>(value));
    return offset + 2;
  }

  readInt32LE(offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i32>(this.dataStart + <usize>offset);
  }

  readInt32BE(offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap<i32>(load<i32>(this.dataStart + <usize>offset));
  }

  readUInt32LE(offset: i32 = 0): u32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u32>(this.dataStart + <usize>offset);
  }

  readUInt32BE(offset: i32 = 0): u32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap<u32>(load<u32>(this.dataStart + <usize>offset));
  }

  writeInt32LE(value: i32, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + offset, value);
    return offset + 4;
  }

  writeInt32BE(value: i32, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + offset, bswap<i32>(value));
    return offset + 4;
  }

  writeUInt32LE(value: u32, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u32>(this.dataStart + offset, value);
    return offset + 4;
  }

  writeUInt32BE(value: u32, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u32>(this.dataStart + offset, bswap<u32>(value));
    return offset + 4;
  }

  readFloatLE(offset: i32 = 0): f32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<f32>(this.dataStart + <usize>offset);
  }

  readFloatBE(offset: i32 = 0): f32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return reinterpret<f32>(bswap<i32>(load<i32>(this.dataStart + <usize>offset)));
  }

  writeFloatLE(value: f32, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<f32>(this.dataStart + offset, value);
    return offset + 4;
  }

  writeFloatBE(value: f32, offset: i32 = 0): i32 {
    if(i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + offset, bswap<i32>(reinterpret<i32>(value)));
    return offset + 4;
  }
}
