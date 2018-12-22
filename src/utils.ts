/* tslint:disable:no-any */

type Subscriber<T> = (t: T) => void;

export function createNewEvent<T = any>(): [
  (subscriber: Subscriber<T>) => void,
  (t: T) => any
] {
  const subscribers: Subscriber<T>[] = [];

  const fireEvent = (t: T) => {
    subscribers.forEach(subscriber => {
      subscriber(t);
    });
  };

  const onEvent = (subscriber: Subscriber<T>) => {
    subscribers.push(subscriber);
  };

  return [onEvent, fireEvent];
}

type When<T> = (t?: T) => any;
type Then<T> = (t?: T) => any;

interface VoidMatchChain {
  if: (when: () => any, then: () => any) => VoidMatchChain;
  else: (then: () => any) => void;
}

interface MatchChain<T> {
  if: (when: (t: T) => any, then: (t: T) => any) => MatchChain<T>;
  else: (then: Then<T>) => void;
}

function matched<T>(x?: T): MatchChain<T> {
  return {
    if: () => matched(x),
    else: () => x,
  };
}

export function match(): VoidMatchChain;
export function match<T>(val: T): MatchChain<T>;
export function match<T>(val?: T): MatchChain<T> {
  return {
    // @ts-ignore
    if: (when: When<T>, then: Then<T>) => {
      if (when(val)) {
        return matched(then(val));
      } else {
        return match(val);
      }
    },
    else: then => then(val),
  };
}

export function once<T extends any[]>(fn: (...params: T) => any) {
  let called = false;

  return (...params: T) => {
    if (called) {
      return;
    }

    called = true;
    fn(...params);
  };
}
