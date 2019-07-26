import { BLOCK_OVERHEAD, BLOCK } from "rt/common";


export class EventEmitter {
  public static EventMap: Map<i32, Map<string, u64>> = new Map<i32, Map<string, u64>>();
  public static registerEventCallback<T, U>(event: string, length: u32 = 1): void {
    if (!isFunction<U>()) {
      ERROR("Cannot register event callback of type U where U is not a function.");
    }
    if (!EventEmitter.EventMap.has(idof<T>())) {
      EventEmitter.EventMap.set(idof<T>(), new Map<string, u64>());
    }
    let ClassEvents = EventEmitter.EventMap.get(idof<T>());
    if (ClassEvents.has(event)) {
      throw new Error("EventMap already contains a definition for event: " + event);
    }
    let definition: u64 = <u64>idof<U>() | (<u64>length << 32);
    ClassEvents.set(event, definition);
    log<u64>(definition);
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
    let cbId = idof<T>();
    let classEventSignature = ClassEvents.get(event);
    let classEventCallbackID = <u32>(classEventSignature & 0xFFFFFFFF);
    assert(cbId == classEventCallbackID);
    if (!this._events.has(event)) this._events.set(event, new Array<u32>());
    let eventList = this._events.get(event);
    eventList.push(changetype<u32>(callback));
    return this;
  }

  public emit<A = string | null, B = string | null, C = string | null, D = string | null, E = string | null, F = string | null, G = string | null, H = string | null, I = string | null, J = string | null>
    (event: string, a: A = null, b: B = null, c: C = null, d: D = null, e: E = null, f: F = null, g: G = null, h: H = null, i: I = null, j: J = null): EventEmitter {
    if (this._events.has(event)) {
      let rtId = changetype<BLOCK>(changetype<usize>(this) - BLOCK_OVERHEAD).rtId;
      let ClassEvents = EventEmitter.EventMap.get(rtId);
      assert(ClassEvents.has(event), "No event definition.");
      let classEventSignature = ClassEvents.get(event);
      let classEventArgLength = <u32>(classEventSignature >> 32) & 0xFFFFFFFF;
      let classEventCallbackID = <u32>(classEventSignature & 0xFFFFFFFF);
      let list = this._events.get(event);
      let length = list.length;
      switch (classEventArgLength) {
        case 0: {
          assert(classEventCallbackID == idof<() => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]));
          break;
        }
        case 1: {
          assert(classEventCallbackID == idof<(a: A) => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]), a);
          break;
        }
        case 2: {
          assert(classEventCallbackID == idof<(a: A, b: B) => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]), a, b);
          break;
        }
        case 3: {
          assert(classEventCallbackID == idof<(a: A, b: B, c: C) => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]), a, b, c);
          break;
        }
        case 4: {
          assert(classEventCallbackID == idof<(a: A, b: B, c: C, d: D) => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]), a, b, c, d);
          break;
        }
        case 5: {
          assert(classEventCallbackID == idof<(a: A, b: B, c: C, d: D, e: E) => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]), a, b, c, d, e);
          break;
        }
        case 6: {
          assert(classEventCallbackID == idof<(a: A, b: B, c: C, d: D, e: E, f: F) => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]), a, b, c, d, e, f);
          break;
        }
        case 7: {
          assert(classEventCallbackID == idof<(a: A, b: B, c: C, d: D, e: E, f: F, g: G) => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]), a, b, c, d, e, f, g);
          break;
        }
        case 8: {
          assert(classEventCallbackID == idof<(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]), a, b, c, d, e, f, g, h);
          break;
        }
        case 9: {
          assert(classEventCallbackID == idof<(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]), a, b, c, d, e, f, g, h, i);
          break;
        }
        case 10: {
          assert(classEventCallbackID == idof<(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J) => void>());
          for (let z = 0; z < length; z++) call_indirect(unchecked(list[z]), a, b, c, d, e, f, g, h, i, j);
          break;
        }
        default: assert(false);
      }
    }
    return this;
  }
}