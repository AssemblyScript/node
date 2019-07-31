import { BLOCK_MAXSIZE } from "rt/common";
import { E_INVALIDLENGTH, E_INDEXOUTOFRANGE } from "util/error";
import { Uint8Array } from "typedarray";
import { Array } from "array";

export class Buffer extends Uint8Array {
  constructor(size: i32) {
    super(size);
  }

  public static alloc(size: i32): Buffer {
    return new Buffer(size);
  }

  public static concat(items: Array<Buffer>, length: i32): Buffer {
    // assert the list itself isn't null
    assert(items != null);

    let size: usize = 0;
    let itemCount = <usize>items.length;
    let itemsDataStart = items.dataStart;

    for (let i: usize = 0; i < itemCount; i++) {
      let item = load<usize>(itemsDataStart + (i << alignof<usize>()));
      if (item == 0) continue;
      size += <usize>load<u32>(item, offsetof<Uint8Array>("dataLength"));
    }

    // account for passed concat buffer length
    size = min<usize>(<usize>length, size);

    let buffer = __alloc(size, idof<ArrayBuffer>());
    let result = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>()));

    result.data = changetype<ArrayBuffer>(buffer);
    result.dataStart = buffer;
    let start: usize = result.dataStart;
    for (let i: usize = 0; i < itemCount && size > 0; i++) {
      let item = load<usize>(itemsDataStart + (i << alignof<usize>()));
      if (item == null) continue;
      let count = min<u32>(size, <usize>load<u32>(item, offsetof<Uint8Array>("dataLength")));
      memory.copy(start, load<usize>(item, offsetof<Uint8Array>("dataStart")), count);
      start += count;
      size -= count;
    }

    return result;
  }

  @unsafe public static allocUnsafe(size: i32): Buffer {
    // Node throws an error if size is less than 0
    if (u32(size) > BLOCK_MAXSIZE) throw new RangeError(E_INVALIDLENGTH);
    let buffer = __alloc(size, idof<ArrayBuffer>());
    // This retains the pointer to the result Buffer.
    let result = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>()));
    result.data = changetype<ArrayBuffer>(buffer);
    result.dataStart = buffer;
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
}
