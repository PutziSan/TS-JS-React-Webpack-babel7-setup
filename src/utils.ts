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
