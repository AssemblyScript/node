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
    let byteLength = this.byteLength;
    let INSPECT_MAX_BYTES = this.INSPECT_MAX_BYTES;
    if (INSPECT_MAX_BYTES == 0 || byteLength == 0) return "<Buffer >";

    // Calculate if an elipsis will be in the string
    let elipsisEnd = byteLength > INSPECT_MAX_BYTES;
    let maxBytes = elipsisEnd ? INSPECT_MAX_BYTES : byteLength;

    // find the start of the buffer
    let dataStart = this.dataStart;

    // formula for calculating end string length (3 * bytes) + 8
    // Example: Buffer.from([1, 2, 3, 4, 5]).inspect() == '<Buffer 01 02 03 04 05>'
    let stringLength = 3 * maxBytes + 8;
    if (elipsisEnd) stringLength += 3; // add 3 characters for elipsis

    // create the result
    let result = __alloc(stringLength << 1, idof<String>());

    // copy the 16 "<Buffer " bytes
    let source = "<Buffer ";
    memory.copy(result, changetype<usize>(source), 16);

    // Start writing at index 8
    let writeOffset: usize = result + 16;
    for (let i = 0; i < maxBytes; i++, writeOffset += 6) {
      let byte = load<u8>(dataStart + <usize>i);
      let top = (byte >>> 4) & 0xF;
      byte &= 0xF;

      store<u16>(writeOffset, top < 10 ? <u16>top + 48 : <u16>top + 87);
      store<u16>(writeOffset, byte < 10 ? <u16>byte + 48 : <u16>byte + 87, 2);

      if (i == (maxBytes - 1)) {
        if (elipsisEnd) {
          // make this a single 64 bit store
          store<u64>(writeOffset, <u64>17451646127570990, 4); // "...>"
        } else {
          store<u16>(writeOffset, <u16>62, 4); // ">"
        }
      } else {
        store<u16>(writeOffset, <u16>32, 4); // " "
      }
    }

    return changetype<string>(result);
  }
}
