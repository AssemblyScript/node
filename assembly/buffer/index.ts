import { BLOCK_MAXSIZE, BLOCK, BLOCK_OVERHEAD } from "rt/common";
import { E_INVALIDLENGTH, E_INDEXOUTOFRANGE } from "util/error";
import { Uint8Array } from "typedarray";

export class Buffer extends Uint8Array {
  [key: number]: u8;

  constructor(size: i32) {
    super(size);
  }

  static alloc(size: i32): Buffer {
    return new Buffer(size);
  }

  @unsafe static allocUnsafe(size: i32): Buffer {
    // range must be valid
    if (<usize>size > BLOCK_MAXSIZE) throw new RangeError(E_INVALIDLENGTH);
    let buffer = __alloc(size, idof<ArrayBuffer>());
    let result = __alloc(offsetof<Buffer>(), idof<Buffer>());

    // set the properties
    store<usize>(result, __retain(buffer), offsetof<Buffer>("buffer"));
    store<usize>(result, buffer, offsetof<Buffer>("dataStart"));
    store<i32>(result, size, offsetof<Buffer>("byteLength"));

    // return and retain
    return changetype<Buffer>(result);
  }

  static isBuffer<T>(value: T): bool {
    return value instanceof Buffer;
  }

  // Adapted from https://github.com/AssemblyScript/assemblyscript/blob/master/std/assembly/typedarray.ts
  subarray(begin: i32 = 0, end: i32 = 0x7fffffff): Buffer {
    var len = <i32>this.byteLength;
    begin = begin < 0 ? max(len + begin, 0) : min(begin, len);
    end   = end   < 0 ? max(len + end,   0) : min(end,   len);
    end   = max(end, begin);

    var out = __alloc(offsetof<Buffer>(), idof<Buffer>()); // retains
    store<usize>(out, __retain(changetype<usize>(this.buffer)), offsetof<Buffer>("buffer"));
    store<usize>(out, this.dataStart + <usize>begin, offsetof<Buffer>("dataStart"));
    store<i32>(out, end - begin, offsetof<Buffer>("byteLength"));

    // retains
    return changetype<Buffer>(out);
  }

  readInt8(offset: i32 = 0): i8 {
    if (i32(offset < 0) | i32(offset >= this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i8>(this.dataStart + <usize>offset);
  }

  readUInt8(offset: i32 = 0): u8 {
    if (i32(offset < 0) | i32(offset >= this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u8>(this.dataStart + <usize>offset);
  }

  writeInt8(value: i8, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset >= this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i8>(this.dataStart + offset, value);
    return offset + 1;
  }

  writeUInt8(value: u8, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset >= this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u8>(this.dataStart + offset, value);
    return offset + 1;
  }

  readInt16LE(offset: i32 = 0): i16 {
    if (i32(offset < 0) | i32(offset + 2 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i16>(this.dataStart + <usize>offset);
  }

  readInt16BE(offset: i32 = 0): i16 {
    if (i32(offset < 0) | i32(offset + 2 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap(load<i16>(this.dataStart + <usize>offset));
  }

  readUInt16LE(offset: i32 = 0): u16 {
    if (i32(offset < 0) | i32(offset + 2 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u16>(this.dataStart + <usize>offset);
  }

  readUInt16BE(offset: i32 = 0): u16 {
    if (i32(offset < 0) | i32(offset + 2 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap(load<u16>(this.dataStart + <usize>offset));
  }

  writeInt16LE(value: i16, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 2 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i16>(this.dataStart + offset, value);
    return offset + 2;
  }

  writeInt16BE(value: i16, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 2 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i16>(this.dataStart + offset, bswap(value));
    return offset + 2;
  }

  writeUInt16LE(value: u16, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 2 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u16>(this.dataStart + offset, value);
    return offset + 2;
  }

  writeUInt16BE(value: u16, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 2 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u16>(this.dataStart + offset, bswap(value));
    return offset + 2;
  }

  readInt32LE(offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i32>(this.dataStart + <usize>offset);
  }

  readInt32BE(offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap(load<i32>(this.dataStart + <usize>offset));
  }

  readUInt32LE(offset: i32 = 0): u32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u32>(this.dataStart + <usize>offset);
  }

  readUInt32BE(offset: i32 = 0): u32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap(load<u32>(this.dataStart + <usize>offset));
  }

  writeInt32LE(value: i32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + offset, value);
    return offset + 4;
  }

  writeInt32BE(value: i32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + offset, bswap(value));
    return offset + 4;
  }

  writeUInt32LE(value: u32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u32>(this.dataStart + offset, value);
    return offset + 4;
  }

  writeUInt32BE(value: u32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u32>(this.dataStart + offset, bswap(value));
    return offset + 4;
  }

  readFloatLE(offset: i32 = 0): f32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<f32>(this.dataStart + <usize>offset);
  }

  readFloatBE(offset: i32 = 0): f32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return reinterpret<f32>(bswap(load<i32>(this.dataStart + <usize>offset)));
  }

  writeFloatLE(value: f32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<f32>(this.dataStart + offset, value);
    return offset + 4;
  }

  writeFloatBE(value: f32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 4 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + offset, bswap(reinterpret<i32>(value)));
    return offset + 4;
  }

  readBigInt64LE(offset: i32 = 0): i64 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i64>(this.dataStart + <usize>offset);
  }

  readBigInt64BE(offset: i32 = 0): i64 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap(load<i64>(this.dataStart + <usize>offset));
  }

  readBigUInt64LE(offset: i32 = 0): u64 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u64>(this.dataStart + <usize>offset);
  }

  readBigUInt64BE(offset: i32 = 0): u64 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap(load<u64>(this.dataStart + <usize>offset));
  }

  writeBigInt64LE(value: i64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i64>(this.dataStart + offset, value);
    return offset + 8;
  }

  writeBigInt64BE(value: i64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i64>(this.dataStart + offset, bswap(value));
    return offset + 8;
  }

  writeBigUInt64LE(value: u64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u64>(this.dataStart + offset, value);
    return offset + 8;
  }

  writeBigUInt64BE(value: u64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u64>(this.dataStart + offset, bswap(value));
    return offset + 8;
  }

  readDoubleLE(offset: i32 = 0): f64 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<f64>(this.dataStart + <usize>offset);
  }

  readDoubleBE(offset: i32 = 0): f64 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return reinterpret<f64>(bswap(load<i64>(this.dataStart + <usize>offset)));
  }

  writeDoubleLE(value: f64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<f64>(this.dataStart + offset, value);
    return offset + 8;
  }

  writeDoubleBE(value: f64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(offset + 8 > this.byteLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i64>(this.dataStart + offset, bswap(reinterpret<i64>(value)));
    return offset + 8;
  }

  swap16(): Buffer {
    let byteLength = <usize>this.byteLength;
    // Make sure byteLength is even
    if (byteLength & 1) throw new RangeError(E_INVALIDLENGTH);
    let dataStart = this.dataStart;
    byteLength += dataStart;
    while (dataStart < byteLength) {
      store<u16>(dataStart, bswap(load<u16>(dataStart)));
      dataStart += 2;
    }
    return this;
  }

  swap32(): Buffer {
    let byteLength = <usize>this.byteLength;
    // Make sure byteLength is divisible by 4
    if (byteLength & 3) throw new RangeError(E_INVALIDLENGTH);
    let dataStart = this.dataStart;
    byteLength += dataStart;
    while (dataStart < byteLength) {
      store<u32>(dataStart, bswap(load<u32>(dataStart)));
      dataStart += 4;
    }
    return this;
  }

  swap64(): Buffer {
    let byteLength = <usize>this.byteLength;
    // Make sure byteLength is divisible by 8
    if (byteLength & 7) throw new RangeError(E_INVALIDLENGTH);
    let dataStart = this.dataStart;
    byteLength += dataStart;
    while (dataStart < <usize>byteLength) {
      store<u64>(dataStart, bswap(load<u64>(dataStart)));
      dataStart += 8;
    }
    return this;
  }
}

export namespace Buffer {
  export namespace ASCII {
    export function encode(str: string): ArrayBuffer {
      let length = str.length;
      let output = __alloc(length, idof<ArrayBuffer>());
      for (let i = 0; i < length; i++) {
        let char = load<u16>(changetype<usize>(str) + <usize>(i << 1));
        store<u8>(output + <usize>i, char & 0x7F);
      }
      return changetype<ArrayBuffer>(output);
    }

    export function decode(buffer: ArrayBuffer): String {
      return decodeUnsafe(changetype<usize>(buffer), buffer.byteLength);
    }

    // @ts-ignore: decorator
    @unsafe export function decodeUnsafe(pointer: usize, length: i32): String {
      let result = __alloc(<usize>length << 1, idof<string>());

      for (let i = 0; i < length; i++) {
        let byte = load<u8>(pointer + <usize>i);
        store<u16>(result + <usize>(i << 1), byte & 0x7F);
      }

      return changetype<String>(result);
    }
  }

  export namespace HEX {
    /** Calculates the byte length of the specified string when encoded as HEX. */
    export function byteLength(str: string): i32 {
      let ptr = changetype<usize>(str);
      let byteCount = <usize>changetype<BLOCK>(changetype<usize>(str) - BLOCK_OVERHEAD).rtSize;
      let length = byteCount >>> 2;
      // The string length must be even because the bytes come in pairs of characters two wide
      if (byteCount & 3) return 0; // encoding fails and returns an empty ArrayBuffer

      byteCount += ptr;
      while (ptr < byteCount) {
        var char = load<u16>(ptr);
        if (  ((char - 0x30) <= 9)
           || ((char - 0x61) <= 5)
           || ((char - 0x41) <= 5)) {
          ptr += 2;
          continue;
        } else {
          return 0;
        }
      }
      return <i32>length;
    }

    /** Creates an ArrayBuffer from a given string that is encoded in the HEX format. */
    export function encode(str: string): ArrayBuffer {
      let bufferLength = byteLength(str);
      // short path: string is not a valid hex string, return a new empty ArrayBuffer
      if (bufferLength == 0) return changetype<ArrayBuffer>(__alloc(0, idof<ArrayBuffer>()));

      // long path: loop over each enociding pair and perform the conversion
      let ptr = changetype<usize>(str);
      let byteEnd = ptr + <usize>changetype<BLOCK>(changetype<usize>(str) - BLOCK_OVERHEAD).rtSize;
      let result = __alloc(bufferLength, idof<ArrayBuffer>());
      let b: u32 = 0;
      let outChar = 0;
      for (let i: usize = 0; ptr < byteEnd; i++) {
        if (i & 1) {
          outChar <<= 4;
          b >>>= 16;
          if ((b - 0x30) <= 9) {
            outChar |= b - 0x30;
          } else if ((b - 0x61) <= 5) {
            outChar |= b - 0x57;
          } else if (b - 0x41 <= 5) {
            outChar |= b - 0x37;
          }
          store<u8>(result + (i >> 1), <u8>(outChar & 0xFF));
          ptr += 4;
        } else {
          b = load<u32>(ptr);
          outChar <<= 4;
          let c = b & 0xFF;
          if ((c - 0x30) <= 9) {
            outChar |= c - 0x30;
          } else if ((c - 0x61) <= 5) {
            outChar |= c - 0x57;
          } else if (c - 0x41 <= 5) {
            outChar |= c - 0x37;
          }
        }
      }
      return changetype<ArrayBuffer>(result);
    }

    /** Creates a string from a given ArrayBuffer that is decoded into hex format. */
    export function decode(buff: ArrayBuffer): string {
      return decodeUnsafe(changetype<usize>(buff), buff.byteLength);
    }

    /** Decodes a chunk of memory to a utf16le encoded string in hex format. */
    // @ts-ignore: decorator
    @unsafe export function decodeUnsafe(ptr: usize, length: i32): string {
      let stringByteLength = length << 2; // length * (2 bytes per char) * (2 chars per input byte)
      let result = __alloc(stringByteLength, idof<String>());
      let i = <usize>0;
      let inputByteLength = <usize>length + ptr;

      // loop over each byte and store a `u32` for each one
      while (ptr < inputByteLength) {
        store<u32>(result + i, charsFromByte(<u32>load<u8>(ptr++)));
        i += 4;
      }

      return changetype<string>(result);
    }

    /** Calculates the two char combination from the byte. */
    // @ts-ignore: decorator
    @inline function charsFromByte(byte: u32): u32 {
      let hi = (byte >>> 4) & 0xF;
      let lo = byte & 0xF;
      hi += select(0x57, 0x30, hi > 9);
      lo += select(0x57, 0x30, lo > 9);
      return (lo << 16) | hi;
    }
  }

  /**
   * Base64 implementation copied from:
   * github.com/lemire/fastbase64/blob/master/src/chromiumbase64.c
   */
  export namespace BASE64 {
    export function byteLength(str: string): i32 {
      let len = str.length;
      let p = len;
      if (p === 0) return 0;
      let n = 0;
      while (i32((--p & 0x3) > 1) & i32(load<u16>(changetype<usize>(str) + <usize>p) == 0x3d)) {
        n++;
      }
      return (len * 3) / 4 - n;
    }

    const e0 = [
      0x41, 0x41, 0x41, 0x41, 0x42, 0x42, 0x42, 0x42, 0x43, 0x43, 0x43, 0x43, 0x44, 0x44, 0x44, 0x44,
      0x45, 0x45, 0x45, 0x45, 0x46, 0x46, 0x46, 0x46, 0x47, 0x47, 0x47, 0x47, 0x48, 0x48, 0x48, 0x48,
      0x49, 0x49, 0x49, 0x49, 0x4a, 0x4a, 0x4a, 0x4a, 0x4b, 0x4b, 0x4b, 0x4b, 0x4c, 0x4c, 0x4c, 0x4c,
      0x4d, 0x4d, 0x4d, 0x4d, 0x4e, 0x4e, 0x4e, 0x4e, 0x4f, 0x4f, 0x4f, 0x4f, 0x50, 0x50, 0x50, 0x50,
      0x51, 0x51, 0x51, 0x51, 0x52, 0x52, 0x52, 0x52, 0x53, 0x53, 0x53, 0x53, 0x54, 0x54, 0x54, 0x54,
      0x55, 0x55, 0x55, 0x55, 0x56, 0x56, 0x56, 0x56, 0x57, 0x57, 0x57, 0x57, 0x58, 0x58, 0x58, 0x58,
      0x59, 0x59, 0x59, 0x59, 0x5a, 0x5a, 0x5a, 0x5a, 0x61, 0x61, 0x61, 0x61, 0x62, 0x62, 0x62, 0x62,
      0x63, 0x63, 0x63, 0x63, 0x64, 0x64, 0x64, 0x64, 0x65, 0x65, 0x65, 0x65, 0x66, 0x66, 0x66, 0x66,
      0x67, 0x67, 0x67, 0x67, 0x68, 0x68, 0x68, 0x68, 0x69, 0x69, 0x69, 0x69, 0x6a, 0x6a, 0x6a, 0x6a,
      0x6b, 0x6b, 0x6b, 0x6b, 0x6c, 0x6c, 0x6c, 0x6c, 0x6d, 0x6d, 0x6d, 0x6d, 0x6e, 0x6e, 0x6e, 0x6e,
      0x6f, 0x6f, 0x6f, 0x6f, 0x70, 0x70, 0x70, 0x70, 0x71, 0x71, 0x71, 0x71, 0x72, 0x72, 0x72, 0x72,
      0x73, 0x73, 0x73, 0x73, 0x74, 0x74, 0x74, 0x74, 0x75, 0x75, 0x75, 0x75, 0x76, 0x76, 0x76, 0x76,
      0x77, 0x77, 0x77, 0x77, 0x78, 0x78, 0x78, 0x78, 0x79, 0x79, 0x79, 0x79, 0x7a, 0x7a, 0x7a, 0x7a,
      0x30, 0x30, 0x30, 0x30, 0x31, 0x31, 0x31, 0x31, 0x32, 0x32, 0x32, 0x32, 0x33, 0x33, 0x33, 0x33,
      0x34, 0x34, 0x34, 0x34, 0x35, 0x35, 0x35, 0x35, 0x36, 0x36, 0x36, 0x36, 0x37, 0x37, 0x37, 0x37,
      0x38, 0x38, 0x38, 0x38, 0x39, 0x39, 0x39, 0x39, 0x2b, 0x2b, 0x2b, 0x2b, 0x2f, 0x2f, 0x2f, 0x2f,
    ] as StaticArray<u8>;

    const e1 = [
      0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f, 0x50,
      0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66,
      0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76,
      0x77, 0x78, 0x79, 0x7a, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2b, 0x2f,
      0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f, 0x50,
      0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66,
      0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76,
      0x77, 0x78, 0x79, 0x7a, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2b, 0x2f,
      0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f, 0x50,
      0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66,
      0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76,
      0x77, 0x78, 0x79, 0x7a, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2b, 0x2f,
      0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f, 0x50,
      0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66,
      0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76,
      0x77, 0x78, 0x79, 0x7a, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2b, 0x2f,
    ] as StaticArray<u8>;

    const e2 = [
      0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f, 0x50,
      0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66,
      0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76,
      0x77, 0x78, 0x79, 0x7a, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2b, 0x2f,
      0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f, 0x50,
      0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66,
      0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76,
      0x77, 0x78, 0x79, 0x7a, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2b, 0x2f,
      0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f, 0x50,
      0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66,
      0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76,
      0x77, 0x78, 0x79, 0x7a, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2b, 0x2f,
      0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f, 0x50,
      0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66,
      0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76,
      0x77, 0x78, 0x79, 0x7a, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2b, 0x2f,
    ] as StaticArray<u8>;

    const CHARPAD: u8 = 61; // =

    export function encode(str: string): ArrayBuffer {
      let i: usize = 0;
      let p = __alloc(byteLength(str), idof<ArrayBuffer>());
      let len = <usize>str.length;
      let strPtr = changetype<usize>(str);

      // must be unsigned 8
      let t1: u8 = 0;
      let t2: u8 = 0;
      let t3: u8 = 0;

      if (len > 2) {
        for (;i < len - 2; i += 3) {
          // load t values
          t1 = <u8>load<u16>(strPtr + (i << 1));
          t2 = <u8>load<u16>(strPtr + ((i + 1) << 1));
          t3 = <u8>load<u16>(strPtr + ((i + 2) << 1));

          store<u8>(p++, unchecked(e0[t1]));
          store<u8>(p++, unchecked(e1[((t1 & 0x03) << 4) | ((t2 >> 4) & 0x0F)]));
          store<u8>(p++, unchecked(e1[((t2 & 0x0F) << 2) | ((t3 >> 6) & 0x03)]));
          store<u8>(p++, unchecked(e2[t3]));
        }
      }

      switch (len - i) {
        case 0: break;
        case 1:
          t1 = <u8>load<u16>(strPtr + (i << 1));
          store<u8>(p++, unchecked(e0[t1]));
          store<u8>(p++, unchecked(e1[(t1 & 0x03) << 4]));
          store<u8>(p++, CHARPAD);
          store<u8>(p++, CHARPAD);
          break;
        case 2:
          t1 = <u8>load<u16>(strPtr + (i << 1));
          t2 = <u8>load<u16>(strPtr + ((i + 1) << 1));
          store<u8>(p++, unchecked(e0[t1]));
          store<u8>(p++, unchecked(e1[((t1 & 0x03) << 4) | ((t2 >> 4) & 0x0F)]));
          store<u8>(p++, unchecked(e2[(t2 & 0x0F) << 2]));
          store<u8>(p++, CHARPAD)
      }
      // return the buffer and retain it
      return changetype<ArrayBuffer>(p);
    }

    export function decode(buffer: ArrayBuffer): string {
      return decodeUnsafe(changetype<usize>(buffer), buffer.byteLength);
    }

    const d0 = [
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x000000f8, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x000000fc,
      0x000000d0, 0x000000d4, 0x000000d8, 0x000000dc, 0x000000e0, 0x000000e4,
      0x000000e8, 0x000000ec, 0x000000f0, 0x000000f4, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x00000000,
      0x00000004, 0x00000008, 0x0000000c, 0x00000010, 0x00000014, 0x00000018,
      0x0000001c, 0x00000020, 0x00000024, 0x00000028, 0x0000002c, 0x00000030,
      0x00000034, 0x00000038, 0x0000003c, 0x00000040, 0x00000044, 0x00000048,
      0x0000004c, 0x00000050, 0x00000054, 0x00000058, 0x0000005c, 0x00000060,
      0x00000064, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x00000068, 0x0000006c, 0x00000070, 0x00000074, 0x00000078,
      0x0000007c, 0x00000080, 0x00000084, 0x00000088, 0x0000008c, 0x00000090,
      0x00000094, 0x00000098, 0x0000009c, 0x000000a0, 0x000000a4, 0x000000a8,
      0x000000ac, 0x000000b0, 0x000000b4, 0x000000b8, 0x000000bc, 0x000000c0,
      0x000000c4, 0x000000c8, 0x000000cc, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff
    ] as StaticArray<u32>;

    const d1 = [
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x0000e003, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x0000f003,
      0x00004003, 0x00005003, 0x00006003, 0x00007003, 0x00008003, 0x00009003,
      0x0000a003, 0x0000b003, 0x0000c003, 0x0000d003, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x00000000,
      0x00001000, 0x00002000, 0x00003000, 0x00004000, 0x00005000, 0x00006000,
      0x00007000, 0x00008000, 0x00009000, 0x0000a000, 0x0000b000, 0x0000c000,
      0x0000d000, 0x0000e000, 0x0000f000, 0x00000001, 0x00001001, 0x00002001,
      0x00003001, 0x00004001, 0x00005001, 0x00006001, 0x00007001, 0x00008001,
      0x00009001, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x0000a001, 0x0000b001, 0x0000c001, 0x0000d001, 0x0000e001,
      0x0000f001, 0x00000002, 0x00001002, 0x00002002, 0x00003002, 0x00004002,
      0x00005002, 0x00006002, 0x00007002, 0x00008002, 0x00009002, 0x0000a002,
      0x0000b002, 0x0000c002, 0x0000d002, 0x0000e002, 0x0000f002, 0x00000003,
      0x00001003, 0x00002003, 0x00003003, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff
    ] as StaticArray<u32>;

    const d2 = [
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x00800f00, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x00c00f00,
      0x00000d00, 0x00400d00, 0x00800d00, 0x00c00d00, 0x00000e00, 0x00400e00,
      0x00800e00, 0x00c00e00, 0x00000f00, 0x00400f00, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x00000000,
      0x00400000, 0x00800000, 0x00c00000, 0x00000100, 0x00400100, 0x00800100,
      0x00c00100, 0x00000200, 0x00400200, 0x00800200, 0x00c00200, 0x00000300,
      0x00400300, 0x00800300, 0x00c00300, 0x00000400, 0x00400400, 0x00800400,
      0x00c00400, 0x00000500, 0x00400500, 0x00800500, 0x00c00500, 0x00000600,
      0x00400600, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x00800600, 0x00c00600, 0x00000700, 0x00400700, 0x00800700,
      0x00c00700, 0x00000800, 0x00400800, 0x00800800, 0x00c00800, 0x00000900,
      0x00400900, 0x00800900, 0x00c00900, 0x00000a00, 0x00400a00, 0x00800a00,
      0x00c00a00, 0x00000b00, 0x00400b00, 0x00800b00, 0x00c00b00, 0x00000c00,
      0x00400c00, 0x00800c00, 0x00c00c00, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff
    ];

    const d3 = [
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x003e0000, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x003f0000,
      0x00340000, 0x00350000, 0x00360000, 0x00370000, 0x00380000, 0x00390000,
      0x003a0000, 0x003b0000, 0x003c0000, 0x003d0000, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x00000000,
      0x00010000, 0x00020000, 0x00030000, 0x00040000, 0x00050000, 0x00060000,
      0x00070000, 0x00080000, 0x00090000, 0x000a0000, 0x000b0000, 0x000c0000,
      0x000d0000, 0x000e0000, 0x000f0000, 0x00100000, 0x00110000, 0x00120000,
      0x00130000, 0x00140000, 0x00150000, 0x00160000, 0x00170000, 0x00180000,
      0x00190000, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x001a0000, 0x001b0000, 0x001c0000, 0x001d0000, 0x001e0000,
      0x001f0000, 0x00200000, 0x00210000, 0x00220000, 0x00230000, 0x00240000,
      0x00250000, 0x00260000, 0x00270000, 0x00280000, 0x00290000, 0x002a0000,
      0x002b0000, 0x002c0000, 0x002d0000, 0x002e0000, 0x002f0000, 0x00300000,
      0x00310000, 0x00320000, 0x00330000, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff,
      0x01ffffff, 0x01ffffff, 0x01ffffff, 0x01ffffff
    ];

    const BADCHAR: u32 = 0x01FFFFFF;

    @unsafe export function decodeUnsafe(pointer: usize, len: i32): string {
      if (len == 0) return "";
      if (i32(len < 0) | i32(len & 0x3)) throw new Error(E_INVALIDLENGTH);

      // at most 2 padding characters
      if (load<u8>(pointer + len) == CHARPAD) {
        len--;
        if (load<u8>(pointer + len) == CHARPAD) {
          len--;
        }
      }

      let i: usize = 0;
      let leftover = len & 3;
      let chunks = len / 4 - select(1, 0, leftover == 0);
      let y = pointer;
      let result = __alloc(<usize>len << 1, idof<string>());
      let x: u32 = 0;

      // for each chunk
      for (i = 0; i < chunks; i++, y += 4) {
        x = unchecked(d0[<i32>load<u8>(y)])
          | unchecked(d1[<i32>load<u8>(y, 1)])
          | unchecked(d2[<i32>load<u8>(y, 2)])
          | unchecked(d3[<i32>load<u8>(y, 3)]);
        if (x >= BADCHAR) throw new Error(E_INDEXOUTOFRANGE);
        let outputPtr = result + (<usize>i << 1);
        store<u16>(outputPtr,  x         & 0xFF);
        store<u16>(outputPtr, (x >>>  8) & 0xFF, 2);
        store<u16>(outputPtr, (x >>> 16) & 0xFF, 4);
      }

      let outputPtr = result + (<usize>i << 1);
      switch(leftover) {
        case 0:
          x = unchecked(d0[<i32>load<u8>(y)])
            | unchecked(d1[<i32>load<u8>(y, 1)])
            | unchecked(d2[<i32>load<u8>(y, 2)])
            | unchecked(d3[<i32>load<u8>(y, 3)]);
          if (x >= BADCHAR) throw new Error(E_INDEXOUTOFRANGE);

          store<u16>(outputPtr,  x         & 0xFF);
          store<u16>(outputPtr, (x >>>  8) & 0xFF, 2);
          store<u16>(outputPtr, (x >>> 16) & 0xFF, 4);
          return changetype<string>(result);
        case 1:
          x = unchecked(d0[<i32>load<u8>(y)]);
          store<u16>(outputPtr,  x         & 0xFF);
          break;
        case 2:
          x = unchecked(d0[<i32>load<u8>(y)])
            | unchecked(d1[<i32>load<u8>(y, 1)]);
          store<u16>(outputPtr,  x         & 0xFF);
          break;
        case 3:
          x = unchecked(d0[<i32>load<u8>(y)])
            | unchecked(d1[<i32>load<u8>(y, 1)])
            | unchecked(d2[<i32>load<u8>(y, 2)]);
          store<u16>(outputPtr,  x         & 0xFF);
          store<u16>(outputPtr, (x >>>  8) & 0xFF, 2);
          break;
      }
      if (x >= BADCHAR) throw new Error(E_INDEXOUTOFRANGE);
      return changetype<string>(result);
    }
  }
}
