import { BLOCK_MAXSIZE, BLOCK, BLOCK_OVERHEAD } from "rt/common";
import { E_INVALIDLENGTH } from "util/error";

class EventList {
  count: usize;

  // adapted from https://github.com/AssemblyScript/assemblyscript/blob/master/std/assembly/array.ts#L11
  ensureSize(minSize: usize): EventList {
    let currentSize = changetype<BLOCK>(changetype<usize>(this) - BLOCK_OVERHEAD).rtSize;
    let byteLength = (minSize + 2) << alignof<usize>();
    if (byteLength > currentSize) {
      if (byteLength > BLOCK_MAXSIZE) throw new RangeError(E_INVALIDLENGTH);
      let oldData = changetype<usize>(this);
      let newData = __realloc(oldData, byteLength);
      // don't need to fill because they won't be used
      // memory.fill(newData + currentSize, 0, byteLength - currentSize);
      return changetype<EventList>(newData);
    }
    return this;
  }
}

export class EventEmitter {
  private _events: Map<string, EventList> = new Map<string, EventList>();

  private _ensureEvent(event: string): void {
    if (!this._events.has(event)) {
      let byteLength = offsetof<EventList>() + (sizeof<usize>() << 2);
      let list = changetype<EventList>(__alloc(byteLength, idof<EventList>()));
      this._events.set(event, list);
    }
  }

  public on<T>(event: string, callback: T): EventEmitter {
    if (!isFunction<T>()) {
      ERROR("EventEmitter#on can only be called with a callback of type T where T is a static function.");
    }
    this._ensureEvent(event);
    let list = this._events.get(event);
    list.count += 1;
    list = list.ensureSize(list.count);
    store<usize>(changetype<usize>(list) + ((list.count) << alignof<usize>()), changetype<usize>(callback));
    return this;
  }

  public emit<T>(event: string, data: T): EventEmitter {
    if (this._events.has(event)) {
      let list = this._events.get(event);
      let count = list.count;
      let start = changetype<usize>(list) + sizeof<usize>();
      for (let i: usize = 0; i < count; i++) {
        call_indirect(<u32>load<usize>(start), data);
        start += sizeof<usize>();
      }
    }
    return this;
  }
}