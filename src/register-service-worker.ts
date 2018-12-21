// tslint:disable

// TODO
// from https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
function onNewServiceWorker(registration, callback) {
  if (registration.waiting) {
    // SW is waiting to activate. Can occur if multiple clients open and
    // one of the clients is refreshed.
    return callback();
  }

  function listenInstalledStateChange() {
    registration.installing.addEventListener('statechange', function(event) {
      if (event.target.state === 'installed') {
        // A new service worker is available, inform the user
        callback();
      }
    });
  }

  if (registration.installing) {
    return listenInstalledStateChange();
  }

  // We are currently controlled so a new SW may be found...
  // Add a listener in case a new SW is found,
  registration.addEventListener('updatefound', listenInstalledStateChange);
}

function bla(swPath: string) {
  const [onNewSW, fireNewSW] = createNewEvent<[ServiceWorkerRegistration]>();
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange
  // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
  // you may want to reload the page when the controller changed
  const [onControllerChanged, fireControllerChange] = createNewEvent();

  async function registerNewServiceWorker() {
    const registration = await navigator.serviceWorker.register(swPath);

    function listenStateChange() {
      registration.installing.addEventListener(
        'statechange',
        when<Event>(ev => ev.target.state === 'installed', fireControllerChange)
      );
    }

    // Track updates to the Service Worker.
    if (!navigator.serviceWorker.controller) {
      // The window client isn't currently controlled so it's a new service worker that will activate immediately
      return;
    }

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      // Ensure refresh is only called once. This works around a bug in "force update on reload".
      once(fireControllerChange)
    );

    const bla = match().if(() => registration.waiting, fireControllerChange);

    condEffect(
      [() => registration.waiting, fireControllerChange],
      [() => registration.installing, listenStateChange],
      defaultF(() => {
        // We are currently controlled so a new SW may be found...
        // Add a listener in case a new SW is found,
        registration.addEventListener('updatefound', listenStateChange);
      })
    );

    match()
      // SW is waiting to activate. Can occur if multiple clients open and
      // one of the clients is refreshed.
      .if(() => registration.waiting, fireControllerChange)
      .if(() => registration.installing, listenStateChange)
      .else(() => {
        // We are currently controlled so a new SW may be found...
        // Add a listener in case a new SW is found,
        registration.addEventListener('updatefound', listenStateChange);
      });
  }

  return {
    registerNewServiceWorker,
    onNewServiceWorker: onNewSW,
    onControllerChanged,
  };
}

function once<T extends any[]>(fn: (...params: T) => any) {
  let called = false;

  return (...params: T) => {
    if (called) {
      return;
    }

    called = true;
    fn(...params);
  };
}

type Subscriber<T extends any[]> = (...params: T) => void;

export function createNewEvent<T extends any[] = any>(): [
  (subscriber: Subscriber<T>) => void,
  (...vals: T) => any
] {
  const subscribers: Subscriber<T>[] = [];

  const fireEvent = (...vals: T) => {
    subscribers.forEach(subscriber => {
      subscriber(...vals);
    });
  };

  const onEvent = (subscriber: Subscriber<T>) => {
    subscribers.push(subscriber);
  };

  return [onEvent, fireEvent];
}

function when<T, R>(cond: (t: T) => any, then: (t: T) => R) {
  return (t: T) => {
    if (cond(t)) {
      return then(t);
    }

    return t;
  };
}

type When = (t) => any;
type Then = (t) => any;
type Cond = [When, Then];

function condEffect(...conds: Cond[]): void {
  const len = conds.length;

  for (let i = 0; i < len; i++) {
    if (conds[i][0]()) {
      return conds[i][1]();
    }
  }
}

const defaultF = (fn: Then) => [() => true, fn];
