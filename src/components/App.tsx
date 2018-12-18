import * as React from 'react';
import { hot } from 'react-hot-loader';
import reactLoadable from 'react-loadable';
import yinYang2000pxPng from './assets/yin-yang-2000px.png';
import { ErrorBoundary } from './ErrorBoundary';
import { JsView } from './JsView';

import './App.css';

interface AppViewState {
  start: boolean;
}

const Loading: React.SFC<reactLoadable.LoadingComponentProps> = props =>
  props.error ? (
    <div>
      Error! <button onClick={props.retry}>Retry</button>
    </div>
  ) : (
    <div>Loading...</div>
  );

const LoadAppView = reactLoadable({
  loader: () => import('./AsyncTest').then(l => l.AsyncTest),
  loading: Loading,
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class InnerApp extends React.Component<{}, AppViewState> {
  state = {
    start: false,
  };

  toggleStart = () => this.setState({ start: !this.state.start });

  alertAfterTime = async () => {
    await wait(1000);
    alert('hi');
  };

  render() {
    return (
      <ErrorBoundary>
        <div>
          <h1>42!</h1>
          <button onClick={() => this.alertAfterTime()}>
            alert with async
          </button>
          <h2 className="app">import static assets (e.g. PNGs)</h2>
          <img
            alt="my"
            style={{ maxHeight: 160, width: 'auto' }}
            src={yinYang2000pxPng}
          />
          <hr />
          <h2>
            link to static assets (can used as external links, not hashed)
          </h2>
          <img src="/images/yin-yang-public.jpg" />
          <hr />
          <h2>
            Load async with dynamic <code>import()</code>
          </h2>
          <button onClick={this.toggleStart}>toggle loading</button>
          {this.state.start && <LoadAppView />}
          <hr />
          <h2>Mix JS with TS:</h2>
          <JsView name="comes from TS" />
        </div>
      </ErrorBoundary>
    );
  }
}

export const App =
  process.env.NODE_ENV === 'development' ? hot(module)(InnerApp) : InnerApp;
