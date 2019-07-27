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
    expect<i32>(buff.writeInt32LE(3735928559)).toBe(4);
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
    expect<i32>(buff.writeInt32BE(3735928559)).toBe(4);
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
});
