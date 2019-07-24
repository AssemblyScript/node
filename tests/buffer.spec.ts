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
    // TODO:
    // expectFn(() => { 
    //   let newBuff = new Buffer(1);
    //   newBuff.writeUInt8(5,10);
    // }).toThrow();    
  });  

  test("#writeInt8", () => {
    let buff = new Buffer(5);
    expect<i32>(buff.writeInt8(9)).toBe(1);
    expect<i32>(buff.writeInt8(-3,4)).toBe(5);
    expect<i8>(buff[0]).toBe(9);
    expect<i8>(buff[4]).toBe(-3);
    // TODO:
    // expectFn(() => { 
    //   let newBuff = new Buffer(1);
    //   newBuff.writeInt8(5,10);
    // }).toThrow();    
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

  test("#readInt16LE", () => {
    let buff = new Buffer(10);
    buff[0] = 0;
    buff[1] = 5;
    buff[2] = 0;
    expect<i16>(buff.readInt16LE()).toBe(1280);
    expect<i16>(buff.readInt16LE(1)).toBe(5);
    // TODO:
    // expectFn(() => { 
    //   let newBuff = new Buffer(1);
    //   newBuff.readInt16LE(0);
    // }).toThrow();
  })

  test("#readInt16BE", () => {
    let buff = new Buffer(10);
    buff[0] = 0;
    buff[1] = 5;
    buff[2] = 0;
    expect<i16>(buff.readInt16BE()).toBe(5);
    expect<i16>(buff.readInt16BE(1)).toBe(1280);
    // TODO:
    // expectFn(() => { 
    //   let newBuff = new Buffer(1);
    //   newBuff.readInt16BE(0);
    // }).toThrow();
  })

  test("#readUInt16LE", () => {
    let buff = new Buffer(10);
    buff[0] = 0;
    buff[1] = 5;
    buff[2] = 0;
    expect<u16>(buff.readUInt16LE()).toBe(1280);
    expect<u16>(buff.readUInt16LE(1)).toBe(5);
    // TODO:
    // expectFn(() => { 
    //   let newBuff = new Buffer(1);
    //   newBuff.readUInt16LE(0);
    // }).toThrow();
  })

  test("#readUInt16BE", () => {
    let buff = new Buffer(10);
    buff[0] = 0;
    buff[1] = 5;
    buff[2] = 0;
    expect<i16>(buff.readUInt16BE()).toBe(5);
    expect<i16>(buff.readUInt16BE(1)).toBe(1280);
    // TODO:
    // expectFn(() => { 
    //   let newBuff = new Buffer(1);
    //   newBuff.readUInt16BE(0);
    // }).toThrow();
  })

  test("#writeInt16LE", () => {
    let buff = new Buffer(4);
    expect<i32>(buff.writeInt16LE(5)).toBe(2);
    expect<i32>(buff.writeInt16LE(1280,2)).toBe(4);
    expect<i8>(buff[0]).toBe(5);
    expect<i8>(buff[1]).toBe(0);
    expect<i8>(buff[2]).toBe(0);
    expect<i8>(buff[3]).toBe(5);
    // TODO:
    // expectFn(() => { 
    //   let newBuff = new Buffer(1);
    //   newBuff.writeInt16LE(0);
    // }).toThrow();
  })
  test("#writeInt16BE", () => {
    let buff = new Buffer(4);
    expect<i32>(buff.writeInt16BE(1280)).toBe(2);
    expect<i32>(buff.writeInt16BE(5,2)).toBe(4);
    expect<i8>(buff[0]).toBe(5);
    expect<i8>(buff[1]).toBe(0);
    expect<i8>(buff[2]).toBe(0);
    expect<i8>(buff[3]).toBe(5);
    // TODO:
    // expectFn(() => { 
    //   let newBuff = new Buffer(1);
    //   newBuff.writeInt16BE(0);
    // }).toThrow();
  })
  test("#writeUInt16LE", () => {
    let buff = new Buffer(4);
    expect<i32>(buff.writeUInt16LE(5)).toBe(2);
    expect<i32>(buff.writeUInt16LE(1280,2)).toBe(4);
    expect<i8>(buff[0]).toBe(5);
    expect<i8>(buff[1]).toBe(0);
    expect<i8>(buff[2]).toBe(0);
    expect<i8>(buff[3]).toBe(5);
    // TODO:
    // expectFn(() => { 
    //   let newBuff = new Buffer(1);
    //   newBuff.writeUInt16LE(0);
    // }).toThrow();
  })
  test("#writeUInt16BE", () => {
    let buff = new Buffer(4);
    expect<i32>(buff.writeUInt16BE(1280)).toBe(2);
    expect<i32>(buff.writeUInt16BE(5,2)).toBe(4);
    expect<i8>(buff[0]).toBe(5);
    expect<i8>(buff[1]).toBe(0);
    expect<i8>(buff[2]).toBe(0);
    expect<i8>(buff[3]).toBe(5);
    // TODO:
    // expectFn(() => { 
    //   let newBuff = new Buffer(1);
    //   newBuff.writeUInt16BE(0);
    // }).toThrow();
  })
});
