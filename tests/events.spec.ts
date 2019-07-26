import { EventEmitter } from "events";

let calls: i32 = 0;

type i32Callback = (a: i32) => void;
type i64Callback = (a: i64, b: i64) => void;
class CustomEventEmitter extends EventEmitter {}

EventEmitter.registerEventCallback<CustomEventEmitter, i32Callback>("data", 1);
EventEmitter.registerEventCallback<CustomEventEmitter, i64Callback>("data2", 2);

describe("events", () => {
  test("events", () => {
    let t = new CustomEventEmitter();
    calls = 0;
    t.on<i32Callback>("data", (wrongName: i32) => {
      calls += 1;
      expect<i32>(wrongName).toBe(42);
    });
    t.emit<i32>("data", 42);
    t.emit<i32>("data", 42);
    t.emit<i32>("data", 42);
    expect<i32>(calls).toBe(3);
  });

  test("events2", () => {
    let t = new CustomEventEmitter();
    calls = 0;
    t.on<i64Callback>("data2", (a: i64, b: i64) => {
      calls += 1;
      expect<i64>(a).toBe(42);
      expect<i64>(b).toBe(42);
    });
    t.emit<i64, i64>("data2", <i64>42, <i64>42);
    t.emit<i64, i64>("data2", <i64>42, <i64>42);
    t.emit<i64, i64>("data2", <i64>42, <i64>42);
    expect<i32>(calls).toBe(3);
  });
});