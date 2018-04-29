import { NetInfo } from 'react-native';

export const findSurvey = (surveyId) => {
  return (dispatch) => {
      return fetch('https://stormy-forest-11115.herokuapp.com/api/survey/surveyId/'+surveyId)
      .then((res)=>res.json())
      .then((survey) => {
        if(survey.id == -1)
          return {code: 404, err:'Not Found'}
        else{
          dispatch({ type: 'SET_SURVEY', survey});
          dispatch({ type: 'ADD_TO_RECENT_SURVEY', survey});
          return {code: 200}
        }
      })
      .catch((err) => {
        return {code:500, err: 'Server Error'}
      })
  }
}

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
  }
}

export const submitAnswer = ( answer ) => {
  return (dispatch, getState) => {
    const isConnected  = getState().app.isConnected;
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
