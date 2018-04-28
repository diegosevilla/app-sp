//app/index.js
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './src/reducers/store';
import AppWithNavigationState from './src/components/AppNavigator';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: configureStore(() => this.setState({ isLoading: false })),
    };
  }

  render() {
   if (this.state.isLoading) return null;
   return (
     <Provider store={this.state.store}>
       <AppWithNavigationState />
     </Provider>
   );
  }
}

export default App;
// import React from 'react';
// import { AppRegistry } from 'react-native';
// import { Provider } from 'react-redux';
// import { createStore } from 'redux';
//
// import AppReducer from './src/reducers/AppReducer';
// import AppWithNavigationState from './src/components/AppNavigator';
//
// class ReduxExampleApp extends React.Component {
//   store = createStore(AppReducer);
//
//   render() {
//     return (
//       <Provider store={this.store}>
//         <AppWithNavigationState />
//       </Provider>
//     );
//   }
// }
//
// AppRegistry.registerComponent('ReduxExample', () => ReduxExampleApp);
//
// export default ReduxExampleApp;
