import React from 'react';
import {Route, withRouter} from 'react-router-dom';

class RouterContainer extends React.Component {
  render() {
    const Component = this.props.component
    return <Route render={props => <Component {...props} />} />;
  }
}
export default withRouter(RouterContainer);

