import { createNewEvent, once } from './utils';

// from https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
export function newServiceWorker(swPath: string) {
  const [onNewSW, fireNewSW] = createNewEvent<ServiceWorker>();
  // you may want to reload the page when the controller changed
  const [onControllerChanged, fireControllerChange] = createNewEvent();

  async function registerNewServiceWorker() {
    const registration = await navigator.serviceWorker.register(swPath);

    function listenStateChange(serviceWorker: ServiceWorker) {
      serviceWorker.addEventListener(
        'statechange',
        () => serviceWorker.state === 'installed' && fireNewSW(serviceWorker)
      );
    }

    // Track updates to the Service Worker.
    if (!navigator.serviceWorker.controller) {
      // The window client isn't currently controlled so it's a new service worker that will activate immediately
      return;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      // Ensure refresh is only called once. This works around a bug in "force update on reload".
      once(fireControllerChange)
    );

    if (registration.waiting) {
      // SW is waiting to activate. Can occur if multiple clients open and one of the clients is refreshed.
      fireNewSW(registration.waiting);
    } else if (registration.installing) {
      listenStateChange(registration.installing);
    } else {
      // We are currently controlled so a new SW may be found...
      // Add a listener in case a new SW is found,
      registration.addEventListener('updatefound', () => {
        if (registration.installing) {
          listenStateChange(registration.installing);
        }
      });
    }
  }

  return {
    registerNewServiceWorker,
    onNewServiceWorker: onNewSW,
    onControllerChanged,
  };
}
