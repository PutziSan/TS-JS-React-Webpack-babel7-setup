import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { commonMessagesJs } from '../commonMessagesJs';

interface OtherViewProps {
  tester: string;
}

export const OtherView: React.SFC<OtherViewProps> = props => (
  <div>
    {props.tester}
    <br />
    <FormattedMessage {...commonMessagesJs.testerJs} />
  </div>
);
