// full code here --> https://github.com/bizz84/redux-navigation-color-picker
import React, { Component } from 'react';
import { Container, Content, Button, Text, Row, Toast} from 'native-base';
import { NetInfo } from 'react-native';
import { connect } from 'react-redux';

import { connectionState, submitSavedAnswer } from '../actions/appActions';


class Home extends Component {
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }

  _handleConnectionChange = (isConnected) => {
    const { dispatch, actionQueue } = this.props;
    dispatch(connectionState({ status: isConnected }));
    if(isConnected){
      if (actionQueue.length > 0) {
        Toast.show({text: 'Device is now online. Saved answers will be submitted.', buttonText: "Okay", duration: 3000, type: 'success' })
        actionQueue.forEach((action) => {
          this.props.dispatch(submitSavedAnswer({action}))
        });
        Toast.show({text: 'Finish submitting all saved answers.', buttonText: "Okay", duration: 3000, type: 'success' })
      }else {
        Toast.show({text: 'Device is now online. There are no saved answers to be submitted.', buttonText: "Okay", duration: 3000, type: 'success' })
      }
    } else {
      Toast.show({text: 'Device is offline. Answers will be saved.', buttonText: "Okay", duration: 3000, type: 'danger'});
    }
  };

  onFindSurvey() {
    this.props.navigation.navigate('FindSurvey');
  }

  onViewRecentSurvey() {
    this.props.navigation.navigate('RecentSurveys');
  }

  render() {
    return (
      <Container>
        <Content>
          <Row style={{width: '100%', paddingTop: 20}}>
              <Text style={{fontSize: 45, width: '100%', textAlign: 'center'}}> CenterPoint </Text>
          </Row>
          <Row style={{width: '100%', paddingBottom: 10}}>
            <Text style={{width: '100%', textAlign: 'center'}}> {'A Multi-platform System for Developing, Conducting, Analyzing, and Publishing Surveys'} </Text>
          </Row>
          <Row>
            <Button style={{ margin: 3}} onPress={this.onFindSurvey.bind(this)}  info>
              <Text> Find Survey </Text>
            </Button>
            <Button style={{ margin: 2}} onPress={this.onViewRecentSurvey.bind(this)} warning>
              <Text> View Recent Surveys </Text>
            </Button>
          </Row>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    isConnected: state.app.isConnected,
    actionQueue: state.app.actionQueue
  };
};

export default connect(mapStateToProps)(Home);
