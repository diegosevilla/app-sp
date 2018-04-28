// full code here --> https://github.com/bizz84/redux-navigation-color-picker
import React, { Component } from 'react';
import { Container, Content, Button, Text, Row} from 'native-base';

class Home extends Component {
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

export default Home;
