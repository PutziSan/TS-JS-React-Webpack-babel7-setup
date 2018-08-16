import * as React from 'react';

import './OtherView.css';

interface OtherViewProps {
  testProp: string;
}

interface OtherViewState {
  counter: number;
}

export class OtherView extends React.Component<OtherViewProps, OtherViewState> {
  state = {
    counter: 0,
  };

  handleClick = () =>
    this.setState(({ counter }) => ({
      counter: counter + 1,
    }));

  render() {
    if (this.state.counter === 5) {
      // Simulate a JS error
      throw new Error('I crashed!');
    }
    return (
      <h1 onClick={this.handleClick} className="other-view">
        {this.state.counter} (click 5x on counter to raise an error)
      </h1>
    );
  }
}
