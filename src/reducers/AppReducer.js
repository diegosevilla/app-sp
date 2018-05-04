import { combineReducers } from 'redux';
import NavReducer from './NavReducer';
import SurveyReducer from './SurveyReducer';

const AppReducer = {
  nav: NavReducer,
  app: SurveyReducer
};

export default AppReducer;
