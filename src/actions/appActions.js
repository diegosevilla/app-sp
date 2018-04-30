import { NetInfo } from 'react-native';
import _ from 'lodash';

export const findSurvey = (surveyId) => {
  return (dispatch, getState) => {
    const recentSurveys  = getState().app.recentSurveys;
    return fetch('https://josevilla-sp.herokuapp.com/api/survey/surveyId/'+surveyId)
    .then((res)=>res.json())
    .then((survey) => {
      if(survey.id == -1)
        return {code: 404, err:'Not Found'}
      else{
        dispatch({ type: 'SET_SURVEY', survey});
        let index = _.findIndex(recentSurveys, function(s) {return s.id == survey.id});
        if(index == -1) dispatch({ type: 'ADD_TO_RECENT_SURVEY', survey});
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

export const addToActionQueue = ({action}) => {
  return (dispatch) => {
    dispatch({type: 'ADD_TO_ACTION_QUEUE', action});
  }
}

export const submitSavedAnswer = ({action}) => {
  let temp = JSON.parse(action);
  let answers = temp.answers;
  let id = temp.surveyId;
  return (dispatch) => {
    return fetch('https://josevilla-sp.herokuapp.com/api/survey/increment/'+id, {
      method: 'POST'
    })
    .then((res) => res.json())
    .then((updatedSurvey) => {
      answers.forEach((answer)=>{
        console.log(answer);
        answer.responseCount = updatedSurvey.responseCount;
        let formData = '';

        for(let key in answer) formData += key+'='+answer[key]+'&';
        formData = formData.slice(0,-1);

        fetch('https://josevilla-sp.herokuapp.com/api/answer/create', {
          method: 'POST',
          headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          body: formData
        });
      });
      dispatch({type:'REMOVE_FROM_ACTION_QUEUE', action });
    })
  }
}

export const submitAnswer = ( answers ) => {
  return (dispatch, getState) => {
    const isConnected  = getState().app.isConnected;
    const survey = getState().app.survey;
    if (isConnected) {
      return fetch('https://josevilla-sp.herokuapp.com/api/survey/increment/'+survey.id, {
        method: 'POST'
      })
      .then((res) => res.json())
      .then((updatedSurvey) => {
        dispatch({ type: 'SET_SURVEY', survey:updatedSurvey});
        answers.forEach((answer)=>{
          answer.responseCount = updatedSurvey.responseCount;
          let formData = '';

          for(let key in answer) formData += key+'='+answer[key]+'&';
          formData = formData.slice(0,-1);

          fetch('https://josevilla-sp.herokuapp.com/api/answer/create', {
            method: 'POST',
            headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: formData
          });
        });
        return {code:200, msg: 'Answers submitted.'};
      });
    } else {
      let action = {
        surveyId: survey.id,
        answers: answers,
      }
      let answer = JSON.stringify(action);
      dispatch({ type: 'ADD_TO_ACTION_QUEUE',  answer});
    }
  };
};
