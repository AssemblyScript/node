/**
 * This is the buffer test suite. For each prototype function, put a single test
 * function call here.
 *
 * @example
 * describe("buffer", () => {
 *   test("#alloc", () => {
 *     // put any expectations related to #alloc here
 *   });
 * });
 */
import { BLOCK_MAXSIZE } from "rt/common";

// Helper function to quickly create a Buffer from an array.
//@ts-ignore
function create<T>(values: valueof<T>[]): T {
  let result = instantiate<T>(values.length);
  //@ts-ignore
  for (let i = 0; i < values.length; i++) result[i] = values[i];
  return result;
}

describe("buffer", () => {
  test(".constructor", () => {
    expect<Buffer>(new Buffer(0)).toBeTruthy();
    expect<Buffer>(new Buffer(10)).toHaveLength(10);
    let myBuffer = new Buffer(10);
    expect<ArrayBuffer>(myBuffer.buffer).toBeTruthy();
    expect<ArrayBuffer>(myBuffer.buffer).toHaveLength(10);
    // TODO: expectFn(() => { new Buffer(-1); }).toThrow();
    // TODO: expectFn(() => { new Buffer(BLOCK_MAXSIZE + 1); }).toThrow();
  });

  test(".alloc", () => {
    expect<Buffer>(Buffer.alloc(10)).toBeTruthy();
    expect<Buffer>(Buffer.alloc(10)).toHaveLength(10);
    let buff = Buffer.alloc(100);
    for (let i = 0; i < buff.length; i++) expect<u8>(buff[i]).toBe(0);
    expect<ArrayBuffer | null>(buff.buffer).not.toBeNull();
    expect<u32>(buff.byteLength).toBe(100);
    // TODO: expectFn(() => { Buffer.alloc(-1); }).toThrow();
    // TODO: expectFn(() => { Buffer.alloc(BLOCK_MAXSIZE + 1); }).toThrow();
  });

  test(".allocUnsafe", () => {
    expect<Buffer>(Buffer.allocUnsafe(10)).toBeTruthy();
    expect<Buffer>(Buffer.allocUnsafe(10)).toHaveLength(10);
    let buff = Buffer.allocUnsafe(100);
    expect<ArrayBuffer | null>(buff.buffer).not.toBeNull();
    expect<u32>(buff.byteLength).toBe(100);
    // TODO: expectFn(() => { Buffer.allocUnsafe(-1); }).toThrow();
    // TODO: expectFn(() => { Buffer.allocUnsafe(BLOCK_MAXSIZE + 1); }).toThrow();
  });

  /**
   * This specification is a tradeoff, because Buffer.from() takes _many_ parameters.
   * Instead, the only common parameter is the first one, which results in Buffer.from
   * acting in a very naive fashion. Perhaps an optional encoding parameter might be
   * possible for strings, at least. However, this makes things more complicated.
   * There are no good solutions. Only tradeoffs. Function overloading is the only
   * way to fix this problem.
   */
  test(".from", () => {
    // Buffer.from uses the array buffer reference
    let buff = new ArrayBuffer(100);
    for (let i = 0; i < 100; i++) store<u8>(changetype<usize>(buff), u8(i));
    let abBuffer = Buffer.from<ArrayBuffer>(buff);
    expect<ArrayBuffer>(abBuffer.buffer).toStrictEqual(buff);
    expect<ArrayBuffer>(abBuffer.buffer).toBe(buff);

    // strings are utf8 encoded by default
    let strBuffer = Buffer.from<string>("Hello world!");
    let strBufferExpected = create<Buffer>([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
    expect<Buffer>(strBuffer).toStrictEqual(strBufferExpected);

    // buffer returns a new reference view to the same ArrayBuffer
    let buff2 = Buffer.from<Buffer>(abBuffer);
    expect<Buffer>(buff2).not.toBe(abBuffer);
    expect<Buffer>(buff2).toStrictEqual(abBuffer);
    expect<ArrayBuffer>(buff2.buffer).toBe(abBuffer.buffer);
    expect<i32>(buff2.byteOffset).toBe(abBuffer.byteOffset);

    // else if it extends ArrayBufferView simply converts all the values
    let floats = create<Float32Array>([1.1, 2.2, 3.3]);
    let floatBuff = Buffer.from<Float32Array>(floats);
    let floatBuffExpected = create<Buffer>([1, 2, 3]);
    expect<Buffer>(floatBuff).toStrictEqual(floatBuffExpected);

    let strArrayExpected = create<Buffer>([1, 2, 3, 4, 5, 6, 7, 0, 0, 0]);
    let stringValues: string[] = ["1.1", "2.2", "3.3", "4.4", "5.5", "6.6", "7.7", "Infinity", "NaN", "-Infinity"];
    let strArrayActual = Buffer.from<Array<String>>(stringValues);
    expect<Buffer>(strArrayActual).toStrictEqual(strArrayExpected, "Array Of Strings");
  });

  test(".fromString", () => {
    // public static fromString(value: string, encoding: string = "utf8"): Buffer {
    // default encoding is utf8
    let expected = create<Buffer>([0x74, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x61, 0x20, 0x74, 0xc3, 0xa9, 0x73, 0x74])
    expect<Buffer>(Buffer.from('this is a tést'))
      .toStrictEqual(expected);

    expect<Buffer>(Buffer.fromString('7468697320697320612074c3a97374', 'hex'))
      .toStrictEqual(expected);
  });

  test(".fromArrayBuffer", () => {
    const arr = new Uint16Array(2);

    arr[0] = 5000;
    arr[1] = 4000;

    // Shares memory with `arr`.
    const buf = Buffer.fromArrayBuffer(arr.buffer);


    expect<Buffer>(buf).toStrictEqual(create<Buffer>([0x88, 0x13, 0xa0, 0x0f]));

    // Changing the original Uint16Array changes the Buffer also.
    arr[1] = 6000;
    expect<Buffer>(buf).toStrictEqual(create<Buffer>([0x88, 0x13, 0x70, 0x17]));

    // test optional parameters
    expect<Buffer>(Buffer.fromArrayBuffer(arr.buffer, 1, 2)).toStrictEqual(create<Buffer>([0x13, 0x70]));

    // TODO:
    // expectFn(() => {
    //   let value = create<Uint16Array>([5000, 4000]); // 4 bytes
    //   Buffer.fromArrayBuffer(value.buffer, 5);
    // }).toThrow("offset out of bounds should throw");
    // expectFn(() => {
    //   let value = create<Uint16Array>([5000, 4000]); // 4 bytes
    //   Buffer.fromArrayBuffer(value.buffer, 2, 3);
    // }).toThrow("length out of bounds should throw");
  });

  test(".fromBuffer", () => {
    let buff1 = create<Buffer>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let buff2 = Buffer.fromBuffer(buff1);

    expect<Buffer>(buff1).not.toBe(buff2);
    expect<ArrayBuffer>(buff1.buffer).not.toBe(buff2.buffer);
    expect<Buffer>(buff1).toStrictEqual(buff2);
  });

  test(".fromArray", () => {
    let buff1 = create<Uint16Array>([3, 6, 9, 12, 15, 18, 21]);
    let buff2 = Buffer.fromArray(buff1, 2, 4);
    let expected = create<Buffer>([9, 12, 15, 18]);
    expect<Buffer>(buff2).toStrictEqual(expected);

    // test string values
    buff2 = Buffer.fromArray<string[]>(["9.2", "12.1", "15.3", "18.8"]);
    expect<Buffer>(buff2).toStrictEqual(expected);
  });

  // todo: fromArray
  // todo: fromBuffer

  test("#isBuffer", () => {
    let a = "";
    let b = new Uint8Array(0);
    let c = 0;
    let d = 1.1;
    let e = new Buffer(0);
    expect<bool>(Buffer.isBuffer<string>(a)).toBeFalsy();
    expect<bool>(Buffer.isBuffer<Uint8Array>(b)).toBeFalsy();
    expect<bool>(Buffer.isBuffer<i32>(c)).toBeFalsy();
    expect<bool>(Buffer.isBuffer<f64>(d)).toBeFalsy();
    expect<bool>(Buffer.isBuffer<Buffer>(e)).toBeTruthy();
    // null checks are done by the compiler explicitly at runtime
    expect<bool>(Buffer.isBuffer<Buffer | null>(null)).toBeFalsy();
  });

  test("#readInt8", () => {
    let buff = create<Buffer>([0x5,0x0,0x0,0x0,0xFF]);
    expect<i8>(buff.readInt8()).toBe(5);
    // Testing offset, and casting between u8 and i8.
    expect<i8>(buff.readInt8(4)).toBe(-1);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readInt8(5);
    // }).toThrow();
  });

  test("#readUInt8", () => {
    let buff = create<Buffer>([0xFE,0x0,0x0,0x0,0x2F]);
    // Testing casting between u8 and i8.
    expect<u8>(buff.readUInt8()).toBe(254);
    // Testing offset
    expect<u8>(buff.readUInt8(4)).toBe(47);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readUInt8(5);
    // }).toThrow();
  });

  test("#writeInt8", () => {
    let buff = new Buffer(5);
    expect<i32>(buff.writeInt8(9)).toBe(1);
    expect<i32>(buff.writeInt8(-3,4)).toBe(5);
    let result = create<Buffer>([0x09, 0x0, 0x0, 0x0, 0xFD]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeInt8(5,10);
    // }).toThrow();
  });

  test("#writeUInt8", () => {
    let buff = new Buffer(5);
    expect<i32>(buff.writeUInt8(4)).toBe(1);
    expect<i32>(buff.writeUInt8(252,4)).toBe(5);
    let result = create<Buffer>([0x04, 0x0, 0x0, 0x0, 0xFC]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeUInt8(5,10);
    // }).toThrow();
  });

  test("#readInt16LE", () => {
    let buff = create<Buffer>([0x0,0x05,0x0]);
    expect<i16>(buff.readInt16LE()).toBe(1280);
    expect<i16>(buff.readInt16LE(1)).toBe(5);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readInt16LE(0);
    // }).toThrow();
  });

  test("#readInt16BE", () => {
    let buff = create<Buffer>([0x0,0x05,0x0]);
    expect<i16>(buff.readInt16BE()).toBe(5);
    expect<i16>(buff.readInt16BE(1)).toBe(1280);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readInt16BE(0);
    // }).toThrow();
  });

  test("#readUInt16LE", () => {
    let buff = create<Buffer>([0x0,0x05,0x0]);
    expect<u16>(buff.readUInt16LE()).toBe(1280);
    expect<u16>(buff.readUInt16LE(1)).toBe(5);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readUInt16LE(0);
    // }).toThrow();
  });

  test("#readUInt16BE", () => {
    let buff = create<Buffer>([0x0,0x05,0x0]);
    expect<i16>(buff.readUInt16BE()).toBe(5);
    expect<i16>(buff.readUInt16BE(1)).toBe(1280);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readUInt16BE(0);
    // }).toThrow();
  });

  test("#writeInt16LE", () => {
    let buff = new Buffer(4);
    expect<i32>(buff.writeInt16LE(5)).toBe(2);
    expect<i32>(buff.writeInt16LE(1280,2)).toBe(4);
    let result = create<Buffer>([0x05, 0x0, 0x0, 0x5]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeInt16LE(0);
    // }).toThrow();
  });

  test("#writeInt16BE", () => {
    let buff = new Buffer(4);
    expect<i32>(buff.writeInt16BE(1280)).toBe(2);
    expect<i32>(buff.writeInt16BE(5,2)).toBe(4);
    let result = create<Buffer>([0x05, 0x0, 0x0, 0x5]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeInt16BE(0);
    // }).toThrow();
  });

  test("#writeUInt16LE", () => {
    let buff = new Buffer(4);
    expect<i32>(buff.writeUInt16LE(5)).toBe(2);
    expect<i32>(buff.writeUInt16LE(1280,2)).toBe(4);
    let result = create<Buffer>([0x05, 0x0, 0x0, 0x5]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeUInt16LE(0);
    // }).toThrow();
  });

  test("#writeUInt16BE", () => {
    let buff = new Buffer(4);
    expect<i32>(buff.writeUInt16BE(1280)).toBe(2);
    expect<i32>(buff.writeUInt16BE(5,2)).toBe(4);
    let result = create<Buffer>([0x05, 0x0, 0x0, 0x5]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeUInt16BE(0);
    // }).toThrow();
  });

  test("#readInt32LE", () => {
    let buff = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0x0d,0xc0,0xde,0x10]);
    expect<i32>(buff.readInt32LE()).toBe(-559038737);
    expect<i32>(buff.readInt32LE(4)).toBe(283033613);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readInt32LE(0);
    // }).toThrow();
  });

  test("#readInt32BE", () => {
    let buff = create<Buffer>([0xDE,0xAD,0xBE,0xEF,0x10,0xde,0xc0,0x0d]);
    expect<i32>(buff.readInt32BE()).toBe(-559038737);
    expect<i32>(buff.readInt32BE(4)).toBe(283033613);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readInt32BE(0);
    // }).toThrow();
  });

  test("#readUInt32LE", () => {
    let buff = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0x0d,0xc0,0xde,0x10]);
    expect<u32>(buff.readUInt32LE()).toBe(3735928559);
    expect<u32>(buff.readUInt32LE(4)).toBe(283033613);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readUInt32LE(0);
    // }).toThrow();
  });

  test("#readUInt32BE", () => {
    let buff = create<Buffer>([0xDE,0xAD,0xBE,0xEF,0x10,0xde,0xc0,0x0d]);
    expect<u32>(buff.readUInt32BE()).toBe(3735928559);
    expect<u32>(buff.readUInt32BE(4)).toBe(283033613);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readUInt32BE(0);
    // }).toThrow();
  });

  test("#writeInt32LE", () => {
    let buff = new Buffer(8);
    expect<i32>(buff.writeInt32LE(-559038737)).toBe(4);
    expect<i32>(buff.writeInt32LE(283033613,4)).toBe(8);
    let result = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0x0d,0xc0,0xde,0x10]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeInt32LE(0);
    // }).toThrow();
  });

  test("#writeInt32BE", () => {
    let buff = new Buffer(8);
    expect<i32>(buff.writeInt32BE(-559038737)).toBe(4);
    expect<i32>(buff.writeInt32BE(283033613,4)).toBe(8);
    let result = create<Buffer>([0xDE,0xAD,0xBE,0xEF,0x10,0xde,0xc0,0x0d]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeInt32BE(0);
    // }).toThrow();
  });

  test("#writeUInt32LE", () => {
    let buff = new Buffer(8);
    expect<i32>(buff.writeUInt32LE(3735928559)).toBe(4);
    expect<i32>(buff.writeUInt32LE(283033613,4)).toBe(8);
    let result = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0x0d,0xc0,0xde,0x10]);;
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeUInt32LE(0);
    // }).toThrow();
  });

  test("#writeUInt32BE", () => {
    let buff = new Buffer(8);
    expect<i32>(buff.writeUInt32BE(3735928559)).toBe(4);
    expect<i32>(buff.writeUInt32BE(283033613,4)).toBe(8);
    let result = create<Buffer>([0xDE,0xAD,0xBE,0xEF,0x10,0xde,0xc0,0x0d]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeUInt32BE(0);
    // }).toThrow();
  });

  test("#readFloatLE", () => {
    let buff = create<Buffer>([0xbb,0xfe,0x4a,0x4f,0x01,0x02,0x03,0x04]);
    expect<f32>(buff.readFloatLE()).toBe(0xcafebabe);
    expect<f32>(buff.readFloatLE(4)).toBe(1.539989614439558e-36);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readFloatLE(0);
    // }).toThrow();
  });

  test("#readFloatBE", () => {
    let buff = create<Buffer>([0x4f,0x4a,0xfe,0xbb,0x01,0x02,0x03,0x04]);
    expect<f32>(buff.readFloatBE()).toBe(0xcafebabe);
    expect<f32>(buff.readFloatBE(4)).toBe(2.387939260590663e-38);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readFloatBE(0);
    // }).toThrow();
  });

  test("#writeFloatLE", () => {
    let buff = new Buffer(8);
    expect<i32>(buff.writeFloatLE(0xcafebabe)).toBe(4);
    expect<i32>(buff.writeFloatLE(1.539989614439558e-36,4)).toBe(8);
    let result = create<Buffer>([0xbb,0xfe,0x4a,0x4f,0x01,0x02,0x03,0x04]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeFloatLE(0);
    // }).toThrow();
  });

  test("#writeFloatBE", () => {
    let buff = new Buffer(8);
    expect<i32>(buff.writeFloatBE(0xcafebabe)).toBe(4);
    expect<i32>(buff.writeFloatBE(2.387939260590663e-38,4)).toBe(8);
    let result = create<Buffer>([0x4f,0x4a,0xfe,0xbb,0x01,0x02,0x03,0x04]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeFloatBE(0);
    // }).toThrow();
  });

  test("#readBigInt64LE", () => {
    let buff = create<Buffer>([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]);
    expect<i64>(buff.readBigInt64LE()).toBe(-4294967296);
    expect<i64>(buff.readBigInt64LE(8)).toBe(4294967295);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readBigInt64LE(0);
    // }).toThrow();
  });

  test("#readBigInt64BE", () => {
    let buff = create<Buffer>([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]);
    expect<i64>(buff.readBigInt64BE()).toBe(4294967295);
    expect<i64>(buff.readBigInt64BE(8)).toBe(-4294967296);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readBigInt64BE(0);
    // }).toThrow();
  });

  test("#readBigUInt64LE", () => {
    let buff = create<Buffer>([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]);
    expect<u64>(buff.readBigUInt64LE()).toBe(18446744069414584320);
    expect<u64>(buff.readBigUInt64LE(8)).toBe(4294967295);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readBigUInt64LE(0);
    // }).toThrow();
  });

  test("#readBigUInt64BE", () => {
    let buff = create<Buffer>([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]);
    expect<u64>(buff.readBigUInt64BE()).toBe(4294967295);
    expect<u64>(buff.readBigUInt64BE(8)).toBe(18446744069414584320);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readBigUInt64BE(0);
    // }).toThrow();
  });

  test("#writeBigInt64LE", () => {
    let buff = new Buffer(16);
    expect<i64>(buff.writeBigInt64LE(-559038737)).toBe(8);
    expect<i64>(buff.writeBigInt64LE(283033613,8)).toBe(16);
    let result = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0xFF,0xFF,0xFF,0xFF,0x0d,0xc0,0xde,0x10,0x00,0x00,0x00,0x00]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeBigInt64LE(0);
    // }).toThrow();
  });

  test("#writeBigInt64BE", () => {
    let buff = new Buffer(16);
    expect<i64>(buff.writeBigInt64BE(-559038737)).toBe(8);
    expect<i64>(buff.writeBigInt64BE(283033613,8)).toBe(16);
    let result = create<Buffer>([0xFF,0xFF,0xFF,0xFF,0xDE,0xAD,0xBE,0xEF,0x00,0x00,0x00,0x00,0x10,0xde,0xc0,0x0d]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeBigInt64BE(0);
    // }).toThrow();
  });

  test("#writeBigUInt64LE", () => {
    let buff = new Buffer(16);
    expect<i64>(buff.writeBigUInt64LE(3735928559)).toBe(8);
    expect<i64>(buff.writeBigUInt64LE(283033613,8)).toBe(16);
    let result = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0x00,0x00,0x00,0x00,0x0d,0xc0,0xde,0x10,0x00,0x00,0x00,0x00]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeBigUInt64LE(0);
    // }).toThrow();
  });

  test("#writeBigUInt64BE", () => {
    let buff = new Buffer(16);
    expect<i64>(buff.writeBigUInt64BE(3735928559)).toBe(8);
    expect<i64>(buff.writeBigUInt64BE(283033613,8)).toBe(16);
    let result = create<Buffer>([0x00,0x00,0x00,0x00,0xDE,0xAD,0xBE,0xEF,0x00,0x00,0x00,0x00,0x10,0xde,0xc0,0x0d]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeBigUInt64BE(0);
    // }).toThrow();
  });

  test("#readDoubleLE", () => {
    let buff = create<Buffer>([0x77, 0xbe, 0x9f, 0x1a, 0x2f, 0xdd, 0x5e, 0x40, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    expect<f64>(buff.readDoubleLE()).toBe(123.456);
    expect<f64>(buff.readDoubleLE(8)).toBe(5.447603722011605e-270);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readDoubleLE(0);
    // }).toThrow();
  });

  test("#readDoubleBE", () => {
    let buff = create<Buffer>([0x40, 0x5e, 0xdd, 0x2f, 0x1a, 0x9f, 0xbe, 0x77, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    expect<f64>(buff.readDoubleBE()).toBe(123.456);
    expect<f64>(buff.readDoubleBE(8)).toBe(8.20788039913184e-304);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readDoubleBE(0);
    // }).toThrow();
  });

  test("#writeDoubleLE", () => {
    let buff = new Buffer(16);
    expect<i32>(buff.writeDoubleLE(123.456)).toBe(8);
    expect<i32>(buff.writeDoubleLE(5.447603722011605e-270,8)).toBe(16);
    let result = create<Buffer>([0x77, 0xbe, 0x9f, 0x1a, 0x2f, 0xdd, 0x5e, 0x40, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeDoubleLE(0);
    // }).toThrow();
  });

  test("#writeDoubleBE", () => {
    let buff = new Buffer(16);
    expect<i32>(buff.writeDoubleBE(123.456)).toBe(8);
    expect<i32>(buff.writeDoubleBE(8.20788039913184e-304,8)).toBe(16);
    let result = create<Buffer>([0x40, 0x5e, 0xdd, 0x2f, 0x1a, 0x9f, 0xbe, 0x77, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    expect<Buffer>(buff).toStrictEqual(result);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.writeDoubleBE(0);
    // }).toThrow();
  });

  test("#subarray", () => {
    let example = create<Buffer>([1, 2, 3, 4, 5, 6, 7, 8]);

    // no parameters means copy the Buffer
    let actual = example.subarray();
    expect<Buffer>(actual).toStrictEqual(example);
    expect<ArrayBuffer>(actual.buffer).toBe(example.buffer); // should use the same buffer

    // start at offset 5
    actual = example.subarray(5);
    let expected = create<Buffer>([6, 7, 8]);
    // trace("length", 1, expected.length);
    expect<Buffer>(actual).toStrictEqual(expected);

    // negative start indicies, start at (8 - 5)
    actual = example.subarray(-5);
    expected = create<Buffer>([4, 5, 6, 7, 8]);
    expect<Buffer>(actual).toStrictEqual(expected);

    // two parameters
    actual = example.subarray(2, 6);
    expected = create<Buffer>([3, 4, 5, 6]);
    expect<Buffer>(actual).toStrictEqual(expected);

    // negative end index
    actual = example.subarray(4, -1);
    expected = create<Buffer>([5, 6, 7]);
    expect<Buffer>(actual).toStrictEqual(expected);
  });

  test("#swap16", () => {
    let actual = create<Buffer>([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);
    let expected = create<Buffer>([0x2, 0x1, 0x4, 0x3, 0x6, 0x5, 0x8, 0x7]);
    let swapped = actual.swap16();
    expect<Buffer>(actual).toStrictEqual(expected);
    expect<Buffer>(swapped).toBe(actual);
    // TODO:
    // expectFn(() => {
    //   let newBuff = create<Buffer>([0x1, 0x2, 0x3]);
    //   newBuff.swap16();
    // }).toThrow();
  });

  test("#swap32", () => {
    let actual = create<Buffer>([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);
    let expected = create<Buffer>([0x4, 0x3, 0x2, 0x1, 0x8, 0x7, 0x6, 0x5]);
    let swapped = actual.swap32();
    expect<Buffer>(actual).toStrictEqual(expected);
    expect<Buffer>(swapped).toBe(actual);
    // TODO:
    // expectFn(() => {
    //   let newBuff = create<Buffer>([0x1, 0x2, 0x3]);
    //   newBuff.swap64();
    // }).toThrow();
  });

  test("#swap64", () => {
    let actual = create<Buffer>([0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf]);
    let expected = create<Buffer>([0x7, 0x6, 0x5, 0x4, 0x3, 0x2, 0x1, 0x0, 0xf, 0xe, 0xd, 0xc, 0xb, 0xa, 0x9, 0x8]);
    let swapped = actual.swap64();
    expect<Buffer>(actual).toStrictEqual(expected);
    expect<Buffer>(swapped).toBe(actual);
    // TODO:
    // expectFn(() => {
    //   let newBuff = create<Buffer>([0x1, 0x2, 0x3]);
    //   newBuff.swap64();
    // }).toThrow();
  });
                       
  test("#Hex.encode", () => {
    let actual = "000102030405060708090a0b0c0d0e0f102030405060708090a0b0c0d0e0f0";
    let exampleBuffer = create<Buffer>([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0]);
    let encoded = Buffer.HEX.encode(actual);
    expect<ArrayBuffer>(encoded).toStrictEqual(exampleBuffer.buffer);
  });

  test("#Hex.decode", () => {
    let expected = "000102030405060708090a0b0c0d0e0f102030405060708090a0b0c0d0e0f0";
    let exampleBuffer = create<Buffer>([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0]);
    let decoded = Buffer.HEX.decode(exampleBuffer.buffer);
    expect<string>(decoded).toStrictEqual(expected);
  });
});
