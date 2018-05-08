import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Toast, Content, Form, Item, Input, H2, Text, Row, Fab, Icon} from 'native-base';
import { Divider} from 'react-native-elements';
import { OptionsQuestion, TextQuestion, NumbersQuestion, CheckBoxQuestion } from './Questions';

import {submitAnswer, submitSavedAnswer } from '../actions/appActions';

class Survey extends React.Component {

  process(q){
    alert('Processing Answers');
    let answers = [];
    q.forEach((question) => {
      let id = question.props.id;
      let values = this.refs[id].getVal();
      this.refs[id].reset();
      values.forEach((response) => {
        let answer = {
          questionId: id,
          response: response
        };
        answers.push(answer);
      })
    });
    if(this.props.isConnected){
      this.props.dispatch(submitAnswer(answers)).then((res) => {
        Toast.show({
          text: 'Answers submitted',
          buttonText: "Okay",
          duration: 3000,
          type: 'success'
        })
      })
    } else {
      this.props.dispatch(submitAnswer(answers));
      Toast.show({
        text: 'Answers saved',
        buttonText: "Okay",
        duration: 3000,
        type: 'success'
      })
    }
  }

  render() {
    const survey = this.props.survey;
    let q = [];
    survey.questions.forEach((question) => {
      switch(question.questionType){
        case 'Options':
          q.push(<OptionsQuestion key={question.id} id={question.id} ref={question.id} question={question}/>);
          break;
        case 'Text':
          q.push(<TextQuestion key={question.id} id={question.id} ref={question.id} question={question}/>);
          break;
        case 'Number':
          q.push(<NumbersQuestion key={question.id} id={question.id} ref={question.id} question={question}/>);
          break;
        default:
          q.push(<CheckBoxQuestion key={question.id} id={question.id} ref={question.id} question={question}/>);
      }
    });

    return(
      <Container>
        <Content>
          <Row style={{width: '100%', padding: 0}}>
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
