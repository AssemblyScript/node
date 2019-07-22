import { BLOCK_MAXSIZE } from "rt/common";
import { E_INVALIDLENGTH, E_INDEXOUTOFRANGE } from "util/error";
import { Uint8Array } from "typedarray";

const BUFFER_INSPECT_HEADER_START: string = "<Buffer ";

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

  public INSPECT_MAX_BYTES: i32 = 50;

  inspect(): string {
    let length = this.byteLength;
    let dataStart = this.dataStart;
    let maxBytes = this.INSPECT_MAX_BYTES;

    // formula for calculating end string length (length * 2) + length - 1 + 9
    // Example: Buffer.from([1, 2, 3, 4, 5]).inspect() == '<Buffer 01 02 03 04 05>'
    let totalBytes = (min(length, <u32>maxBytes) * 3 + 8) << 1; // two bytes * formula
    let buffer = __alloc(totalBytes, idof<String>());

    let source = "<Buffer ";
    memory.copy(buffer, changetype<usize>(source), 16); // copy the 16 "<Buffer " bytes
    for (let i = 0; i < length; i++) {
      let writeOffset = buffer + 16 + <usize>(i << 1) * 3;
      let byte = load<u8>(dataStart + <usize>i);
      let top = (byte >>> 4) & 0xF;
      byte &= 0xF;

      store<u16>(writeOffset, top < 10 ? <u16>top + 48 : <u16>top + 87);
      store<u16>(writeOffset, byte < 10 ? <u16>byte + 48 : <u16>byte + 87, 2);

      if (i < (maxBytes - 1)) {
        store<u16>(writeOffset, <u16>(i == (length - 1) ? 62 : 32), 4); // " " | ">"
      } else {
        // TODO: Optimize this into a single u64 store
        store<u16>(writeOffset, 46, 4); // "."
        store<u16>(writeOffset, 46, 6); // "."
        store<u16>(writeOffset, 46, 8); // "."
        store<u16>(writeOffset, 62, 10); // ">"
        break;
      }
    }

    return changetype<string>(buffer);
  }
}
