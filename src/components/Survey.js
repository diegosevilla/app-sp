import React from 'react';
import { NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { Container, Toast, Content, Form, Item, Input, H2, Text, Row, Fab, Icon} from 'native-base';
import { Divider} from 'react-native-elements';
import { OptionsQuestion, TextQuestion, NumbersQuestion, CheckBoxQuestion } from './Questions';

import { connectionState, addToActionQueue, submitAnswer, submitSavedAnswer } from '../actions/netActions';

class Survey extends React.Component {
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }

  _handleConnectionChange = (isConnected) => {
    Toast.show({
      text: isConnected? 'Device is now online' : 'Device is now offline',
      buttonText: "Okay",
      type: isConnected? "success": "danger",
      duration: 3000
    })
    const { dispatch, actionQueue } = this.props;
    dispatch(connectionState({ status: isConnected }));
    if (isConnected && actionQueue.length > 0) {
      actionQueue.forEach((answer) => {
        console.log(JSON.stringify(answer));
        this.props.dispatch(submitSavedAnswer({answer}))
      });
    }

  };

  componentWillMount(){
    const { params } = this.props.navigation.state;
    const survey = params ? params.survey : null;
    this.state = {survey: survey};
  }

  process(q){
    q.forEach((question) => {
      let id = question.props.id;
      let answer = {
        questionId: id,
        response: this.refs[id].getVal()
      };
      this.props.dispatch(submitAnswer(answer));
    });
    alert(this.props.isConnected? 'Answers submitted.' : 'Device is offline. Answers will be saved.')
  }

  render() {
    const survey = this.state.survey;
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
          <Row style={{textAlign: 'center'}}>
            <H2> {survey.surveyName} </H2>
          </Row>
          <Row style={{textAlign: 'center'}}>
            <Text style={{fontSize: 16}}> {survey.author} </Text>
          </Row>
          <Row style={{textAlign: 'center'}}>
            <Text style={{fontSize: 14}}> {survey.details} </Text>
          </Row>
          <Divider style={{ backgroundColor: 'blue' }} />
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
    isConnected: state.survey.isConnected,
    actionQueue: state.survey.actionQueue
  };
};

export default connect(mapStateToProps)(Survey);
