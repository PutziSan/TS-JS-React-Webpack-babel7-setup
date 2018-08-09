import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { App } from '../src/components/App';

import 'jest-enzyme';

it('renders without crashing', () => {
  mount(<App />);
});

it('renders the correct headline', () => {
  expect(shallow(<App />).find('h1')).toHaveText('42!');
});
