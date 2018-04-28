// full code here --> https://github.com/bizz84/redux-navigation-color-picker
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'

import navigation from './src/reducer'
import Navigator from './src/Navigator';

const reducer = combineReducers({ navigation })
const store = createStore(reducer, applyMiddleware(logger))

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    );
  }
}
A