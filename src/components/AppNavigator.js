// full code here --> https://github.com/bizz84/redux-navigation-color-picker
import React from 'react';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { createStore, combineReducers } from 'redux';
import { connect } from 'react-redux';
import { createReduxBoundAddListener, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { Root } from 'native-base';

import Home from './Home';
import Survey from './Survey';
import FindSurvey from './FindSurvey';
import RecentSurveys from './RecentSurveys';

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav, // <-- make sure this is where your nav lives (i.e. if your reducer is at state.nav use that instead)
);
const addListener = createReduxBoundAddListener("root");

export const AppNavigator = StackNavigator({
  Home: { screen: Home },
  Survey: {screen: Survey},
  RecentSurveys: {
    screen: RecentSurveys,
    navigationOptions: {
      headerLeft: null,
    }
  },
  FindSurvey: {
    screen: FindSurvey,
    navigationOptions: {
      headerLeft: null,
    }
  }
}, {
  initialRouteName: 'Home',
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <Root>
    <AppNavigator
      navigation={addNavigationHelpers({ dispatch, state: nav, addListener})}
    />
  </Root>
);

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
