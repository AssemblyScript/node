import { EventEmitter } from "events";

let calls: i32 = 0;

type i32Callback = (value: i32) => void;

class CustomEventEmitter extends EventEmitter {}

EventEmitter.registerEventCallback<CustomEventEmitter, i32Callback>("data");

describe("events", () => {
  test("events", () => {
    let t = new CustomEventEmitter();
    t.on<i32Callback>("data", <i32Callback>(value: i32) => {
      calls += 1;
      expect<i32>(value).toBe(42);
    });
    t.emit<i32>("data", 42);
    t.emit<i32>("data", 42);
    t.emit<i32>("data", 42);
    expect<i32>(calls).toBe(3);
  });
});