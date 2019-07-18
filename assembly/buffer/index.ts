import { BLOCK_MAXSIZE } from "rt/common";
import { E_INVALIDLENGTH, E_INDEXOUTOFRANGE } from "util/error";

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
    // @ts-ignore: This retains the pointer to the result underlying ArrayBuffer
    result.data = changetype<ArrayBuffer>(buffer);
    // @ts-ignore: This property is @unsafe and used by the parent ArrayBufferView class.
    result.dataStart = changetype<usize>(buffer);
    // @ts-ignore: This property is @unsafe and used by the parent ArrayBufferView class.
    result.dataLength = size;
    return result;
  }
}
