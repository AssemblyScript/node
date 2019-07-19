function bufferFrom(values: i32[]): Buffer {
  let buffer = new Buffer(values.length);
  for (let i = 0; i < values.length; i++) buffer[i] = <u8>values[i];
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

  test("#concat", () => {
    let list: Buffer[] = new Array<Buffer>(0);
    for (let i = 0; i < 5; i++) {
      let buff = Buffer.alloc(5 - i);
      for (let j = 0; j < (5 - i); j++) {
         buff[j] = u8(i);
      }
      list.push(buff);
    }
    let actual: Buffer = Buffer.concat(list, 15);

    let expected: Buffer = bufferFrom([0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4]);

    // TODO: When as-pect releases 2.2.1
    // expect<Buffer>(actual).toStrictEqual(expected);
    expect<ArrayBuffer>(actual.buffer).toStrictEqual(expected.buffer);
  });
});
