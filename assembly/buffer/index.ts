import { BLOCK_MAXSIZE } from "rt/common";
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
  public static from<T>(value: T): Buffer {
    // @ts-ignore: AssemblyScript treats this statement correctly
    if (value instanceof String[]) {
      let length = value.length;
      log<i32>(length);
      let buffer = __alloc(length, idof<ArrayBuffer>());
      let sourceStart = value.dataStart;
      for (let i = 0; i < length; i++) {
        let str = changetype<string>(load<usize>(sourceStart + (usize(i) << alignof<usize>())));
        let value = parseFloat(str); // parseFloat is still naive
        store<u8>(buffer + usize(i), isFinite<f64>(value) ? u8(value) : u8(0));
      }
      let result = changetype<Buffer>(__alloc(offsetof<Buffer>(), idof<Buffer>()));
      result.data = changetype<ArrayBuffer>(buffer);
      result.dataStart = changetype<usize>(value);
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
}
