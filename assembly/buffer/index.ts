import { BLOCK_MAXSIZE, BLOCK, BLOCK_OVERHEAD } from "rt/common";
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

  readUInt8(offset: i32 = 0): u8 {
    if(<u32>offset >= this.dataLength) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u8>(this.dataStart + usize(offset));
  }

  writeUInt8(value: u8, offset: i32 = 0): i32 {
    if(<u32>offset >= this.dataLength) throw new RangeError(E_INDEXOUTOFRANGE);
    store<u8>(this.dataStart + offset, value);
    return offset + 1;
  }

  writeInt8(value: i8, offset: i32 = 0): i32 {
    if(<u32>offset >= this.dataLength) throw new RangeError(E_INDEXOUTOFRANGE);
    store<i8>(this.dataStart + offset, value);
    return offset + 1;
  }

  readInt8(offset: i32 = 0): i8 {
    if(<u32>offset >= this.dataLength) throw new RangeError(E_INDEXOUTOFRANGE);
    return load<i8>(this.dataStart + usize(offset));
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

    @inline export function byteFromChars(chars: u32): i32 {
      let top = chars & 0xFFFF;
      let bottom = chars >>> 16;

      // get the top byte
      if (top >= 0x30 && top <= 0x39) top -= 0x30; // 0-9
      else if (top >= 0x61 && top <= 0x66) top -= 0x57; // a-f
      else if (top >= 0x41 && top <= 0x46) top -= 0x37; // A-F
      else return -1;

      // get the bottom byte
      if (bottom >= 0x30 && bottom <= 0x39) bottom -= 0x30; // 0-9
      else if (bottom >= 0x61 && bottom <= 0x66) bottom -= 0x57; // a-f
      else if (bottom >= 0x41 && bottom <= 0x46) bottom -= 0x37; // A-F
      else return -1;

      return (top << 4) | bottom;
    }

    /** Calculates the byte length of the specified string when encoded as HEX. */
    export function byteLength(str: string): i32 {
      let ptr = changetype<usize>(str);
      let byteCount = changetype<BLOCK>(changetype<usize>(str) - BLOCK_OVERHEAD).rtSize;
      // The string length must be even because the bytes come in pairs of characters two wide
      if (byteCount & 0x3) return 0; // encoding fails and returns an empty ArrayBuffer

      // start length calculation loop
      let length = 0;
      byteCount += ptr;

      while (ptr < byteCount) {
        let result = byteFromChars(load<u32>(ptr));
        if (result == -1) return 0; // invalid character
        length += 1;
        ptr += 4;
      }
      return length;
    }

    /** Creates an ArrayBuffer from a given string that is encoded in the HEX format. */
    export function encode(str: string): ArrayBuffer {
      let bufferLength = byteLength(str);
      // short path: string is not a valid hex string, return a new empty ArrayBuffer
      if (bufferLength == 0) return changetype<ArrayBuffer>(__retain(__alloc(0, idof<ArrayBuffer>())));
      let ptr = changetype<usize>(str);

      // long path: loop over each byte and perform the conversion
      let byteEnd = changetype<BLOCK>(changetype<usize>(str) - BLOCK_OVERHEAD).rtSize + ptr;
      let result = __alloc(bufferLength, idof<ArrayBuffer>());
      let i: usize = 0;
      while (ptr < byteEnd) {
        store<u8>(result + i, byteFromChars(load<u32>(ptr)));
        ptr += 4;
        i += 1;
      }
      return changetype<ArrayBuffer>(result);
    }

    /** Creates an String from a given ArrayBuffer that is decoded in the HEX format. */
    export function decode(buff: ArrayBuffer): string {
      return decodeUnsafe(changetype<usize>(buff), buff.byteLength);
    }

    /** Decodes a block of memory from the given pointer with the given length to a utf16le encoded string in HEX format. */
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
