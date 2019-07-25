import { EventEmitter } from "events";

let calls: i32 = 0;

type i32Callback = (value: i32) => void;

describe("events", () => {
  test("events", () => {
    let t = new EventEmitter();
    t.on<i32Callback>("data", (value: i32) => {
      calls += 1;
      expect<i32>(value).toBe(42);
    });
    t.emit<i32>("data", 42);
    t.emit<i32>("data", 42);
    t.emit<i32>("data", 42);
    expect<i32>(calls).toBe(3);
  });
});