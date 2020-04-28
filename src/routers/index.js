import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import Products from '../modules/products/List';
import ProductForm from '../modules/products/Form';
import Images from '../modules/images/List';
import ImagesForm from '../modules/images/Form';
import Types from '../modules/types/List';
import TypesForm from '../modules/types/Form';

class RouterContainer extends React.Component {
    render() {
      return (
        <Switch>
          {/* products view */}
          <Route exact path="/products/edit" component={ProductForm}/>
          <Route exact path="/products/add" component={ProductForm}/>
          <Route exact path="/products" component={Products}/>

          {/* images view */}
          <Route exact path="/images/edit" component={ImagesForm}/>
          <Route exact path="/images/add" component={ImagesForm}/>
          <Route exact path="/images" component={Images}/>

          {/* types view */}
          <Route exact path="/types/edit" component={TypesForm}/>
          <Route exact path="/types/add" component={TypesForm}/>
          <Route exact path="/types" component={Types}/>

          <Route exact path="/" component={Products}/>
        </Switch>
        );
    }
  }
  export default withRouter(RouterContainer);