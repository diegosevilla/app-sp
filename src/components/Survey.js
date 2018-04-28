import React from 'react';
import { NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Content, Form, Item, Input, H2, Row, Fab, Icon} from 'native-base';
import { Divider} from 'react-native-elements';
import { OptionsQuestion, TextQuestion, NumbersQuestion, CheckBoxQuestion } from './Questions';

import {connectionState} from '../actions/netActions';

class Survey extends React.Component {
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }

  _handleConnectionChange = (isConnected) => {
    this.props.dispatch(connectionState({ status: isConnected }));
  };

  componentWillMount(){
    const { params } = this.props.navigation.state;
    const survey = params ? params.survey : null;
    this.state = {survey: survey};
  }

  process(q){
    let answers = [];
    q.forEach((question) => {
      let id = question.props.id;
      let temp = {
        id: id,
        answer: this.refs[id].getVal()
      };
      console.log(JSON.stringify(temp));
      answers.push(temp);
    });
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
          <Row style={{align: 'center'}}>
          <H2> {survey.surveyName} </H2>
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
    isConnected: state.isConnected,
  };
};

export default connect(mapStateToProps)(Survey);
