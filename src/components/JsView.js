import React from 'react';
import PropTypes from 'prop-types';
import { OtherView } from './OtherView';

const staticProp = 'my static value';

export const JsView = props => (
  <div>
    <h3>This is a JS-Component</h3>
    <p>{props.name}</p>
    <p>
      with Object-spread (<code>...</code>) support
    </p>
    <pre>
      {JSON.stringify(
        {
          ...Object.assign({}, { a: 'a', b: 'b' }, { a: 'c', c: 'c' }),
          c: 'd',
          d: 'd',
          staticProp
        },
        null,
        2
      )}
    </pre>
    <p>and also renders a TS-Component:</p>
    <OtherView testProp="comes from JS" />
  </div>
);

JsView.propTypes = {
  name: PropTypes.string.isRequired
};
