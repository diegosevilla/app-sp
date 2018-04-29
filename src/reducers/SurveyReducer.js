import _ from 'lodash';

const initialState = {
  personIndex: 1,
  people: [],
  actionQueue: [],
  isConnected: false,
  recentSurveys: [],
};

const SurveyReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_ACTION_QUEUE':
      return Object.assign({}, state, {
        actionQueue: state.actionQueue.concat([action.answer]),
      });
    case 'REMOVE_FROM_ACTION_QUEUE':
      return Object.assign({}, state, {
        actionQueue: _.without(state.actionQueue, action.answer),
      });
    case 'ADD_TO_RECENT_SURVEY':
      return Object.assign({}, state, {
        recentSurveys: state.recentSurveys.concat([action.survey]),
      });
    case 'CHANGE_CONNECTION_STATUS':
      return Object.assign({}, state, {
        isConnected: action.isConnected,
      });
    default:
      return state
  }
}

export default SurveyReducer;
