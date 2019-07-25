import { BLOCK_OVERHEAD, BLOCK } from "rt/common";

class Callback<T> {}
class Dummy {}

export class EventEmitter {
  public static EventMap: Map<i32, Map<string, i32>> = new Map<i32, Map<string, i32>>();
  public static registerEventCallback<T, U>(event: string): void {
    if (!isFunction<U>()) {
      ERROR("Cannot register event callback of type U where U is not a function.");
    }
    if (!EventEmitter.EventMap.has(idof<T>())) {
      EventEmitter.EventMap.set(idof<T>(), new Map<string, i32>());
    }
    let ClassEvents = EventEmitter.EventMap.get(idof<T>());
    if (ClassEvents.has(event)) {
      throw new Error("EventMap already contains a definition for event: " + event);
    }
    ClassEvents.set(event, idof<Callback<U>>());
  }

  private _events: Map<string, u32[]> = new Map<string, u32[]>();

  public on<T>(event: string, callback: T): EventEmitter {
    if (!isFunction<T>()) {
      ERROR("EventEmitter#on can only be called with a callback of type T where T is a static function.");
    }
    let rtId = changetype<BLOCK>(changetype<usize>(this) - BLOCK_OVERHEAD).rtId;
    let EventMap = EventEmitter.EventMap;
    if (!EventMap.has(rtId)) throw new Error("Cannot attach events to an EventEmitter with no EventMap definitions.");
    let ClassEvents = EventMap.get(rtId);
    if (!ClassEvents.has(event)) throw new Error("Event does not exist: " + event);
    let cbId = idof<Callback<T>>();
    let classEventCallbackID = ClassEvents.get(event);
    assert(cbId == classEventCallbackID);
    if (!this._events.has(event)) this._events.set(event, new Array<u32>());
    let eventList = this._events.get(event);
    eventList.push(changetype<u32>(callback));
    return this;
  }

  public emit<T>(event: string, data: T): EventEmitter {
    if (this._events.has(event)) {
      let list = this._events.get(event);
      let length = list.length;
      for (let i: i32 = 0; i < length; i++) {
        call_indirect(unchecked(list[i]), data);
      }
    }
    return this;
  }
}