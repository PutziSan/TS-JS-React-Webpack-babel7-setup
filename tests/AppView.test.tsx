import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { AppView } from '../src/components/AppView';

import 'jest-enzyme';

it('renders without crashing', () => {
  mount(<AppView />);
});

it('renders the correct headline', () => {
  expect(shallow(<AppView />).find('h1')).toHaveText('42!');
});
