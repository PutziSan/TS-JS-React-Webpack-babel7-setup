import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppView } from '../src/components/AppView';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppView />, div);
  ReactDOM.unmountComponentAtNode(div);
});
