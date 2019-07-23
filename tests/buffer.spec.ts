function bufferFrom<T>(values: valueof<T>[]): T {
  let buffer = instantiate<T>(values.length);
  // @ts-ignore
  for (let i = 0; i < values.length; i++) buffer[i] = values[i];
  return buffer;
}

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

describe("buffer", () => {
  test("#constructor", () => {
    expect<Buffer>(new Buffer(0)).toBeTruthy();
    expect<Buffer>(new Buffer(10)).toHaveLength(10);
    let myBuffer = new Buffer(10);
    expect<ArrayBuffer>(myBuffer.buffer).toBeTruthy();
    expect<ArrayBuffer>(myBuffer.buffer).toHaveLength(10);
    // TODO: expectFn(() => { new Buffer(-1); }).toThrow();
    // TODO: expectFn(() => { new Buffer(BLOCK_MAXSIZE + 1); }).toThrow();
  });

  test("#alloc", () => {
    expect<Buffer>(Buffer.alloc(10)).toBeTruthy();
    expect<Buffer>(Buffer.alloc(10)).toHaveLength(10);
    let buff = Buffer.alloc(100);
    for (let i = 0; i < buff.length; i++) expect<u8>(buff[i]).toBe(0);
    expect<ArrayBuffer | null>(buff.buffer).not.toBeNull();
    expect<u32>(buff.byteLength).toBe(100);
    // TODO: expectFn(() => { Buffer.alloc(-1); }).toThrow();
    // TODO: expectFn(() => { Buffer.alloc(BLOCK_MAXSIZE + 1); }).toThrow();
  });

  test("#allocUnsafe", () => {
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
  test("#from", () => {
    // TODO: Switch to expect<Buffer>() when 2.2.1 releases

    // Buffer.from uses the array buffer reference
    let buff = new ArrayBuffer(100);
    for (let i = 0; i < 100; i++) store<u8>(changetype<usize>(buff), u8(i));
    let abBuffer = Buffer.from<ArrayBuffer>(buff);
    expect<ArrayBuffer>(abBuffer.buffer).toStrictEqual(buff);
    expect<ArrayBuffer>(abBuffer.buffer).toBe(buff);

    // strings are utf8 encoded by default
    let strBuffer = Buffer.from<string>("Hello world!");
    let strBufferExpected = bufferFrom<Buffer>([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
    expect<ArrayBuffer>(strBuffer.buffer).toStrictEqual(strBufferExpected.buffer);

    // buffer returns a new reference view to the same ArrayBuffer
    let buff2 = Buffer.from<Buffer>(abBuffer);
    expect<Buffer>(buff2).not.toBe(abBuffer);
    expect<ArrayBuffer>(buff2.buffer).toBe(abBuffer.buffer);
    expect<usize>(buff2.dataStart).toBe(abBuffer.dataStart);
    expect<u32>(buff2.dataLength).toBe(abBuffer.dataLength);

    // else if it extends ArrayBufferView simply converts all the values
    let floats = bufferFrom<Float32Array>([1.1, 2.2, 3.3]);
    let floatBuff = Buffer.from<Float32Array>(floats);
    let floatBuffExpected = bufferFrom<Buffer>([1, 2, 3]);
    expect<ArrayBuffer>(floatBuff.buffer).toStrictEqual(floatBuffExpected.buffer);

    let strArrayExpected = bufferFrom<Buffer>([1, 2, 3, 4, 5, 6, 7, 0, 0, 0]);
    let stringValues: string[] = ["1.1", "2.2", "3.3", "4.4", "5.5", "6.6", "7.7", "Infinity", "NaN", "-Infinity"];
    let strArrayActual = Buffer.from<Array<String>>(stringValues);
    expect<ArrayBuffer>(strArrayActual.buffer).toStrictEqual(strArrayExpected.buffer);
  });

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

  test("#readUInt8", () => {
    let buff = new Buffer(10);
    buff[0] = -2;
    buff[9] = 47;
    // Testing casting between u8 and i8.
    expect<u8>(buff.readUInt8(0)).toBe(254);
    expect<u8>(buff.readUInt8()).toBe(254);
    // Testing offset
    expect<u8>(buff.readUInt8(9)).toBe(47);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readUInt8(5);
    // }).toThrow();
  });

  test("#writeUInt8", () => {
    let buff = new Buffer(5);
    expect<i32>(buff.writeUInt8(4)).toBe(1);
    expect<i32>(buff.writeUInt8(252,4)).toBe(5);
    expect<u8>(buff[0]).toBe(4);
    expect<u8>(buff[4]).toBe(252);
  });

  test("#writeInt8", () => {
    let buff = new Buffer(5);
    expect<i32>(buff.writeInt8(9)).toBe(1);
    expect<i32>(buff.writeInt8(-3,4)).toBe(5);
    expect<i8>(buff[0]).toBe(9);
    expect<i8>(buff[4]).toBe(-3);
  });

  test("#readInt8", () => {
    let buff = new Buffer(10);
    buff[0] = 5;
    buff[9] = 255;
    expect<i8>(buff.readInt8(0)).toBe(5);
    expect<i8>(buff.readInt8()).toBe(5);
    // Testing offset, and casting between u8 and i8.
    expect<i8>(buff.readInt8(9)).toBe(-1);
    // TODO:
    // expectFn(() => {
    //   let newBuff = new Buffer(1);
    //   newBuff.readInt8(5);
    // }).toThrow();
  });
});
