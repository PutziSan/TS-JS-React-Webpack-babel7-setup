import { faCoffee } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { defineMessages, FormattedMessage, IntlProvider } from 'react-intl';
import reactLoadable from 'react-loadable';
import yinYang2000pxPng from './assets/yin-yang-2000px.png';
import { JsView } from './JsView';

const a = defineMessages({
  asd: {
    defaultMessage: 'tester',
    id: 'asd'
  }
});

const LoadAppView = reactLoadable({
  loader: () => import('./AsyncTest'),
  loading: () => <div>LOAD!!!</div>,
  render: (loaded, props) => <loaded.AsyncTest {...props} />
});

export class AppView extends React.Component<{}, { start: boolean }> {
  state = {
    start: false
  };

  toggleStart = () => this.setState({ start: !this.state.start });

  render() {
    return (
      <IntlProvider locale="en">
        <div>
          <h1>42!</h1>
          <FontAwesomeIcon icon={faCoffee} />
          <h2>import PNG- noar</h2>
          <img
            alt="my"
            style={{ maxHeight: 160, width: 'auto' }}
            src={yinYang2000pxPng}
          />
          <button onClick={this.toggleStart}>toggle loading</button>
          {this.state.start && <LoadAppView />}
          <br />
          <FormattedMessage {...a.asd} />
          <JsView name="testera" />
        </div>
      </IntlProvider>
    );
  }
}
