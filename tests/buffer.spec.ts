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

function createFrom<T>(values: valueof<T>[]): T {
  let result = instantiate<T>(values.length);
  for (let i = 0; i < values.length; i++) result[i] = values[i];
  return result;
}

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

  test("#Hex.encode", () => {
    let actual = "000102030405060708090a0b0c0d0e0f102030405060708090a0b0c0d0e0f0";
    let exampleBuffer = createFrom<Buffer>([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0]);
    let encoded = Buffer.HEX.encode(actual);
    expect<ArrayBuffer>(encoded).toStrictEqual(exampleBuffer.buffer);
  });

  test("#Hex.decode", () => {
    let expected = "000102030405060708090a0b0c0d0e0f102030405060708090a0b0c0d0e0f0";
    let exampleBuffer = createFrom<Buffer>([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0]);
    let decoded = Buffer.HEX.decode(exampleBuffer.buffer);
    expect<string>(decoded).toStrictEqual(expected);
  });
});
