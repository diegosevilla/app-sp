import React from 'react';
import { NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Toast, Content, Form, Item, Input, H2, Text, Row, Fab, Icon} from 'native-base';
import { Divider} from 'react-native-elements';
import { OptionsQuestion, TextQuestion, NumbersQuestion, CheckBoxQuestion } from './Questions';

import { connectionState, submitAnswer, submitSavedAnswer } from '../actions/appActions';

class Survey extends React.Component {
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }

  _handleConnectionChange = (isConnected) => {
    const { dispatch, actionQueue } = this.props;
    dispatch(connectionState({ status: isConnected }));
    if(isConnected){
      if (actionQueue.length > 0) {
        Toast.show({text: 'Device is now online. Saved answers will be submitted.', buttonText: "Okay", duration: 3000, type: 'success' })
        actionQueue.forEach((action) => {
          alert(action);
          this.props.dispatch(submitSavedAnswer({action}))
        });
      }
    } else {
      Toast.show({text: 'Device is offline. Answers will be saved.', buttonText: "Okay", duration: 3000, type: 'danger'});
    }
  };

  process(q){
    let answers = [];
    q.forEach((question) => {
      let id = question.props.id;
      let values = this.refs[id].getVal();
      values.forEach((response) => {
        let answer = {
          questionId: id,
          response: response
        };
        answers.push(answer);
      })
    });
    this.props.dispatch(submitAnswer(answers));
    Toast.show({
      text: this.props.isConnected? 'Answers submitted'  : 'Answers saved.',
      buttonText: "Okay",
      duration: 3000,
      type:this.props.isConnected? 'success' : 'danger'
    })
  }

  render() {
    const survey = this.props.survey;
    let q = [];
    survey.questions.forEach((question) => {
      switch(question.questionType){
        case 'Options':
          q.push(<OptionsQuestion id={question.id} ref={question.id} question={question}/>);
          break;
        case 'Text':
          q.push(<TextQuestion id={question.id} ref={question.id} question={question}/>);
          break;
        case 'Number':
          q.push(<NumbersQuestion id={question.id} ref={question.id} question={question}/>);
          break;
        default:
          q.push(<CheckBoxQuestion id={question.id} ref={question.id} question={question}/>);
      }
    });

    return(
      <Container>
        <Content>
          <Row style={{width: '100%'}}>
            <H2 style={{ textAlign: 'center'}} > {survey.surveyName} </H2>
          </Row>
          <Row>
            <Text style={{ textAlign: 'center', fontSize: 16}}> {survey.author} </Text>
          </Row>
          <Row>
            <Text style={{textAlign: 'center', fontSize: 14}}> {survey.details} </Text>
          </Row>
          <Divider style={{ margin: 2, backgroundColor: 'blue' }} />
          <Form>
            {q}
          </Form>
        </Content>
        <Fab style={{ backgroundColor: '#e8542c' }} position="bottomRight" onPress={() => this.process(q)}>
          <Icon name="md-send" />
        </Fab>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    isConnected: state.app.isConnected,
    actionQueue: state.app.actionQueue,
    survey: state.app.survey
  };
};

export default connect(mapStateToProps)(Survey);
