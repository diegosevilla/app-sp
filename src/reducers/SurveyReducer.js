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
    case 'INC_PERSON_INDEX':
      return Object.assign({}, state, {
        personIndex: state.personIndex + 1,
      });
    case 'SAVE_PERSON':
      return Object.assign({}, state, {
        people: [action.person].concat(state.people),
      });
    case 'ADD_TO_ACTION_QUEUE':
      return Object.assign({}, state, {
        actionQueue: state.actionQueue.concat([action.payload]),
      });
    case 'REMOVE_FROM_ACTION_QUEUE':
      return Object.assign({}, state, {
        actionQueue: _.without(state.actionQueue, action.payload),
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
