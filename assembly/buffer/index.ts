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

  public static concat<T>(items: T, length: i32): Buffer {
    if (!isArray<T>()) {
      ERROR("Buffer.concat<T> must accept an Array where T extends Array<Uint8Array | Buffer>");
    }
    assert(unchecked(items[0]) instanceof Uint8Array); // Can this be a static check?

    let size: usize = 0;
    let itemCount = usize(items.length);
    let itemsDataStart = items.dataStart;

    for (let i: usize = 0; i < itemCount; i++) {
      let item = load<usize>(itemsDataStart + (i << alignof<usize>()));
      if (item == 0) continue;
      size += <usize>load<u32>(item, offsetof<Uint8Array>("dataLength"));
    }
    size = min<usize>(usize(length), size);
    assert(items);

    let buffer = __alloc(size, idof<ArrayBuffer>());
    let result = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>()));

    result.data = changetype<ArrayBuffer>(buffer);
    result.dataStart = changetype<usize>(buffer);
    let start: usize = result.dataStart;
    for (let i: usize = 0; i < itemCount && size > 0; i++) {
      let item = load<usize>(itemsDataStart + (i << alignof<usize>()));
      if (item == 0) continue;
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
    result.dataStart = changetype<usize>(buffer);
    result.dataLength = size;
    return result;
  }
}
