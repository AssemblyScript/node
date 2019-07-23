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
import { INSPECT_MAX_BYTES } from "buffer";

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

  test("#inspect", () => {
    let buff = new Buffer(16);
    for (let i = 0; i < 16; i++) buff[i] = i;
    let result = buff.inspect();
    expect<string>(result).toBe("<Buffer 00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f>");
    INSPECT_MAX_BYTES = 5;
    result = buff.inspect();
    expect<string>(result).toBe("<Buffer 00 01 02 03 04...>");

    buff = new Buffer(0);
    result = buff.inspect()
    expect<string>(result).toBe("<Buffer >");
  });
});
