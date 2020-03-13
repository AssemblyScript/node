import { BLOCK_MAXSIZE, BLOCK, BLOCK_OVERHEAD } from "rt/common";
import { E_INVALIDLENGTH, E_INDEXOUTOFRANGE } from "util/error";
import { Uint8Array } from "typedarray";
import { ArrayBufferView } from "arraybuffer";
import { Array } from "array";

// @ts-ignore: Decorator
@inline
function assembleBuffer(arrayBuffer: usize, offset: usize, length: u32): Buffer {
  let pointer = __alloc(offsetof<Buffer>(), idof<Buffer>());
  store<usize>(pointer, __retain(arrayBuffer), offsetof<Buffer>("buffer"));
  store<usize>(pointer, arrayBuffer + offset, offsetof<Buffer>("dataStart"));
  store<u32>(pointer, length, offsetof<Buffer>("byteLength"));
  return changetype<Buffer>(pointer);
}

export class Buffer extends Uint8Array {
  constructor(size: i32) {
    super(size);
  }

  static alloc(size: i32): Buffer {
    return new Buffer(size);
  }

  @unsafe static allocUnsafe(size: i32): Buffer {
    // range must be valid
    if (<usize>size > BLOCK_MAXSIZE) throw new RangeError(E_INVALIDLENGTH);
    return assembleBuffer(__alloc(size, idof<ArrayBuffer>()), 0, size);
  }

  public static fromArrayBuffer(buffer: ArrayBuffer, byteOffset: i32 = 0, length: i32 = -1): Buffer {
    length = select(buffer.byteLength, length, length < 0);
    if (i32(byteOffset < 0) | i32(byteOffset > buffer.byteLength - length)) throw new RangeError(E_INDEXOUTOFRANGE);
    if (length == 0) return new Buffer(0);

    return assembleBuffer(changetype<usize>(buffer), <usize>byteOffset, <u32>length);
  }

  public static fromString(value: string, encoding: string = "utf8"): Buffer {
    let buffer: ArrayBuffer;
    if (encoding == "utf8" || encoding == "utf-8") {
      buffer = String.UTF8.encode(value);
    } else if (encoding == "utf16le") {
      buffer = String.UTF16.encode(value);
    } else if (encoding == "hex") {
      buffer = Buffer.HEX.encode(value);
    } else if (encoding == "ascii") {
      buffer = Buffer.ASCII.encode(value);
    } else {
      throw new TypeError("Invalid string encoding.");
    }

    // assemble the buffer
    return assembleBuffer(changetype<usize>(buffer), 0, buffer.byteLength);
  }

  public static fromArray<T extends ArrayBufferView>(value: T, offset: i32 = 0, length: i32 = -1): Buffer {
    length = select(value.length, length, length < 0);
    if (i32(offset < 0) | i32(offset > value.length)) throw new RangeError(E_INDEXOUTOFRANGE);
    if (length > value.length - offset) throw new RangeError(E_INVALIDLENGTH);
    if (length == 0) return new Buffer(0);
    let arrayBuffer = __alloc(length, idof<ArrayBuffer>());
    if (value instanceof Array<string>) {
      for (let i = 0; i < length; i++) {
        let index = i + offset;
        let byteValue = parseFloat(unchecked(value[index]));
        store<u8>(arrayBuffer + <usize>i, <u8>(isFinite(byteValue) ? <u8>byteValue : 0));
      }
    } else {
      for (let i = 0; i < length; i++) {
        let index = i + offset;
        let element = isDefined(unchecked(value[index]))
          ? unchecked(value[index])
          : value[index];

        if (isFloat(element)) {
          store<u8>(arrayBuffer + <usize>i, <u8>(isFinite(element) ? <u8>element : 0));
        } else {
          store<u8>(arrayBuffer + <usize>i, <u8>element);
        }
      }
    }

    return assembleBuffer(arrayBuffer, 0, length);
  }

  public static fromBuffer(source: Buffer): Buffer {
    let length = source.byteLength;
    let data = __alloc(length, idof<ArrayBuffer>()); // retains
    memory.copy(data, source.dataStart, length);
    return assembleBuffer(data, 0, length);
  }

  // @ts-ignore: Buffer returns on all valid branches
  public static from<T>(value: T): Buffer {
    if (value instanceof ArrayBuffer) {
      return assembleBuffer(changetype<usize>(value), 0, value.byteLength);
    } else if (value instanceof String) {
      // @ts-ignore value not instance of `string` does changetype<string>(value) work here?
      let buffer = String.UTF8.encode(value);
      return assembleBuffer(changetype<usize>(buffer), 0, buffer.byteLength);
    } else if (value instanceof Buffer) {
      return Buffer.fromBuffer(value);
    } else if (value instanceof ArrayBufferView) {
      return Buffer.fromArray(value);
    }
    ERROR("Cannot call Buffer.from<T>() where T is not a string, Buffer, ArrayBuffer, Array, or Array-like Object.");
  }

  public static isBuffer<T>(value: T): bool {
    return value instanceof Buffer;
  }

  // Adapted from https://github.com/AssemblyScript/assemblyscript/blob/master/std/assembly/typedarray.ts
  subarray(begin: i32 = 0, end: i32 = 0x7fffffff): Buffer {
    var len = <i32>this.byteLength;
    begin = begin < 0 ? max(len + begin, 0) : min(begin, len);
    end   = end   < 0 ? max(len + end,   0) : min(end,   len);
    end   = max(end, begin);

    return assembleBuffer(changetype<usize>(this.buffer), <usize>this.byteOffset + <usize>begin, <u32>end - <u32>begin);
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
}
