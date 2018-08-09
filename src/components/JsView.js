import React from 'react';
import PropTypes from 'prop-types';
import { OtherView } from './OtherView';

export const JsView = props => (
  <div>
    <h3>This is a JS-Component</h3>
    <p>{props.name}</p>
    <p>and also renders a TS-Component:</p>
    <OtherView testProp="comes from JS" />
  </div>
);

JsView.propTypes = {
  name: PropTypes.string.isRequired
};
