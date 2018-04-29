import { NetInfo } from 'react-native';

export const addToRecentSurvey = (survey) => {
  return (dispatch ) => {
    dispatch({ type: 'ADD_TO_RECENT_SURVEY', survey});
  };
};

export const connectionState = ({ status }) => {
  return { type: 'CHANGE_CONNECTION_STATUS', isConnected: status };
};

export const addToActionQueue = ({answer}) => {
  return (dispatch) => {
    dispatch({type: 'ADD_TO_ACTION_QUEUE', answer});
  }
}

export const submitSavedAnswer = ({answer}) => {
  return (dispatch) => {
    let formData = '';

    for(let key in answer) formData += key+'='+answer[key]+'&';
    formData = formData.slice(0,-1);

    console.log(formData);
    return fetch('https://stormy-forest-11115.herokuapp.com/api/answer/create', {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: formData
    })
    .then((res) => res.json())
    .then((res) => {
      console.log('dito pows');
      dispatch({ type: 'REMOVE_FROM_ACTION_QUEUE', answer });
    });
  }
}

export const submitAnswer = ( answer ) => {
  return (dispatch, getState) => {
    const isConnected  = getState().survey.isConnected;
    if (isConnected) {
      let formData = '';

      for(let key in answer) formData += key+'='+answer[key]+'&';
      formData = formData.slice(0,-1);

      return fetch('https://stormy-forest-11115.herokuapp.com/api/answer/create', {
        method: 'POST',
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: formData
      })
      .then((res) => res.json())
      .then((res) => {
        dispatch({ type: 'REMOVE_FROM_ACTION_QUEUE', answer });
      });
    } else {
      dispatch({ type: 'ADD_TO_ACTION_QUEUE', answer });
    }
  };
};
