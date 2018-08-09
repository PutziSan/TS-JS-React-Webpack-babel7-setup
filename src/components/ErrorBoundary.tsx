import * as React from 'react';
import { ErrorInfo } from 'react';

export class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  };

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      // tslint:disable-next-line:no-console
      console.error(error, info);
    }

    // TODO custom error logging, e.g. sentry

    this.setState({ hasError: true });
  }

  toggleHasError = () => this.setState({ hasError: !this.state.hasError });

  render() {
    if (this.state.hasError) {
      if (process.env.NODE_ENV === 'development') {
        return (
          <div>
            <h1>Error! see logs! :/</h1>
            <button onClick={this.toggleHasError}>reset app</button>
          </div>
        );
      }

      // TODO insert your custom ERROR-UI
      return <h1>Error! :(</h1>;
    }

    return this.props.children;
  }
}
