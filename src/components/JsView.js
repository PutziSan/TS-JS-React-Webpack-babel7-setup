import React from 'react';
import { OtherView } from './OtherView';
import { commonMessagesTs } from '../commonMessagesTs';
import { FormattedMessage } from 'react-intl';

export const JsView = props => (
  <div>
    <p>{props.name}</p>
    <p>other child:</p>
    <OtherView tester="OMG" />
    <FormattedMessage {...commonMessagesTs.testerTs} />
  </div>
);
