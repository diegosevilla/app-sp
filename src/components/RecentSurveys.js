// full code here --> https://github.com/bizz84/redux-navigation-color-picker
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Content, List, ListItem, Text, Fab, Icon } from 'native-base';
import {setSurvey} from '../actions/appActions';

class RecentSurveys extends Component {
  static navigationOptions = {
    title: 'Recent Surveys',
  };

  goToSurvey(survey){
    this.setState({isLoading: true})
    const {dispatch} = this.props;
    dispatch(setSurvey(survey)).then((res)=>{
      if(res.code == 200){
        this.props.navigation.navigate('Survey');
      }else {
        Toast.show({
          text: res.err,
          buttonText: "Okay",
          duration: 3000
        })
      }
      this.setState({isLoading: false})
    })
  }

  cancel(){
    this.props.navigation.goBack();
  }

  render() {
    const { recentSurveys } = this.props;
    if(recentSurveys.length == 0){
      return(
        <Container>
          <Content>
            <Text style={{fontSize: 24, textAlign: 'center'}}> No Recent Surveys Yet. </Text>
          </Content>
          <Fab direction="up" style={{ backgroundColor: '#e8542c' }} position="bottomRight" onPress={() => this.cancel()}>
            <Icon name="md-arrow-round-back" />
          </Fab>
        </Container>
      )
    } else
    return (
      <Container>
        <Content>
          <List>
            {
              recentSurveys.map((survey, i) => (
                <ListItem key={survey.id} onPress={() => this.goToSurvey(survey)}>
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
