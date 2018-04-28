import { NetInfo } from 'react-native';


export const addToRecentSurvey = (survey) => {
  return (dispatch  ) => {
    dispatch({ type: 'ADD_TO_RECENT_SURVEY', survey});
  };
};

export const connectionState = ({ status }) => {
  return { type: 'CHANGE_CONNECTION_STATUS', isConnected: status };
};
