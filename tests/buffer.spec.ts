function instantiateFrom<T>(values: valueof<T>[]): T {
  let result = instantiate<T>(values.length);
  // @ts-ignore
  for (let i = 0; i < values.length; i++) result[i] = values[i];
  return result;
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

  test("#compare", () => {
    let a = instantiateFrom<Buffer>([0x05, 0x06, 0x07, 0x08]);
    let b = instantiateFrom<Buffer>([0x01, 0x02, 0x03]);
    let c = instantiateFrom<Buffer>([0x05, 0x06, 0x07]);
    let d = instantiateFrom<Buffer>([0x04, 0x05, 0x06]);

    let actual: Buffer[] = [a, b, c, d];
    actual.sort(Buffer.compare);
    let expected: Buffer[] = [b, d, c, a];
    expect<Buffer[]>(actual).toStrictEqual(expected);
  });
});
