import * as React from 'react';
import { newServiceWorker } from '../register-service-worker';

interface State {
  serviceWorker?: ServiceWorker;
  deferredPrompt?: BeforeInstallPromptEvent;
  isLoading: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}

interface Props {
  // tslint:disable-next-line:no-any
  onError?: (error: any) => void;
}

export class ServiceWorkerUi extends React.PureComponent<Props, State> {
  state: State = {
    serviceWorker: undefined,
    deferredPrompt: undefined,
    isLoading: false,
  };

  componentDidMount() {
    const sw = newServiceWorker('/service-worker.js');

    sw.onNewServiceWorker(serviceWorker => this.setState({ serviceWorker }));
    sw.onControllerChanged(() => window.location.reload());

    window.addEventListener('beforeinstallprompt', e => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.setState({ deferredPrompt: e as BeforeInstallPromptEvent });
    });

    window.addEventListener('load', () => {
      if (process.env.NODE_ENV === 'production') {
        sw.registerNewServiceWorker().catch(e => {
          if (this.props.onError) {
            this.props.onError(e);
          }
        });
      }
    });
  }

  render() {
    const { serviceWorker, isLoading, deferredPrompt } = this.state;

    return (
      <React.Fragment>
        {serviceWorker && (
          <div style={{ position: 'absolute', right: 16, bottom: 16 }}>
            Neue Version verfügbar
            <button
              disabled={isLoading}
              onClick={() => {
                this.setState({ isLoading: true });
                // skipWaiting wird in service-worker genutzt: check https://developers.google.com/web/tools/workbox/guides/advanced-recipes
                serviceWorker.postMessage('skipWaiting');
              }}
            >
              Jetzt neu laden
            </button>
          </div>
        )}
        {deferredPrompt && (
          <div style={{ position: 'absolute', left: 16, bottom: 16 }}>
            Wollen Sie es installieren?
            <button
              disabled={isLoading}
              onClick={() => {
                this.setState({ isLoading: true });
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then(choiceResult => {
                  if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                  } else {
                    console.log('User dismissed the A2HS prompt');
                  }
                  this.setState({ deferredPrompt: undefined });
                });
              }}
            >
              Jetzt installieren!
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}
