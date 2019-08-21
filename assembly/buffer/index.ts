import { BLOCK_MAXSIZE, BLOCK, BLOCK_OVERHEAD } from "rt/common";
import { E_INVALIDLENGTH, E_INDEXOUTOFRANGE } from "util/error";
import { Uint8Array } from "typedarray";
import { ArrayBufferView } from "arraybuffer";

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

  // @ts-ignore: Buffer returns on all valid branches
  public static from<T extends ArrayBufferView>(value: T): Buffer {
    // @ts-ignore: AssemblyScript treats this statement correctly
    if (value instanceof String[]) {
      let length = <usize>value.length;
      let buffer = __alloc(length, idof<ArrayBuffer>());
      let sourceStart = value.dataStart;
      for (let i: usize = 0; i < length; i++) {
        let str = changetype<string>(load<usize>(sourceStart + (<usize>i << alignof<usize>())));
        let value = parseFloat(str); // parseFloat is still naive
        trace("float values", 2, value, u8(value));
        store<u8>(buffer + i, isFinite(value) ? u8(value) : u8(0));
      }
      let result = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>()));
      result.data = changetype<ArrayBuffer>(buffer);
      result.dataStart = changetype<usize>(buffer);
      result.dataLength = length;
      return result;
    } else if (value instanceof ArrayBuffer) {
      let result = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>()));
      result.data = value;
      result.dataStart = changetype<usize>(value);
      result.dataLength = value.byteLength;
      return result;
    } else if (value instanceof String) {
      // @ts-ignore value not instance of `string` does changetype<string>(value) work here?
      let buffer = String.UTF8.encode(value);
      let result = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>()));
      result.data = buffer;
      result.dataStart = changetype<usize>(buffer);
      result.dataLength = buffer.byteLength;
      return result;
    } else if (value instanceof Buffer) {
      let result = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>()));
      result.data = value.buffer;
      result.dataStart = value.dataStart;
      result.dataLength = value.dataLength;
      return result;
    } else if (value instanceof ArrayBufferView) {
      let length = value.length;
      let buffer = __alloc(length, idof<ArrayBuffer>());
      let result = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>()));
      // @ts-ignore: value[i] is implied to work
      for (let i = 0; i < length; i++) store<u8>(buffer + usize(i), u8(unchecked(value[i])));
      result.data = changetype<ArrayBuffer>(buffer);
      result.dataStart = buffer;
      result.dataLength = u32(length);
      return result;
    }
    ERROR("Cannot call Buffer.from<T>() where T is not a string, Buffer, ArrayBuffer, Array, or Array-like Object.");
  }

  public static isBuffer<T>(value: T): bool {
    return value instanceof Buffer;
  }

  // Adapted from https://github.com/AssemblyScript/assemblyscript/blob/master/std/assembly/typedarray.ts
  public subarray(begin: i32 = 0, end: i32 = 0x7fffffff): Buffer {
    var len = <i32>this.dataLength;
    begin = begin < 0 ? max(len + begin, 0) : min(begin, len);
    end   = end   < 0 ? max(len + end,   0) : min(end,   len);
    end   = max(end, begin);
    var out = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>())); // retains
    out.data = this.data; // retains
    out.dataStart = this.dataStart + <usize>begin;
    out.dataLength = end - begin;
    return out;
  }

  readInt8(offset: i32 = 0): i8 {
    if (i32(offset < 0) | i32(<u32>offset >= this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i8>(this.dataStart + <usize>offset);
  }

  readUInt8(offset: i32 = 0): u8 {
    if (i32(offset < 0) | i32(<u32>offset >= this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u8>(this.dataStart + <usize>offset);
  }

  writeInt8(value: i8, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset >= this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i8>(this.dataStart + offset, value);
    return offset + 1;
  }

  writeUInt8(value: u8, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset >= this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u8>(this.dataStart + offset, value);
    return offset + 1;
  }

  readInt16LE(offset: i32 = 0): i16 {
    if (i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i16>(this.dataStart + <usize>offset);
  }

  readInt16BE(offset: i32 = 0): i16 {
    if (i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap<i16>(load<i16>(this.dataStart + <usize>offset));
  }

  readUInt16LE(offset: i32 = 0): u16 {
    if (i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u16>(this.dataStart + <usize>offset);
  }

  readUInt16BE(offset: i32 = 0): u16 {
    if (i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap<u16>(load<u16>(this.dataStart + <usize>offset));
  }

  writeInt16LE(value: i16, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i16>(this.dataStart + offset, value);
    return offset + 2;
  }

  writeInt16BE(value: i16, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i16>(this.dataStart + offset, bswap<i16>(value));
    return offset + 2;
  }

  writeUInt16LE(value: u16, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u16>(this.dataStart + offset, value);
    return offset + 2;
  }

  writeUInt16BE(value: u16, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 2 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u16>(this.dataStart + offset, bswap<u16>(value));
    return offset + 2;
  }

  readInt32LE(offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i32>(this.dataStart + <usize>offset);
  }

  readInt32BE(offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap<i32>(load<i32>(this.dataStart + <usize>offset));
  }

  readUInt32LE(offset: i32 = 0): u32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u32>(this.dataStart + <usize>offset);
  }

  readUInt32BE(offset: i32 = 0): u32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap<u32>(load<u32>(this.dataStart + <usize>offset));
  }

  writeInt32LE(value: i32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + offset, value);
    return offset + 4;
  }

  writeInt32BE(value: i32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + offset, bswap<i32>(value));
    return offset + 4;
  }

  writeUInt32LE(value: u32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u32>(this.dataStart + offset, value);
    return offset + 4;
  }

  writeUInt32BE(value: u32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u32>(this.dataStart + offset, bswap<u32>(value));
    return offset + 4;
  }

  readFloatLE(offset: i32 = 0): f32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<f32>(this.dataStart + <usize>offset);
  }

  readFloatBE(offset: i32 = 0): f32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return reinterpret<f32>(bswap<i32>(load<i32>(this.dataStart + <usize>offset)));
  }

  writeFloatLE(value: f32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<f32>(this.dataStart + offset, value);
    return offset + 4;
  }

  writeFloatBE(value: f32, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 4 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + offset, bswap<i32>(reinterpret<i32>(value)));
    return offset + 4;
  }

  readBigInt64LE(offset: i32 = 0): i64 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i64>(this.dataStart + <usize>offset);
  }

  readBigInt64BE(offset: i32 = 0): i64 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap<i64>(load<i64>(this.dataStart + <usize>offset));
  }

  readBigUInt64LE(offset: i32 = 0): u64 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u64>(this.dataStart + <usize>offset);
  }

  readBigUInt64BE(offset: i32 = 0): u64 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return bswap<u64>(load<u64>(this.dataStart + <usize>offset));
  }

  writeBigInt64LE(value: i64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i64>(this.dataStart + offset, value);
    return offset + 8;
  }

  writeBigInt64BE(value: i64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i64>(this.dataStart + offset, bswap<i64>(value));
    return offset + 8;
  }

  writeBigUInt64LE(value: u64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u64>(this.dataStart + offset, value);
    return offset + 8;
  }

  writeBigUInt64BE(value: u64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u64>(this.dataStart + offset, bswap<u64>(value));
    return offset + 8;
  }

  readDoubleLE(offset: i32 = 0): f64 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<f64>(this.dataStart + <usize>offset);
  }

  readDoubleBE(offset: i32 = 0): f64 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    return reinterpret<f64>(bswap<i64>(load<i64>(this.dataStart + <usize>offset)));
  }

  writeDoubleLE(value: f64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<f64>(this.dataStart + offset, value);
    return offset + 8;
  }

  writeDoubleBE(value: f64, offset: i32 = 0): i32 {
    if (i32(offset < 0) | i32(<u32>offset + 8 > this.dataLength)) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i64>(this.dataStart + offset, bswap<i64>(reinterpret<i64>(value)));
    return offset + 8;
  }

  swap16(): Buffer {
    let dataLength = this.dataLength;
    // Make sure dataLength is even
    if (dataLength & 1) throw new RangeError(E_INVALIDLENGTH);
    let dataStart = this.dataStart;
    dataLength += dataStart;
    while (dataStart < dataLength) {
      store<u16>(dataStart, bswap<u16>(load<u16>(dataStart)));
      dataStart += 2;
    }
    return this;
  }
  
  swap32(): Buffer {
    let dataLength = this.dataLength;
    // Make sure dataLength is divisible by 4
    if (dataLength & 3) throw new RangeError(E_INVALIDLENGTH);
    let dataStart = this.dataStart;
    dataLength += dataStart;
    while (dataStart < dataLength) {
      store<u32>(dataStart, bswap<u32>(load<u32>(dataStart)));
      dataStart += 4;
    }
    return this;
  }
  
  swap64(): Buffer {
    let dataLength = this.dataLength;
    // Make sure dataLength is divisible by 8
    if (dataLength & 7) throw new RangeError(E_INVALIDLENGTH);
    let dataStart = this.dataStart;
    dataLength += dataStart;
    while (dataStart < dataLength) {
      store<u64>(dataStart, bswap<u64>(load<u64>(dataStart)));
      dataStart += 8;
    }
    return this;
  }
}

export namespace Buffer {
  export namespace HEX {
    /** Calculates the two char combination from the byte. */
    @inline export function charsFromByte(byte: u32): u32 {
      let top = (byte >>> 4) & 0xF;
      let bottom = (0xF & byte);
      top += select(0x57, 0x30, top > 9);
      bottom += select(0x57, 0x30, bottom > 9);
      return (bottom << 16) | top;
    }

    /** Calculates the byte length of the specified string when encoded as HEX. */
    export function byteLength(str: string): i32 {
      let ptr = changetype<usize>(str);
      let byteCount = changetype<BLOCK>(changetype<usize>(str) - BLOCK_OVERHEAD).rtSize;
      let length = byteCount >> 2;
      // The string length must be even because the bytes come in pairs of characters two wide
      if (byteCount & 0x3) return 0; // encoding fails and returns an empty ArrayBuffer

      byteCount += ptr;
      while (ptr < byteCount) {
        var char = load<u16>(ptr);
        if (  ((char - 0x30) <= 0x9)
           || ((char - 0x61) <= 0x5)
           || ((char - 0x41) <= 0x5)) {
          ptr += 2;
          continue;
        } else {
          return 0;
        }
      }
      return length;
    }

    /** Creates an ArrayBuffer from a given string that is encoded in the HEX format. */
    export function encode(str: string): ArrayBuffer {
      let bufferLength = byteLength(str);
      // short path: string is not a valid hex string, return a new empty ArrayBuffer
      if (bufferLength == 0) return changetype<ArrayBuffer>(__alloc(0, idof<ArrayBuffer>()));

      // long path: loop over each enociding pair and perform the conversion
      let ptr = changetype<usize>(str);
      let byteEnd = changetype<BLOCK>(changetype<usize>(str) - BLOCK_OVERHEAD).rtSize + ptr;
      let result = __alloc(bufferLength, idof<ArrayBuffer>());
      let b: u32 = 0;
      let outChar = 0;
      for (let i: usize = 0; ptr < byteEnd; i++) {
        let odd = i & 1;
        if (odd) {
          outChar <<= 4;
          b >>>= 16;
          if ((b - 0x30) <= 9) {
            outChar |= b - 0x30;
          } else if ((b - 0x61) <= 0x5) {
            outChar |= b - 0x57;
          } else if (b - 0x41 <= 0x5) {
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
          } else if ((c - 0x61) <= 0x5) {
            outChar |= c - 0x57;
          } else if (c - 0x41 <= 0x5) {
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
    @unsafe export function decodeUnsafe(ptr: usize, length: i32): string {
      let stringByteLength = length << 2; // length * (2 bytes per char) * (2 chars per input byte)
      let result = __alloc(stringByteLength, idof<String>());
      let i = <usize>0;
      let inputByteLength = <usize>length + ptr;

      // loop over each byte and store a `u32` for each one
      while (ptr < inputByteLength) {
        store<u32>(result + i, charsFromByte(<u32>load<u8>(ptr)));
        i += 4;
        ptr++;
      }

      return changetype<string>(result);
    }
  }
}
