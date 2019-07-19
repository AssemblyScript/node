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
    expect<ArrayBuffer>(buff.buffer).not.toBeNull();
    expect<u32>(buff.byteLength).toBe(100);
    // TODO: expectFn(() => { Buffer.alloc(-1); }).toThrow();
    // TODO: expectFn(() => { Buffer.alloc(BLOCK_MAXSIZE + 1); }).toThrow();
  });

  test("#allocUnsafe", () => {
    expect<Buffer>(Buffer.allocUnsafe(10)).toBeTruthy();
    expect<Buffer>(Buffer.allocUnsafe(10)).toHaveLength(10);
    let buff = Buffer.allocUnsafe(100);
    expect<ArrayBuffer>(buff.buffer).not.toBeNull();
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
});
