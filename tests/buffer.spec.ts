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
    expect(new Buffer(0)).toBeTruthy();
    expect(new Buffer(10)).toHaveLength(10);
    let myBuffer = new Buffer(10);
    expect(myBuffer.buffer).toBeTruthy();
    expect(myBuffer.buffer).toHaveLength(10);
    expect(() => { new Buffer(-1); }).toThrow();
    // TODO: figure out how to test block maxsize
    // expect(() => { new Buffer(1 + BLOCK_MAXSIZE); }).toThrow();
  });

  test("#alloc", () => {
    expect(Buffer.alloc(10)).toBeTruthy();
    expect(Buffer.alloc(10)).toHaveLength(10);
    let buff = Buffer.alloc(100);
    for (let i = 0; i < buff.length; i++) expect<u8>(buff[i]).toBe(0);
    expect(buff.buffer).not.toBeNull();
    expect(buff.byteLength).toBe(100);
    expect(() => { Buffer.alloc(-1); }).toThrow();
    // TODO: figure out how to test block maxsize
    // expect(() => { Buffer.alloc(1 + BLOCK_MAXSIZE); }).toThrow();
  });

  test("#allocUnsafe", () => {
    expect(Buffer.allocUnsafe(10)).toBeTruthy();
    expect(Buffer.allocUnsafe(10)).toHaveLength(10);
    let buff = Buffer.allocUnsafe(100);
    expect(buff.buffer).not.toBeNull();
    expect(buff.byteLength).toBe(100);
    expect(() => { Buffer.allocUnsafe(-1); }).toThrow();
    // TODO: figure out how to test block maxsize
    // expect(() => { Buffer.allocUnsafe(BLOCK_MAXSIZE + 1); }).toThrow();
  });

  test("#isBuffer", () => {
    let a = "";
    let b = new Uint8Array(0);
    let c = 0;
    let d = 1.1;
    let e = new Buffer(0);
    let f: Buffer | null = null;

    expect(Buffer.isBuffer(a)).toBeFalsy();
    expect(Buffer.isBuffer(b)).toBeFalsy();
    expect(Buffer.isBuffer(c)).toBeFalsy();
    expect(Buffer.isBuffer(d)).toBeFalsy();
    expect(Buffer.isBuffer(e)).toBeTruthy();
    expect(Buffer.isBuffer(f)).toBeFalsy();
  });

  test("#readInt8", () => {
    let buff = create<Buffer>([0x5,0x0,0x0,0x0,0xFF]);
    expect(buff.readInt8()).toBe(5);
    // Testing offset, and casting between u8 and i8.
    expect(buff.readInt8(4)).toBe(-1);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readInt8(5);
    }).toThrow();
  });

  test("#readUInt8", () => {
    let buff = create<Buffer>([0xFE,0x0,0x0,0x0,0x2F]);
    // Testing casting between u8 and i8.
    expect(buff.readUInt8()).toBe(254);
    // Testing offset
    expect(buff.readUInt8(4)).toBe(47);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readUInt8(5);
    }).toThrow();
  });

  test("#writeInt8", () => {
    let buff = new Buffer(5);
    expect(buff.writeInt8(9)).toBe(1);
    expect(buff.writeInt8(-3,4)).toBe(5);
    let result = create<Buffer>([0x09, 0x0, 0x0, 0x0, 0xFD]);
    expect(buff).toStrictEqual(result);
    // TODO:
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeInt8(5,10);
    }).toThrow();
  });

  test("#writeUInt8", () => {
    let buff = new Buffer(5);
    expect(buff.writeUInt8(4)).toBe(1);
    expect(buff.writeUInt8(252,4)).toBe(5);
    let result = create<Buffer>([0x04, 0x0, 0x0, 0x0, 0xFC]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeUInt8(5,10);
    }).toThrow();
  });

  test("#readInt16LE", () => {
    let buff = create<Buffer>([0x0,0x05,0x0]);
    expect(buff.readInt16LE()).toBe(1280);
    expect(buff.readInt16LE(1)).toBe(5);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readInt16LE(0);
    }).toThrow();
  });

  test("#readInt16BE", () => {
    let buff = create<Buffer>([0x0,0x05,0x0]);
    expect(buff.readInt16BE()).toBe(5);
    expect(buff.readInt16BE(1)).toBe(1280);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readInt16BE(0);
    }).toThrow();
  });

  test("#readUInt16LE", () => {
    let buff = create<Buffer>([0x0,0x05,0x0]);
    expect(buff.readUInt16LE()).toBe(1280);
    expect(buff.readUInt16LE(1)).toBe(5);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readUInt16LE(0);
    }).toThrow();
  });

  test("#readUInt16BE", () => {
    let buff = create<Buffer>([0x0,0x05,0x0]);
    expect(buff.readUInt16BE()).toBe(5);
    expect(buff.readUInt16BE(1)).toBe(1280);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readUInt16BE(0);
    }).toThrow();
  });

  test("#writeInt16LE", () => {
    let buff = new Buffer(4);
    expect(buff.writeInt16LE(5)).toBe(2);
    expect(buff.writeInt16LE(1280,2)).toBe(4);
    let result = create<Buffer>([0x05, 0x0, 0x0, 0x5]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeInt16LE(0);
    }).toThrow();
  });

  test("#writeInt16BE", () => {
    let buff = new Buffer(4);
    expect(buff.writeInt16BE(1280)).toBe(2);
    expect(buff.writeInt16BE(5,2)).toBe(4);
    let result = create<Buffer>([0x05, 0x0, 0x0, 0x5]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeInt16BE(0);
    }).toThrow();
  });

  test("#writeUInt16LE", () => {
    let buff = new Buffer(4);
    expect(buff.writeUInt16LE(5)).toBe(2);
    expect(buff.writeUInt16LE(1280,2)).toBe(4);
    let result = create<Buffer>([0x05, 0x0, 0x0, 0x5]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeUInt16LE(0);
    }).toThrow();
  });

  test("#writeUInt16BE", () => {
    let buff = new Buffer(4);
    expect(buff.writeUInt16BE(1280)).toBe(2);
    expect(buff.writeUInt16BE(5,2)).toBe(4);
    let result = create<Buffer>([0x05, 0x0, 0x0, 0x5]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeUInt16BE(0);
    }).toThrow();
  });

  test("#readInt32LE", () => {
    let buff = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0x0d,0xc0,0xde,0x10]);
    expect(buff.readInt32LE()).toBe(-559038737);
    expect(buff.readInt32LE(4)).toBe(283033613);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readInt32LE(0);
    }).toThrow();
  });

  test("#readInt32BE", () => {
    let buff = create<Buffer>([0xDE,0xAD,0xBE,0xEF,0x10,0xde,0xc0,0x0d]);
    expect(buff.readInt32BE()).toBe(-559038737);
    expect(buff.readInt32BE(4)).toBe(283033613);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readInt32BE(0);
    }).toThrow();
  });

  test("#readUInt32LE", () => {
    let buff = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0x0d,0xc0,0xde,0x10]);
    expect(buff.readUInt32LE()).toBe(3735928559);
    expect(buff.readUInt32LE(4)).toBe(283033613);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readUInt32LE(0);
    }).toThrow();
  });

  test("#readUInt32BE", () => {
    let buff = create<Buffer>([0xDE,0xAD,0xBE,0xEF,0x10,0xde,0xc0,0x0d]);
    expect(buff.readUInt32BE()).toBe(3735928559);
    expect(buff.readUInt32BE(4)).toBe(283033613);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readUInt32BE(0);
    }).toThrow();
  });

  test("#writeInt32LE", () => {
    let buff = new Buffer(8);
    expect(buff.writeInt32LE(-559038737)).toBe(4);
    expect(buff.writeInt32LE(283033613,4)).toBe(8);
    let result = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0x0d,0xc0,0xde,0x10]);
    expect<Buffer>(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeInt32LE(0);
    }).toThrow();
  });

  test("#writeInt32BE", () => {
    let buff = new Buffer(8);
    expect(buff.writeInt32BE(-559038737)).toBe(4);
    expect(buff.writeInt32BE(283033613,4)).toBe(8);
    let result = create<Buffer>([0xDE,0xAD,0xBE,0xEF,0x10,0xde,0xc0,0x0d]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeInt32BE(0);
    }).toThrow();
  });

  test("#writeUInt32LE", () => {
    let buff = new Buffer(8);
    expect(buff.writeUInt32LE(3735928559)).toBe(4);
    expect(buff.writeUInt32LE(283033613,4)).toBe(8);
    let result = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0x0d,0xc0,0xde,0x10]);;
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeUInt32LE(0);
    }).toThrow();
  });

  test("#writeUInt32BE", () => {
    let buff = new Buffer(8);
    expect(buff.writeUInt32BE(3735928559)).toBe(4);
    expect(buff.writeUInt32BE(283033613,4)).toBe(8);
    let result = create<Buffer>([0xDE,0xAD,0xBE,0xEF,0x10,0xde,0xc0,0x0d]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeUInt32BE(0);
    }).toThrow();
  });

  test("#readFloatLE", () => {
    let buff = create<Buffer>([0xbb,0xfe,0x4a,0x4f,0x01,0x02,0x03,0x04]);
    expect(buff.readFloatLE()).toBe(0xcafebabe);
    expect(buff.readFloatLE(4)).toBe(1.539989614439558e-36);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readFloatLE(0);
    }).toThrow();
  });

  test("#readFloatBE", () => {
    let buff = create<Buffer>([0x4f,0x4a,0xfe,0xbb,0x01,0x02,0x03,0x04]);
    expect(buff.readFloatBE()).toBe(0xcafebabe);
    expect(buff.readFloatBE(4)).toBe(2.387939260590663e-38);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readFloatBE(0);
    }).toThrow();
  });

  test("#writeFloatLE", () => {
    let buff = new Buffer(8);
    expect(buff.writeFloatLE(0xcafebabe)).toBe(4);
    expect(buff.writeFloatLE(1.539989614439558e-36,4)).toBe(8);
    let result = create<Buffer>([0xbb,0xfe,0x4a,0x4f,0x01,0x02,0x03,0x04]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeFloatLE(0);
    }).toThrow();
  });

  test("#writeFloatBE", () => {
    let buff = new Buffer(8);
    expect(buff.writeFloatBE(0xcafebabe)).toBe(4);
    expect(buff.writeFloatBE(2.387939260590663e-38,4)).toBe(8);
    let result = create<Buffer>([0x4f,0x4a,0xfe,0xbb,0x01,0x02,0x03,0x04]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeFloatBE(0);
    }).toThrow();
  });

  test("#readBigInt64LE", () => {
    let buff = create<Buffer>([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]);
    expect(buff.readBigInt64LE()).toBe(-4294967296);
    expect(buff.readBigInt64LE(8)).toBe(4294967295);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readBigInt64LE(0);
    }).toThrow();
  });

  test("#readBigInt64BE", () => {
    let buff = create<Buffer>([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]);
    expect(buff.readBigInt64BE()).toBe(4294967295);
    expect(buff.readBigInt64BE(8)).toBe(-4294967296);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readBigInt64BE(0);
    }).toThrow();
  });

  test("#readBigUInt64LE", () => {
    let buff = create<Buffer>([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]);
    expect(buff.readBigUInt64LE()).toBe(18446744069414584320);
    expect(buff.readBigUInt64LE(8)).toBe(4294967295);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readBigUInt64LE(0);
    }).toThrow();
  });

  test("#readBigUInt64BE", () => {
    let buff = create<Buffer>([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]);
    expect(buff.readBigUInt64BE()).toBe(4294967295);
    expect(buff.readBigUInt64BE(8)).toBe(18446744069414584320);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readBigUInt64BE(0);
    }).toThrow();
  });

  test("#writeBigInt64LE", () => {
    let buff = new Buffer(16);
    expect(buff.writeBigInt64LE(-559038737)).toBe(8);
    expect(buff.writeBigInt64LE(283033613,8)).toBe(16);
    let result = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0xFF,0xFF,0xFF,0xFF,0x0d,0xc0,0xde,0x10,0x00,0x00,0x00,0x00]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeBigInt64LE(0);
    }).toThrow();
  });

  test("#writeBigInt64BE", () => {
    let buff = new Buffer(16);
    expect(buff.writeBigInt64BE(-559038737)).toBe(8);
    expect(buff.writeBigInt64BE(283033613,8)).toBe(16);
    let result = create<Buffer>([0xFF,0xFF,0xFF,0xFF,0xDE,0xAD,0xBE,0xEF,0x00,0x00,0x00,0x00,0x10,0xde,0xc0,0x0d]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeBigInt64BE(0);
    }).toThrow();
  });

  test("#writeBigUInt64LE", () => {
    let buff = new Buffer(16);
    expect(buff.writeBigUInt64LE(3735928559)).toBe(8);
    expect(buff.writeBigUInt64LE(283033613,8)).toBe(16);
    let result = create<Buffer>([0xEF,0xBE,0xAD,0xDE,0x00,0x00,0x00,0x00,0x0d,0xc0,0xde,0x10,0x00,0x00,0x00,0x00]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeBigUInt64LE(0);
    }).toThrow();
  });

  test("#writeBigUInt64BE", () => {
    let buff = new Buffer(16);
    expect(buff.writeBigUInt64BE(3735928559)).toBe(8);
    expect(buff.writeBigUInt64BE(283033613,8)).toBe(16);
    let result = create<Buffer>([0x00,0x00,0x00,0x00,0xDE,0xAD,0xBE,0xEF,0x00,0x00,0x00,0x00,0x10,0xde,0xc0,0x0d]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeBigUInt64BE(0);
    }).toThrow();
  });

  test("#readDoubleLE", () => {
    let buff = create<Buffer>([0x77, 0xbe, 0x9f, 0x1a, 0x2f, 0xdd, 0x5e, 0x40, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    expect(buff.readDoubleLE()).toBe(123.456);
    expect(buff.readDoubleLE(8)).toBe(5.447603722011605e-270);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readDoubleLE(0);
    }).toThrow();
  });

  test("#readDoubleBE", () => {
    let buff = create<Buffer>([0x40, 0x5e, 0xdd, 0x2f, 0x1a, 0x9f, 0xbe, 0x77, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    expect(buff.readDoubleBE()).toBe(123.456);
    expect(buff.readDoubleBE(8)).toBe(8.20788039913184e-304);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.readDoubleBE(0);
    }).toThrow();
  });

  test("#writeDoubleLE", () => {
    let buff = new Buffer(16);
    expect(buff.writeDoubleLE(123.456)).toBe(8);
    expect(buff.writeDoubleLE(5.447603722011605e-270,8)).toBe(16);
    let result = create<Buffer>([0x77, 0xbe, 0x9f, 0x1a, 0x2f, 0xdd, 0x5e, 0x40, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeDoubleLE(0);
    }).toThrow();
  });

  test("#writeDoubleBE", () => {
    let buff = new Buffer(16);
    expect(buff.writeDoubleBE(123.456)).toBe(8);
    expect(buff.writeDoubleBE(8.20788039913184e-304,8)).toBe(16);
    let result = create<Buffer>([0x40, 0x5e, 0xdd, 0x2f, 0x1a, 0x9f, 0xbe, 0x77, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    expect(buff).toStrictEqual(result);
    expect(() => {
      let newBuff = new Buffer(1);
      newBuff.writeDoubleBE(0);
    }).toThrow();
  });

  test("#subarray", () => {
    let example = create<Buffer>([1, 2, 3, 4, 5, 6, 7, 8]);

    // no parameters means copy the Buffer
    let actual = example.subarray();
    expect(actual).toStrictEqual(example);
    expect(actual.buffer).toBe(example.buffer); // should use the same buffer

    // start at offset 5
    actual = example.subarray(5);
    let expected = create<Buffer>([6, 7, 8]);
    // trace("length", 1, expected.length);
    expect(actual).toStrictEqual(expected);

    // negative start indicies, start at (8 - 5)
    actual = example.subarray(-5);
    expected = create<Buffer>([4, 5, 6, 7, 8]);
    expect(actual).toStrictEqual(expected);

    // two parameters
    actual = example.subarray(2, 6);
    expected = create<Buffer>([3, 4, 5, 6]);
    expect(actual).toStrictEqual(expected);

    // negative end index
    actual = example.subarray(4, -1);
    expected = create<Buffer>([5, 6, 7]);
    expect(actual).toStrictEqual(expected);
  });

  test("#swap16", () => {
    let actual = create<Buffer>([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);
    let expected = create<Buffer>([0x2, 0x1, 0x4, 0x3, 0x6, 0x5, 0x8, 0x7]);
    let swapped = actual.swap16();
    expect(actual).toStrictEqual(expected);
    expect(swapped).toBe(actual);
    expect(() => {
      let newBuff = create<Buffer>([0x1, 0x2, 0x3]);
      newBuff.swap16();
    }).toThrow();
  });

  test("#swap32", () => {
    let actual = create<Buffer>([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);
    let expected = create<Buffer>([0x4, 0x3, 0x2, 0x1, 0x8, 0x7, 0x6, 0x5]);
    let swapped = actual.swap32();
    expect(actual).toStrictEqual(expected);
    expect(swapped).toBe(actual);
    expect(() => {
      let newBuff = create<Buffer>([0x1, 0x2, 0x3]);
      newBuff.swap64();
    }).toThrow();
  });

  test("#swap64", () => {
    let actual = create<Buffer>([0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf]);
    let expected = create<Buffer>([0x7, 0x6, 0x5, 0x4, 0x3, 0x2, 0x1, 0x0, 0xf, 0xe, 0xd, 0xc, 0xb, 0xa, 0x9, 0x8]);
    let swapped = actual.swap64();
    expect(actual).toStrictEqual(expected);
    expect(swapped).toBe(actual);
    expect(() => {
      let newBuff = create<Buffer>([0x1, 0x2, 0x3]);
      newBuff.swap64();
    }).toThrow();
  });

  test("#Hex.encode", () => {
    let actual = "000102030405060708090a0b0c0d0e0f102030405060708090a0b0c0d0e0f0";
    let exampleBuffer = create<Buffer>([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0]);
    let encoded = Buffer.HEX.encode(actual);
    expect(encoded).toStrictEqual(exampleBuffer.buffer);
  });

  test("#Hex.decode", () => {
    let expected = "000102030405060708090a0b0c0d0e0f102030405060708090a0b0c0d0e0f0";
    let exampleBuffer = create<Buffer>([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x90, 0xa0, 0xb0, 0xc0, 0xd0, 0xe0, 0xf0]);
    let decoded = Buffer.HEX.decode(exampleBuffer.buffer);
    expect(decoded).toStrictEqual(expected);
  });

  test("#ASCII.encode", () => {
    let actual = "D34dB3eF";
    let exampleBuffer = create<Buffer>([0x44, 0x33, 0x34, 0x64, 0x42, 0x33, 0x65, 0x46]);
    let encoded = Buffer.ASCII.encode(actual);
    expect(encoded).toStrictEqual(exampleBuffer.buffer);
  });

  test("#ASCII.decode", () => {
    let expected = create<Buffer>([0x44, 0x33, 0x34, 0x64, 0x42, 0x33, 0x65, 0x46]);
    let example = "D34dB3eF";
    let encoded = Buffer.ASCII.decode(expected.buffer);
    expect(encoded).toStrictEqual(example);
  });
});
