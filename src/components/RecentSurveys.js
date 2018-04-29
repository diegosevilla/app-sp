// full code here --> https://github.com/bizz84/redux-navigation-color-picker
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Content, List, ListItem, Text, Fab, Icon } from 'native-base';

class RecentSurveys extends Component {
  static navigationOptions = {
    title: 'Recent Surveys',
  };

  cancel(){
    this.props.navigation.goBack();
  }

  render() {
    const { recentSurveys } = this.props;
    return (
      <Container>
        <Content>
          <List>
            {
              recentSurveys.map((survey, i) => (
                <ListItem onPress={() => this.props.navigation.navigate('Survey')}>
                  <Text> {survey.surveyName} </Text>
                </ListItem>
              ))
            }
          </List>
        </Content>
        <Fab direction="up" style={{ backgroundColor: '#e8542c' }} position="bottomRight" onPress={() => this.cancel()}>
          <Icon name="md-arrow-round-back" />
        </Fab>
      </Container>
    );
  }
}

const mapStateToProps = state => ({ recentSurveys: state.app.recentSurveys});

export default connect(mapStateToProps)(RecentSurveys);
